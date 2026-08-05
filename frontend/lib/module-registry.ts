import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CalendarHeart,
  ClipboardCheck,
  ClipboardList,
  Code2,
  CreditCard,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  Handshake,
  LineChart,
  Megaphone,
  MessageSquare,
  MonitorSmartphone,
  School,
  Trophy,
  UserCog,
  Users,
  Wrench,
  Bookmark,
  type LucideIcon,
} from "lucide-react";

export interface ModuleDefinition {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
}

function module(
  slug: string,
  title: string,
  description: string,
  icon: LucideIcon,
  emptyTitle: string,
  emptyDescription: string
): ModuleDefinition {
  return {
    slug,
    title,
    description,
    icon,
    searchPlaceholder: `Search ${title.toLowerCase()}…`,
    emptyTitle,
    emptyDescription,
  };
}

/**
 * Module registry — powers the designed scaffold pages behind every
 * navigation item. Each entry is replaced by its real page as that
 * module is built out (static routes take precedence over dynamic).
 */
export const MODULE_REGISTRY: Record<string, ModuleDefinition[]> = {
  administrator: [
    module("reports", "Reports", "Revenue, attendance, completion, performance and impact analytics, exportable to PDF and Excel.", BarChart3, "No reports yet", "Run your first report and it will appear here."),
    module("learners", "Learners", "Manage learner records: profiles, guardians, progress, attendance, certificates and notes.", Users, "No learners yet", "Register a learner to get started."),
    module("instructors", "Instructors", "Trainer profiles, assigned classes, performance and availability.", UserCog, "No instructors yet", "Add an instructor to your team."),
    module("hr", "Staff & HR", "Staff, volunteers, trainers, contracts, payroll, leave and performance.", Briefcase, "No staff records yet", "Add staff members to build your team directory."),
    module("programmes", "Programmes", "Digital Literacy, Corporate Training, Coding, Teacher Training, Tutoring and Technology Services — objectives, modules, pricing, outcomes and duration.", GraduationCap, "No programmes yet", "Create your first programme."),
    module("courses", "Courses", "Course builder: modules, lessons, videos, slides, PDFs, assignments, projects, quizzes and certificates.", BookOpen, "No courses yet", "Create a course with the course builder."),
    module("content", "Content Library", "Folders, search, categories, tags, version history, uploads and previews.", FolderOpen, "No content yet", "Upload your first learning asset."),
    module("classes", "Classes", "Schedules, venues, online links, trainer and learner assignment, capacity.", CalendarDays, "No classes scheduled", "Schedule your first class."),
    module("attendance", "Attendance", "QR-code and manual attendance marking, statistics and reports.", ClipboardCheck, "No attendance records", "Mark attendance for a class to see records here."),
    module("assessments", "Assessments", "MCQs, coding challenges, projects and essays with auto and manual grading, rubrics and feedback.", ClipboardList, "No assessments yet", "Create your first assessment."),
    module("certificates", "Certificates", "Automatic generation, PDF export, QR verification, certificate IDs and email delivery.", Award, "No certificates issued", "Issue a certificate to a graduate."),
    module("corporate", "Corporate Training", "Companies, employees, departments, attendance, training hours, certificates and reports.", Building2, "No corporate clients yet", "Add a company to manage its training."),
    module("schools", "Schools", "Schools, teachers, students, computer labs, packages, devices, visits and reports.", School, "No schools yet", "Add a school partnership."),
    module("partnerships", "Partnerships", "Partners, MoUs, meetings, funding, contacts, status and renewals.", Handshake, "No partners yet", "Log your first partnership."),
    module("tech-services", "Tech Services", "Website and software projects, networking, ICT support, maintenance, lab setup, invoices and tickets.", Wrench, "No service projects yet", "Create a technology services project."),
    module("finance", "Finance", "Payments, invoices, revenue, expenses, scholarships and discounts — M-Pesa, Stripe and bank.", CreditCard, "No transactions yet", "Record your first payment."),
    module("events", "Events", "Workshops, hackathons, graduations and bootcamps — registrations, attendance and certificates.", CalendarHeart, "No events yet", "Plan your first event."),
    module("crm", "CRM", "Leads for schools, corporates, government, parents and NGOs — emails, meetings and follow-ups.", MessageSquare, "No leads yet", "Capture your first lead."),
  ],
  instructor: [
    module("classes", "My Classes", "Your scheduled classes, venues and online links.", CalendarDays, "No classes assigned", "Your scheduled classes will appear here."),
    module("attendance", "Attendance", "Mark and review attendance for your classes.", ClipboardCheck, "No attendance records", "Mark attendance to see records here."),
    module("assignments", "Assignments", "Create and manage assignments for your learners.", FileText, "No assignments yet", "Create your first assignment."),
    module("grades", "Grades", "Grade submissions, apply rubrics and give feedback.", Award, "No grades yet", "Submissions to grade will appear here."),
    module("analytics", "Learner Analytics", "Progress, performance and engagement across your classes.", LineChart, "No analytics yet", "Learner analytics will appear once classes have activity."),
    module("materials", "Teaching Materials", "Lesson plans and materials for your classes.", FolderOpen, "No materials yet", "Upload your teaching materials."),
    module("announcements", "Announcements", "Post announcements to your classes.", Megaphone, "No announcements yet", "Share your first announcement."),
  ],
  learner: [
    module("courses", "My Courses", "Enrolled courses, lessons and progress.", BookOpen, "No courses yet", "Enrol in a course to get started."),
    module("assignments", "Assignments", "Tasks due, submitted and graded.", FileText, "No assignments", "Assignments from your instructors appear here."),
    module("certificates", "Certificates", "Certificates you've earned, with QR verification.", Award, "No certificates yet", "Graduate from a course to earn your first certificate."),
    module("attendance", "Attendance", "Your attendance history across classes.", ClipboardCheck, "No attendance records", "Your attendance will appear after your first class."),
    module("calendar", "Calendar", "Your class schedule and deadlines.", CalendarDays, "No upcoming events", "Your schedule will appear here."),
    module("messages", "Messages", "Conversations with instructors and LEA Labs.", MessageSquare, "No messages yet", "Messages from instructors appear here."),
    module("playground", "Coding Workspace", "Browser editor for HTML, CSS, JavaScript, Python and Java with live preview and auto-save.", Code2, "No saved code yet", "Open the editor and write your first program."),
    module("portfolio", "Portfolio", "Projects, repositories, screenshots, videos, reflections and your public portfolio URL.", MonitorSmartphone, "No portfolio items yet", "Add a project to build your portfolio."),
    module("achievements", "Achievements", "Badges and milestones earned.", Trophy, "No achievements yet", "Complete lessons and attend classes to earn achievements."),
    module("progress", "Progress", "Completion tracking and skill growth.", LineChart, "No progress data yet", "Your progress will appear as you complete lessons."),
    module("bookmarks", "Bookmarks", "Saved lessons and resources.", Bookmark, "No bookmarks yet", "Bookmark lessons to find them here."),
    module("downloads", "Downloads", "Course materials and certificates you've downloaded.", Download, "No downloads yet", "Downloaded files will appear here."),
  ],
};

export function getModule(role: string, slug: string): ModuleDefinition | undefined {
  return MODULE_REGISTRY[role]?.find((entry) => entry.slug === slug);
}
