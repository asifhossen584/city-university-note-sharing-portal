// lib/helpers.js - small helpers shared by the routes.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Wrap an async route handler so a thrown HttpError (or any error) reaches
// the error handler in server.js instead of hanging the request.
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Plain text from a request field: trimmed, and cut to a maximum length.
function text(value, maxLength) {
  var s = typeof value === 'string' ? value.trim() : '';
  return s.length > maxLength ? s.substring(0, maxLength) : s;
}

// Course codes are compared and stored in their cleaned form:
// capital letters and digits only. The catalogue still holds official
// codes with spaces ("CSE 1101"), so a typed "CSE1101" must match
// that course instead of creating a duplicate of it.
function normCourseCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Checks the first bytes of a file, so a renamed .exe cannot pretend to be a PDF.
function looksLikeType(buffer, ext) {
  var head = buffer.slice(0, 8);
  if (ext === 'pdf') return head.slice(0, 4).toString('latin1') === '%PDF';
  if (ext === 'png') return head[0] === 0x89 && head.slice(1, 4).toString('latin1') === 'PNG';
  if (ext === 'jpg' || ext === 'jpeg') return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  if (ext === 'docx' || ext === 'pptx') return head[0] === 0x50 && head[1] === 0x4b;
  if (ext === 'doc' || ext === 'ppt') return head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0;
  return false;
}

// The public shape of a user. Never includes the password hash, and the
// admin-only fields (studentId, phone) are only added where the caller is
// allowed to see them (own profile, or the admin user list).
function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, role: u.role, dept: u.dept };
}

// Same as publicUser, plus the fields the owner (and admins) may see.
function fullUser(u) {
  if (!u) return null;
  var out = publicUser(u);
  out.studentId = u.student_id || '';
  out.phone = u.phone || '';
  out.approved = !!u.approved;
  out.suspended = !!u.suspended;
  out.joined = u.joined;
  out.photo = u.photo || null;
  return out;
}

module.exports = { HttpError, asyncHandler, text, normCourseCode, looksLikeType, publicUser, fullUser };
