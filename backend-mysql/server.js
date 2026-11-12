// server.js - starts the Notes Portal backend API.
// Run it with:  npm start          (or: node server.js)
// The API listens on http://localhost:3000 by default (see config.js / .env).
// This server is API-only: it serves no frontend pages. Point the React
// frontend at this address (see README.md, "Connecting the React frontend").
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const db = require('./db');
const MySQLStore = require('./lib/sessionStore');
const auth = require('./lib/auth');
const { HttpError } = require('./lib/helpers');
const notesLib = require('./lib/notes');

const app = express();
fs.mkdirSync(notesLib.UPLOADS, { recursive: true });

// The React frontend runs on another port while you develop it, so the API
// must allow cross-origin requests from it (with the session cookie).
app.use(cors({ origin: config.corsOrigins, credentials: true }));

// JSON bodies (note uploads send the file as base64 inside the JSON, so the
// limit has to fit a 10 MB file: base64 is about 1.37x bigger).
app.use(express.json({ limit: '16mb' }));

// Login sessions: a random session id in an HttpOnly cookie, the session data
// itself in MySQL (lib/sessionStore.js). No login state ever lives in the
// browser, and no password or credential is ever sent to the frontend.
app.use(session({
  name: 'session',
  secret: config.sessionSecret,
  store: new MySQLStore(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: config.sessionDays * 86400000,
    secure: process.env.SECURE_COOKIE === 'true' // true only behind HTTPS
  }
}));

app.use(auth.loadUser);

// ---------- API routes (same paths as the original portal) ----------
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/browse'));
app.use('/api', require('./routes/notes'));
app.use('/api/admin', require('./routes/admin'));

// ---------- status page ----------
app.get('/', function (req, res) {
  res.type('html').send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Notes Portal API</title>' +
    '<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;line-height:1.6;color:#333}' +
    'h1{font-size:24px}code{background:#f2f2f2;padding:2px 6px;border-radius:4px}</style></head><body>' +
    '<h1>University Notes Sharing Portal - API is running</h1>' +
    '<p>The backend is up. It serves the API at <code>/api/...</code> - for example ' +
    '<code>GET /api/courses</code> and <code>GET /api/notes</code>.</p>' +
    '<p>Open the React frontend and point it at this address ' +
    '(see <code>README.md</code>, "Connecting the React frontend").</p>' +
    '</body></html>'
  );
});

// ---------- errors ----------
app.use('/api', function (req, res) {
  res.status(404).json({ error: 'Not found.' });
});

app.use(function (err, req, res, next) {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File is too large (maximum ' + config.maxFileMB + ' MB).' });
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ---------- start ----------
async function start() {
  var check = await db.testConnection();
  if (!check.ok) {
    console.error('');
    console.error('  Could not connect to MySQL: ' + (check.error && check.error.message ? check.error.message : check.error));
    console.error('  1. Make sure MySQL is running.');
    console.error('  2. Create the database and user (see README.md, step 2).');
    console.error('  3. Check DB_HOST / DB_USER / DB_PASSWORD in your .env file.');
    console.error('  4. Then run:  npm run seed');
    console.error('');
    process.exit(1);
  }
  try {
    await db.pool.query('SELECT 1 FROM users LIMIT 1');
  } catch (err) {
    console.error('');
    console.error('  Connected to MySQL, but the tables are missing.');
    console.error('  Run the seed first:  npm run seed');
    console.error('');
    process.exit(1);
  }

  app.listen(config.port, function () {
    console.log('');
    console.log('  University Notes Sharing Portal - backend API is running');
    console.log('  API address:  http://localhost:' + config.port + '/api');
    console.log('  Admin login: ' + config.admin.email + ' / ' + config.admin.password + '  (change it after logging in)');
    if (config.admin.password === 'Admin@123') {
      console.log('  WARNING: you are using the demo default admin password. Change it (Profile -> Change password).');
    }
    console.log('  Press Ctrl + C to stop the server.');
    console.log('');
  });
}

start();
