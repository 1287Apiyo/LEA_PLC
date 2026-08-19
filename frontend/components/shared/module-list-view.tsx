"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Clock, Layers, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { CrudTable } from "@/components/shared/crud-table";
import { getTableConfig } from "@/lib/table-registry";
import { resourceService, type ResourceRow } from "@/services/resources";

interface ModuleListViewProps {
  role: string;
  slug: string;
  /** Plural display label from the server-side registry, e.g. "Learners". */
  plural: string;
}

// ── Overview computation ──────────────────────────────────

const MONEY_KEYS = ["amount", "price", "value", "budget", "salary", "contract_value", "funding", "fee"];
const PCT_KEYS = ["attendance_rate", "progress", "quiz_avg", "rating"];
const DATE_KEYS = ["created_at", "enrolled_at", "paid_at", "issued_at", "uploaded_at", "joined_at", "incurred_at", "posted_at", "received_at", "earned_at", "added_at", "downloaded_at", "submitted_at", "start_at", "signed_at", "date", "due_at", "renewal_at", "last_activity"];

const GOOD_STATUSES = new Set(["active", "paid", "issued", "published", "completed", "present", "open", "approved", "verified", "on-track", "won", "ready", "upcoming"]);
const BAD_STATUSES = new Set(["suspended", "failed", "absent", "overdue", "cancelled", "revoked", "rejected", "lost", "expired", "at-risk"]);
const PENDING_STATUSES = new Set(["pending", "submitted", "scheduled", "ongoing", "grading", "probation", "negotiating", "contacted", "meeting", "proposal", "new", "planning", "late", "on-leave", "quoted", "draft", "outstanding"]);

interface OverviewStat {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}

function findKey(keys: string[], rows: ResourceRow[]): string | undefined {
  return keys.find((key) => rows.some((row) => typeof row[key] === "number"));
}

function computeStats(rows: ResourceRow[]): OverviewStat[] {
  const stats: OverviewStat[] = [];
  const total = rows.length;
  if (total === 0) return stats;

  stats.push({ label: "Total records", value: total, hint: "in this module", icon: Layers });

  // Active / positive status count.
  const statusValues = rows.map((row) => String(row.status ?? "")).filter(Boolean);
  if (statusValues.length > 0) {
    const good = statusValues.filter((value) => GOOD_STATUSES.has(value.toLowerCase())).length;
    stats.push({
      label: "Healthy records",
      value: good,
      hint: `${Math.round((good / statusValues.length) * 100)}% of listed`,
      icon: BadgeCheck,
    });
  }

  // Money column sum.
  const moneyKey = findKey(MONEY_KEYS, rows);
  if (moneyKey) {
    const sum = rows.reduce((acc, row) => acc + Number(row[moneyKey] ?? 0), 0);
    stats.push({
      label: "Total value",
      value: sum.toLocaleString("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }),
      hint: `across ${total} records`,
      icon: Wallet,
    });
  }

  // Percentage column average (rating handled as /5).
  const pctKey = findKey(PCT_KEYS, rows);
  if (pctKey) {
    const values = rows.map((row) => Number(row[pctKey] ?? 0)).filter((value) => value > 0);
    if (values.length > 0) {
      const isRating = pctKey === "rating";
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      stats.push({
        label: isRating ? "Average rating" : "Average",
        value: isRating ? average.toFixed(1) : `${Math.round(average)}%`,
        hint: isRating ? "/ 5 · instructors" : pctKey.replace(/_/g, " "),
        icon: TrendingUp,
      });
    }
  }

  // New this week.
  const dateKey = DATE_KEYS.find((key) => rows.some((row) => row[key]));
  if (dateKey) {
    const weekAgo = Date.now() - 7 * 86400000;
    const recent = rows.filter((row) => {
      const time = new Date(String(row[dateKey] ?? "")).getTime();
      return !Number.isNaN(time) && time >= weekAgo;
    }).length;
    if (recent > 0) {
      stats.push({
        label: "New this week",
        value: recent,
        hint: "last 7 days",
        icon: Clock,
      });
    }
  }

  return stats;
}

function chipTone(value: string): "default" | "secondary" | "destructive" | "outline" {
  const normalized = value.toLowerCase();
  if (GOOD_STATUSES.has(normalized)) return "default";
  if (BAD_STATUSES.has(normalized)) return "destructive";
  if (PENDING_STATUSES.has(normalized)) return "secondary";
  return "outline";
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

/**
 * Module page — dashboard-style overview (summary stats + status
 * distribution) above the full CRUD table, computed live from data.
 */
export function ModuleListView({ role, slug, plural }: ModuleListViewProps) {
  const config = getTableConfig(role, slug);
  const { data } = useQuery({
    queryKey: ["overview", config?.resource ?? slug],
    queryFn: () => resourceService.list(config?.resource ?? slug, { per_page: 100 }),
    enabled: Boolean(config),
    staleTime: 60 * 1000,
  });

  const rows = useMemo(() => data?.data ?? [], [data]);
  const stats = useMemo(() => computeStats(rows), [rows]);

  const statusDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of rows) {
      const value = String(row.status ?? "");
      if (!value) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([value, count]) => ({ value, count }));
  }, [rows]);

  if (!config) return null;
  const singular = singularize(plural);

  return (
    <div className="space-y-6">
      {stats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} hint={stat.hint} />
          ))}
        </div>
      ) : null}

      {statusDistribution.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          {statusDistribution.map(({ value, count }) => (
            <Badge key={value} variant={chipTone(value)} className="gap-1.5 py-1">
              <span className="font-semibold">{count}</span>
              <span className="capitalize">{value.replace(/-/g, " ")}</span>
            </Badge>
          ))}
        </div>
      ) : null}

            <CrudTable
        resource={config.resource}
        columns={config.columns}
        searchPlaceholder={config.searchPlaceholder}
        title={singular}
        plural={plural}
        canCreate={role !== "learner" || ["messages", "bookmarks", "downloads", "projects"].includes(config.resource)}
      />

    </div>
  );
}
