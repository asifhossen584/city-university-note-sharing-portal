-- schema.sql - Notes Portal database (MySQL 8 / MariaDB 10.4+).
-- Run it once:   mysql -u notes_user -p notes_portal < schema.sql
-- (or let `npm run seed` run it for you - it creates the database too.)
-- All tables use InnoDB + utf8mb4. Timestamps are BIGINT milliseconds since
-- the epoch (Date.now()), exactly like the original JSON database, so the API
-- returns the same shapes as before.

CREATE DATABASE IF NOT EXISTS notes_portal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE notes_portal;

-- ---------------------------------------------------------------- users
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,   -- bcrypt hash (never plain text)
  student_id  VARCHAR(12) NULL,          -- exactly 12 digits, unique
  phone       VARCHAR(15) NULL,          -- 10-15 digits
  role        ENUM('student', 'moderator', 'admin') NOT NULL DEFAULT 'student',
  dept        VARCHAR(60) NOT NULL DEFAULT '',
  approved    TINYINT(1) NOT NULL DEFAULT 0,  -- 0 = waiting for admin approval
  suspended   TINYINT(1) NOT NULL DEFAULT 0,  -- 1 = cannot log in
  photo       MEDIUMTEXT NULL,           -- profile photo as a data URL (optional)
  joined      BIGINT NOT NULL,           -- milliseconds since epoch
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_student_id (student_id),
  INDEX idx_users_role (role),
  INDEX idx_users_approved (approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------- courses
-- The official 294-course catalogue (Textile 77, BBA 82 + 1 legacy, Agriculture
-- 81, Law 47, CSE 4, EEE 1, English 1). `sem` is the string "Semester 1" ..
-- "Semester 12" for every department.
CREATE TABLE IF NOT EXISTS courses (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  code   VARCHAR(30) NOT NULL,           -- e.g. "CSE 1101" (official) or "CSE1101" (typed)
  title  VARCHAR(150) NOT NULL,
  dept   VARCHAR(60) NOT NULL,
  sem    VARCHAR(40) NOT NULL,           -- "Semester 1" .. "Semester 12"
  UNIQUE KEY uq_courses_dept_sem_code (dept, sem, code),
  INDEX idx_courses_dept_sem (dept, sem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------- notes
CREATE TABLE IF NOT EXISTS notes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  course_id   INT NOT NULL,
  title       VARCHAR(150) NOT NULL,
  `desc`      TEXT NOT NULL DEFAULT '',
  file_name   VARCHAR(200) NOT NULL,     -- original file name shown to users
  stored_name VARCHAR(255) NOT NULL,     -- random name on disk (never guessed)
  file_type   VARCHAR(10) NOT NULL,      -- pdf, doc, docx, ppt, pptx, png, jpg
  file_size   INT NOT NULL DEFAULT 0,
  status      ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created     BIGINT NOT NULL,           -- milliseconds since epoch
  downloads   INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_notes_stored_name (stored_name),
  INDEX idx_notes_course (course_id),
  INDEX idx_notes_user (user_id),
  INDEX idx_notes_status_created (status, created),
  CONSTRAINT fk_notes_user   FOREIGN KEY (user_id)   REFERENCES users (id)   ON DELETE CASCADE,
  CONSTRAINT fk_notes_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------- ratings
CREATE TABLE IF NOT EXISTS ratings (
  note_id INT NOT NULL,
  user_id INT NOT NULL,
  value   TINYINT NOT NULL,              -- 1 to 5 stars
  PRIMARY KEY (note_id, user_id),
  INDEX idx_ratings_user (user_id),
  CONSTRAINT fk_ratings_note FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
  CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------- comments
CREATE TABLE IF NOT EXISTS comments (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  note_id  INT NOT NULL,
  user_id  INT NOT NULL,
  text     VARCHAR(1000) NOT NULL,
  created  BIGINT NOT NULL,
  INDEX idx_comments_note (note_id),
  INDEX idx_comments_user (user_id),
  CONSTRAINT fk_comments_note FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------ bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INT NOT NULL,
  note_id INT NOT NULL,
  PRIMARY KEY (user_id, note_id),
  INDEX idx_bookmarks_note (note_id),
  CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_bookmarks_note FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------- notices
-- Posted by admins (and moderators). Shown on the Home notice board and in
-- the notification bell, pinned first.
CREATE TABLE IF NOT EXISTS notices (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  author_id  INT NULL,
  title      VARCHAR(150) NOT NULL,
  body       TEXT NOT NULL,
  pinned     TINYINT(1) NOT NULL DEFAULT 0,
  created    BIGINT NOT NULL,
  INDEX idx_notices_pinned_created (pinned, created),
  CONSTRAINT fk_notices_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------- password reset codes
CREATE TABLE IF NOT EXISTS resets (
  email      VARCHAR(150) NOT NULL PRIMARY KEY,
  code_hash  CHAR(64) NOT NULL,          -- sha256 of the 6-digit code
  expires_at BIGINT NOT NULL,
  tries      INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------- sessions
-- Login sessions (express-session store, see lib/sessionStore.js).
-- `data` is the serialized session (it only ever holds the user id).
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) NOT NULL PRIMARY KEY,
  user_id    INT NULL,
  expires_at BIGINT NOT NULL,
  data       MEDIUMTEXT NOT NULL,
  INDEX idx_sessions_user (user_id),
  INDEX idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
