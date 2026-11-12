// routes/notes.js - upload, edit, delete, rating, comments and bookmarks.
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config');
const { pool } = require('../db');
const { HttpError, asyncHandler, text, looksLikeType } = require('../lib/helpers');
const auth = require('../lib/auth');
const notesLib = require('../lib/notes');

const router = express.Router();
const ALLOWED_TYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg'];

function rows(result) { return result[0]; }

// File upload accepts two shapes (same API as the original portal):
//   - multipart/form-data with a "file" field (used by a normal HTML form), or
//   - JSON with fileName + fileData (base64), as the original frontend sends.
// Either way the file is checked for type, size and real content, then saved
// under a random name.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileMB * 1024 * 1024 }
});
function uploadFile(req, res, next) {
  if (req.is('multipart/form-data')) return upload.single('file')(req, res, next);
  next();
}

async function ratingInfo(noteId) {
  var r = rows(await pool.query(
    'SELECT COALESCE(AVG(value), 0) AS avg, COUNT(*) AS count FROM ratings WHERE note_id = ?', [noteId]
  ))[0];
  return { avg: Number(r.avg) || 0, count: Number(r.count) || 0 };
}

// ---------- upload ----------
router.post('/notes', uploadFile, asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var title = text(req.body.title, 150);
  var desc = text(req.body.desc, 2000);
  var course = await notesLib.resolveCourse(req.body, '', '');

  var fileName = '';
  var buffer = null;
  if (req.file) {
    fileName = text(req.file.originalname, 200);
    buffer = req.file.buffer;
  } else {
    fileName = text(req.body.fileName, 200);
    var fileData = typeof req.body.fileData === 'string' ? req.body.fileData : '';
    if (!fileData) throw new HttpError(400, 'Please choose a file to upload.');
    buffer = Buffer.from(fileData, 'base64');
  }

  if (title.length < 3) throw new HttpError(400, 'Title must be 3 to 150 characters.');
  var ext = fileName.indexOf('.') > -1 ? fileName.split('.').pop().toLowerCase() : '';
  if (ALLOWED_TYPES.indexOf(ext) === -1) throw new HttpError(400, 'File type not allowed. Use PDF, DOC, DOCX, PPT, PPTX, PNG or JPG.');
  if (!buffer || buffer.length === 0) throw new HttpError(400, 'The file is empty.');
  if (buffer.length > config.maxFileMB * 1024 * 1024) throw new HttpError(400, 'File is too large (maximum ' + config.maxFileMB + ' MB).');
  if (!looksLikeType(buffer, ext)) throw new HttpError(400, 'The file content does not match its type (.' + ext + ').');

  // The file is saved with a random name, so nobody can guess or overwrite it.
  var storedName = crypto.randomBytes(16).toString('hex') + '.' + ext;
  fs.writeFileSync(path.join(notesLib.UPLOADS, storedName), buffer);

  var result = await pool.query(
    'INSERT INTO notes (user_id, course_id, title, `desc`, file_name, stored_name, file_type, file_size, status, created, downloads) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [user.id, course.id, title, desc, fileName, storedName, ext, buffer.length,
      user.role === 'admin' ? 'approved' : 'pending', Date.now(), 0]
  );
  var note = rows(await pool.query('SELECT status FROM notes WHERE id = ? LIMIT 1', [result[0].insertId]))[0];
  res.json({ id: result[0].insertId, status: note.status });
}));

// ---------- edit (title, description, course only - the file stays) ----------
// NOTE: like the original portal, editing an approved note does NOT send it
// back to pending. If that matters for your project, set status='pending'
// here for non-admin editors.
router.put('/notes/:id', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var note = found[0];
  if (!note) throw new HttpError(404, 'Note not found.');
  if (!notesLib.canChange(note, user)) throw new HttpError(403, 'You can only edit your own notes.');
  var title = text(req.body.title, 150);
  if (title.length < 3) throw new HttpError(400, 'Title must be 3 to 150 characters.');
  var currentCourse = rows(await pool.query('SELECT * FROM courses WHERE id = ? LIMIT 1', [note.course_id]))[0] || { dept: '', sem: '' };
  var course = await notesLib.resolveCourse(req.body, currentCourse.dept, currentCourse.sem);
  await pool.query(
    'UPDATE notes SET title = ?, `desc` = ?, course_id = ? WHERE id = ?',
    [title, text(req.body.desc, 2000), course.id, note.id]
  );
  res.json({ ok: true });
}));

// ---------- delete (owner, admin or moderator) ----------
router.delete('/notes/:id', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var note = found[0];
  if (!note) throw new HttpError(404, 'Note not found.');
  if (!notesLib.canChange(note, user)) throw new HttpError(403, 'You can only delete your own notes.');
  notesLib.removeNoteFile(note.stored_name);
  await pool.query('DELETE FROM notes WHERE id = ?', [note.id]); // ratings, comments, bookmarks go too (ON DELETE CASCADE)
  res.json({ ok: true });
}));

// ---------- rate 1-5 (not your own note, approved notes only) ----------
router.post('/notes/:id/rate', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var note = found[0];
  if (!note || note.status !== 'approved') throw new HttpError(404, 'Note not found.');
  if (note.user_id === user.id) throw new HttpError(400, 'You cannot rate your own note.');
  var value = Number(req.body.value);
  if (!Number.isInteger(value) || value < 1 || value > 5) throw new HttpError(400, 'Rating must be from 1 to 5.');
  await pool.query(
    'INSERT INTO ratings (note_id, user_id, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
    [note.id, user.id, value]
  );
  res.json(await ratingInfo(note.id));
}));

// ---------- add a comment ----------
router.post('/notes/:id/comments', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var note = found[0];
  if (!note || note.status !== 'approved') throw new HttpError(404, 'Note not found.');
  var body = text(req.body.text, 1000);
  if (!body) throw new HttpError(400, 'Comment must be 1 to 1000 characters.');
  await pool.query(
    'INSERT INTO comments (note_id, user_id, text, created) VALUES (?, ?, ?, ?)',
    [note.id, user.id, body, Date.now()]
  );
  res.json({ ok: true });
}));

// ---------- delete a comment (its author, admin or moderator) ----------
router.delete('/comments/:id', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM comments WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var comment = found[0];
  if (!comment) throw new HttpError(404, 'Comment not found.');
  if (user.role !== 'admin' && user.role !== 'moderator' && comment.user_id !== user.id) {
    throw new HttpError(403, 'You can only delete your own comments.');
  }
  await pool.query('DELETE FROM comments WHERE id = ?', [comment.id]);
  res.json({ ok: true });
}));

// ---------- bookmark on/off (a toggle) ----------
router.post('/notes/:id/bookmark', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var note = found[0];
  if (!note || note.status !== 'approved') throw new HttpError(404, 'Note not found.');
  var exists = rows(await pool.query(
    'SELECT 1 FROM bookmarks WHERE note_id = ? AND user_id = ? LIMIT 1', [note.id, user.id]
  ));
  if (exists.length) {
    await pool.query('DELETE FROM bookmarks WHERE note_id = ? AND user_id = ?', [note.id, user.id]);
  } else {
    await pool.query('INSERT INTO bookmarks (user_id, note_id) VALUES (?, ?)', [user.id, note.id]);
  }
  res.json({ bookmarked: !exists.length });
}));

// ---------- my bookmarks ----------
router.get('/bookmarks', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var list = rows(await pool.query(
    notesLib.NOTE_SELECT +
    'JOIN bookmarks b ON b.note_id = n.id AND b.user_id = ? ' +
    'WHERE n.status = ? ORDER BY n.created DESC',
    [user.id, 'approved']
  ));
  res.json({ notes: list.map(notesLib.noteFromRow) });
}));

module.exports = router;
