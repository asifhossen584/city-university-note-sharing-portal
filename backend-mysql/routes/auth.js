// routes/auth.js - registration, login, logout, password reset and profile.
// New accounts are created UNAPPROVED: they cannot log in (and cannot reset
// their password) until an admin approves them (see routes/admin.js).
const express = require('express');
const crypto = require('crypto');
const config = require('../config');
const { pool } = require('../db');
const { HttpError, asyncHandler, text, publicUser, fullUser } = require('../lib/helpers');
const auth = require('../lib/auth');

const router = express.Router();

// ---------- login attempts limit (stops password guessing) ----------
var attempts = {};
function checkAttempts(ip) {
  var now = Date.now();
  var a = attempts[ip];
  if (!a || a.reset < now) a = attempts[ip] = { count: 0, reset: now + 15 * 60000 };
  if (a.count >= 20) throw new HttpError(429, 'Too many attempts. Please try again in a few minutes.');
  a.count++;
}

function getRows(result) { return result[0]; }

// ---------- register ----------
router.post('/register', asyncHandler(async function (req, res) {
  checkAttempts(req.ip);
  var name = text(req.body.name, 100);
  var email = text(req.body.email, 150).toLowerCase();
  var password = typeof req.body.password === 'string' ? req.body.password : '';
  var dept = text(req.body.dept, 60);
  var studentId = text(req.body.studentId, 12);
  var phone = text(req.body.phone, 15);

  if (name.length < 2) throw new HttpError(400, 'Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Please enter a valid email address.');
  if (config.allowedEmailDomain && email.split('@')[1] !== config.allowedEmailDomain) {
    throw new HttpError(400, 'Please use your university email (@' + config.allowedEmailDomain + ').');
  }
  if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
  if (!/^\d{12}$/.test(studentId)) throw new HttpError(400, 'Student ID must be exactly 12 numbers - digits only, no letters or spaces.');
  if (!/^\d{10,15}$/.test(phone)) throw new HttpError(400, 'Phone number must be 10 to 15 digits.');
  if (config.departments.indexOf(dept) === -1) throw new HttpError(400, 'Please choose your department.');

  var dupEmail = getRows(await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]));
  if (dupEmail.length) throw new HttpError(409, 'An account with this email already exists.');
  var dupId = getRows(await pool.query('SELECT id FROM users WHERE student_id = ? LIMIT 1', [studentId]));
  if (dupId.length) throw new HttpError(409, 'An account with this Student ID already exists.');

  var hash = await auth.hashPassword(password);
  var result = await pool.query(
    'INSERT INTO users (name, email, password_hash, student_id, phone, role, dept, approved, suspended, joined) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, hash, studentId, phone, 'student', dept, 0, 0, Date.now()]
  );
  var user = getRows(await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [result[0].insertId]))[0];

  // No session: the account is NOT active until an admin approves it.
  res.json({
    ok: true,
    message: 'Your account was created. It will become active after an admin approves it.',
    user: fullUser(user)
  });
}));

// ---------- login ----------
router.post('/login', asyncHandler(async function (req, res) {
  checkAttempts(req.ip);
  var email = text(req.body.email, 150).toLowerCase();
  var password = typeof req.body.password === 'string' ? req.body.password : '';
  var users = getRows(await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]));
  var user = users[0];
  if (!user || !(await auth.checkPassword(password, user.password_hash))) {
    throw new HttpError(401, 'Wrong email or password.');
  }
  if (!user.approved) throw new HttpError(403, 'Your account is waiting for admin approval.');
  if (user.suspended) throw new HttpError(403, 'Your account has been suspended. Please contact the admin.');
  req.session.userId = user.id;
  res.json({ user: fullUser(user) });
}));

// ---------- logout ----------
router.post('/logout', asyncHandler(async function (req, res) {
  req.session.destroy(function () {});
  res.clearCookie('session');
  res.json({ ok: true });
}));

// ---------- who am I ----------
router.get('/me', asyncHandler(async function (req, res) {
  res.json({ user: req.user ? fullUser(req.user) : null });
}));

// ---------- password reset, step 1: make a 6-digit code (15 minutes) ----------
router.post('/forgot', asyncHandler(async function (req, res) {
  checkAttempts(req.ip);
  var email = text(req.body.email, 150).toLowerCase();
  var users = getRows(await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]));
  var user = users[0];
  var answer = { ok: true, message: 'If this email is registered, a reset code has been created.' };
  // Only active accounts get a code (unapproved or suspended accounts cannot
  // reset their password - same rule as login).
  if (user && user.approved && !user.suspended) {
    var code = String(crypto.randomInt(100000, 1000000));
    await pool.query('DELETE FROM resets WHERE email = ?', [email]);
    await pool.query(
      'INSERT INTO resets (email, code_hash, expires_at, tries) VALUES (?, ?, ?, 0)',
      [email, auth.sha256(code), Date.now() + 15 * 60000]
    );
    console.log('Password reset code for ' + email + ': ' + code);
    if (config.showResetCode) answer.code = code;
  }
  res.json(answer);
}));

// ---------- password reset, step 2: check the code, set the new password ----------
router.post('/reset', asyncHandler(async function (req, res) {
  checkAttempts(req.ip);
  var email = text(req.body.email, 150).toLowerCase();
  var code = text(req.body.code, 10);
  var newPassword = typeof req.body.password === 'string' ? req.body.password : '';
  var resets = getRows(await pool.query('SELECT * FROM resets WHERE email = ? LIMIT 1', [email]));
  var reset = resets[0];
  if (!reset || reset.expires_at < Date.now() || reset.tries >= 5) {
    throw new HttpError(400, 'The code is wrong or has expired.');
  }
  if (reset.code_hash !== auth.sha256(code)) {
    await pool.query('UPDATE resets SET tries = tries + 1 WHERE email = ?', [email]);
    throw new HttpError(400, 'The code is wrong or has expired.');
  }
  if (newPassword.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
  var users = getRows(await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]));
  var user = users[0];
  if (!user) throw new HttpError(400, 'The code is wrong or has expired.');
  if (!user.approved) throw new HttpError(403, 'Your account is waiting for admin approval.');
  if (user.suspended) throw new HttpError(403, 'Your account has been suspended. Please contact the admin.');
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [await auth.hashPassword(newPassword), user.id]);
  await pool.query('DELETE FROM resets WHERE email = ?', [email]);
  await auth.deleteUserSessions(user.id); // log the account out everywhere
  res.json({ ok: true });
}));

// ---------- edit my profile ----------
router.put('/profile', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var name = text(req.body.name, 100);
  var dept = text(req.body.dept, 60);
  var studentId = text(req.body.studentId, 12);
  var phone = text(req.body.phone, 15);
  if (name.length < 2) throw new HttpError(400, 'Please enter your full name.');
  if (config.departments.indexOf(dept) === -1) throw new HttpError(400, 'Please choose your department.');
  if (!/^\d{12}$/.test(studentId)) throw new HttpError(400, 'Student ID must be exactly 12 numbers - digits only, no letters or spaces.');
  if (!/^\d{10,15}$/.test(phone)) throw new HttpError(400, 'Phone number must be 10 to 15 digits.');
  var dup = getRows(await pool.query(
    'SELECT id FROM users WHERE student_id = ? AND id <> ? LIMIT 1', [studentId, user.id]
  ));
  if (dup.length) throw new HttpError(409, 'An account with this Student ID already exists.');

  // Profile photo: a data URL (the frontend downscales it to 256px first).
  // Send { removePhoto: true } to go back to the initials avatar.
  var photo = user.photo;
  if (req.body.removePhoto) photo = null;
  else if (typeof req.body.photo === 'string' && req.body.photo.length > 0) {
    if (req.body.photo.length > 1024 * 1024) throw new HttpError(400, 'Profile photo is too large.');
    if (req.body.photo.indexOf('data:image/') !== 0) throw new HttpError(400, 'Profile photo must be an image.');
    photo = req.body.photo;
  }

  await pool.query(
    'UPDATE users SET name = ?, dept = ?, student_id = ?, phone = ?, photo = ? WHERE id = ?',
    [name, dept, studentId, phone, photo, user.id]
  );
  var updated = getRows(await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [user.id]))[0];
  res.json({ user: fullUser(updated) });
}));

// ---------- change my password ----------
router.post('/change-password', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var oldPassword = typeof req.body.oldPassword === 'string' ? req.body.oldPassword : '';
  var newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';
  if (!(await auth.checkPassword(oldPassword, user.password_hash))) throw new HttpError(400, 'Current password is wrong.');
  if (newPassword.length < 8) throw new HttpError(400, 'New password must be at least 8 characters.');
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [await auth.hashPassword(newPassword), user.id]);
  await auth.deleteUserSessions(user.id); // log out everywhere else
  // Rotate the session id (session fixation protection) and keep THIS login:
  // regenerate() gives the session a fresh id, then we re-attach the user.
  // (Simply setting req.session.userId again would not work: express-session
  // only saves a session it sees as changed, and the value did not change.)
  await new Promise(function (resolve, reject) {
    req.session.regenerate(function (err) { if (err) reject(err); else resolve(); });
  });
  req.session.userId = user.id;
  res.json({ ok: true });
}));

module.exports = router;
