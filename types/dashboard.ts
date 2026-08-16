/** Dashboard domain types — mirror the Laravel /api/v1/dashboard contracts. */

export interface DashboardStat {
  label: string;
  value: string | number;
  /** % change vs previous period (positive = up). */
  delta?: number;
  hint?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface CategoryPoint {
  label: string;
  value: number;
}

// ── Administrator ────────────────────────────────────────

export interface RecentRegistration {
  id: string;
  name: string;
  programme: string;
  enrolled_at: string;
  status: "active" | "pending" | "suspended";
}

export interface RecentPayment {
  id: string;
  learner: string;
  amount: number;
  currency: "KES";
  method: "M-Pesa" | "Stripe" | "Bank";
  status: "paid" | "pending" | "failed";
  paid_at: string;
}

export interface TodayClass {
  id: string;
  course: string;
  start_time: string;
  end_time: string;
  venue: string;
  trainer: string;
  learners: number;
}

export interface AdminDashboard {
  stats: {
    activeLearners: DashboardStat;
    todayClasses: DashboardStat;
    revenueThisMonth: DashboardStat;
    attendanceRate: DashboardStat;
    completionRate: DashboardStat;
  };
  revenueTrend: ChartPoint[];
  enrolmentByProgramme: CategoryPoint[];
  attendanceByWeek: ChartPoint[];
  recentRegistrations: RecentRegistration[];
  recentPayments: RecentPayment[];
  todaySchedule: TodayClass[];
}

// ── Instructor ───────────────────────────────────────────

export interface InstructorAssignment {
  id: string;
  title: string;
  course: string;
  due_at: string;
  submissions: number;
  graded: number;
}

export interface InstructorDashboard {
  stats: {
    todayClasses: DashboardStat;
    attendanceRate: DashboardStat;
    pendingGrading: DashboardStat;
    activeLearners: DashboardStat;
  };
  classSchedule: TodayClass[];
  attendanceByWeek: ChartPoint[];
  gradeDistribution: CategoryPoint[];
  recentAssignments: InstructorAssignment[];
  announcements: { id: string; title: string; body: string; created_at: string }[];
}

// ── Learner ──────────────────────────────────────────────

export interface LearnerCourse {
  id: string;
  title: string;
  programme: string;
  progress: number; // 0-100
  next_lesson: string;
  deadline: string | null;
}

export interface LearnerAssignment {
  id: string;
  title: string;
  course: string;
  due_at: string;
  status: "open" | "submitted" | "graded" | "overdue";
  grade: number | null;
}

export interface LearnerCertificate {
  id: string;
  title: string;
  issued_at: string;
  verified: boolean;
}

export interface LearnerDashboard {
  stats: {
    coursesInProgress: DashboardStat;
    assignmentsDue: DashboardStat;
    attendanceRate: DashboardStat;
    certificates: DashboardStat;
  };
  myCourses: LearnerCourse[];
  nextClass: TodayClass | null;
  assignments: LearnerAssignment[];
  certificates: LearnerCertificate[];
  achievements: string[];
  progressByWeek: ChartPoint[];
}
