# Notes Portal — React Frontend (connected to the MySQL backend)

This is the **connected** version of the Notes Portal React frontend. It looks and
works exactly like the static demo, but every bit of data comes from the
Node.js + Express + MySQL backend (`../backend-mysql/`) instead of localStorage:

- Login, register (with admin approval), forgot/reset password, profile and
  change password
- The 294-course catalogue, notes search/filter, note detail with the real
  PDF/photo shown in-page, upload, edit/delete, rate, comment, bookmark
- Public contributor profiles, notices, admin panel (approvals, users, roles,
  suspend, add staff, courses, notices)
- Dark mode toggle (the only thing kept in localStorage — a UI preference)

**There are no demo credentials in this folder.** No passwords, no seed users,
no "Demo accounts" box. The login page is just email + password. The default
logins are listed in the **backend README** (`../backend-mysql/README.md`).

## Run it (on your own PC)

### 1. Start MySQL

Make sure your MySQL/MariaDB server is running and the `notes_portal`
database exists (the backend README explains the one-time setup and seed).

### 2. Start the backend

```bash
cd ../backend-mysql
npm install        # first time only
npm run seed       # first time only (creates the admin + the 294 courses)
npm start          # runs on http://localhost:3000
```

Leave that window running. The backend must be up while you use the site —
without it the frontend shows "Could not reach the server".

### 3. Serve this folder

Open this folder in VS Code and use **Live Server** (right-click `index.html`
→ "Open with Live Server"), or from a terminal inside this folder:

```bash
npx serve .        # or: python -m http.server 8000
```

Then open the address it gives you (for example `http://localhost:5500` or
`http://localhost:8000`). **Do not open `index.html` directly from the file
system** (`file://`) — the browser blocks the API calls that way.

### 4. Log in

Use a login from the backend README, for example the admin
`admin@city.edu` / `Admin@123` (change that password after the first login:
Profile → Change password). New registrations stay inactive until an admin
approves them — that is on purpose.

## If the backend runs somewhere else

The API address is one constant at the top of `src/app.js`:

```js
const API_BASE = (window.NOTES_PORTAL_API_BASE || "http://localhost:3000") + "/api";
```

Change `http://localhost:3000` there (or set `window.NOTES_PORTAL_API_BASE`
before `src/app.js` loads). If you use a different port for the frontend,
add its origin to `corsOrigins` in `../backend-mysql/config.js` (or the
`CORS_ORIGIN` variable in `.env`) and restart the backend — otherwise the
browser blocks the login request.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Page shell: fonts, stylesheet, React + htm vendor scripts, `src/app.js` |
| `src/app.js` | The whole app (all views) — talks to the API only |
| `src/data.js` | Constants only: the 10 departments and Semester 1–12 |
| `src/styles.css` | The design (warm paper, gold accent) + dark mode + responsive rules |
| `vendor/` | React, ReactDOM and htm (no build step, no `npm install` needed here) |
| `public/assets/` | The four photos used on the Home page |

## Notes

- The semester picker offers Semester 1–12 for every department, as requested.
- Course code and subject title are separate hand-typed boxes. Only the
  **course code** auto-uppercases (letters/digits only); the subject title,
  note title and description keep normal lowercase text.
- Uploads up to 10 MB are stored on the server. A PDF or photo is shown
  directly on the note page; Word/PowerPoint notes show a download notice
  because browsers cannot display them inline.
- Viewing a note's file needs a login (the backend requires it); downloading
  also needs a login and is counted by the server.
- The seeded demo Student IDs/phones in the backend are placeholders
  (`027200000001` …) — each user should replace theirs in Profile.
