// seed.js - creates the database, the tables and the first data.
// Run it once:   npm run seed        (or: node seed.js)
// Run it again with --force to wipe everything and start over:
//                node seed.js --force
//
// What it seeds:
//   - the admin account (config.admin) + 4 sample users (3 students, 1 moderator)
//   - the official 294-course catalogue (lib/courses.js - never edited by hand)
//   - 7 sample notes with real one-page PDF files (lib/pdf.js), ratings,
//     comments, bookmarks and 3 notices (only when SEED_SAMPLES is true)
//
// Passwords are hashed with bcrypt AT SEED TIME. No plain-text password is
// stored in this file: the demo defaults live in config.js (change them in
// your .env file) and only their hashes reach the database.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('./config');
const COURSES = require('./lib/courses');
const pdf = require('./lib/pdf');

const UPLOADS = path.join(__dirname, 'uploads');
const DAY = 86400000;
const FORCE = process.argv.indexOf('--force') !== -1;

// Split schema.sql into single statements. The file has no semicolons inside
// string literals, so splitting on ";" is safe here.
function splitSql(text) {
  return text.split(';').map(function (s) {
    // drop full-line -- comments
    return s.split('\n').filter(function (line) { return line.trim().indexOf('--') !== 0; }).join('\n');
  }).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
}

async function main() {
  // 1. Connect to the MySQL server (no database yet) and create the database.
  var adminConn = await mysql.createConnection({
    host: config.db.host, port: config.db.port,
    user: config.db.user, password: config.db.password
  });
  await adminConn.query(
    'CREATE DATABASE IF NOT EXISTS `' + config.db.database + '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
  );
  await adminConn.end();

  // 2. Run the schema (creates all tables).
  var pool = mysql.createPool({
    host: config.db.host, port: config.db.port, user: config.db.user,
    password: config.db.password, database: config.db.database,
    multipleStatements: false
  });
  var schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  var statements = splitSql(schema);
  for (var i = 0; i < statements.length; i++) {
    var stmt = statements[i];
    if (/^CREATE DATABASE/i.test(stmt) || /^USE /i.test(stmt)) continue; // already done above
    await pool.query(stmt);
  }

  // 3. Skip when data already exists (unless --force).
  var existing = await pool.query('SELECT COUNT(*) AS n FROM users');
  if (existing[0][0].n > 0 && !FORCE) {
    console.log('Database already has users - nothing to seed.');
    console.log('Run "node seed.js --force" to wipe everything and start over.');
    await pool.end();
    return;
  }
  if (FORCE) {
    await pool.query('SET FOREIGN_KEY_CHECKS=0');
    var tables = ['sessions', 'resets', 'notices', 'bookmarks', 'comments', 'ratings', 'notes', 'courses', 'users'];
    for (var t = 0; t < tables.length; t++) await pool.query('DROP TABLE IF EXISTS ' + tables[t]);
    await pool.query('SET FOREIGN_KEY_CHECKS=1');
    for (var s = 0; s < statements.length; s++) {
      var st = statements[s];
      if (/^CREATE DATABASE/i.test(st) || /^USE /i.test(st)) continue;
      await pool.query(st);
    }
    console.log('Existing tables dropped (--force).');
  }

  var now = Date.now();
  fs.mkdirSync(UPLOADS, { recursive: true });

  // 4. Users. The admin is active at once; sample users too. A student who
  // registers through the website is NOT active until an admin approves them.
  var adminHash = await bcrypt.hash(config.admin.password, 12);
  var studentHash = await bcrypt.hash(config.studentPassword, 12);
  var users = [
    [1, config.admin.name, config.admin.email, adminHash, 'admin', 'CSE', '027200000001', '01700000001', 1, 0, now],
    [2, 'Rafiq Ahmed', 'rafiq@city.edu', studentHash, 'student', 'CSE', '027200000002', '01700000002', 1, 0, now - 100 * DAY],
    [3, 'Nusrat Jahan', 'nusrat@city.edu', studentHash, 'student', 'BBA', '027200000003', '01700000003', 1, 0, now - 90 * DAY],
    [4, 'Tanvir Hasan', 'tanvir@city.edu', studentHash, 'student', 'EEE', '027200000004', '01700000004', 1, 0, now - 70 * DAY],
    [5, 'Mim Chowdhury', 'mim@city.edu', studentHash, 'moderator', 'English', '027200000005', '01700000005', 1, 0, now - 60 * DAY]
  ];
  for (var u = 0; u < users.length; u++) {
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role, dept, student_id, phone, approved, suspended, joined) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', users[u]
    );
  }
  console.log('Users seeded: ' + users.length + ' (admin + 3 students + 1 moderator).');

  // 5. The 294-course catalogue (explicit ids 1..294, same as the original portal).
  for (var c = 0; c < COURSES.length; c++) {
    var course = COURSES[c];
    await pool.query(
      'INSERT INTO courses (id, code, title, dept, sem) VALUES (?, ?, ?, ?, ?)',
      [course.id, course.code, course.title, course.dept, course.sem]
    );
  }
  console.log('Courses seeded: ' + COURSES.length + '.');

  // 6. Sample notes, ratings, comments, bookmarks and notices.
  if (config.addSampleData) {
    var samples = [
      [11, 2, 1, 'Pointers and Memory Management', 'Pointer basics, dynamic memory and common mistakes with worked examples.', 78, 'approved', 34, ['A pointer stores a memory address', 'malloc() and free() manage heap memory', 'Set freed pointers to NULL', 'Arrays and pointers are related']],
      [12, 3, 2, 'Linked List and Stack Summary', 'Singly and doubly linked lists, push and pop, with diagrams.', 60, 'approved', 27, ['Node = data + next pointer', 'Insert at head is O(1)', 'Stack follows LIFO order', 'Use a stack to reverse a string']],
      [13, 2, 3, 'SQL Joins and Normalization Cheat Sheet', 'INNER, LEFT and RIGHT joins plus 1NF to 3NF in one page.', 41, 'approved', 52, ['INNER JOIN keeps matching rows only', 'LEFT JOIN keeps all left rows', '1NF: no repeating groups', '3NF: no transitive dependency']],
      [14, 4, 5, 'Diode and Transistor Basics', 'Forward and reverse bias, BJT regions and simple circuits.', 33, 'approved', 19, ['Diode conducts in forward bias', 'BJT has cut-off, active, saturation', 'Beta = Ic / Ib', 'Use a resistor to limit current']],
      [15, 3, 6, 'Principles of Management: Chapters 1 to 3', 'Planning, organizing, leading and controlling, with examples.', 18, 'approved', 14, ['Four functions of management', 'SWOT analysis for planning', 'Span of control and hierarchy', 'Leadership styles compared']],
      [16, 4, 4, 'Process Scheduling Algorithms', 'FCFS, SJF, Round Robin and priority scheduling with Gantt charts.', 9, 'approved', 8, ['FCFS is simple but can starve jobs', 'SJF gives the least waiting time', 'Round Robin needs a time quantum', 'Priority scheduling may starve jobs']],
      [17, 2, 7, 'Essay Writing Guide', 'Structure of a good essay: thesis, body paragraphs and conclusion.', 1, 'pending', 0, ['Start with a clear thesis', 'One idea per paragraph', 'Support points with evidence', 'End with a short conclusion']]
    ];
    for (var n = 0; n < samples.length; n++) {
      var s = samples[n];
      var courseRow = COURSES.filter(function (cc) { return cc.id === s[2]; })[0];
      var file = pdf.makePdf(s[3], courseRow.code + ' | ' + courseRow.title, s[8]);
      var storedName = 'sample-' + s[0] + '.pdf';
      fs.writeFileSync(path.join(UPLOADS, storedName), file);
      var fileName = s[3].replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() + '.pdf';
      await pool.query(
        'INSERT INTO notes (id, user_id, course_id, title, `desc`, file_name, stored_name, file_type, file_size, status, created, downloads) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [s[0], s[1], s[2], s[3], s[4], fileName, storedName, 'pdf', file.length, s[6], now - s[5] * DAY, s[7]]
      );
    }
    console.log('Sample notes seeded: ' + samples.length + ' (6 approved, 1 pending).');

    var ratings = [
      [11, 3, 5], [11, 4, 4], [12, 2, 4], [12, 4, 5], [13, 3, 5],
      [13, 4, 5], [13, 1, 4], [14, 2, 3], [15, 2, 4], [16, 3, 4]
    ];
    for (var r = 0; r < ratings.length; r++) {
      await pool.query('INSERT INTO ratings (note_id, user_id, value) VALUES (?, ?, ?)', ratings[r]);
    }
    var comments = [
      [1, 11, 3, 'Very clear explanation of dynamic memory. Thanks!', now - 70 * DAY],
      [2, 13, 4, 'The join examples helped me a lot before the exam.', now - 30 * DAY],
      [3, 13, 3, 'Can you add a page on indexes too?', now - 12 * DAY]
    ];
    for (var cm = 0; cm < comments.length; cm++) {
      await pool.query('INSERT INTO comments (id, note_id, user_id, text, created) VALUES (?, ?, ?, ?, ?)', comments[cm]);
    }
    await pool.query('INSERT INTO bookmarks (user_id, note_id) VALUES (3, 13), (4, 11)');
    console.log('Ratings, comments and bookmarks seeded.');

    var notices = [
      [1, 1, 1, 'New course lists: Law and Agriculture are live',
        'The official semester-wise course lists for Law (47 courses) and Agriculture (81 courses) are now in the catalogue. When you upload a note, pick the right department, semester and course so classmates can find it easily.', now - 1 * DAY],
      [2, 1, 0, 'Upload clear PDFs or photos',
        'Notes open right on the website before anyone downloads them, so please upload a readable PDF or a clear, straight photo of every page. Blurry or cropped notes will be sent back.', now - 10 * DAY],
      [3, 5, 0, 'Share your semester-final notes',
        'Finished a course this semester? Share your best notes and help your juniors - the most downloaded notes each month get featured on the home page.', now - 20 * DAY]
    ];
    for (var nt = 0; nt < notices.length; nt++) {
      await pool.query(
        'INSERT INTO notices (id, author_id, pinned, title, body, created) VALUES (?, ?, ?, ?, ?, ?)',
        notices[nt]
      );
    }
    console.log('Notices seeded: ' + notices.length + '.');
  }

  await pool.end();
  console.log('');
  console.log('Done. Database "' + config.db.database + '" is ready.');
  console.log('  Admin login: ' + config.admin.email + ' / ' + config.admin.password);
  if (config.admin.password === 'Admin@123') {
    console.log('  WARNING: you are using the demo default admin password.');
    console.log('  Change it right after the first login (Profile -> Change password),');
    console.log('  or set ADMIN_PASSWORD in your .env file and re-seed.');
  }
  console.log('  Student login (sample accounts): rafiq@city.edu / ' + config.studentPassword);
  console.log('Start the server with:  npm start');
}

main().catch(function (err) {
  console.error('Seed failed: ' + (err && err.message ? err.message : err));
  if (err && err.code === 'ECONNREFUSED') {
    console.error('Is MySQL running? Start it first (see README.md), then run the seed again.');
  }
  if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('MySQL refused the login. Check DB_USER / DB_PASSWORD in your .env file (see README.md).');
  }
  process.exit(1);
});
