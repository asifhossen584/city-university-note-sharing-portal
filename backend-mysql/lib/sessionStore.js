// lib/sessionStore.js - an express-session store backed by MySQL.
//
// express-session keeps a random session id in the browser cookie; the session
// data itself lives in the `sessions` table (see schema.sql), so logins survive
// a server restart and no session data ever sits in the browser.
// Only the user id is stored in the session object (req.session.userId).
const session = require('express-session');
const { pool } = require('../db');

class MySQLStore extends session.Store {
  constructor() {
    super();
  }

  // session = { cookie: {...}, userId: 3 }
  set(sid, sess, cb) {
    var expires = Date.now() + (sess.cookie && sess.cookie.maxAge ? sess.cookie.maxAge : 7 * 86400000);
    var userId = sess.userId || null;
    pool.query(
      'INSERT INTO sessions (session_id, user_id, expires_at, data) VALUES (?, ?, ?, ?) ' +
      'ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), expires_at = VALUES(expires_at), data = VALUES(data)',
      [sid, userId, expires, JSON.stringify(sess)]
    ).then(function () { if (cb) cb(null); })
      .catch(function (err) { if (cb) cb(err); });
  }

  get(sid, cb) {
    pool.query('SELECT data, expires_at FROM sessions WHERE session_id = ? LIMIT 1', [sid])
      .then(function (rows) {
        if (!rows[0].length) return cb(null, null);
        if (rows[0][0].expires_at < Date.now()) return cb(null, null);
        try { cb(null, JSON.parse(rows[0][0].data)); }
        catch (e) { cb(null, null); }
      })
      .catch(function (err) { cb(err); });
  }

  destroy(sid, cb) {
    pool.query('DELETE FROM sessions WHERE session_id = ?', [sid])
      .then(function () { if (cb) cb(null); })
      .catch(function (err) { if (cb) cb(err); });
  }

  touch(sid, sess, cb) {
    var expires = Date.now() + (sess.cookie && sess.cookie.maxAge ? sess.cookie.maxAge : 7 * 86400000);
    pool.query('UPDATE sessions SET expires_at = ? WHERE session_id = ?', [expires, sid])
      .then(function () { if (cb) cb(null); })
      .catch(function (err) { if (cb) cb(err); });
  }
}

module.exports = MySQLStore;
