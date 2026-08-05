"use client";

import { CrudTable } from "@/components/shared/crud-table";
import { getTableConfig } from "@/lib/table-registry";
import { getModule } from "@/lib/module-registry";

interface ModuleListViewProps {
  role: string;
  slug: string;
}

/** Singular display label for a module title (e.g. "Learners" → "Learner"). */
function singularize(title: string): string {
  const overrides: Record<string, string> = {
    "Staff & HR": "Staff member",
    "Corporate Training": "Company",
    "Tech Services": "Project",
    "Content Library": "Asset",
    CRM: "Lead",
    Attendance: "Attendance record",
    Classes: "Class",
    Schools: "School",
    Partnerships: "Partner",
    Programmes: "Programme",
    Assessments: "Assessment",
    Certificates: "Certificate",
    Grades: "Grade",
    Materials: "Material",
    Announcements: "Announcement",
    Assignments: "Assignment",
    Messages: "Message",
    Achievements: "Achievement",
    Progress: "Progress entry",
    Bookmarks: "Bookmark",
    Downloads: "Download",
    Courses: "Course",
    Instructors: "Instructor",
    Learners: "Learner",
    Events: "Event",
    Invoices: "Invoice",
    Expenses: "Expense",
  };
  if (overrides[title]) return overrides[title];
  return title.replace(/s$/, "");
}

/** Renders the CRUD table for a module route from the column registry. */
export function ModuleListView({ role, slug }: ModuleListViewProps) {
  const config = getTableConfig(role, slug);
  const definition = getModule(role, slug);
  if (!config) return null;

  const plural = definition?.title ?? config.resource;
  const singular = singularize(plural);

  return (
    <CrudTable
      resource={config.resource}
      columns={config.columns}
      searchPlaceholder={config.searchPlaceholder}
      title={singular}
      plural={plural}
    />
  );
}
