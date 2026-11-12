// lib/auth.js - password hashing (bcrypt) and login guards.
//
// Passwords are never saved as plain text. bcrypt is a slow, salted hash made
// for passwords: the hash itself contains the salt, so one column is enough.
// The session itself lives in MySQL (see lib/sessionStore.js) and the browser
// only keeps a random session id in an HttpOnly cookie.
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../db');
const { HttpError } = require('./helpers');

const SALT_ROUNDS = 12;

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function checkPassword(password, savedHash) {
  if (!savedHash) return false;
  return bcrypt.compare(password, savedHash);
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Loads the logged-in user (if any) from the session and attaches it as
// req.user. Runs on every request; never throws for visitors.
async function loadUser(req, res, next) {
  req.user = null;
  try {
    if (req.session && req.session.userId) {
      var rows = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.session.userId]);
      if (rows[0].length) req.user = rows[0][0];
      else req.session.userId = null; // the account was deleted
    }
  } catch (err) {
    return next(err);
  }
  next();
}

function needLogin(req) {
  if (!req.user) throw new HttpError(401, 'Please log in first.');
  return req.user;
}

// Admins and moderators ("staff"). Moderators can approve/reject notes, delete
// notes and comments and post notices, but cannot manage users, roles or courses.
function needStaff(req) {
  var user = needLogin(req);
  if (user.role !== 'admin' && user.role !== 'moderator') {
    throw new HttpError(403, 'Staff access only.');
  }
  return user;
}

function needAdmin(req) {
  var user = needLogin(req);
  if (user.role !== 'admin') throw new HttpError(403, 'Admin access only.');
  return user;
}

// Delete every login session of one user (used after a password change,
// a suspension, or deleting the account).
async function deleteUserSessions(userId) {
  await pool.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
}

module.exports = { hashPassword, checkPassword, sha256, loadUser, needLogin, needStaff, needAdmin, deleteUserSessions };
