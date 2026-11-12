// db.js - the MySQL connection pool (mysql2, promise API).
// Every route uses this pool. Settings come from config.js, which reads them
// from environment variables (see .env.example).
const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
  // BIGINT columns (our timestamps are milliseconds since epoch) come back as
  // numbers instead of strings, so the API returns the same shapes as before.
  supportBigNumbers: true,
  bigNumberStrings: false,
  multipleStatements: false
});

// Quick check used at server start-up: prints a helpful message when MySQL
// is not running or the login is wrong, instead of crashing with a raw error.
async function testConnection() {
  try {
    await pool.query('SELECT 1');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err };
  }
}

module.exports = { pool: pool, testConnection: testConnection };
