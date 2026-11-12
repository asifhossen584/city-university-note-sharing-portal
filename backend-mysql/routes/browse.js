// routes/browse.js - public reading: courses, note search/browse, note detail,
// file preview/download, public contributor profiles and notices.
const express = require('express');
const fs = require('fs');
const path = require('path');
const { pool } = require('../db');
const { HttpError, asyncHandler } = require('../lib/helpers');
const auth = require('../lib/auth');
const notesLib = require('../lib/notes');

const router = express.Router();
const ALLOWED_TYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg'];
const PREVIEW_TYPES = ['pdf', 'png', 'jpg', 'jpeg'];
const MIME = {
  pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg'
};

function rows(result) { return result[0]; }

// ---------- courses ----------
router.get('/courses', asyncHandler(async function (req, res) {
  var list = rows(await pool.query('SELECT * FROM courses ORDER BY id'));
  res.json({ courses: list });
}));

// ---------- search, browse and filter (approved notes only) ----------
router.get('/notes', asyncHandler(async function (req, res) {
  var q = (req.query.q || '').toLowerCase();
  var dept = req.query.dept || '';
  var sem = req.query.sem || '';
  var courseId = req.query.course || '';
  var sort = req.query.sort || 'newest';

  var where = ["n.status = 'approved'"];
  var params = [];
  if (dept) { where.push('c.dept = ?'); params.push(dept); }
  if (sem) { where.push('c.sem = ?'); params.push(sem); }
  if (courseId) { where.push('n.course_id = ?'); params.push(Number(courseId) || 0); }
  if (q) {
    where.push('(n.title LIKE ? OR n.`desc` LIKE ? OR c.code LIKE ? OR c.title LIKE ? OR u.name LIKE ?)');
    var like = '%' + q + '%';
    params.push(like, like, like, like, like);
  }
  var order = 'n.created DESC';
  if (sort === 'rated') order = 'avg DESC, count DESC';
  else if (sort === 'downloads') order = 'n.downloads DESC';
  else if (sort === 'title') order = 'n.title ASC';

  var list = rows(await pool.query(
    notesLib.NOTE_SELECT + 'WHERE ' + where.join(' AND ') + ' ORDER BY ' + order + ' LIMIT 200',
    params
  ));
  res.json({ notes: list.map(notesLib.noteFromRow) });
}));

// ---------- my notes (every status, newest first) ----------
router.get('/my-notes', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var list = rows(await pool.query(
    notesLib.NOTE_SELECT + 'WHERE n.user_id = ? ORDER BY n.created DESC', [user.id]
  ));
  res.json({ notes: list.map(notesLib.noteFromRow) });
}));

// ---------- one note, with comments, my rating and bookmark state ----------
router.get('/notes/:id', asyncHandler(async function (req, res) {
  var found = rows(await pool.query(notesLib.NOTE_SELECT + 'WHERE n.id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var row = found[0];
  if (!row || !notesLib.canSee(row, req.user)) throw new HttpError(404, 'Note not found.');
  var comments = rows(await pool.query(
    'SELECT cm.*, u.name AS name FROM comments cm LEFT JOIN users u ON u.id = cm.user_id ' +
    'WHERE cm.note_id = ? ORDER BY cm.created DESC', [row.id]
  )).map(function (c) {
    return { id: c.id, userId: c.user_id, name: c.name || 'Deleted user', text: c.text, created: c.created };
  });

  var myRating = 0, bookmarked = false;
  if (req.user) {
    var mine = rows(await pool.query(
      'SELECT value FROM ratings WHERE note_id = ? AND user_id = ? LIMIT 1', [row.id, req.user.id]
    ));
    if (mine.length) myRating = mine[0].value;
    var bm = rows(await pool.query(
      'SELECT 1 FROM bookmarks WHERE note_id = ? AND user_id = ? LIMIT 1', [row.id, req.user.id]
    ));
    bookmarked = bm.length > 0;
  }
  res.json({
    note: notesLib.noteFromRow(row), comments: comments,
    myRating: myRating, bookmarked: bookmarked,
    canChange: !!req.user && notesLib.canChange(row, req.user)
  });
}));

// ---------- preview (?download=0) and download (?download=1) ----------
router.get('/notes/:id/file', asyncHandler(async function (req, res) {
  var user = auth.needLogin(req);
  var found = rows(await pool.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [Number(req.params.id) || 0]));
  var note = found[0];
  if (!note || !notesLib.canSee(note, user)) throw new HttpError(404, 'Note not found.');
  var filePath = path.join(notesLib.UPLOADS, note.stored_name);
  if (!fs.existsSync(filePath)) throw new HttpError(404, 'The file is missing on the server.');

  var download = req.query.download === '1';
  if (!download && PREVIEW_TYPES.indexOf(note.file_type) === -1) {
    throw new HttpError(415, 'Preview is not available for this file type. Please download it.');
  }
  if (download) {
    await pool.query('UPDATE notes SET downloads = downloads + 1 WHERE id = ?', [note.id]);
  }
  var asciiName = note.file_name.replace(/[^a-zA-Z0-9._-]/g, '_');
  res.writeHead(200, {
    'Content-Type': MIME[note.file_type] || 'application/octet-stream',
    'Content-Length': fs.statSync(filePath).size,
    'Content-Disposition': (download ? 'attachment' : 'inline') + '; filename="' + asciiName + '"; filename*=UTF-8\'\'' + encodeURIComponent(note.file_name),
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'private, no-store'
  });
  fs.createReadStream(filePath).pipe(res);
}));

// ---------- public contributor profile ----------
// Visitors see only approved notes. The owner and admins also see pending
// notes. Only an admin sees the "account" box (email, Student ID, phone,
// approval and suspension state) - students and logged-out visitors never do.
router.get('/users/:id', asyncHandler(async function (req, res) {
  var userId = Number(req.params.id) || 0;
  var found = rows(await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]));
  var user = found[0];
  if (!user) throw new HttpError(404, 'User not found.');

  var viewerIsAdmin = !!req.user && req.user.role === 'admin';
  var isOwner = !!req.user && req.user.id === user.id;
  var showAll = viewerIsAdmin || isOwner;

  var stats = rows(await pool.query(
    'SELECT COUNT(*) AS notes_shared, COALESCE(SUM(n.downloads), 0) AS total_downloads ' +
    'FROM notes n WHERE n.user_id = ? AND (n.status = ? OR ? = 1)',
    [userId, 'approved', showAll ? 1 : 0]
  ))[0];
  var avgRow = rows(await pool.query(
    'SELECT COALESCE(AVG(rt.value), 0) AS avg_rating FROM ratings rt ' +
    'JOIN notes n ON n.id = rt.note_id WHERE n.user_id = ? AND n.status = ?',
    [userId, 'approved']
  ))[0];
  var depts = rows(await pool.query(
    'SELECT DISTINCT c.dept FROM notes n JOIN courses c ON c.id = n.course_id ' +
    'WHERE n.user_id = ? AND n.status = ? ORDER BY c.dept',
    [userId, 'approved']
  )).map(function (r) { return r.dept; });

  var notes = rows(await pool.query(
    notesLib.NOTE_SELECT +
    'WHERE n.user_id = ? AND (n.status = ? OR ? = 1) ORDER BY n.created DESC',
    [userId, 'approved', showAll ? 1 : 0]
  )).map(notesLib.noteFromRow);

  var profile = {
    id: user.id, name: user.name, dept: user.dept, role: user.role, joined: user.joined,
    notesShared: Number(stats.notes_shared) || 0,
    totalDownloads: Number(stats.total_downloads) || 0,
    avgRating: Number(avgRow.avg_rating) || 0,
    departments: depts,
    suspended: !!user.suspended,
    approved: !!user.approved,
    photo: user.photo || null
  };
  var account = null;
  if (viewerIsAdmin) {
    account = {
      name: user.name, email: user.email, studentId: user.student_id || '',
      phone: user.phone || '', dept: user.dept, role: user.role,
      joined: user.joined, approved: !!user.approved, suspended: !!user.suspended,
      notesShared: profile.notesShared
    };
  }
  res.json({ profile: profile, notes: notes, account: account, isOwner: isOwner, viewerIsAdmin: viewerIsAdmin });
}));

// ---------- notices (public) ----------
router.get('/notices', asyncHandler(async function (req, res) {
  var list = rows(await pool.query(
    'SELECT nt.*, u.name AS author FROM notices nt LEFT JOIN users u ON u.id = nt.author_id ' +
    'ORDER BY nt.pinned DESC, nt.created DESC'
  )).map(function (n) {
    return { id: n.id, authorId: n.author_id, author: n.author || 'Deleted user', pinned: !!n.pinned, created: n.created, title: n.title, body: n.body };
  });
  res.json({ notices: list });
}));

module.exports = router;
