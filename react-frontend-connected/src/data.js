/* ================= Connected frontend — constants only =================
   This frontend gets ALL its data from the backend API
   (http://localhost:3000/api). There is no seed data in the client source:
   no users, no passwords, no notes, no course list. The 294-course
   catalogue, the notes, the users and the notices all come from the API.
   Departments and semesters are the only fixed lists (City University's
   official 10 departments; Semester 1-12 for every department). */
      const DEPARTMENTS = ["CSE","EEE","BBA","English","Textile","Civil","Pharmacy","Mechanical","Law","Agriculture"];
      const SEMESTERS = Array.from({length:12}, (_,i)=>i+1);
