"use client";

import Link from "next/link";
import { CalendarDays, ClipboardCheck, FileCheck2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { GreetingBanner } from "@/components/dashboard/greeting-banner";
import { CategoryBarChart, TrendLineChart } from "@/components/dashboard/charts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AssignmentList, TodaySchedule } from "@/components/dashboard/dashboard-lists";
import { useInstructorDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/lib/auth-store";

/** Instructor dashboard — classes, attendance, grading and learner analytics. */
export function InstructorDashboard() {
  const { data, isLoading, isError, refetch } = useInstructorDashboard();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name.split(" ")[0] ?? "Instructor";

  return (
    <div className="space-y-6">
      <GreetingBanner
        firstName={firstName}
        message="Your teaching overview — classes, grading and learner activity."
        chip={
          <>
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {data?.stats.todayClasses.value ?? "—"} classes today
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
            <StatCard icon={CalendarDays} {...data.stats.todayClasses} />
            <StatCard icon={ClipboardCheck} {...data.stats.attendanceRate} />
            <StatCard icon={FileCheck2} {...data.stats.pendingGrading} />
            <StatCard icon={Users} {...data.stats.activeLearners} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-[#4d176e] hover:bg-[#35104f]"><Link href="/instructor/grading"><FileCheck2 className="mr-1.5 h-4 w-4" /> Open grading queue</Link></Button>
            <Button asChild variant="outline"><Link href="/instructor/announcements">Post course update</Link></Button>
            <Button asChild variant="outline"><Link href="/instructor/tutor-sessions">Review tutor requests</Link></Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="Attendance rate"
              subtitle="Weekly average, last 8 weeks"
              className="lg:col-span-2"
            >
              <TrendLineChart data={data.attendanceByWeek} />
            </ChartCard>
            <ChartCard title="Grade distribution" subtitle="Recent assessments">
              <CategoryBarChart data={data.gradeDistribution} />
            </ChartCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TodaySchedule classes={data.classSchedule} />
            </div>
            <QuickActions role="instructor" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Recent assignments"
              subtitle="Submissions vs graded"
            >
              <AssignmentList items={data.recentAssignments} />
            </ChartCard>
            <ChartCard title="Announcements" subtitle="Latest from your classes">
              <div className="space-y-1">
                {data.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-md px-2 py-2 hover:bg-muted/50"
                  >
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {announcement.body}
                    </p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
