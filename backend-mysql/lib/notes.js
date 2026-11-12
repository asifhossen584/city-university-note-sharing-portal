// lib/notes.js - course lookup and note helpers shared by the routes.
const fs = require('fs');
const path = require('path');
const { pool } = require('../db');
const { HttpError, text, normCourseCode } = require('./helpers');

const UPLOADS = path.join(__dirname, '..', 'uploads');

// Course code + subject title typed in by hand (manual entry): use the
// course already in the catalogue when the typed code and title match
// one, or add the typed course to the catalogue when it is not listed
// yet - that is how notes for departments with no published course list
// can be uploaded at all. A typed code that is already listed with a
// different title is a mismatch, not a new course.
// (Same rules as the original portal's resolveCourse; sem is the string
// "Semester 1" .. "Semester 12" for every department.)
async function resolveCourse(body, fallbackDept, fallbackSem) {
  // A course picked from the catalogue (by id) wins.
  if (body.courseId) {
    var byId = await pool.query('SELECT * FROM courses WHERE id = ? LIMIT 1', [Number(body.courseId) || 0]);
    if (byId[0].length) return byId[0][0];
  }
  var code = normCourseCode(text(body.courseCode, 30));
  var title = text(body.courseTitle, 150);
  if (!code || !title) throw new HttpError(400, 'Please enter both a course code and a subject title.');
  var dept = text(body.dept, 60) || fallbackDept || '';
  var sem = text(body.sem, 40) || fallbackSem || '';

  var poolRows = await pool.query(
    'SELECT * FROM courses WHERE (? = "" OR dept = ?) AND (? = "" OR sem = ?)',
    [dept, dept, sem, sem]
  );
  var sameCode = poolRows[0].filter(function (c) { return normCourseCode(c.code) === code; });
  if (sameCode.length) {
    var match = sameCode.filter(function (c) { return c.title.toLowerCase() === title.toLowerCase(); })[0];
    if (match) return match;
    throw new HttpError(400, 'That course code is already listed as "' + sameCode[0].title + '". Please check the subject title.');
  }
  if (!dept || !sem) throw new HttpError(400, 'Please choose a department and a semester.');
  // A new course is stored in its cleaned form (capital letters + digits only).
  var created = await pool.query(
    'INSERT INTO courses (code, title, dept, sem) VALUES (?, ?, ?, ?)',
    [code, title, dept, sem]
  );
  return { id: created[0].insertId, code: code, title: title, dept: dept, sem: sem };
}

// One row of the note list query (see noteSelect below) turned into the
// public note shape the frontend already knows: course info, uploader name
// and rating summary attached, internal file name hidden.
function noteFromRow(r) {
  return {
    id: r.id, userId: r.user_id, courseId: r.course_id, title: r.title, desc: r.desc,
    fileName: r.file_name, fileType: r.file_type, fileSize: r.file_size, status: r.status,
    created: r.created, downloads: r.downloads,
    code: r.code, courseTitle: r.course_title, dept: r.dept, sem: r.sem,
    uploader: r.uploader || 'Deleted user', avg: Number(r.avg) || 0, count: Number(r.count) || 0
  };
}

// Shared SELECT for notes with course, uploader and rating info.
// The rating summary comes from a derived table (no GROUP BY), so the query
// works the same on MySQL 8 (ONLY_FULL_GROUP_BY) and MariaDB.
// Extra WHERE conditions are appended by the caller.
const NOTE_SELECT =
  'SELECT n.*, c.code, c.title AS course_title, c.dept, c.sem, u.name AS uploader, ' +
  'COALESCE(rs.avg, 0) AS avg, COALESCE(rs.cnt, 0) AS count ' +
  'FROM notes n ' +
  'JOIN courses c ON c.id = n.course_id ' +
  'LEFT JOIN users u ON u.id = n.user_id ' +
  'LEFT JOIN (SELECT note_id, AVG(value) AS avg, COUNT(*) AS cnt FROM ratings GROUP BY note_id) rs ON rs.note_id = n.id ';

// A note can be seen if it is approved, or if it belongs to the user,
// or the user is staff (admin or moderator).
function canSee(note, user) {
  if (note.status === 'approved') return true;
  if (!user) return false;
  return user.role === 'admin' || user.role === 'moderator' || user.id === note.user_id;
}

function canChange(note, user) {
  return user.role === 'admin' || user.role === 'moderator' || user.id === note.user_id;
}

// Delete a note's stored file from uploads/ (best effort - a missing file
// is not an error). The database rows disappear through ON DELETE CASCADE.
function removeNoteFile(storedName) {
  if (!storedName) return;
  fs.unlink(path.join(UPLOADS, storedName), function () {});
}

module.exports = { UPLOADS, resolveCourse, noteFromRow, NOTE_SELECT, canSee, canChange, removeNoteFile };
