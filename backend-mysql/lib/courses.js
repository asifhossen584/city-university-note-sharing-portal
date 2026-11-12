// lib/courses.js - the official 294-course catalogue (copied from the original
// portal lib/seed.js, 2026-11-06). Do NOT invent courses or edit this list by hand:
// the lists for Textile (77), BBA (82), Agriculture (81) and Law (47) come from
// City University's official site (cityuniversity.ac.bd); the first 7 rows are
// legacy courses kept because the sample notes attach to them.
// Each row: { id, code, title, dept, sem } where sem is "Semester 1" .. "Semester 12".
// BBA has 83 rows here = 82 official + 1 legacy (BBA 1101, id 6).
module.exports = [
  {
    "id": 1,
    "code": "CSE 1101",
    "title": "Introduction to Programming",
    "dept": "CSE",
    "sem": "Semester 1"
  },
  {
    "id": 2,
    "code": "CSE 1203",
    "title": "Data Structures",
    "dept": "CSE",
    "sem": "Semester 2"
  },
  {
    "id": 3,
    "code": "CSE 2105",
    "title": "Database Systems",
    "dept": "CSE",
    "sem": "Semester 3"
  },
  {
    "id": 4,
    "code": "CSE 3101",
    "title": "Operating Systems",
    "dept": "CSE",
    "sem": "Semester 5"
  },
  {
    "id": 5,
    "code": "EEE 2203",
    "title": "Electronic Circuit",
    "dept": "EEE",
    "sem": "Semester 3"
  },
  {
    "id": 6,
    "code": "BBA 1101",
    "title": "Principles of Management",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 7,
    "code": "ENG 1101",
    "title": "English Composition",
    "dept": "English",
    "sem": "Semester 1"
  },
  {
    "id": 8,
    "code": "TE 1101",
    "title": "Introduction to Textile Engineering",
    "dept": "Textile",
    "sem": "Semester 1"
  },
  {
    "id": 9,
    "code": "PHY 1103",
    "title": "Physics",
    "dept": "Textile",
    "sem": "Semester 1"
  },
  {
    "id": 10,
    "code": "CHE 1105",
    "title": "Chemistry I",
    "dept": "Textile",
    "sem": "Semester 1"
  },
  {
    "id": 11,
    "code": "ENG 1179",
    "title": "Freshman English",
    "dept": "Textile",
    "sem": "Semester 1"
  },
  {
    "id": 12,
    "code": "CHE 1106",
    "title": "Chemistry I Laboratory",
    "dept": "Textile",
    "sem": "Semester 1"
  },
  {
    "id": 13,
    "code": "PHY 1104",
    "title": "Physics Laboratory",
    "dept": "Textile",
    "sem": "Semester 2"
  },
  {
    "id": 14,
    "code": "MAT 1205",
    "title": "Algebra Trigonometry & 2D Geometry",
    "dept": "Textile",
    "sem": "Semester 2"
  },
  {
    "id": 15,
    "code": "CHE 1207",
    "title": "Chemistry II",
    "dept": "Textile",
    "sem": "Semester 2"
  },
  {
    "id": 16,
    "code": "CHE 1208",
    "title": "Chemistry II Laboratory",
    "dept": "Textile",
    "sem": "Semester 2"
  },
  {
    "id": 17,
    "code": "TE 1103",
    "title": "Textile Raw Materials I",
    "dept": "Textile",
    "sem": "Semester 2"
  },
  {
    "id": 18,
    "code": "TE 1207",
    "title": "Textile Raw Materials II",
    "dept": "Textile",
    "sem": "Semester 3"
  },
  {
    "id": 19,
    "code": "CSE 1211",
    "title": "Computer Fundamentals & Programming",
    "dept": "Textile",
    "sem": "Semester 3"
  },
  {
    "id": 20,
    "code": "CSE 1212",
    "title": "Computer Fundamentals & Programming Laboratory",
    "dept": "Textile",
    "sem": "Semester 3"
  },
  {
    "id": 21,
    "code": "BDS 1203",
    "title": "Bangla & Bangladesh Studies",
    "dept": "Textile",
    "sem": "Semester 3"
  },
  {
    "id": 22,
    "code": "TE 1205",
    "title": "Fundamentals of Polymer Science",
    "dept": "Textile",
    "sem": "Semester 3"
  },
  {
    "id": 23,
    "code": "ME 2101",
    "title": "Engineering Materials",
    "dept": "Textile",
    "sem": "Semester 4"
  },
  {
    "id": 24,
    "code": "ME 2104",
    "title": "Engineering Drawing Laboratory",
    "dept": "Textile",
    "sem": "Semester 4"
  },
  {
    "id": 25,
    "code": "TE 2109",
    "title": "Yarn Manufacturing Engineering I",
    "dept": "Textile",
    "sem": "Semester 4"
  },
  {
    "id": 26,
    "code": "TE 2110",
    "title": "Yarn Manufacturing Engineering I Laboratory",
    "dept": "Textile",
    "sem": "Semester 4"
  },
  {
    "id": 27,
    "code": "MAT 2113",
    "title": "Differential & Integral Calculus",
    "dept": "Textile",
    "sem": "Semester 4"
  },
  {
    "id": 28,
    "code": "TE 2223",
    "title": "Textile Physics",
    "dept": "Textile",
    "sem": "Semester 5"
  },
  {
    "id": 29,
    "code": "STA 2105",
    "title": "Statistics for Engineers",
    "dept": "Textile",
    "sem": "Semester 5"
  },
  {
    "id": 30,
    "code": "ECO 2109",
    "title": "Industrial Economics",
    "dept": "Textile",
    "sem": "Semester 5"
  },
  {
    "id": 31,
    "code": "TEM 2101",
    "title": "Environmental Management",
    "dept": "Textile",
    "sem": "Semester 5"
  },
  {
    "id": 32,
    "code": "EEE 2209",
    "title": "Fundamental of Electrical Circuits",
    "dept": "Textile",
    "sem": "Semester 5"
  },
  {
    "id": 33,
    "code": "EEE 2210",
    "title": "Fundamentals of Electronic Circuits Laboratory",
    "dept": "Textile",
    "sem": "Semester 5"
  },
  {
    "id": 34,
    "code": "ME 2203",
    "title": "Fundamental of Mechanical Engineering",
    "dept": "Textile",
    "sem": "Semester 6"
  },
  {
    "id": 35,
    "code": "ME 2206",
    "title": "Machine Shop and Practice Laboratory",
    "dept": "Textile",
    "sem": "Semester 6"
  },
  {
    "id": 36,
    "code": "TE 2211",
    "title": "Textile Testing & Quality Control I",
    "dept": "Textile",
    "sem": "Semester 6"
  },
  {
    "id": 37,
    "code": "TE 2212",
    "title": "Textile Testing & Quality Control I Laboratory",
    "dept": "Textile",
    "sem": "Semester 6"
  },
  {
    "id": 38,
    "code": "TE 2213",
    "title": "Fabric Manufacturing Engineering I",
    "dept": "Textile",
    "sem": "Semester 6"
  },
  {
    "id": 39,
    "code": "TE 2214",
    "title": "Fabric Manufacturing Engineering I Laboratory",
    "dept": "Textile",
    "sem": "Semester 6"
  },
  {
    "id": 40,
    "code": "TE 3115",
    "title": "Wet Processing Engineering I",
    "dept": "Textile",
    "sem": "Semester 7"
  },
  {
    "id": 41,
    "code": "TE 3116",
    "title": "Wet Processing Engineering I Laboratory",
    "dept": "Textile",
    "sem": "Semester 7"
  },
  {
    "id": 42,
    "code": "TE 3117",
    "title": "Apparel Manufacturing Engineering I",
    "dept": "Textile",
    "sem": "Semester 7"
  },
  {
    "id": 43,
    "code": "TE 3118",
    "title": "Apparel Manufacturing Engineering I Laboratory",
    "dept": "Textile",
    "sem": "Semester 7"
  },
  {
    "id": 44,
    "code": "TE 3119",
    "title": "Yarn Manufacturing Engineering II",
    "dept": "Textile",
    "sem": "Semester 7"
  },
  {
    "id": 45,
    "code": "TE 3120",
    "title": "Yarn Manufacturing Engineering II Laboratory",
    "dept": "Textile",
    "sem": "Semester 7"
  },
  {
    "id": 46,
    "code": "TTM 3103",
    "title": "Textile Trade & Marketing",
    "dept": "Textile",
    "sem": "Semester 8"
  },
  {
    "id": 47,
    "code": "TE 3121",
    "title": "Fabric Manufacturing Engineering II",
    "dept": "Textile",
    "sem": "Semester 8"
  },
  {
    "id": 48,
    "code": "TE 3122",
    "title": "Fabric Manufacturing Engineering II Laboratory",
    "dept": "Textile",
    "sem": "Semester 8"
  },
  {
    "id": 49,
    "code": "ME 3203",
    "title": "Textile Machines and Maintenance",
    "dept": "Textile",
    "sem": "Semester 8"
  },
  {
    "id": 50,
    "code": "TE 3225",
    "title": "Sustainable Textile Production",
    "dept": "Textile",
    "sem": "Semester 8"
  },
  {
    "id": 51,
    "code": "TE 3233",
    "title": "Technical Textiles",
    "dept": "Textile",
    "sem": "Semester 8"
  },
  {
    "id": 52,
    "code": "TE 3227",
    "title": "Fabric Structure & Analysis",
    "dept": "Textile",
    "sem": "Semester 9"
  },
  {
    "id": 53,
    "code": "TE 3228",
    "title": "Fabric Structure & Analysis Laboratory",
    "dept": "Textile",
    "sem": "Semester 9"
  },
  {
    "id": 54,
    "code": "TE 3229",
    "title": "Wet Processing Engineering II",
    "dept": "Textile",
    "sem": "Semester 9"
  },
  {
    "id": 55,
    "code": "TE 3230",
    "title": "Wet Processing Engineering II Laboratory",
    "dept": "Textile",
    "sem": "Semester 9"
  },
  {
    "id": 56,
    "code": "TE 3231",
    "title": "Apparel Manufacturing Engineering II",
    "dept": "Textile",
    "sem": "Semester 9"
  },
  {
    "id": 57,
    "code": "TE 3232",
    "title": "Apparel Manufacturing Engineering II Laboratory",
    "dept": "Textile",
    "sem": "Semester 9"
  },
  {
    "id": 58,
    "code": "TE 4141",
    "title": "Yarn Manufacturing Engineering III (Any One)",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 59,
    "code": "TE 4143",
    "title": "Fabric Manufacturing Engineering III",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 60,
    "code": "TE 4145",
    "title": "Wet Processing Engineering III",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 61,
    "code": "TE 4147",
    "title": "Apparel Manufacturing Engineering III",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 62,
    "code": "TE 4142",
    "title": "Yarn Manufacturing Engineering III Laboratory (Any One)",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 63,
    "code": "TE 4144",
    "title": "Fabric Manufacturing Engineering III Laboratory",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 64,
    "code": "TE 4146",
    "title": "Wet Processing Engineering III Laboratory",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 65,
    "code": "TE 4148",
    "title": "Apparel Manufacturing Engineering III Laboratory",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 66,
    "code": "EPE 4111",
    "title": "Engineering Professional Ethics",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 67,
    "code": "TQM 4105",
    "title": "Textile Quality Management",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 68,
    "code": "TE 4135",
    "title": "Textile Testing & Quality Control II",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 69,
    "code": "TE 4136",
    "title": "Textile Testing & Quality Control II Laboratory",
    "dept": "Textile",
    "sem": "Semester 10"
  },
  {
    "id": 70,
    "code": "TE 4137",
    "title": "Fashion Design and Textile Merchandising",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 71,
    "code": "TE 4139",
    "title": "Research Methodology",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 72,
    "code": "TE 4258 (A)",
    "title": "Thesis/Project",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 73,
    "code": "CSE 4101",
    "title": "Application of Computer in Textile Engineering",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 74,
    "code": "TE 4249",
    "title": "Yarn Manufacturing Engineering IV (Any One)",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 75,
    "code": "TE 4251",
    "title": "Fabric Manufacturing Engineering IV",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 76,
    "code": "TE 4253",
    "title": "Wet Processing Engineering IV",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 77,
    "code": "TE 4255",
    "title": "Apparel Manufacturing Engineering IV",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 78,
    "code": "TE 4250",
    "title": "Yarn Manufacturing Engineering IV Laboratory (Any One)",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 79,
    "code": "TE 4252",
    "title": "Fabric Manufacturing Engineering IV Laboratory",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 80,
    "code": "TE 4254",
    "title": "Wet Processing Engineering IV Laboratory",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 81,
    "code": "TE 4256",
    "title": "Apparel Manufacturing Engineering IV Laboratory",
    "dept": "Textile",
    "sem": "Semester 11"
  },
  {
    "id": 82,
    "code": "TE 4258 (B)",
    "title": "Thesis/Project",
    "dept": "Textile",
    "sem": "Semester 12"
  },
  {
    "id": 83,
    "code": "TE 4260",
    "title": "Industrial Training/Internship",
    "dept": "Textile",
    "sem": "Semester 12"
  },
  {
    "id": 84,
    "code": "TE 4262",
    "title": "Comprehensive Viva",
    "dept": "Textile",
    "sem": "Semester 12"
  },
  {
    "id": 85,
    "code": "BBA 04131101",
    "title": "Introduction to Business",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 86,
    "code": "BLC 02321102",
    "title": "Bengali Language and Culture",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 87,
    "code": "BBA 04131103",
    "title": "Principles of Management",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 88,
    "code": "CSE 06111104",
    "title": "Computer Fundamentals",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 89,
    "code": "MAT 05411105",
    "title": "Fundamentals of Mathematics",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 90,
    "code": "ENG 02321107",
    "title": "Business English Fundamentals",
    "dept": "BBA",
    "sem": "Semester 1"
  },
  {
    "id": 91,
    "code": "BBA 03111201",
    "title": "Micro-Economics",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 92,
    "code": "BBA 04111202",
    "title": "Principles of Accounting",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 93,
    "code": "BBA 04111203",
    "title": "Principles of Insurance",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 94,
    "code": "BBA 02321204",
    "title": "Advanced Business English",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 95,
    "code": "STA 05421205",
    "title": "Introduction to Business Statistics",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 96,
    "code": "SOP 02231206",
    "title": "Sociology & Psychology",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 97,
    "code": "BBA 04134202",
    "title": "Viva Voce",
    "dept": "BBA",
    "sem": "Semester 2"
  },
  {
    "id": 98,
    "code": "BBA 03112101",
    "title": "Macro-Economics",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 99,
    "code": "BBA 04112103",
    "title": "Financial Accounting",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 100,
    "code": "BBA 02232102",
    "title": "Corporate Governance and Ethics",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 101,
    "code": "BBA 04142104",
    "title": "Principles of Marketing",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 102,
    "code": "LAW 04132105",
    "title": "Business Law",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 103,
    "code": "BBA 05422106",
    "title": "Statistics for Decision Making",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 104,
    "code": "CSE 06112107",
    "title": "Computer Application in Business",
    "dept": "BBA",
    "sem": "Semester 3"
  },
  {
    "id": 105,
    "code": "BBA 04132201",
    "title": "Business Communication",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 106,
    "code": "BBA 05412202",
    "title": "Business Mathematics",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 107,
    "code": "BBA 04132203",
    "title": "Human Resource Management",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 108,
    "code": "BBA 06122204",
    "title": "Management Information System",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 109,
    "code": "BBA 04122205",
    "title": "Principles of Finance",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 110,
    "code": "BBA 04132206",
    "title": "Organizational Behavior",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 111,
    "code": "BDS 02222207",
    "title": "Bangladesh Studies",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 112,
    "code": "BBA 04134202",
    "title": "Viva Voce",
    "dept": "BBA",
    "sem": "Semester 4"
  },
  {
    "id": 113,
    "code": "BBA 04123101",
    "title": "Financial Management",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 114,
    "code": "BBA 04143102",
    "title": "Marketing Management",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 115,
    "code": "BBA 04113103",
    "title": "Managerial Accounting",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 116,
    "code": "BBA 04133104",
    "title": "International Business",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 117,
    "code": "BBA 04133105",
    "title": "E-Commerce",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 118,
    "code": "HIS 02223106",
    "title": "History of the Emergence of Bangladesh",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 119,
    "code": "BBA 04133107",
    "title": "Entrepreneurship Development",
    "dept": "BBA",
    "sem": "Semester 5"
  },
  {
    "id": 120,
    "code": "BBA 04133201",
    "title": "Supply Chain Management",
    "dept": "BBA",
    "sem": "Semester 6"
  },
  {
    "id": 121,
    "code": "BBA 04133202",
    "title": "Production and Operation Management",
    "dept": "BBA",
    "sem": "Semester 6"
  },
  {
    "id": 122,
    "code": "BBA 04133203",
    "title": "Research Methods in Business",
    "dept": "BBA",
    "sem": "Semester 6"
  },
  {
    "id": 123,
    "code": "BBA 04113204",
    "title": "Auditing & Taxation",
    "dept": "BBA",
    "sem": "Semester 6"
  },
  {
    "id": 124,
    "code": "BBA 04123205",
    "title": "Practices of Banking",
    "dept": "BBA",
    "sem": "Semester 6"
  },
  {
    "id": 125,
    "code": "BBA 04133206",
    "title": "Project and NGO Management",
    "dept": "BBA",
    "sem": "Semester 6"
  },
  {
    "id": 126,
    "code": "BBA 04134101",
    "title": "Strategic Management (Capstone)",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 127,
    "code": "BBA 04134201",
    "title": "Internship",
    "dept": "BBA",
    "sem": "Semester 8"
  },
  {
    "id": 128,
    "code": "AGR 1101",
    "title": "Fundamentals of Agronomy",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 129,
    "code": "AGR 1102",
    "title": "Fundamentals of Agronomy Practical",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 130,
    "code": "AGR 1103",
    "title": "Fundamentals of Agricultural Botany",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 131,
    "code": "AGR 1104",
    "title": "Fundamentals of Agricultural Botany Practical",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 132,
    "code": "ENG 1178",
    "title": "Basic English",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 133,
    "code": "HUM 1105",
    "title": "Bangladesh Studies",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 134,
    "code": "HUM 1107",
    "title": "Bangla Language and Literature",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 135,
    "code": "AGR 1109",
    "title": "Integrated Aquaculture",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 136,
    "code": "AGR 1110",
    "title": "Integrated Aquaculture Practical",
    "dept": "Agriculture",
    "sem": "Semester 1"
  },
  {
    "id": 137,
    "code": "AGR 1201",
    "title": "Introduction to Agro forestry and Environment",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 138,
    "code": "AGR 1202",
    "title": "Introduction to Agro forestry and Environment Practical",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 139,
    "code": "AGR 1203",
    "title": "Introduction to Soil Science",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 140,
    "code": "AGR 1204",
    "title": "Introduction to Soil Science Practical",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 141,
    "code": "HUM 1205",
    "title": "Rural Sociology",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 142,
    "code": "CSE 1207",
    "title": "Introduction to Computer Science",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 143,
    "code": "CSE 1208",
    "title": "Introduction to Computer Science Practical",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 144,
    "code": "BBA 1209",
    "title": "Introduction to Agri-Economics and Agribusiness",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 145,
    "code": "AGR 1211",
    "title": "Animal Science",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 146,
    "code": "AGR 1212",
    "title": "Animal Science Practical",
    "dept": "Agriculture",
    "sem": "Semester 2"
  },
  {
    "id": 147,
    "code": "AGR 2101",
    "title": "Seed Technology and Weed Science",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 148,
    "code": "AGR 2102",
    "title": "Seed Technology and Weed Science Practical",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 149,
    "code": "AGR 2103",
    "title": "Plant Physiology",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 150,
    "code": "AGR 2104",
    "title": "Plant Physiology Practical",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 151,
    "code": "AGR 2105",
    "title": "Principles of Horticulture and Land Scaping",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 152,
    "code": "AGR 2106",
    "title": "Principles of Horticulture and Land Scaping Practical",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 153,
    "code": "AGR 2107",
    "title": "Introduction to Entomology",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 154,
    "code": "AGR 2108",
    "title": "Introduction to Entomology Practical",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 155,
    "code": "ME 2195",
    "title": "Fundamentals of Agricultural Engineering",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 156,
    "code": "ME 2196",
    "title": "Fundamentals of Agricultural Engineering",
    "dept": "Agriculture",
    "sem": "Semester 3"
  },
  {
    "id": 157,
    "code": "AGR 2201",
    "title": "Soil Classification, Survey and Conservation",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 158,
    "code": "AGR 2202",
    "title": "Soil Classification, Survey and Conservation Practical",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 159,
    "code": "AGR 2203",
    "title": "Fundamentals of Plant Pathology",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 160,
    "code": "AGR 2204",
    "title": "Fundamentals of Plant Pathology Practical",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 161,
    "code": "AGR 2205",
    "title": "Cytology",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 162,
    "code": "AGR 2206",
    "title": "Cytology Practical",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 163,
    "code": "AGR 2207",
    "title": "Fundamentals of Agricultural Extension",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 164,
    "code": "AGR 2208",
    "title": "Fundamentals of Agricultural Extension Practical",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 165,
    "code": "CHE 2209",
    "title": "Biochemistry and Molecular Biology",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 166,
    "code": "CHE 2210",
    "title": "Biochemistry and Molecular Biology Practical",
    "dept": "Agriculture",
    "sem": "Semester 4"
  },
  {
    "id": 167,
    "code": "AGR 3101",
    "title": "Soil Fertility and Soil Microbiology",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 168,
    "code": "AGR 3102",
    "title": "Soil Fertility and Soil Microbiology Practical",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 169,
    "code": "AGR 3103",
    "title": "Insect Physiology and Ecology",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 170,
    "code": "AGR 3104",
    "title": "Insect Physiology and Ecology Practical",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 171,
    "code": "AGR 3105",
    "title": "Diseases of Field Crops",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 172,
    "code": "AGR 3106",
    "title": "Diseases of Field Crops Practical",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 173,
    "code": "AGR 3107",
    "title": "Fundamentals of Genetics",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 174,
    "code": "AGR 3108",
    "title": "Fundamentals of Genetics Practical",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 175,
    "code": "CHE 3109",
    "title": "Agricultural Chemistry",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 176,
    "code": "CHE 3110",
    "title": "Agricultural Chemistry Practical",
    "dept": "Agriculture",
    "sem": "Semester 5"
  },
  {
    "id": 177,
    "code": "AGR 3201",
    "title": "Crop Production Technology",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 178,
    "code": "AGR 3202",
    "title": "Crop Production Technology Practical",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 179,
    "code": "AGR 3203",
    "title": "Crop Climatology",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 180,
    "code": "AGR 3204",
    "title": "Crop Climatology Practical",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 181,
    "code": "AGR 3205",
    "title": "Olericulture",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 182,
    "code": "AGR 3206",
    "title": "Olericulture Practical",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 183,
    "code": "AGR 3207",
    "title": "Agricultural Extension Organization Management",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 184,
    "code": "AGR 3208",
    "title": "Agricultural Extension Organization Management Practical",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 185,
    "code": "STA 3209",
    "title": "Agricultural Statistics",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 186,
    "code": "STA 3210",
    "title": "Agricultural Statistics Practical",
    "dept": "Agriculture",
    "sem": "Semester 6"
  },
  {
    "id": 187,
    "code": "AGR 4101",
    "title": "Plant Ecology",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 188,
    "code": "AGR 4112",
    "title": "Plant Ecology Practical",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 189,
    "code": "AGR 4103",
    "title": "Pomology",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 190,
    "code": "AGR 4104",
    "title": "Pomology Practical",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 191,
    "code": "AGR 4105",
    "title": "Soil Physics and Soil Chemistry",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 192,
    "code": "AGR 4106",
    "title": "Soil Physics and Soil Chemistry Practical",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 193,
    "code": "AGR 4107",
    "title": "Insect Pest Management and Economic Entomology",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 194,
    "code": "AGR 4108",
    "title": "Insect Pest Management and Economic Entomology Practical",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 195,
    "code": "AGR 4109",
    "title": "Plant Breeding",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 196,
    "code": "AGR 4110",
    "title": "Plant Breeding Practical",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 197,
    "code": "CSE 4111",
    "title": "Information and Communication Technology",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 198,
    "code": "CSE 4112",
    "title": "Information and Communication Technology Practical",
    "dept": "Agriculture",
    "sem": "Semester 7"
  },
  {
    "id": 199,
    "code": "AGR 4201",
    "title": "Farm Management and Post-harvest Technology",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 200,
    "code": "AGR 4202",
    "title": "Farm Management and Post-harvest Technology Practical",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 201,
    "code": "AGR 4203",
    "title": "Nutrition, Food processing and Food Safety",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 202,
    "code": "AGR 4204",
    "title": "Nutrition, Food processing and Food Safety Practical",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 203,
    "code": "AGR 4205",
    "title": "Diseases of Fruits, Vegetables and Management",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 204,
    "code": "AGR 4206",
    "title": "Diseases of Fruits, Vegetables and Management Practical",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 205,
    "code": "AGR 4207",
    "title": "Introduction to Biotechnology",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 206,
    "code": "AGR 4208",
    "title": "Introduction to Biotechnology Practical",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 207,
    "code": "ME 4295",
    "title": "Agricultural Mechanization",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 208,
    "code": "ME 4296",
    "title": "Agricultural Mechanization Practical",
    "dept": "Agriculture",
    "sem": "Semester 8"
  },
  {
    "id": 209,
    "code": "Law 04211101",
    "title": "Law of Tort and Consumer Protection",
    "dept": "Law",
    "sem": "Semester 1"
  },
  {
    "id": 210,
    "code": "Law 04211102",
    "title": "Law of Contract and Partnership",
    "dept": "Law",
    "sem": "Semester 1"
  },
  {
    "id": 211,
    "code": "HIS 04211103",
    "title": "Constitutional and Legal History of Bangladesh",
    "dept": "Law",
    "sem": "Semester 1"
  },
  {
    "id": 212,
    "code": "BDS 04211104",
    "title": "Introduction to Bangladesh Studies",
    "dept": "Law",
    "sem": "Semester 1"
  },
  {
    "id": 213,
    "code": "CSE 04211105",
    "title": "Introduction to Computer",
    "dept": "Law",
    "sem": "Semester 1"
  },
  {
    "id": 214,
    "code": "ENG 04211166",
    "title": "Basic English Language",
    "dept": "Law",
    "sem": "Semester 1"
  },
  {
    "id": 215,
    "code": "Law 04211201",
    "title": "Jurisprudence",
    "dept": "Law",
    "sem": "Semester 2"
  },
  {
    "id": 216,
    "code": "Law 04211202",
    "title": "Muslim Law-I",
    "dept": "Law",
    "sem": "Semester 2"
  },
  {
    "id": 217,
    "code": "Law 04211203",
    "title": "Hindu Law",
    "dept": "Law",
    "sem": "Semester 2"
  },
  {
    "id": 218,
    "code": "ETH 04211204",
    "title": "Equity and Trust",
    "dept": "Law",
    "sem": "Semester 2"
  },
  {
    "id": 219,
    "code": "CSE 04211205",
    "title": "Computer Applications in Law",
    "dept": "Law",
    "sem": "Semester 2"
  },
  {
    "id": 220,
    "code": "ENG 04211268",
    "title": "Advanced English Language",
    "dept": "Law",
    "sem": "Semester 2"
  },
  {
    "id": 221,
    "code": "Law 04212101",
    "title": "Interpretation of Statutes and General Clauses Act",
    "dept": "Law",
    "sem": "Semester 3"
  },
  {
    "id": 222,
    "code": "Law 04212102",
    "title": "Muslim Law-II",
    "dept": "Law",
    "sem": "Semester 3"
  },
  {
    "id": 223,
    "code": "Law 04212103",
    "title": "Constitutional Law-I",
    "dept": "Law",
    "sem": "Semester 3"
  },
  {
    "id": 224,
    "code": "Law 04212104",
    "title": "Law of Transfer of Property-I",
    "dept": "Law",
    "sem": "Semester 3"
  },
  {
    "id": 225,
    "code": "Law 04212105",
    "title": "Land Laws of Bangladesh-I",
    "dept": "Law",
    "sem": "Semester 3"
  },
  {
    "id": 226,
    "code": "ENG 04212106",
    "title": "English for Law",
    "dept": "Law",
    "sem": "Semester 3"
  },
  {
    "id": 227,
    "code": "SOC 04212201",
    "title": "Public Administration and the Law",
    "dept": "Law",
    "sem": "Semester 4"
  },
  {
    "id": 228,
    "code": "SOC 04212202",
    "title": "Criminology",
    "dept": "Law",
    "sem": "Semester 4"
  },
  {
    "id": 229,
    "code": "Law 04212203",
    "title": "Constitutional Law-II",
    "dept": "Law",
    "sem": "Semester 4"
  },
  {
    "id": 230,
    "code": "Law 04212204",
    "title": "Law of Transfer of Property-II",
    "dept": "Law",
    "sem": "Semester 4"
  },
  {
    "id": 231,
    "code": "Law 04212205",
    "title": "Land Laws of Bangladesh-II",
    "dept": "Law",
    "sem": "Semester 4"
  },
  {
    "id": 232,
    "code": "BUS 04212206",
    "title": "Labor and Industrial Affairs",
    "dept": "Law",
    "sem": "Semester 4"
  },
  {
    "id": 233,
    "code": "Law 04213101",
    "title": "Law of Evidence-I",
    "dept": "Law",
    "sem": "Semester 5"
  },
  {
    "id": 234,
    "code": "Law 04213102",
    "title": "Law of Criminal Procedure-I",
    "dept": "Law",
    "sem": "Semester 5"
  },
  {
    "id": 235,
    "code": "Law 04213103",
    "title": "Law of Crimes-I",
    "dept": "Law",
    "sem": "Semester 5"
  },
  {
    "id": 236,
    "code": "Law 04213104",
    "title": "Business Law-I",
    "dept": "Law",
    "sem": "Semester 5"
  },
  {
    "id": 237,
    "code": "Law 04213105",
    "title": "Public International Law-I",
    "dept": "Law",
    "sem": "Semester 5"
  },
  {
    "id": 238,
    "code": "Law 04213106",
    "title": "Laws of Public Demands Recovery and Registration",
    "dept": "Law",
    "sem": "Semester 5"
  },
  {
    "id": 239,
    "code": "Law 04213201",
    "title": "Law of Evidence-II",
    "dept": "Law",
    "sem": "Semester 6"
  },
  {
    "id": 240,
    "code": "Law 04213202",
    "title": "Law of Criminal Procedure-II",
    "dept": "Law",
    "sem": "Semester 6"
  },
  {
    "id": 241,
    "code": "Law 04213203",
    "title": "Law of Crimes-II",
    "dept": "Law",
    "sem": "Semester 6"
  },
  {
    "id": 242,
    "code": "Law 04213204",
    "title": "Business Law-II",
    "dept": "Law",
    "sem": "Semester 6"
  },
  {
    "id": 243,
    "code": "Law 04213205",
    "title": "Public International Law-II",
    "dept": "Law",
    "sem": "Semester 6"
  },
  {
    "id": 244,
    "code": "SOC 04213206",
    "title": "Alternative Dispute Resolution and Legal Aid",
    "dept": "Law",
    "sem": "Semester 6"
  },
  {
    "id": 245,
    "code": "Law 04214101",
    "title": "Law of Civil Procedure-I",
    "dept": "Law",
    "sem": "Semester 7"
  },
  {
    "id": 246,
    "code": "Law 04214102",
    "title": "Fiscal Law",
    "dept": "Law",
    "sem": "Semester 7"
  },
  {
    "id": 247,
    "code": "Law 04214103",
    "title": "Special Criminal Laws",
    "dept": "Law",
    "sem": "Semester 7"
  },
  {
    "id": 248,
    "code": "Law 04214104",
    "title": "Company and Banking Law",
    "dept": "Law",
    "sem": "Semester 7"
  },
  {
    "id": 249,
    "code": "Law 04214105",
    "title": "Environmental Laws",
    "dept": "Law",
    "sem": "Semester 7"
  },
  {
    "id": 250,
    "code": "Law 04214106",
    "title": "Law of Information and Technology",
    "dept": "Law",
    "sem": "Semester 7"
  },
  {
    "id": 251,
    "code": "Law 04214201",
    "title": "Law of Civil Procedure-II",
    "dept": "Law",
    "sem": "Semester 8"
  },
  {
    "id": 252,
    "code": "Law 04214202",
    "title": "Specific Relief Act and Limitation Act",
    "dept": "Law",
    "sem": "Semester 8"
  },
  {
    "id": 253,
    "code": "Law 04214203",
    "title": "Law of Drafting, Conveyancing and Pleading",
    "dept": "Law",
    "sem": "Semester 8"
  },
  {
    "id": 254,
    "code": "Law 04214204",
    "title": "Clinical Legal Education",
    "dept": "Law",
    "sem": "Semester 8"
  },
  {
    "id": 255,
    "code": "Law 04214205",
    "title": "Research Monograph",
    "dept": "Law",
    "sem": "Semester 8"
  },
  {
    "id": 256,
    "code": "FIN 04124102",
    "title": "Corporate Finance",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 257,
    "code": "FIN 04124103",
    "title": "Investment & Portfolio Management",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 258,
    "code": "FIN 04124104",
    "title": "Financial Markets & Institutions",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 259,
    "code": "FIN 04124105",
    "title": "Bank Management and Financial Services",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 260,
    "code": "FIN 04124106",
    "title": "Insurance and Risk Management",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 261,
    "code": "FIN 04124107",
    "title": "Financial Derivatives",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 262,
    "code": "FIN 04124108",
    "title": "International Finance",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 263,
    "code": "FIN 04124130",
    "title": "Financial Technology",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 264,
    "code": "FIN 04124131",
    "title": "Working Capital Management",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 265,
    "code": "FIN 04124132",
    "title": "Real Estate Financing",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 266,
    "code": "AIS 04114109",
    "title": "Intermediate Accounting",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 267,
    "code": "AIS 04114110",
    "title": "Cost Accounting",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 268,
    "code": "AIS 04114111",
    "title": "Accounting Information System",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 269,
    "code": "AIS 04114112",
    "title": "Accounting for Government and Non-Profit Organizations",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 270,
    "code": "AIS 04114113",
    "title": "Financial Statement Analysis",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 271,
    "code": "AIS 04114114",
    "title": "Advanced Accounting",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 272,
    "code": "AIS 04114133",
    "title": "International Accounting",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 273,
    "code": "AIS 04114134",
    "title": "Accounting Theory",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 274,
    "code": "HRM 04134115",
    "title": "Compensation Management",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 275,
    "code": "HRM 04134116",
    "title": "Training and Development",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 276,
    "code": "HRM 04134117",
    "title": "Organizational Development",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 277,
    "code": "HRM 04134118",
    "title": "Industrial Relations",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 278,
    "code": "HRM 04134119",
    "title": "Manpower Planning & Forecasting",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 279,
    "code": "HRM 04134120",
    "title": "Industrial Psychology",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 280,
    "code": "HRM 04134121",
    "title": "Small and Medium Business Management",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 281,
    "code": "HRM 04114135",
    "title": "Labor and Industrial Economics",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 282,
    "code": "HRM 04114137",
    "title": "Stress and Change Management",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 283,
    "code": "HRM 04114138",
    "title": "Conflict and Negotiation",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 284,
    "code": "MKT 04144122",
    "title": "Consumer Behavior",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 285,
    "code": "MKT 04144123",
    "title": "Selling and Salesmanship",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 286,
    "code": "MKT 04144124",
    "title": "Business Logistics",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 287,
    "code": "MKT 04144125",
    "title": "Brand Management and Promotion",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 288,
    "code": "MKT 04144126",
    "title": "Advertising",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 289,
    "code": "MKT 04144127",
    "title": "International Marketing",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 290,
    "code": "MKT 04144128",
    "title": "Marketing Research",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 291,
    "code": "MKT 04147129",
    "title": "Strategic Marketing",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 292,
    "code": "MKT 04114136",
    "title": "Digital Marketing",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 293,
    "code": "MKT 04114139",
    "title": "Service Marketing",
    "dept": "BBA",
    "sem": "Semester 7"
  },
  {
    "id": 294,
    "code": "MKT 04114140",
    "title": "Social Media & Mobile Marketing",
    "dept": "BBA",
    "sem": "Semester 7"
  }
];
