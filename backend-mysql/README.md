# University Notes Sharing Portal — Backend (Node.js + Express + MySQL)

The backend API for the City University Notes Sharing Portal. Students upload,
search, preview, download, rate, comment on and bookmark study notes; admins
approve uploads, manage users, courses and notices.

This is the **backend only** (no frontend pages). It replaces the original
portal's JSON-file database (`data/db.json`) with MySQL, and replaces its
hand-rolled scrypt hashing with **bcrypt**. The API paths and response shapes
are the same as the original portal, so the frontend can call them unchanged.

> **Security fix:** the old static frontend shipped demo credentials
> (`admin@city.edu / Admin@123`) in client-visible page source, so anyone could
> sign in as admin. Here, passwords live **only as bcrypt hashes in MySQL**,
> login is checked **server-side**, and no credential appears in any file the
> browser can see. The default admin password below is a *demo* default for
> your own computer — change it right after the first login.

## What it can do

| Functionality | What it includes |
|---|---|
| Authentication & User Management | Sign up (Student ID + phone required), login, logout, password reset, profile, change password, admin deletes users |
| Account approval | New accounts stay inactive until an admin approves them (Admin → Users → Approve) |
| Roles & suspension | Student / Moderator / Admin; moderators approve notes, delete notes/comments and post notices; admins manage users, roles, courses and staff; suspend/unsuspend |
| Notes Management | Upload (PDF, DOC, DOCX, PPT, PPTX, PNG, JPG up to 10 MB), edit, delete, categories (department → semester → course), preview, download, admin approve / reject |
| Search, Browse & Filter | Search by keyword, filter by department, semester and course, sort by newest, rating, downloads, title |
| Rating, Comments & Bookmarks | 1–5 star rating, comments, bookmarks |
| Admin panel | Statistics (incl. accounts waiting for approval), approve/reject uploads, manage users/courses/notices |
| Notices | Admins and moderators post, edit, pin and delete notices |

## 1. Install the tools

1. **Node.js LTS (version 16 or newer):** https://nodejs.org — check with `node --version`.
2. **MySQL 8 (or MariaDB 10.4+):**
   - **Windows (easiest):** install [XAMPP](https://www.apachefriends.org/) and start MySQL from the XAMPP Control Panel — or install [MySQL Installer](https://dev.mysql.com/downloads/installer/) and remember the `root` password you set.
   - **macOS:** `brew install mysql` then `brew services start mysql`.
   - **Linux (Ubuntu/Debian):** `sudo apt install mariadb-server` then `sudo service mariadb start`.

## 2. Create the database and the MySQL user

Open a MySQL shell (`mysql -u root -p` on the command line, or the SQL tab in
phpMyAdmin) and run:

```sql
CREATE DATABASE notes_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'notes_user'@'localhost' IDENTIFIED BY 'notes_pass';
GRANT ALL PRIVILEGES ON notes_portal.* TO 'notes_user'@'localhost';
FLUSH PRIVILEGES;
```

(Use your own password instead of `notes_pass` — and put the same one in `.env` below.)

> The seed script can also create the database for you, but the MySQL user
> above must exist first (or use `root` in `.env` for a local demo only).

## 3. Set up the project

```bash
# in this folder:
cp .env.example .env        # then edit .env if your MySQL password differs
npm install
npm run seed                # creates the tables + the 294-course catalogue
npm start
```

Open http://localhost:3000 in your browser — you should see "API is running".

**Logins after seeding**

| Role | Email | Password |
|---|---|---|
| Admin | admin@city.edu | Admin@123 |
| Student | rafiq@city.edu | Student@123 |
| Student | nusrat@city.edu | Student@123 |
| Student | tanvir@city.edu | Student@123 |
| Moderator | mim@city.edu | Student@123 |

Sample accounts also have a Student ID (`027200000001`–`027200000005`) and a
phone number filled in. **Change the admin password right after the first
login** (log in → Profile → Change password), or set `ADMIN_PASSWORD` in
`.env` before seeding. To start again from zero: `node seed.js --force`
(wipes all tables and re-seeds), and delete the files in `uploads/`.

To seed without the sample notes/users/notices (only the admin account and the
course catalogue), set `SEED_SAMPLES=false` in `.env` before seeding.

## 4. Connecting the React frontend

The React frontend is a separate project. Point it at this API by using
`http://localhost:3000/api` as its base URL, and send every request with
credentials included so the session cookie travels with it:

```js
const API = 'http://localhost:3000/api';
fetch(API + '/notes', { credentials: 'include' });           // GET
fetch(API + '/login', {                                       // POST
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

CORS is already configured for the Vite dev server (`http://localhost:5173`).
If your frontend runs on another address, add it to `CORS_ORIGIN` in `.env`.

> **Important:** once the frontend calls this API, remove the demo accounts
> from the frontend source — login must go through `POST /api/login` only.
> That is the whole point of this backend: no credential may appear in any
> file the browser can load.

## API endpoints

All responses are JSON. `401` = not logged in, `403` = wrong role / account not
active, `404` = not found. Requests with a body must be `Content-Type:
application/json` (except the note upload, which also accepts
`multipart/form-data` with a `file` field).

### Auth

| Method & path | What it does |
|---|---|
| `POST /api/register` | Create an account. Body: `name, email, password (min 8), studentId (exactly 12 digits), phone (10–15 digits), dept`. The account is **not active** until an admin approves it — no session is created. |
| `POST /api/login` | Body: `email, password`. Blocked while the account waits for approval or is suspended. |
| `POST /api/logout` | Log out. |
| `GET /api/me` | The logged-in user (or `null`). |
| `POST /api/forgot` | Start a password reset (6-digit code, 15 minutes). The code is printed in the server window; while `SHOW_RESET_CODE=true` it is also returned in the answer (demo only). |
| `POST /api/reset` | Body: `email, code, password`. |
| `PUT /api/profile` | Edit my name, department, Student ID, phone, profile photo (`photo` = image data URL, or `removePhoto: true`). |
| `POST /api/change-password` | Body: `oldPassword, newPassword`. Logs the account out everywhere else. |

### Browse (public reading)

| Method & path | What it does |
|---|---|
| `GET /api/courses` | The 294-course catalogue. |
| `GET /api/notes?q=&dept=&sem=&course=&sort=` | Approved notes. `sem` is the string `Semester 1` … `Semester 12`; `sort` is `newest` (default), `rated`, `downloads` or `title`. |
| `GET /api/my-notes` | My notes, every status (login required). |
| `GET /api/notes/:id` | One note + comments + my rating/bookmark. Pending notes only for the owner and staff. |
| `GET /api/notes/:id/file?download=0/1` | Preview (PDF/photo, inline) or download the file (login required; downloads are counted). |
| `GET /api/users/:id` | Public contributor profile + their notes. Admins also get the `account` box (email, Student ID, phone, approval state). |
| `GET /api/notices` | Notices, pinned first. |

### Notes (login required)

| Method & path | What it does |
|---|---|
| `POST /api/notes` | Upload. JSON: `title, desc, courseId` **or** `courseCode + courseTitle + dept + sem`, `fileName, fileData` (base64) — or multipart `file`. Admin uploads are approved at once; everyone else waits for approval. |
| `PUT /api/notes/:id` | Edit title, description, course (owner, admin or moderator). |
| `DELETE /api/notes/:id` | Delete (owner, admin or moderator). |
| `POST /api/notes/:id/rate` | Body: `value` 1–5 (not your own note). Returns `{ avg, count }`. |
| `POST /api/notes/:id/comments` | Body: `text` (max 1000). |
| `DELETE /api/comments/:id` | Delete a comment (its author, admin or moderator). |
| `POST /api/notes/:id/bookmark` | Bookmark on/off toggle. Returns `{ bookmarked }`. |
| `GET /api/bookmarks` | My bookmarked notes. |

### Admin

| Method & path | Who | What it does |
|---|---|---|
| `GET /api/admin/stats` | staff | `{ users, notes, pending, downloads, pendingAccounts }` |
| `GET /api/admin/notes` | staff | All notes, newest first. |
| `POST /api/admin/notes/:id/status` | staff | Body: `status` = `approved` / `rejected` / `pending`. |
| `GET /api/admin/users?approved=0` | admin | User list (`approved=0` = waiting for approval). |
| `POST /api/admin/users` | admin | Add a moderator/admin directly. Body: `name, email, dept, password (min 8), role`. Active at once. |
| `PUT /api/admin/users/:id/role` | admin | Body: `role` = `student` / `moderator` / `admin` (never your own). |
| `PUT /api/admin/users/:id/suspend` | admin | Body: `suspended: true/false` (never yourself; suspending logs them out). |
| `POST /api/admin/users/:id/approve` | admin | Approve a waiting account. |
| `POST /api/admin/users/:id/reject` | admin | Reject a sign-up (the account is deleted). |
| `DELETE /api/admin/users/:id` | admin | Delete a user (never yourself). |
| `POST /api/admin/courses` | admin | Add a course. Body: `dept, sem, code, title` (code is stored capital-letters + digits only). |
| `DELETE /api/admin/courses/:id` | admin | Delete a course (only when it has no notes). |
| `POST /api/admin/notices` | staff | Body: `title, body, pinned`. |
| `PUT /api/admin/notices/:id` | staff | Edit a notice (incl. pin/unpin). |
| `DELETE /api/admin/notices/:id` | staff | Delete a notice. |

## The course catalogue

294 courses, exactly as published by City University (cityuniversity.ac.bd),
plus 7 legacy courses kept because the sample notes attach to them:

| Department | Courses |
|---|---|
| Textile | 77 |
| BBA | 82 official + 1 legacy (BBA 1101) |
| Agriculture | 81 |
| Law | 47 |
| CSE | 4 (legacy) |
| EEE | 1 (legacy) |
| English | 1 (legacy) |

No official semester-wise list exists yet for CSE, EEE, Civil, Pharmacy,
Mechanical or English — those departments keep only the legacy courses that
have notes attached. **Do not invent courses.** The list lives in
`lib/courses.js` (generated from the original portal's seed data); if the
university publishes a new list, update that file and re-seed.

Semester is `Semester 1` … `Semester 12` for **every** department (a project
rule — even where the official programme is shorter). Course code and subject
title are two separate hand-typed fields: typing a listed code with its
correct title reuses that course, a listed code with a different title is
rejected, and an unlisted code + title is added to the catalogue.

## Folder guide

| Path | What it is |
|---|---|
| `server.js` | Starts the server, session + CORS setup, mounts the routes |
| `config.js` | Settings (port, session, demo accounts, CORS) — reads `.env` |
| `db.js` | The MySQL connection pool |
| `schema.sql` | All tables: users, courses, notes, ratings, comments, bookmarks, notices, resets, sessions |
| `seed.js` | Creates the database, runs the schema, seeds the catalogue + demo data |
| `lib/auth.js` | bcrypt password hashing, login guards, session loading |
| `lib/sessionStore.js` | express-session store backed by MySQL |
| `lib/helpers.js` | Shared helpers (errors, text cleaning, course-code normalising, file checks) |
| `lib/notes.js` | Course lookup (`resolveCourse`), note shapes, visibility rules |
| `lib/courses.js` | The 294-course catalogue (do not edit by hand) |
| `lib/pdf.js` | Makes the one-page sample PDFs (seed only) |
| `routes/auth.js` | Register, login, logout, password reset, profile |
| `routes/browse.js` | Courses, note search/browse/detail/file, public profiles, notices |
| `routes/notes.js` | Upload, edit, delete, rating, comments, bookmarks |
| `routes/admin.js` | Stats, approvals, users/roles/suspend, courses, notices |
| `uploads/` | Uploaded files (random names; only the server opens them) |
| `.env.example` | Template for your `.env` file |

## Security built in

- Passwords are salted and hashed with **bcrypt** (12 rounds). They are never
  stored or logged as plain text, and never sent to the browser.
- Login uses a random session id in an **HttpOnly** cookie; the session data
  lives in MySQL. Too many login attempts from one address are blocked
  (20 per 15 minutes).
- Uploads are checked for file type, size and real file content (a renamed
  `.exe` is refused), and saved with random names.
- Students cannot see each other's pending notes. Only logged in users can
  preview or download files. New accounts cannot log in until approved.
- Every database query uses placeholders — no string-built SQL.
- Other websites cannot call the API from a browser unless their origin is in
  `CORS_ORIGIN`.

## Before putting it on the internet

- Change the admin password and set a long random `SESSION_SECRET` in `.env`.
- Set `SHOW_RESET_CODE=false` and connect an email service for reset codes.
- Use HTTPS (for example behind Nginx) and set `SECURE_COOKIE=true` in `.env`.
- Use a dedicated MySQL user with access only to this database (as in step 2).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Could not connect to MySQL` / `ECONNREFUSED` | MySQL is not running. Start it (XAMPP Control Panel → MySQL → Start, or `brew services start mysql`, or `sudo service mariadb start`). |
| `Access denied for user 'notes_user'` | Wrong password or the user does not exist — repeat step 2, and check `DB_USER` / `DB_PASSWORD` in `.env`. |
| `Connected to MySQL, but the tables are missing` | Run `npm run seed` first. |
| `npm install` fails on `bcrypt` (Windows) | Install the Node.js build tools once (`npm install --global windows-build-tools` in an admin terminal), or replace `bcrypt` with `bcryptjs` in `package.json` (same API, pure JavaScript, slower). |
| `Port 3000 is already in use` | Another server is running on port 3000 — stop it, or set `PORT=3001` in `.env`. |
| `Too many attempts` (429) | Wait 15 minutes, or restart the server (the counter is in memory). |

## Known limitations (same as the original portal)

- Editing an approved note does **not** send it back to pending.
- There is no email service: password reset codes appear in the server window
  (and in the API answer while `SHOW_RESET_CODE=true`).
