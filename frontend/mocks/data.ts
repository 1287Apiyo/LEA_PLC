/**
 * Mock data store — deterministic demo data for every module resource.
 * Mirrors the Laravel list contracts: { data, meta } with search/sort/pagination.
 */

export type ResourceKey =
  | "learners"
  | "instructors"
  | "staff"
  | "programmes"
  | "courses"
  | "content"
  | "classes"
  | "attendance"
  | "assessments"
  | "certificates"
  | "companies"
  | "schools"
  | "partners"
  | "projects"
  | "payments"
  | "invoices"
  | "expenses"
  | "events"
  | "leads"
  | "assignments"
  | "submissions"
  | "announcements"
  | "materials"
  | "messages"
  | "achievements"
  | "bookmarks"
  | "downloads"
  | "progress";

export type Row = Record<string, unknown>;

const FIRST = [
  "Amina", "Brian", "Faith", "Grace", "John", "Kevin", "Linet", "Mwangi",
  "Naomi", "Peter", "Wanjiru", "Samuel", "Tabitha", "Victor", "Zawadi", "Dennis",
];
const LAST = [
  "Kamau", "Otieno", "Mwangi", "Kipchoge", "Hassan", "Njoroge", "Wambui",
  "Ochieng", "Mutua", "Chebet", "Kariuki", "Odhiambo", "Nyambura", "Wekesa",
];
const PROGRAMMES = [
  "Digital Literacy", "Coding Programme", "Corporate Training",
  "Teacher Training", "Tutoring", "Tech Services",
];
const COURSES = [
  "Digital Literacy — Level 1", "Digital Literacy — Level 2", "Python Basics",
  "Web Development — HTML/CSS", "JavaScript Essentials", "Spreadsheets & Data",
  "Corporate Onboarding", "ICT for Teachers",
];
const VENUES = [
  "Lab 1 · Westlands", "Lab 2 · Kilimani", "Lab 3 · CBD",
  "Online", "Boardroom B", "Maker Space · Ngong Rd",
];
const COMPANIES = ["KCB Group", "Safaricom PLC", "Equity Bank", "Nairobi County"];
const SCHOOLS = ["St. Mary's Primary", "Kilimani Junior", "Moi Avenue High", "Langata Academy"];

const DAY = 86400000;
const NOW = Date.now();
const daysAgo = (n: number) => new Date(NOW - n * DAY).toISOString();
const inDays = (n: number) => new Date(NOW + n * DAY).toISOString();

const pick = <T,>(list: T[], index: number, salt = 0): T =>
  list[(index * 7 + salt * 13) % list.length];

const name = (i: number) => `${pick(FIRST, i)} ${pick(LAST, i, 1)}`;

const rows = (count: number, build: (i: number) => Row): Row[] =>
  Array.from({ length: count }, (_, i) => build(i));

/** All module resources with deterministic demo rows. */
export const DB: Record<ResourceKey, Row[]> = {
  learners: rows(10, (i) => ({
    id: `LRN-10${i + 1}`,
    name: name(i),
    email: `${pick(FIRST, i).toLowerCase()}.${pick(LAST, i, 1).toLowerCase()}@example.com`,
    phone: `+2547${String(10000000 + i * 123457).slice(0, 8)}`,
    programme: pick(PROGRAMMES, i),
    course: pick(COURSES, i, 1),
    status: ["active", "active", "active", "pending", "active", "suspended"][i % 6],
    attendance_rate: 82 + (i * 3) % 17,
    enrolled_at: daysAgo(3 + i * 9),
    guardian: `${pick(LAST, i, 2)} (parent)`,
    institution: pick(SCHOOLS, i, 3),
  })),

  instructors: rows(6, (i) => ({
    id: `TRN-20${i + 1}`,
    name: name(i + 3),
    email: `trainer${i + 1}@lealabs.test`,
    phone: `+2547${String(30000000 + i * 987123).slice(0, 8)}`,
    specialisation: pick(["Digital Literacy", "Coding", "Web Development", "ICT Support", "Data", "Teacher Training"], i),
    assigned_classes: 2 + (i % 4),
    learners: 40 + i * 11,
    availability: pick(["Mon–Fri", "Mon–Wed", "Tue–Thu", "Weekends"], i),
    rating: 4.2 + (i % 4) * 0.2,
    status: ["active", "active", "active", "on-leave", "active"][i % 5],
  })),

  staff: rows(6, (i) => ({
    id: `STF-30${i + 1}`,
    name: name(i + 7),
    role: pick(["Administrator", "Accountant", "Operations", "IT Support", "Coordinator", "Receptionist"], i),
    department: pick(["Leadership", "Finance", "Operations", "Technology", "Academics", "Front Office"], i),
    contract_type: ["Full-time", "Full-time", "Part-time", "Contract", "Volunteer"][i % 5],
    salary: 45000 + i * 18000,
    joined_at: daysAgo(60 + i * 40),
    leave_balance: 12 - i,
    status: ["active", "active", "active", "probation", "active"][i % 5],
  })),

  programmes: rows(6, (i) => ({
    id: `PRG-40${i + 1}`,
    name: PROGRAMMES[i],
    duration: `${[6, 12, 3, 4, 6, 2][i]} weeks`,
    modules: 4 + (i % 4),
    learners: 71 + i * 57,
    price: [4500, 12500, 24000, 8000, 6000, 3000][i],
    currency: "KES",
    outcomes: pick(["Certification", "Job placement", "School integration", "Teacher CPD", "Foundational skills", "Lab deployment"], i),
    status: ["active", "active", "active", "active", "draft", "active"][i % 6],
  })),

  courses: rows(8, (i) => ({
    id: `CRS-5${i + 1}`,
    title: COURSES[i],
    programme: pick(PROGRAMMES, i),
    trainer: name(i + 2),
    modules: 3 + (i % 5),
    lessons: 12 + i * 4,
    learners: 18 + i * 6,
    duration: `${4 + i} weeks`,
    price: [4500, 6000, 12500, 12500, 15000, 6000, 24000, 8000][i],
    currency: "KES",
    status: ["published", "published", "published", "draft", "published", "published", "archived", "published"][i % 8],
    updated_at: daysAgo(i * 3),
  })),

  content: rows(8, (i) => ({
    id: `AST-6${i + 1}`,
    title: pick(["Intro to Spreadsheets", "HTML Basics", "Python Loops", "Networking 101", "Typing Drills", "Budgeting", "Slide Design", "Data Entry"], i),
    folder: pick(["Digital Literacy", "Coding", "Corporate", "ICT Support", "Assessments", "Templates"], i),
    type: ["video", "pdf", "slides", "worksheet", "quiz", "project"][i % 6],
    size: `${(i + 1) * 4} MB`,
    version: `v${i + 2}`,
    uploaded_by: name(i + 1),
    uploaded_at: daysAgo(i * 4),
    category: pick(["Lesson", "Assessment", "Reference", "Project brief"], i),
    tags: pick(["beginner", "core", "advanced", "exam", "bonus"], i),
  })),

  classes: rows(8, (i) => ({
    id: `CLS-7${i + 1}`,
    course: pick(COURSES, i),
    trainer: name(i + 4),
    date: daysAgo(i - 1),
    start_time: `${8 + (i % 6)}:00`,
    end_time: `${10 + (i % 6)}:00`,
    venue: pick(VENUES, i),
    mode: ["onsite", "onsite", "online", "onsite", "online"][i % 5],
    capacity: 20 + (i % 3) * 5,
    enrolled: 14 + i * 2,
    status: ["scheduled", "ongoing", "completed", "scheduled", "completed", "cancelled"][i % 6],
  })),

  attendance: rows(9, (i) => ({
    id: `ATT-8${i + 1}`,
    learner: name(i),
    course: pick(COURSES, i, 1),
    class_id: `CLS-7${(i % 6) + 1}`,
    date: daysAgo(i % 7),
    time_in: `${8 + (i % 3)}:4${i % 10}`,
    method: ["qr", "manual", "qr", "qr", "manual"][i % 5],
    status: ["present", "present", "present", "late", "absent", "present"][i % 6],
    marked_by: name(i + 5),
  })),

  assessments: rows(6, (i) => ({
    id: `ASM-9${i + 1}`,
    title: pick(["Weekly MCQ", "Coding challenge: loops", "Portfolio project", "Essay: internet safety", "Group presentation", "Practical exam"], i),
    course: pick(COURSES, i, 2),
    type: ["mcq", "coding", "project", "essay", "presentation", "practical"][i % 6],
    due_at: inDays(2 + i * 3),
    submissions: 12 + i * 4,
    grading: ["auto", "manual", "manual", "auto", "rubric", "rubric"][i % 6],
    max_score: [20, 100, 50, 30, 40, 60][i],
    status: ["open", "open", "grading", "closed", "open", "scheduled"][i % 6],
  })),

  certificates: rows(6, (i) => ({
    id: `CERT-1${i + 1}${i}`,
    learner: name(i + 1),
    course: pick(COURSES, i, 3),
    certificate_id: `LEA-2026-${String(i + 1).padStart(4, "0")}`,
    issued_at: daysAgo(5 + i * 14),
    qr_verified: i % 3 === 0,
    delivered: ["email", "email", "download", "email"][i % 4],
    status: ["issued", "issued", "issued", "pending", "issued", "revoked"][i % 6],
  })),

  companies: rows(4, (i) => ({
    id: `CMP-11${i + 1}`,
    name: COMPANIES[i],
    contact: name(i + 6),
    email: `training@${COMPANIES[i].toLowerCase().replace(/[^a-z]/g, "")}.com`,
    employees_trained: 40 + i * 120,
    departments: 3 + i * 2,
    training_hours: 220 + i * 180,
    contract_value: 480000 + i * 240000,
    currency: "KES",
    status: ["active", "active", "negotiating", "active"][i % 4],
    renewal_at: inDays(20 + i * 60),
  })),

  schools: rows(4, (i) => ({
    id: `SCH-12${i + 1}`,
    name: SCHOOLS[i],
    location: pick(["Westlands", "Kilimani", "CBD", "Langata", "Kasarani"], i),
    contact: name(i + 9),
    teachers: 12 + i * 6,
    students: 180 + i * 140,
    labs: 1 + i,
    devices: 20 + i * 12,
    package: pick(["Starter Lab", "Standard Lab", "Advanced Lab", "Basic Lab"], i),
    visits_this_term: 2 + i * 2,
    status: ["active", "active", "pending", "active"][i % 4],
  })),

  partners: rows(5, (i) => ({
    id: `PTN-13${i + 1}`,
    name: pick(["UNICEF Kenya", "British Council", "Safaricom Foundation", "Mastercard Foundation", "County Gov — Nairobi"], i),
    type: ["NGO", "International", "Corporate", "Foundation", "Government"][i % 5],
    contact: name(i + 8),
    email: `partner${i + 1}@example.org`,
    mou_status: ["active", "active", "draft", "active", "expired"][i % 5],
    mou_signed_at: daysAgo(30 + i * 45),
    renewal_at: inDays(40 + i * 90),
    funding: [0, 1500000, 0, 2400000, 0][i],
    currency: "KES",
  })),

  projects: rows(5, (i) => ({
    id: `PRJ-14${i + 1}`,
    name: pick(["LEA school website", "Lab setup — St. Mary's", "ICT support retainer", "HR payroll system", "Networking upgrade"], i),
    client: pick([...COMPANIES, "St. Mary's Primary"], i),
    type: ["website", "software", "networking", "software", "maintenance"][i % 5],
    status: ["in-progress", "completed", "active", "in-progress", "quoted"][i % 5],
    budget: 85000 + i * 130000,
    currency: "KES",
    start_at: daysAgo(10 + i * 20),
    due_at: inDays(15 + i * 30),
    tickets_open: 1 + (i % 3),
    lead: name(i + 10),
  })),

  payments: rows(9, (i) => ({
    id: `PAY-88${i + 2}${i}`,
    learner: i < 7 ? name(i + 1) : COMPANIES[i % 4],
    invoice: `INV-20${i + 1}${i}`,
    amount: [4500, 12500, 24000, 3000, 6000, 485000, 8000, 15000, 4500][i],
    currency: "KES",
    method: ["M-Pesa", "M-Pesa", "Bank", "Stripe", "M-Pesa", "Bank", "M-Pesa", "Stripe", "M-Pesa"][i % 9],
    reference: `QWK${(900000 + i * 10007).toString()}`,
    status: ["paid", "paid", "paid", "pending", "paid", "paid", "failed", "paid", "pending"][i % 9],
    paid_at: daysAgo(i % 6),
    purpose: ["enrolment", "enrolment", "corporate", "enrolment", "tutoring", "corporate", "enrolment", "bootcamp", "enrolment"][i % 9],
  })),

  invoices: rows(6, (i) => ({
    id: `INV-2${i + 1}${i}${i}`,
    client: pick([...COMPANIES, ...SCHOOLS], i),
    number: `INV-2026-${String(i + 1).padStart(4, "0")}`,
    items: 2 + (i % 3),
    amount: 42000 + i * 98000,
    currency: "KES",
    issued_at: daysAgo(4 + i * 8),
    due_at: inDays(10 + i * 5),
    status: ["paid", "outstanding", "paid", "overdue", "draft", "paid"][i % 6],
  })),

  expenses: rows(5, (i) => ({
    id: `EXP-31${i}`,
    category: pick(["Rent", "Salaries", "Equipment", "Internet", "Transport", "Marketing"], i),
    description: pick(["Office rent — Westlands", "Lab equipment maintenance", "Fibre internet", "Field visit fuel", "Social media ads", "Printer toner"], i),
    amount: 8000 + i * 24000,
    currency: "KES",
    incurred_at: daysAgo(i * 5),
    paid_by: name(i + 3),
    receipt: i % 2 === 0,
    status: ["approved", "approved", "pending", "approved", "rejected"][i % 5],
  })),

  events: rows(5, (i) => ({
    id: `EVT-41${i}`,
    name: pick(["Coding Bootcamp — Term 3", "Graduation Ceremony", "Teacher Training Workshop", "Hackathon 2026", "Digital Literacy Open Day"], i),
    type: ["bootcamp", "graduation", "workshop", "hackathon", "open-day"][i % 5],
    venue: pick(VENUES, i, 2),
    date: inDays(3 + i * 9),
    capacity: 40 + i * 25,
    registrations: 18 + i * 12,
    fee: [2500, 0, 1000, 500, 0][i],
    currency: "KES",
    status: ["upcoming", "upcoming", "upcoming", "planning", "upcoming"][i % 5],
  })),

  leads: rows(6, (i) => ({
    id: `LEAD-51${i}`,
    name: pick(["Joseph M.", "Caroline W.", "Achieng O.", "Ministry of Education", "ActionAid KE", "Equity Foundation"], i),
    source: ["school", "corporate", "government", "ngo", "parent", "referral"][i % 6],
    email: `lead${i + 1}@example.com`,
    phone: `+2547${String(70000000 + i * 654321).slice(0, 8)}`,
    stage: ["new", "contacted", "meeting", "proposal", "won", "lost"][i % 6],
    value: 50000 + i * 90000,
    currency: "KES",
    next_follow_up: inDays(1 + i * 2),
    owner: name(i + 2),
    last_contact: daysAgo(i * 2),
  })),

  assignments: rows(6, (i) => ({
    id: `ASG-6${i + 1}${i}`,
    title: pick(["Spreadsheet modelling", "Capstone: personal budget", "HTML first page", "Python mini-project", "Networking quiz", "Slide deck"], i),
    course: pick(COURSES, i, 1),
    due_at: inDays(1 + i * 4),
    submissions: 16 + i * 3,
    graded: i * 4,
    status: ["open", "open", "grading", "closed", "open", "open"][i % 6],
  })),

  submissions: rows(8, (i) => ({
    id: `SUB-7${i + 1}${i}`,
    learner: name(i),
    assignment: pick(["Spreadsheet modelling", "HTML first page", "Python mini-project", "Capstone"], i),
    submitted_at: daysAgo(i % 5),
    score: [null, 88, null, 72, 95, null, 64, 81][i],
    max_score: 100,
    status: ["submitted", "graded", "submitted", "graded", "graded", "late", "submitted", "graded"][i % 8],
    feedback: i % 2 === 0 ? "Good work — watch your formatting." : null,
  })),

  announcements: rows(4, (i) => ({
    id: `ANN-8${i}`,
    title: pick(["Lab 1 closed Friday", "New curriculum packs", "Guest lecture: AI basics", "Term break schedule"], i),
    body: "Full announcement text with details for learners and instructors.",
    audience: ["all", "instructors", "learners", "corporate"][i % 4],
    posted_by: name(i + 4),
    posted_at: daysAgo(i * 2),
    pinned: i === 0,
  })),

  materials: rows(5, (i) => ({
    id: `MAT-9${i}`,
    title: pick(["Lesson plan — Week 4", "Typing drills pack", "Slide deck: Loops", "Worksheet: Budgeting", "Project brief"], i),
    course: pick(COURSES, i, 2),
    type: ["lesson-plan", "slides", "pdf", "worksheet", "brief"][i % 5],
    size: `${(i + 1) * 2} MB`,
    uploaded_at: daysAgo(i * 3),
    downloads: 12 + i * 7,
  })),

  messages: Array.from({ length: 5 }, (_, i) => ({
    id: `MSG-${i}`,
    from: name(i + 3),
    subject: pick(["Assignment feedback", "Class moved to Lab 2", "Certificate ready", "Bootcamp reminder", "Welcome to Level 2"], i),
    preview: "Short message preview for the conversation list.",
    received_at: daysAgo(i),
    unread: i < 2,
  })),

  achievements: rows(5, (i) => ({
    id: `ACH-0${i}`,
    title: pick(["Perfect attendance", "First project", "Level 1 graduate", "Speed typer", "10 lessons streak"], i),
    description: "Milestone reached in your learning journey.",
    earned_at: daysAgo(3 + i * 12),
    icon: pick(["star", "flame", "trophy", "shield", "rocket"], i),
  })),

  bookmarks: rows(4, (i) => ({
    id: `BMK-${i}`,
    title: pick(["Python loops tutorial", "Spreadsheet formulas cheat sheet", "HTML reference", "Career guide"], i),
    type: ["lesson", "reference", "lesson", "guide"][i % 4],
    added_at: daysAgo(i * 3),
    course: pick(COURSES, i, 1),
  })),

  downloads: rows(4, (i) => ({
    id: `DLD-${i}`,
    title: pick(["Level 1 workbook", "Certificate PDF", "Bootcamp pack", "Offline notes"], i),
    type: ["pdf", "pdf", "zip", "pdf"][i % 4],
    size: `${(i + 1) * 3} MB`,
    downloaded_at: daysAgo(i * 2),
    status: ["ready", "ready", "ready", "expired"][i % 4],
  })),

  progress: rows(6, (i) => ({
    id: `PRG-${i}`,
    course: pick(COURSES, i, 2),
    lessons_done: 3 + i * 4,
    lessons_total: 16,
    progress: 18 + i * 13,
    quiz_avg: 72 + (i * 5) % 26,
    last_activity: daysAgo(i % 5),
    status: ["on-track", "on-track", "at-risk", "on-track", "completed", "on-track"][i % 6],
  })),
};

export const RESOURCE_KEYS = Object.keys(DB) as ResourceKey[];

/** Server-style list: search, sort, paginate → { data, meta }. */
export function listResource(
  key: ResourceKey,
  params: {
    search?: string;
    sort?: string | null;
    order?: "asc" | "desc";
    page?: number;
    per_page?: number;
  }
) {
  const all = DB[key];
  const query = params.search?.trim().toLowerCase() ?? "";

  let filtered = all;
  if (query) {
    filtered = all.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }

  const sortKey = params.sort ?? null;
  const order = params.order === "desc" ? -1 : 1;
  if (sortKey && sortKey in all[0]) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * order;
      return String(av).localeCompare(String(bv)) * order;
    });
  }

  const perPage = Math.max(1, params.per_page ?? 10);
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, params.page ?? 1), lastPage);
  const from = total === 0 ? null : (page - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(page * perPage, total);

  return {
    data: filtered.slice((page - 1) * perPage, page * perPage),
    meta: {
      current_page: page,
      per_page: perPage,
      total,
      last_page: lastPage,
      from,
      to,
    },
  };
}
