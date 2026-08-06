"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Flame,
  MapPin,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { GreetingBanner } from "@/components/dashboard/greeting-banner";
import { TrendLineChart } from "@/components/dashboard/charts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  AssignmentList,
  CertificateList,
  CourseProgressList,
} from "@/components/dashboard/dashboard-lists";
import { useLearnerDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

/** Flat, bright accents for the fun learner portal — no gradients. */
const ACHIEVEMENT_COLORS = [
  "bg-orange-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-pink-500",
];

/** Learner dashboard — greeting banner, courses, next class, progress and rewards. */
export function LearnerDashboard() {
  const { data, isLoading, isError, refetch } = useLearnerDashboard();
  const user = useAuthStore((s) => s.user);

  const firstName = user?.name.split(" ")[0] ?? "Learner";
  const avgProgress =
    data && data.myCourses.length > 0
      ? Math.round(
          data.myCourses.reduce((sum, course) => sum + course.progress, 0) /
            data.myCourses.length
        )
      : null;

  return (
    <div className="space-y-6">
      {/* Greeting banner */}
      <GreetingBanner
        firstName={firstName}
        message={
          avgProgress !== null
            ? `You're ${avgProgress}% through this term's courses — keep the momentum going.`
            : "Your learning journey starts here — pick a course and get going."
        }
        chip={
          <>
            <Flame className="h-3.5 w-3.5" aria-hidden />
            {data?.stats.attendanceRate.value ?? "—"} attendance
          </>
        }
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-xl" />
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          Could not load the dashboard.
          <Button variant="outline" size="sm" className="ml-2" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={BookOpen} {...data.stats.coursesInProgress} />
            <StatCard icon={FileCheck2} {...data.stats.assignmentsDue} />
            <StatCard icon={UserCheck} {...data.stats.attendanceRate} />
            <StatCard icon={Award} {...data.stats.certificates} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CourseProgressList courses={data.myCourses} />
            </div>
            {data.nextClass ? (
              <Card className="overflow-hidden">
                <div className="h-1 bg-primary" />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
                    Next class
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{data.nextClass.course}</p>
                    <p className="text-sm text-muted-foreground">
                      Today · {data.nextClass.start_time}–{data.nextClass.end_time}
                    </p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {data.nextClass.venue}
                    </p>
                    <p className="text-muted-foreground">
                      Trainer: {data.nextClass.trainer}
                    </p>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/learner/calendar">Open calendar</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <QuickActions role="learner" />
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard title="Assignments" subtitle="Upcoming and recent">
              <AssignmentList items={data.assignments} emptyLabel="All caught up!" />
            </ChartCard>
            <ChartCard title="Progress this term" subtitle="Weekly completion">
              <TrendLineChart data={data.progressByWeek} />
            </ChartCard>
            <CertificateList items={data.certificates} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <QuickActions role="learner" />
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.achievements.map((achievement, index) => (
                  <span
                    key={achievement}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white",
                      ACHIEVEMENT_COLORS[index % ACHIEVEMENT_COLORS.length]
                    )}
                  >
                    <Award className="h-4 w-4" aria-hidden />
                    {achievement}
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
