// config.js - the settings of the backend.
// Change them here, or set the matching environment variable (see .env.example).
// Nothing in this file is ever sent to the browser: the frontend only talks to
// the API, so no password or secret below can leak into page source.
require('dotenv').config();

function envBool(name, fallback) {
  if (process.env[name] === undefined) return fallback;
  return process.env[name] === 'true' || process.env[name] === '1';
}

module.exports = {
  port: Number(process.env.PORT) || 3000,

  // Leave empty to allow any email. Example: 'cityuniversity.edu.bd' = only university emails.
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN || '',

  maxFileMB: 10,
  sessionDays: 7,

  // Secret used to sign the session cookie. Change this in production!
  // (Set SESSION_SECRET in your .env file.)
  sessionSecret: process.env.SESSION_SECRET || 'notes-portal-dev-secret-change-me',

  // There is no email service in this project, so the password reset code is
  // shown in the server window (and, while this is true, returned in the API
  // answer). Set SHOW_RESET_CODE=false on a real website and connect an email
  // service for password reset codes.
  showResetCode: envBool('SHOW_RESET_CODE', true),

  // The first admin account (created only the first time you run `npm run seed`).
  // The password is stored ONLY as a bcrypt hash in the database - never as plain
  // text, and never in any file the browser can see.
  //   - Set ADMIN_PASSWORD in your .env file to choose your own password, or
  //   - keep the demo default below and CHANGE IT right after the first login
  //     (log in, then Profile -> Change password).
  admin: {
    name: 'Portal Admin',
    email: process.env.ADMIN_EMAIL || 'admin@city.edu',
    password: process.env.ADMIN_PASSWORD || 'Admin@123'
  },

  // Password for the sample student / moderator accounts created by the seed.
  studentPassword: process.env.STUDENT_PASSWORD || 'Student@123',

  // Create sample users, notes, ratings, comments and notices when seeding.
  // Set SEED_SAMPLES=false to seed only the admin account and the course catalogue.
  addSampleData: envBool('SEED_SAMPLES', true),

  // Where the React frontend runs while you develop it (Vite's default port is
  // 5173; VS Code Live Server uses 5500; `npx serve` and `python -m http.server`
  // default to 3000 and 8000). The API accepts requests from these origins and
  // allows the session cookie to be sent with them. Comma-separated list, e.g.
  //   CORS_ORIGIN=http://localhost:5173,http://localhost:5500
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000,http://127.0.0.1:8000')
    .split(',').map(function (s) { return s.trim(); }).filter(Boolean),

  // The 10 departments of City University (official list, cityuniversity.ac.bd).
  departments: ['CSE', 'EEE', 'BBA', 'English', 'Textile', 'Civil', 'Pharmacy', 'Mechanical', 'Law', 'Agriculture'],

  // MySQL connection (see db.js). Never hardcode a production password here:
  // put the real values in your .env file (see .env.example).
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'notes_user',
    password: process.env.DB_PASSWORD || 'notes_pass',
    database: process.env.DB_NAME || 'notes_portal',
    connectionLimit: 10
  }
};
