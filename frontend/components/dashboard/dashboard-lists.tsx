"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  InstructorAssignment,
  LearnerAssignment,
  LearnerCertificate,
  LearnerCourse,
  RecentPayment,
  RecentRegistration,
  TodayClass,
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

/** Card with a header row and list body. */
function ListCard({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {href ? (
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <Link href={href}>View all</Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1">{children}</CardContent>
    </Card>
  );
}

export function TodaySchedule({ classes }: { classes: TodayClass[] }) {
  return (
    <ListCard title="Today's classes" href="/admin/classes">
      {classes.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.course}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.trainer} · {item.venue} · {item.learners} learners
            </p>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {item.start_time}–{item.end_time}
          </span>
        </div>
      ))}
    </ListCard>
  );
}

const REGISTRATION_STATUS: Record<RecentRegistration["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
};

export function RecentRegistrations({ items }: { items: RecentRegistration[] }) {
  return (
    <ListCard title="Recent registrations" href="/admin/learners">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.programme} · {new Date(item.enrolled_at).toLocaleDateString()}
            </p>
          </div>
          <Badge variant={REGISTRATION_STATUS[item.status]} className="shrink-0 capitalize">
            {item.status}
          </Badge>
        </div>
      ))}
    </ListCard>
  );
}

const PAYMENT_STATUS: Record<RecentPayment["status"], "default" | "secondary" | "destructive"> = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
};

export function RecentPayments({ items }: { items: RecentPayment[] }) {
  return (
    <ListCard title="Recent payments" href="/admin/finance">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.learner}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.id} · {item.method}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold">
              {item.amount.toLocaleString("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 })}
            </span>
            <Badge variant={PAYMENT_STATUS[item.status]} className="capitalize">
              {item.status}
            </Badge>
          </div>
        </div>
      ))}
    </ListCard>
  );
}

export function AssignmentList({
  items,
  emptyLabel = "No assignments.",
}: {
  items: InstructorAssignment[] | LearnerAssignment[];
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="px-2 py-4 text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {"course" in item && item.course} · due{" "}
              {new Date(item.due_at).toLocaleDateString()}
            </p>
          </div>
          {"submissions" in item ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {item.graded}/{item.submissions} graded
            </span>
          ) : "grade" in item && item.grade !== null ? (
            <Badge variant="secondary" className="shrink-0">
              {item.grade}%
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 capitalize">
              {"status" in item ? item.status : ""}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

/** One flat color per course — the learner portal's playful progress bars. */
const COURSE_COLORS = [
  "bg-orange-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-pink-500",
];

export function CourseProgressList({ courses }: { courses: LearnerCourse[] }) {
  return (
    <ListCard title="My courses" href="/learner/courses">
      {courses.map((course, index) => (
        <Link
          key={course.id}
          href={`/learner/courses/${course.id}`}
          className="block space-y-1.5 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-medium">{course.title}</p>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {course.progress}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", COURSE_COLORS[index % COURSE_COLORS.length])}
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            Next: {course.next_lesson}
          </p>
        </Link>
      ))}
    </ListCard>
  );
}

export function CertificateList({ items }: { items: LearnerCertificate[] }) {
  return (
    <ListCard title="Certificates" href="/learner/certificates">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.id} · {new Date(item.issued_at).toLocaleDateString()}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("shrink-0", item.verified && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400")}
          >
            {item.verified ? "Verified" : "Pending"}
          </Badge>
        </div>
      ))}
    </ListCard>
  );
}
