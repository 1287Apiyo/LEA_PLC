import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ResourceRow } from "@/services/resources";
import type { ResourceKey } from "@/mocks/data";

/**
 * Column registry — defines the table shown on each module page.
 * Keyed by "{role}/{slug}" to match the dynamic module routes.
 */

// ── Cell formatters ───────────────────────────────────────

function statusVariant(value: unknown): "default" | "secondary" | "destructive" | "outline" {
  const v = String(value).toLowerCase();
  if (["active", "paid", "issued", "completed", "present", "on-track", "approved", "published", "ready", "open", "verified", "won"].includes(v)) {
    return "default";
  }
  if (["pending", "submitted", "scheduled", "ongoing", "grading", "probation", "negotiating", "contacted", "meeting", "proposal", "new", "upcoming", "planning", "late", "on-leave", "quoted", "draft", "outstanding"].includes(v)) {
    return "secondary";
  }
  if (["suspended", "failed", "absent", "overdue", "cancelled", "revoked", "rejected", "lost", "expired", "at-risk"].includes(v)) {
    return "destructive";
  }
  return "outline";
}

export function statusCell(value: unknown) {
  const label = String(value ?? "—");
  return (
    <Badge variant={statusVariant(value)} className="capitalize">
      {label.replace(/-/g, " ")}
    </Badge>
  );
}

export const currency = (value: unknown) =>
  Number(value ?? 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  });

export const date = (value: unknown) =>
  value ? new Date(String(value)).toLocaleDateString() : "—";

export function typeCell(value: unknown) {
  return (
    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs capitalize text-muted-foreground">
      {String(value ?? "—").replace(/-/g, " ")}
    </span>
  );
}

function progressCell(value: unknown) {
  const number = Number(value ?? 0);
  return (
    <div className="flex w-28 items-center gap-2">
      <Progress value={number} className="h-1.5" />
      <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
        {number}%
      </span>
    </div>
  );
}

const primary = (value: unknown) => <span className="font-medium">{String(value ?? "—")}</span>;

const secondary = (value: unknown) => (
  <span className="text-muted-foreground">{String(value ?? "—")}</span>
);

interface ColumnOptions {
  cell?: (value: unknown, row: ResourceRow) => React.ReactNode;
  sortable?: boolean;
}

function column(id: string, header: string, options: ColumnOptions = {}): ColumnDef<ResourceRow> {
  return {
    accessorKey: id,
    header,
    enableSorting: options.sortable ?? true,
    cell: ({ getValue, row }) =>
      options.cell ? options.cell(getValue(), row.original) : String(getValue() ?? "—"),
  };
}

// ── Registry ──────────────────────────────────────────────

export interface ModuleTableConfig {
  resource: ResourceKey;
  searchPlaceholder: string;
  columns: ColumnDef<ResourceRow>[];
}

export const TABLE_REGISTRY: Record<string, ModuleTableConfig> = {
  "admin/learners": {
    resource: "learners",
    searchPlaceholder: "Search learners…",
    columns: [
      column("name", "Learner", { cell: primary }),
      column("email", "Email", { cell: secondary }),
      column("programme", "Programme"),
      column("attendance_rate", "Attendance", { cell: (v) => progressCell(v) }),
      column("guardian", "Guardian", { cell: secondary }),
      column("enrolled_at", "Enrolled", { cell: (v) => date(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/instructors": {
    resource: "instructors",
    searchPlaceholder: "Search instructors…",
    columns: [
      column("name", "Trainer", { cell: primary }),
      column("specialisation", "Specialisation"),
      column("assigned_classes", "Classes", { cell: secondary }),
      column("learners", "Learners", { cell: secondary }),
      column("availability", "Availability", { cell: secondary }),
      column("rating", "Rating", { cell: (v) => `★ ${Number(v).toFixed(1)}` }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/hr": {
    resource: "staff",
    searchPlaceholder: "Search staff…",
    columns: [
      column("name", "Name", { cell: primary }),
      column("role", "Role"),
      column("department", "Department"),
      column("contract_type", "Contract", { cell: secondary }),
      column("salary", "Salary", { cell: (v) => currency(v) }),
      column("joined_at", "Joined", { cell: (v) => date(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/programmes": {
    resource: "programmes",
    searchPlaceholder: "Search programmes…",
    columns: [
      column("name", "Programme", { cell: primary }),
      column("duration", "Duration", { cell: secondary }),
      column("modules", "Modules", { cell: secondary }),
      column("learners", "Learners", { cell: secondary }),
      column("price", "Price", { cell: (v) => currency(v) }),
      column("outcomes", "Outcome", { cell: secondary }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/courses": {
    resource: "courses",
    searchPlaceholder: "Search courses…",
    columns: [
      column("title", "Course", { cell: primary }),
      column("programme", "Programme"),
      column("trainer", "Trainer", { cell: secondary }),
      column("lessons", "Lessons", { cell: secondary }),
      column("learners", "Learners", { cell: secondary }),
      column("price", "Price", { cell: (v) => currency(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/content": {
    resource: "content",
    searchPlaceholder: "Search content…",
    columns: [
      column("title", "Asset", { cell: primary }),
      column("folder", "Folder"),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("size", "Size", { cell: secondary }),
      column("version", "Version", { cell: secondary }),
      column("tags", "Tags", { cell: secondary }),
      column("uploaded_at", "Uploaded", { cell: (v) => date(v) }),
    ],
  },
  "admin/classes": {
    resource: "classes",
    searchPlaceholder: "Search classes…",
    columns: [
      column("id", "Class", { cell: primary }),
      column("course", "Course"),
      column("trainer", "Trainer", { cell: secondary }),
      column("date", "Date", { cell: (v) => date(v) }),
      column("start_time", "Time", { cell: (v) => String(v).slice(0, 5) }),
      column("venue", "Venue", { cell: secondary }),
      column("enrolled", "Enrolled", {
        cell: (v, row) => `${v} / ${row.capacity ?? "—"}`,
      }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/attendance": {
    resource: "attendance",
    searchPlaceholder: "Search attendance…",
    columns: [
      column("id", "Record", { cell: primary }),
      column("learner", "Learner"),
      column("course", "Course"),
      column("date", "Date", { cell: (v) => date(v) }),
      column("time_in", "Time in", { cell: secondary }),
      column("method", "Method", { cell: (v) => typeCell(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/assessments": {
    resource: "assessments",
    searchPlaceholder: "Search assessments…",
    columns: [
      column("title", "Assessment", { cell: primary }),
      column("course", "Course"),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("due_at", "Due", { cell: (v) => date(v) }),
      column("submissions", "Submissions", { cell: secondary }),
      column("grading", "Grading", { cell: (v) => typeCell(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/certificates": {
    resource: "certificates",
    searchPlaceholder: "Search certificates…",
    columns: [
      column("certificate_id", "Certificate", { cell: primary }),
      column("learner", "Learner"),
      column("course", "Course"),
      column("issued_at", "Issued", { cell: (v) => date(v) }),
      column("delivered", "Delivery", { cell: (v) => typeCell(v) }),
      column("qr_verified", "QR", { cell: (v) => (v ? "Verified" : "—") }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/corporate": {
    resource: "companies",
    searchPlaceholder: "Search companies…",
    columns: [
      column("name", "Company", { cell: primary }),
      column("contact", "Contact", { cell: secondary }),
      column("employees_trained", "Trained", { cell: secondary }),
      column("training_hours", "Hours", { cell: secondary }),
      column("contract_value", "Contract", { cell: (v) => currency(v) }),
      column("renewal_at", "Renewal", { cell: (v) => date(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/schools": {
    resource: "schools",
    searchPlaceholder: "Search schools…",
    columns: [
      column("name", "School", { cell: primary }),
      column("location", "Location", { cell: secondary }),
      column("students", "Students", { cell: secondary }),
      column("labs", "Labs", { cell: secondary }),
      column("devices", "Devices", { cell: secondary }),
      column("package", "Package"),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/partnerships": {
    resource: "partners",
    searchPlaceholder: "Search partners…",
    columns: [
      column("name", "Partner", { cell: primary }),
      column("type", "Type"),
      column("contact", "Contact", { cell: secondary }),
      column("mou_status", "MoU", { cell: (v) => statusCell(v) }),
      column("funding", "Funding", {
        cell: (v) => (Number(v) > 0 ? currency(v) : "—"),
      }),
      column("renewal_at", "Renewal", { cell: (v) => date(v) }),
    ],
  },
  "admin/tech-services": {
    resource: "projects",
    searchPlaceholder: "Search projects…",
    columns: [
      column("name", "Project", { cell: primary }),
      column("client", "Client"),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("budget", "Budget", { cell: (v) => currency(v) }),
      column("tickets_open", "Open tickets", { cell: secondary }),
      column("due_at", "Due", { cell: (v) => date(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/events": {
    resource: "events",
    searchPlaceholder: "Search events…",
    columns: [
      column("name", "Event", { cell: primary }),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("venue", "Venue", { cell: secondary }),
      column("date", "Date", { cell: (v) => date(v) }),
      column("registrations", "Registrations", {
        cell: (v, row) => `${v} / ${row.capacity ?? "—"}`,
      }),
      column("fee", "Fee", {
        cell: (v) => (Number(v) > 0 ? currency(v) : "Free"),
      }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "admin/crm": {
    resource: "leads",
    searchPlaceholder: "Search leads…",
    columns: [
      column("name", "Lead", { cell: primary }),
      column("source", "Source", { cell: (v) => typeCell(v) }),
      column("email", "Email", { cell: secondary }),
      column("stage", "Stage", { cell: (v) => statusCell(v) }),
      column("value", "Value", { cell: (v) => currency(v) }),
      column("next_follow_up", "Next follow-up", { cell: (v) => date(v) }),
      column("owner", "Owner", { cell: secondary }),
    ],
  },

  // ── Instructor ──────────────────────────────────────────
  "instructor/classes": {
    resource: "classes",
    searchPlaceholder: "Search your classes…",
    columns: [
      column("course", "Course", { cell: primary }),
      column("date", "Date", { cell: (v) => date(v) }),
      column("start_time", "Time", { cell: (v) => String(v).slice(0, 5) }),
      column("venue", "Venue", { cell: secondary }),
      column("mode", "Mode", { cell: (v) => typeCell(v) }),
      column("enrolled", "Enrolled", { cell: secondary }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "instructor/attendance": {
    resource: "attendance",
    searchPlaceholder: "Search attendance…",
    columns: [
      column("learner", "Learner", { cell: primary }),
      column("course", "Course"),
      column("date", "Date", { cell: (v) => date(v) }),
      column("time_in", "Time in", { cell: secondary }),
      column("method", "Method", { cell: (v) => typeCell(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "instructor/assignments": {
    resource: "assignments",
    searchPlaceholder: "Search assignments…",
    columns: [
      column("title", "Assignment", { cell: primary }),
      column("course", "Course"),
      column("due_at", "Due", { cell: (v) => date(v) }),
      column("submissions", "Submissions", { cell: secondary }),
      column("graded", "Graded", { cell: secondary }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "instructor/grades": {
    resource: "submissions",
    searchPlaceholder: "Search submissions…",
    columns: [
      column("learner", "Learner", { cell: primary }),
      column("assignment", "Assignment"),
      column("submitted_at", "Submitted", { cell: (v) => date(v) }),
      column("score", "Score", {
        cell: (v) => (v == null ? "—" : <span className="font-medium">{String(v)}%</span>),
      }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "instructor/materials": {
    resource: "materials",
    searchPlaceholder: "Search materials…",
    columns: [
      column("title", "Material", { cell: primary }),
      column("course", "Course"),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("size", "Size", { cell: secondary }),
      column("downloads", "Downloads", { cell: secondary }),
      column("uploaded_at", "Uploaded", { cell: (v) => date(v) }),
    ],
  },
  "instructor/announcements": {
    resource: "announcements",
    searchPlaceholder: "Search announcements…",
    columns: [
      column("title", "Announcement", { cell: primary }),
      column("audience", "Audience", { cell: (v) => typeCell(v) }),
      column("posted_by", "Posted by", { cell: secondary }),
      column("posted_at", "Posted", { cell: (v) => date(v) }),
      column("pinned", "Pinned", { cell: (v) => (v ? "Pinned" : "—") }),
    ],
  },

  // ── Learner ─────────────────────────────────────────────
  "learner/courses": {
    resource: "courses",
    searchPlaceholder: "Search my courses…",
    columns: [
      column("title", "Course", { cell: primary }),
      column("programme", "Programme"),
      column("trainer", "Trainer", { cell: secondary }),
      column("progress", "Progress", { cell: (v) => progressCell(v) }),
      column("duration", "Duration", { cell: secondary }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "learner/assignments": {
    resource: "assignments",
    searchPlaceholder: "Search assignments…",
    columns: [
      column("title", "Assignment", { cell: primary }),
      column("course", "Course"),
      column("due_at", "Due", { cell: (v) => date(v) }),
      column("graded", "Graded", { cell: (v) => `${v} submissions` }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "learner/certificates": {
    resource: "certificates",
    searchPlaceholder: "Search certificates…",
    columns: [
      column("certificate_id", "Certificate", { cell: primary }),
      column("course", "Course"),
      column("issued_at", "Issued", { cell: (v) => date(v) }),
      column("delivered", "Delivery", { cell: (v) => typeCell(v) }),
      column("qr_verified", "QR", { cell: (v) => (v ? "Verified" : "—") }),
    ],
  },
  "learner/attendance": {
    resource: "attendance",
    searchPlaceholder: "Search attendance…",
    columns: [
      column("course", "Course", { cell: primary }),
      column("date", "Date", { cell: (v) => date(v) }),
      column("time_in", "Time in", { cell: secondary }),
      column("method", "Method", { cell: (v) => typeCell(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "learner/messages": {
    resource: "messages",
    searchPlaceholder: "Search messages…",
    columns: [
      column("subject", "Subject", { cell: primary }),
      column("from", "From", { cell: secondary }),
      column("preview", "Preview", {
        cell: (v) => <span className="line-clamp-1 text-muted-foreground">{String(v)}</span>,
      }),
      column("received_at", "Received", { cell: (v) => date(v) }),
      column("unread", "", {
        sortable: false,
        cell: (v) => (v ? <Badge variant="secondary">New</Badge> : null),
      }),
    ],
  },
  "learner/achievements": {
    resource: "achievements",
    searchPlaceholder: "Search achievements…",
    columns: [
      column("title", "Achievement", { cell: primary }),
      column("description", "Description", { cell: secondary }),
      column("earned_at", "Earned", { cell: (v) => date(v) }),
    ],
  },
  "learner/progress": {
    resource: "progress",
    searchPlaceholder: "Search progress…",
    columns: [
      column("course", "Course", { cell: primary }),
      column("progress", "Progress", { cell: (v) => progressCell(v) }),
      column("quiz_avg", "Quiz average", { cell: (v) => `${v}%` }),
      column("last_activity", "Last activity", { cell: (v) => date(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
  "learner/bookmarks": {
    resource: "bookmarks",
    searchPlaceholder: "Search bookmarks…",
    columns: [
      column("title", "Bookmark", { cell: primary }),
      column("course", "Course"),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("added_at", "Added", { cell: (v) => date(v) }),
    ],
  },
  "learner/downloads": {
    resource: "downloads",
    searchPlaceholder: "Search downloads…",
    columns: [
      column("title", "Download", { cell: primary }),
      column("type", "Type", { cell: (v) => typeCell(v) }),
      column("size", "Size", { cell: secondary }),
      column("downloaded_at", "Downloaded", { cell: (v) => date(v) }),
      column("status", "Status", { cell: (v) => statusCell(v) }),
    ],
  },
};

export function getTableConfig(role: string, slug: string): ModuleTableConfig | undefined {
  return TABLE_REGISTRY[`${role}/${slug}`];
}
