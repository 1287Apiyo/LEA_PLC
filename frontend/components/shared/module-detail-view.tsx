"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { getTableConfig } from "@/lib/table-registry";
import { resourceService, type ResourceRow } from "@/services/resources";

const HIDDEN_KEYS = new Set([
  "id", "salt", "password_hash", "updated_at",
  // rendered by the dedicated ecosystem cards below
  "lessons", "enrolments", "learners",
]);
const DATE_KEYS = new Set([
  "created_at", "enrolled_at", "paid_at", "issued_at", "uploaded_at", "joined_at",
  "submitted_at", "due_at", "start_at", "date", "earned_at", "renewal_at",
  "last_activity", "expires_at", "expiresAt", "signed_at", "received_at", "incurred_at",
]);

function humanize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "object") return JSON.stringify(value);
  const text = String(value);
  if (DATE_KEYS.has(key)) {
    const time = new Date(text).getTime();
    if (!Number.isNaN(time)) {
      return new Date(time).toLocaleDateString("en", {
        year: "numeric", month: "short", day: "numeric",
      });
    }
  }
  return text;
}

interface ModuleDetailViewProps {
  role: string;
  module: string;
  id: string;
  /** Display label of the module, e.g. "Learners". */
  plural: string;
}

const fmtDate = (value: unknown) => {
  const text = String(value ?? "");
  const time = new Date(text).getTime();
  if (!text || Number.isNaN(time)) return null;
  return new Date(time).toLocaleDateString("en", {
    year: "numeric", month: "short", day: "numeric",
  });
};

interface EnrolmentRow {
  learnerId?: unknown;
  learner_name?: unknown;
  learner_email?: unknown;
  progress?: unknown;
  completed_lessons?: unknown;
  enrolled_at?: unknown;
  courseId?: unknown;
  course_title?: unknown;
}

/** Course detail — everyone enrolled in the course, with progress. */
function EnrolledLearnersCard({ row }: { row: ResourceRow }) {
  const enrolments = Array.isArray(row.enrolments) ? (row.enrolments as EnrolmentRow[]) : [];
  const count = Number(row.learners ?? enrolments.length);
  const lessonCount = Number(row.lesson_count ?? 0);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Enrolled learners</h3>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {count}
          </span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Learners studying this course and how far they&apos;ve come.
        </p>
        {enrolments.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No learners enrolled yet. They&apos;ll appear here as soon as they enrol.
          </p>
        ) : (
          <ul className="divide-y">
            {enrolments.map((enr) => {
              const done = Array.isArray(enr.completed_lessons) ? enr.completed_lessons.length : 0;
              const date = fmtDate(enr.enrolled_at);
              return (
                <li key={String(enr.learnerId ?? "?")} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {String(enr.learner_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/learners/${String(enr.learnerId ?? "")}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {String(enr.learner_name ?? "—")}
                    </Link>
                    {enr.learner_email ? (
                      <p className="truncate text-xs text-muted-foreground">{String(enr.learner_email)}</p>
                    ) : null}
                  </div>
                  <div className="w-40">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Number(enr.progress ?? 0)}%</span>
                      <span>{done}/{lessonCount} lessons</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${Number(enr.progress ?? 0)}%` }}
                      />
                    </div>
                  </div>
                  {date ? <span className="text-xs text-muted-foreground">{date}</span> : null}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** Learner detail — the courses they're enrolled in, with progress. */
function EnrolledCoursesCard({ row }: { row: ResourceRow }) {
  const enrolments = Array.isArray(row.enrolments) ? (row.enrolments as Array<Record<string, unknown>>) : [];
  const count = Number(row.courses_enrolled ?? enrolments.length);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Enrolled courses</h3>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {count}
          </span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Courses this learner is studying and their progress.
        </p>
        {enrolments.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Not enrolled in any courses yet.
          </p>
        ) : (
          <ul className="divide-y">
            {enrolments.map((enr) => {
              const done = Array.isArray(enr.completed_lessons) ? enr.completed_lessons.length : 0;
              const date = fmtDate(enr.enrolled_at);
              return (
                <li key={String(enr.courseId ?? "?")} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/courses/${String(enr.courseId ?? "")}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {String(enr.course_title ?? "—")}
                    </Link>
                    {date ? <p className="text-xs text-muted-foreground">Enrolled {date}</p> : null}
                  </div>
                  <div className="w-40">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Number(enr.progress ?? 0)}%</span>
                      <span>{done} lessons done</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${Number(enr.progress ?? 0)}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** Single-record view — fetches /api/v1/{resource}/{id} and renders its fields. */
export function ModuleDetailView({ role, module, id, plural }: ModuleDetailViewProps) {
  const pathname = usePathname();
  const config = getTableConfig(role, module);
  const resource = config?.resource ?? module;
  const singular = plural.replace(/s$/, "");
  const backHref = pathname.split("/").slice(0, -1).join("/") || `/${role}/${module}`;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["detail", resource, id],
    queryFn: () => resourceService.get(resource, id),
    enabled: Boolean(id),
  });

  const row: ResourceRow | undefined = data?.data;
  const title = isLoading
    ? "Loading…"
    : String(row?.name ?? row?.title ?? row?.id ?? "Record");

  const fields = row
    ? Object.entries(row).filter(([key]) => !HIDDEN_KEYS.has(key))
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={`${singular} details`}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Back to {plural}
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ) : isError ? (
            <p className="text-sm text-muted-foreground">
              Could not load this record. It may have been deleted.
            </p>
          ) : fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">No details available.</p>
          ) : (
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {fields.map(([key, value]) => (
                <div key={key} className="min-w-0 border-b pb-3 last:border-0 sm:border-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {humanize(key)}
                  </dt>
                  <dd className="mt-1 break-words text-sm">{formatValue(key, value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>

      {row && module === "courses" ? <EnrolledLearnersCard row={row} /> : null}
      {row && (module === "learners" || module === "instructors" || module === "staff")
        ? <EnrolledCoursesCard row={row} />
        : null}
    </div>
  );
}
