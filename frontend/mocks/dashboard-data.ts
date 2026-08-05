import type {
  AdminDashboard,
  InstructorDashboard,
  LearnerDashboard,
} from "@/types/dashboard";

/** Demo dashboard data for mock mode — realistic LEA Labs operating figures. */

const NOW = new Date();

function iso(daysAgo: number): string {
  return new Date(NOW.getTime() - daysAgo * 86400000).toISOString();
}

export const ADMIN_DASHBOARD: AdminDashboard = {
  stats: {
    activeLearners: { label: "Active learners", value: 1_284, delta: 8.2, hint: "vs last month" },
    todayClasses: { label: "Classes today", value: 14, hint: "6 venues · 8 online" },
    revenueThisMonth: { label: "Revenue this month", value: "KSh 1,284,500", delta: 12.4, hint: "vs last month" },
    attendanceRate: { label: "Attendance rate", value: "91%", delta: 2.1, hint: "this week" },
    completionRate: { label: "Completion rate", value: "78%", delta: -1.3, hint: "all programmes" },
  },
  revenueTrend: [
    { label: "Sep", value: 640_000 },
    { label: "Oct", value: 720_000 },
    { label: "Nov", value: 685_000 },
    { label: "Dec", value: 810_000 },
    { label: "Jan", value: 940_000 },
    { label: "Feb", value: 1_020_000 },
    { label: "Mar", value: 1_140_000 },
    { label: "Apr", value: 1_085_000 },
    { label: "May", value: 1_220_000 },
    { label: "Jun", value: 1_310_000 },
    { label: "Jul", value: 1_245_000 },
    { label: "Aug", value: 1_284_500 },
  ],
  enrolmentByProgramme: [
    { label: "Digital Literacy", value: 412 },
    { label: "Coding", value: 356 },
    { label: "Corporate Training", value: 289 },
    { label: "Teacher Training", value: 142 },
    { label: "Tutoring", value: 71 },
    { label: "Tech Services", value: 14 },
  ],
  attendanceByWeek: [
    { label: "W1", value: 88 },
    { label: "W2", value: 90 },
    { label: "W3", value: 87 },
    { label: "W4", value: 92 },
    { label: "W5", value: 90 },
    { label: "W6", value: 91 },
    { label: "W7", value: 93 },
    { label: "W8", value: 91 },
  ],
  recentRegistrations: [
    { id: "REG-2411", name: "Wanjiru Kamau", programme: "Digital Literacy", enrolled_at: iso(0), status: "active" },
    { id: "REG-2410", name: "Brian Otieno", programme: "Coding Programme", enrolled_at: iso(0), status: "active" },
    { id: "REG-2409", name: "Faith Mwangi", programme: "Teacher Training", enrolled_at: iso(1), status: "pending" },
    { id: "REG-2408", name: "Samuel Kipchoge", programme: "Corporate Training", enrolled_at: iso(1), status: "active" },
    { id: "REG-2407", name: "Amina Hassan", programme: "Digital Literacy", enrolled_at: iso(2), status: "active" },
  ],
  recentPayments: [
    { id: "PAY-8821", learner: "Wanjiru Kamau", amount: 4500, currency: "KES", method: "M-Pesa", status: "paid", paid_at: iso(0) },
    { id: "PAY-8820", learner: "Brian Otieno", amount: 12500, currency: "KES", method: "M-Pesa", status: "paid", paid_at: iso(0) },
    { id: "PAY-8819", learner: "KCB Group (corporate)", amount: 485000, currency: "KES", method: "Bank", status: "paid", paid_at: iso(1) },
    { id: "PAY-8818", learner: "Faith Mwangi", amount: 3000, currency: "KES", method: "Stripe", status: "pending", paid_at: iso(1) },
    { id: "PAY-8817", learner: "Samuel Kipchoge", amount: 24000, currency: "KES", method: "M-Pesa", status: "paid", paid_at: iso(2) },
  ],
  todaySchedule: [
    { id: "CLS-101", course: "Digital Literacy — Level 1", start_time: "09:00", end_time: "11:00", venue: "Lab 1 · Westlands", trainer: "Grace M.", learners: 24 },
    { id: "CLS-102", course: "Coding Basics (Python)", start_time: "09:30", end_time: "11:30", venue: "Online", trainer: "Peter K.", learners: 31 },
    { id: "CLS-103", course: "Corporate Onboarding — KCB", start_time: "11:00", end_time: "13:00", venue: "Boardroom B", trainer: "Amina H.", learners: 18 },
    { id: "CLS-104", course: "Web Development — HTML/CSS", start_time: "14:00", end_time: "16:00", venue: "Lab 2 · Kilimani", trainer: "Brian O.", learners: 22 },
  ],
};

export const INSTRUCTOR_DASHBOARD: InstructorDashboard = {
  stats: {
    todayClasses: { label: "Classes today", value: 3, hint: "1 online · 2 on-site" },
    attendanceRate: { label: "Attendance rate", value: "94%", delta: 1.8, hint: "last 30 days" },
    pendingGrading: { label: "Pending grading", value: 12, hint: "2 overdue" },
    activeLearners: { label: "Active learners", value: 96, delta: 4.5, hint: "across your classes" },
  },
  classSchedule: [
    { id: "CLS-101", course: "Digital Literacy — Level 1", start_time: "09:00", end_time: "11:00", venue: "Lab 1 · Westlands", trainer: "Grace M.", learners: 24 },
    { id: "CLS-103", course: "Corporate Onboarding — KCB", start_time: "11:00", end_time: "13:00", venue: "Boardroom B", trainer: "Grace M.", learners: 18 },
    { id: "CLS-105", course: "Digital Literacy — Level 2", start_time: "14:30", end_time: "16:30", venue: "Online", trainer: "Grace M.", learners: 27 },
  ],
  attendanceByWeek: [
    { label: "W1", value: 90 },
    { label: "W2", value: 92 },
    { label: "W3", value: 89 },
    { label: "W4", value: 95 },
    { label: "W5", value: 93 },
    { label: "W6", value: 96 },
    { label: "W7", value: 92 },
    { label: "W8", value: 94 },
  ],
  gradeDistribution: [
    { label: "A", value: 28 },
    { label: "B", value: 41 },
    { label: "C", value: 22 },
    { label: "D", value: 7 },
    { label: "E", value: 2 },
  ],
  recentAssignments: [
    { id: "ASG-501", title: "Spreadsheet modelling", course: "Digital Literacy — Level 2", due_at: iso(0), submissions: 24, graded: 21 },
    { id: "ASG-502", title: "Capstone: personal budget", course: "Digital Literacy — Level 1", due_at: iso(2), submissions: 22, graded: 12 },
    { id: "ASG-503", title: "Data entry sprint", course: "Corporate Onboarding", due_at: iso(4), submissions: 18, graded: 18 },
  ],
  announcements: [
    { id: "ANN-01", title: "Lab 1 closed Friday 3pm", body: "Maintenance window — move afternoon sessions to Lab 2.", created_at: iso(1) },
    { id: "ANN-02", title: "New curriculum packs", body: "Updated Level 1 slide decks are now in the content library.", created_at: iso(3) },
  ],
};

export const LEARNER_DASHBOARD: LearnerDashboard = {
  stats: {
    coursesInProgress: { label: "Courses in progress", value: 3 },
    assignmentsDue: { label: "Assignments due", value: 2, hint: "next 7 days" },
    attendanceRate: { label: "Attendance rate", value: "96%", delta: 3.2 },
    certificates: { label: "Certificates earned", value: 2 },
  },
  myCourses: [
    { id: "CRS-11", title: "Digital Literacy — Level 2", programme: "Digital Literacy", progress: 68, next_lesson: "Spreadsheet formulas II", deadline: iso(12) },
    { id: "CRS-12", title: "Python Basics", programme: "Coding Programme", progress: 34, next_lesson: "Loops & lists", deadline: null },
    { id: "CRS-13", title: "Web Development — HTML/CSS", programme: "Coding Programme", progress: 12, next_lesson: "Semantic HTML", deadline: iso(20) },
  ],
  nextClass: {
    id: "CLS-101",
    course: "Digital Literacy — Level 2",
    start_time: "09:00",
    end_time: "11:00",
    venue: "Lab 1 · Westlands",
    trainer: "Grace M.",
    learners: 27,
  },
  assignments: [
    { id: "ASG-501", title: "Spreadsheet modelling", course: "Digital Literacy — Level 2", due_at: iso(0), status: "open", grade: null },
    { id: "ASG-502", title: "Capstone: personal budget", course: "Digital Literacy — Level 1", due_at: iso(2), status: "submitted", grade: null },
    { id: "ASG-499", title: "HTML first page", course: "Web Development", due_at: iso(8), status: "graded", grade: 87 },
  ],
  certificates: [
    { id: "CERT-118", title: "Digital Literacy — Level 1", issued_at: iso(60), verified: true },
    { id: "CERT-096", title: "Computer Basics", issued_at: iso(200), verified: true },
  ],
  achievements: ["Perfect attendance · July", "First project submitted", "Level 1 graduate"],
  progressByWeek: [
    { label: "W1", value: 10 },
    { label: "W2", value: 18 },
    { label: "W3", value: 26 },
    { label: "W4", value: 35 },
    { label: "W5", value: 44 },
    { label: "W6", value: 55 },
    { label: "W7", value: 61 },
    { label: "W8", value: 68 },
  ],
};
