import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Code2,
  CreditCard,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  MonitorSmartphone,
  School,
  Users,
  UserCog,
  Wrench,
  CalendarHeart,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/auth";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/** Role-aware navigation — the source of truth for the sidebar and command palette. */
export const NAV: Record<Role, NavSection[]> = {
  administrator: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { title: "Reports", href: "/admin/reports", icon: BarChart3 },
      ],
    },
    {
      title: "People",
      items: [
        { title: "Learners", href: "/admin/learners", icon: Users },
        { title: "Instructors", href: "/admin/instructors", icon: UserCog },
        { title: "Staff", href: "/admin/hr", icon: Briefcase },
      ],
    },
    {
      title: "Learning",
      items: [
        { title: "Programmes", href: "/admin/programmes", icon: GraduationCap },
        { title: "Courses", href: "/admin/courses", icon: BookOpen },
        { title: "Content Library", href: "/admin/content", icon: FolderOpen },
        { title: "Classes", href: "/admin/classes", icon: CalendarDays },
        { title: "Attendance", href: "/admin/attendance", icon: ClipboardList },
        { title: "Assessments", href: "/admin/assessments", icon: Code2 },
        { title: "Certificates", href: "/admin/certificates", icon: Award },
      ],
    },
    {
      title: "Business",
      items: [
        { title: "Corporate Training", href: "/admin/corporate", icon: Building2 },
        { title: "Schools", href: "/admin/schools", icon: School },
        { title: "Partnerships", href: "/admin/partnerships", icon: Handshake },
        { title: "Tech Services", href: "/admin/tech-services", icon: Wrench },
        { title: "Finance", href: "/admin/finance", icon: CreditCard },
        { title: "Events", href: "/admin/events", icon: CalendarHeart },
        { title: "CRM", href: "/admin/crm", icon: MessageSquare },
      ],
    },
  ],
  instructor: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", href: "/instructor", icon: LayoutDashboard },
        { title: "My Classes", href: "/instructor/classes", icon: CalendarDays },
        { title: "Attendance", href: "/instructor/attendance", icon: ClipboardList },
      ],
    },
    {
      title: "Teaching",
      items: [
        { title: "Assignments", href: "/instructor/assignments", icon: FileText },
        { title: "Grades", href: "/instructor/grades", icon: Award },
        { title: "Learner Analytics", href: "/instructor/analytics", icon: BarChart3 },
        { title: "Materials", href: "/instructor/materials", icon: FolderOpen },
        { title: "Announcements", href: "/instructor/announcements", icon: MessageSquare },
      ],
    },
  ],
  learner: [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", href: "/learner", icon: LayoutDashboard },
        { title: "Programmes & courses", href: "/learner/courses", icon: BookOpen },
        { title: "Assignments", href: "/learner/assignments", icon: FileText },
        { title: "Certificates", href: "/learner/certificates", icon: Award },
        { title: "Attendance", href: "/learner/attendance", icon: ClipboardList },
        { title: "Calendar", href: "/learner/calendar", icon: CalendarDays },
        { title: "Messages", href: "/learner/messages", icon: MessageSquare },
        { title: "Coding Workspace", href: "/learner/playground", icon: Code2 },
      ],
    },
    {
      title: "My Space",
      items: [
        { title: "Portfolio", href: "/learner/portfolio", icon: MonitorSmartphone },
        { title: "Achievements", href: "/learner/achievements", icon: Award },
        { title: "Progress", href: "/learner/progress", icon: BarChart3 },
        { title: "Bookmarks", href: "/learner/bookmarks", icon: BookOpen },
        { title: "Downloads", href: "/learner/downloads", icon: FolderOpen },
      ],
    },
  ],
};

/** Flattened nav — used by the command palette. */
export function flattenNav(role: Role): NavItem[] {
  return NAV[role].flatMap((section) => section.items);
}
