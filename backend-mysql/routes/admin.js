// routes/admin.js - the admin panel (and the staff/moderator parts of it).
//   Staff = admin + moderator: note approvals, note/comment deletion, notices.
//   Admin only: users, roles, suspend, account approval, courses, staff accounts.
const express = require('express');
const config = require('../config');
const { pool } = require('../db');
const { HttpError, asyncHandler, text, normCourseCode, fullUser } = require('../lib/helpers');
const auth = require('../lib/auth');
const notesLib = require('../lib/notes');

const router = express.Router();

function rows(result) { return result[0]; }

// Delete a user completely: their files first, then the row itself.
// (Ratings, comments, bookmarks and notes disappear through ON DELETE CASCADE.)
async function deleteUserCompletely(userId) {
  var files = rows(await pool.query('SELECT stored_name FROM notes WHERE user_id = ?', [userId]));
  files.forEach(function (f) { notesLib.removeNoteFile(f.stored_name); });
  await auth.deleteUserSessions(userId);
  await pool.query('DELETE FROM users WHERE id = ?', [userId]);
}

// ---------- statistics ----------
router.get('/stats', asyncHandler(async function (req, res) {
  auth.needStaff(req);
  var users = rows(await pool.query('SELECT COUNT(*) AS n FROM users'))[0].n;
  var approved = rows(await pool.query("SELECT COUNT(*) AS n FROM notes WHERE status = 'approved'"))[0].n;
  var pending = rows(await pool.query("SELECT COUNT(*) AS n FROM notes WHERE status = 'pending'"))[0].n;
  var downloads = rows(await pool.query('SELECT COALESCE(SUM(downloads), 0) AS n FROM notes'))[0].n;
  var pendingAccounts = rows(await pool.query('SELECT COUNT(*) AS n FROM users WHERE approved = 0'))[0].n;
  res.json({
    users: Number(users), notes: Number(approved), pending: Number(pending),
    downloads: Number(downloads), pendingAccounts: Number(pendingAccounts)
  });
}));

// ---------- all notes (newest first) ----------
router.get('/notes', asyncHandler(async function (req, res) {
  auth.needStaff(req);
  var list = rows(await pool.query(notesLib.NOTE_SELECT + 'ORDER BY n.created DESC'));
  res.json({ notes: list.map(notesLib.noteFromRow) });
}));

// ---------- approve / reject / unpublish a note ----------
router.post('/notes/:id/status', asyncHandler(async function (req, res) {
  auth.needStaff(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  if (!found.length) throw new HttpError(404, 'Note not found.');
  var status = req.body.status;
  if (['approved', 'rejected', 'pending'].indexOf(status) === -1) throw new HttpError(400, 'Wrong status.');
  await pool.query('UPDATE notes SET status = ? WHERE id = ?', [status, found[0].id]);
  res.json({ ok: true });
}));

// ---------- user list (admin only) ----------
// ?approved=0 lists only the accounts waiting for approval.
router.get('/users', asyncHandler(async function (req, res) {
  auth.needAdmin(req);
  var filter = '';
  var params = [];
  if (req.query.approved === '0' || req.query.approved === '1') {
    filter = 'WHERE u.approved = ?';
    params.push(Number(req.query.approved));
  }
  var list = rows(await pool.query(
    'SELECT u.*, (SELECT COUNT(*) FROM notes n WHERE n.user_id = u.id) AS notes ' +
    'FROM users u ' + filter + ' ORDER BY u.joined DESC',
    params
  )).map(function (u) {
    var out = fullUser(u);
    out.notes = Number(u.notes) || 0;
    return out;
  });
  res.json({ users: list });
}));

// ---------- add a moderator or admin directly (admin only) ----------
// The new staff account is active at once - no approval needed.
router.post('/users', asyncHandler(async function (req, res) {
  auth.needAdmin(req);
  var name = text(req.body.name, 100);
  var email = text(req.body.email, 150).toLowerCase();
  var dept = text(req.body.dept, 60);
  var password = typeof req.body.password === 'string' ? req.body.password : '';
  var role = req.body.role === 'admin' ? 'admin' : 'moderator';
  if (name.length < 2) throw new HttpError(400, 'Please enter the full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Please enter a valid email address.');
  if (config.departments.indexOf(dept) === -1) throw new HttpError(400, 'Please choose a department.');
  if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
  var dup = rows(await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]));
  if (dup.length) {
    throw new HttpError(409, 'An account with this email already exists. Change that member\'s role instead of adding them again.');
  }
  var hash = await auth.hashPassword(password);
  var result = await pool.query(
    'INSERT INTO users (name, email, password_hash, role, dept, approved, suspended, joined) ' +
    'VALUES (?, ?, ?, ?, ?, 1, 0, ?)',
    [name, email, hash, role, dept, Date.now()]
  );
  var user = rows(await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [result[0].insertId]))[0];
  res.json({ ok: true, user: fullUser(user) });
}));

// ---------- change a member's role (admin only, never your own) ----------
router.put('/users/:id/role', asyncHandler(async function (req, res) {
  var admin = auth.needAdmin(req);
  var userId = Number(req.params.id) || 0;
  if (userId === admin.id) throw new HttpError(400, 'You cannot change your own role.');
  var role = req.body.role;
  if (['student', 'moderator', 'admin'].indexOf(role) === -1) throw new HttpError(400, 'Wrong role.');
  var found = rows(await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]));
  if (!found.length) throw new HttpError(404, 'User not found.');
  await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
  res.json({ ok: true });
}));

// ---------- suspend / unsuspend a member (admin only, never yourself) ----------
// Suspending logs the member out at once and blocks their next login.
router.put('/users/:id/suspend', asyncHandler(async function (req, res) {
  var admin = auth.needAdmin(req);
  var userId = Number(req.params.id) || 0;
  if (userId === admin.id) throw new HttpError(400, 'You cannot suspend your own account.');
  var suspended = req.body.suspended ? 1 : 0;
  var found = rows(await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]));
  if (!found.length) throw new HttpError(404, 'User not found.');
  await pool.query('UPDATE users SET suspended = ? WHERE id = ?', [suspended, userId]);
  if (suspended) await auth.deleteUserSessions(userId);
  res.json({ ok: true });
}));

// ---------- approve a waiting account (admin only) ----------
router.post('/users/:id/approve', asyncHandler(async function (req, res) {
  auth.needAdmin(req);
  var userId = Number(req.params.id) || 0;
  var found = rows(await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]));
  if (!found.length) throw new HttpError(404, 'User not found.');
  await pool.query('UPDATE users SET approved = 1 WHERE id = ?', [userId]);
  res.json({ ok: true });
}));

// ---------- reject a sign-up (admin only): the account is deleted ----------
router.post('/users/:id/reject', asyncHandler(async function (req, res) {
  auth.needAdmin(req);
  var userId = Number(req.params.id) || 0;
  var found = rows(await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]));
  if (!found.length) throw new HttpError(404, 'User not found.');
  await deleteUserCompletely(userId);
  res.json({ ok: true });
}));

// ---------- delete a user (admin only, never yourself) ----------
router.delete('/users/:id', asyncHandler(async function (req, res) {
  var admin = auth.needAdmin(req);
  var userId = Number(req.params.id) || 0;
  if (userId === admin.id) throw new HttpError(400, 'You cannot delete your own account.');
  var found = rows(await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]));
  if (!found.length) throw new HttpError(404, 'User not found.');
  await deleteUserCompletely(userId);
  res.json({ ok: true });
}));

// ---------- add a course (admin only) ----------
router.post('/courses', asyncHandler(async function (req, res) {
  auth.needAdmin(req);
  var dept = text(req.body.dept, 60);
  var sem = text(req.body.sem, 40);
  var code = normCourseCode(text(req.body.code, 30));
  var title = text(req.body.title, 150);
  if (!dept || !sem || !code || !title) throw new HttpError(400, 'Please fill in all the course fields.');
  var same = rows(await pool.query('SELECT * FROM courses WHERE dept = ? AND sem = ?', [dept, sem]));
  var duplicate = same.some(function (c) { return normCourseCode(c.code) === code; });
  if (duplicate) throw new HttpError(409, 'This course already exists.');
  await pool.query('INSERT INTO courses (code, title, dept, sem) VALUES (?, ?, ?, ?)', [code, title, dept, sem]);
  res.json({ ok: true });
}));

// ---------- delete a course (admin only, only when it has no notes) ----------
router.delete('/courses/:id', asyncHandler(async function (req, res) {
  auth.needAdmin(req);
  var courseId = Number(req.params.id) || 0;
  var found = rows(await pool.query('SELECT * FROM courses WHERE id = ? LIMIT 1', [courseId]));
  if (!found.length) throw new HttpError(404, 'Course not found.');
  var hasNotes = rows(await pool.query('SELECT 1 FROM notes WHERE course_id = ? LIMIT 1', [courseId]));
  if (hasNotes.length) throw new HttpError(409, 'This course still has notes. Delete those notes first.');
  await pool.query('DELETE FROM courses WHERE id = ?', [courseId]);
  res.json({ ok: true });
}));

// ---------- notices (staff: admin + moderator) ----------
router.post('/notices', asyncHandler(async function (req, res) {
  var user = auth.needStaff(req);
  var title = text(req.body.title, 150);
  var body = text(req.body.body, 5000);
  if (!title) throw new HttpError(400, 'Please enter a title for the notice.');
  if (!body) throw new HttpError(400, 'Please enter the notice text.');
  var result = await pool.query(
    'INSERT INTO notices (author_id, title, body, pinned, created) VALUES (?, ?, ?, ?, ?)',
    [user.id, title, body, req.body.pinned ? 1 : 0, Date.now()]
  );
  res.json({ ok: true, id: result[0].insertId });
}));

router.put('/notices/:id', asyncHandler(async function (req, res) {
  var user = auth.needStaff(req);
  var noticeId = Number(req.params.id) || 0;
  var found = rows(await pool.query('SELECT * FROM notices WHERE id = ? LIMIT 1', [noticeId]));
  if (!found.length) throw new HttpError(404, 'Notice not found.');
  var title = text(req.body.title, 150);
  var body = text(req.body.body, 5000);
  if (!title) throw new HttpError(400, 'Please enter a title for the notice.');
  if (!body) throw new HttpError(400, 'Please enter the notice text.');
  await pool.query(
    'UPDATE notices SET title = ?, body = ?, pinned = ? WHERE id = ?',
    [title, body, req.body.pinned ? 1 : 0, noticeId]
  );
  res.json({ ok: true });
}));

router.delete('/notices/:id', asyncHandler(async function (req, res) {
  auth.needStaff(req);
  var noticeId = Number(req.params.id) || 0;
  var found = rows(await pool.query('SELECT * FROM notices WHERE id = ? LIMIT 1', [noticeId]));
  if (!found.length) throw new HttpError(404, 'Notice not found.');
  await pool.query('DELETE FROM notices WHERE id = ?', [noticeId]);
  res.json({ ok: true });
}));

module.exports = router;
