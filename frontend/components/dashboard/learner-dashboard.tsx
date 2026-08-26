"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  MapPin,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { GreetingBanner } from "@/components/dashboard/greeting-banner";
import { CourseProgressDonut, TrendLineChart } from "@/components/dashboard/charts";
import { useLearnerDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/lib/auth-store";

/** Focused learner dashboard — the essentials for knowing what to do next. */
export function LearnerDashboard() {
  const { data, isLoading, isError, refetch } = useLearnerDashboard();
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name.split(" ")[0] ?? "Learner";

  const avgProgress =
    data && data.myCourses.length > 0
      ? Math.round(data.myCourses.reduce((sum, course) => sum + course.progress, 0) / data.myCourses.length)
      : null;
  const courseProgress = data && data.myCourses.length > 0
    ? data.myCourses.reduce((sum, course) => sum + course.progress, 0) / data.myCourses.length
    : 0;
  const nextAssignment = data?.assignments.find((item) => item.status === "open" || item.status === "overdue");
  const nextCourse = data?.myCourses.find((course) => course.progress < 100);
  const nextAction = nextAssignment
    ? { label: "Submit your next assignment", detail: `${nextAssignment.title} · ${nextAssignment.course}`, href: "/learner/assignments", icon: FileCheck2 }
    : nextCourse
      ? { label: `Continue ${nextCourse.title}`, detail: `${nextCourse.progress}% complete · ${nextCourse.next_lesson || "Choose your next lesson"}`, href: `/learner/courses/${nextCourse.id}`, icon: BookOpen }
      : { label: "Choose your next course", detail: "Explore the LEA Labs curriculum and find a practical place to begin.", href: "/learner/courses", icon: BookOpen };
  const NextActionIcon = nextAction.icon;

  return (
    <div className="space-y-4 pb-4">
      <GreetingBanner
        firstName={firstName}
        message={
          avgProgress !== null
            ? `You're ${avgProgress}% through your current courses. Keep the next step simple.`
            : "Choose a course and take one practical step today."
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Could not load the dashboard.
          <Button variant="outline" size="sm" className="ml-2" onClick={() => void refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard icon={BookOpen} {...data.stats.coursesInProgress} />
            <StatCard icon={FileCheck2} {...data.stats.assignmentsDue} />
            <StatCard icon={UserCheck} {...data.stats.attendanceRate} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr]">
            <Card className="border-[#d9c6e1] bg-white">
              <CardHeader className="pb-1"><CardTitle className="text-base text-[#151116]">Course progress</CardTitle><p className="mt-1 text-xs text-muted-foreground">Your average completion across current courses.</p></CardHeader>
              <CardContent className="relative p-3">
                <CourseProgressDonut value={courseProgress} height={150} />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-1"><div className="text-center"><p className="text-2xl font-bold text-[#4d176e]">{Math.round(courseProgress)}%</p><p className="text-[10px] text-muted-foreground">complete</p></div></div>
              </CardContent>
            </Card>
            <Card className="border-[#d9c6e1] bg-white">
              <CardHeader className="pb-1"><CardTitle className="text-base text-[#151116]">Learning activity</CardTitle><p className="mt-1 text-xs text-muted-foreground">Recent completion activity from your learning record.</p></CardHeader>
              <CardContent className="px-3 pb-3 pt-1"><TrendLineChart data={data.progressByWeek} height={160} /></CardContent>
            </Card>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <Card className="border-[#d9c6e1] bg-white">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base text-[#151116]">Current courses</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Your active learning at a glance.</p>
                </div>
                <Link href="/learner/courses" className="text-xs font-semibold text-[#4d176e] hover:text-[#b94920]">View all</Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.myCourses.length ? data.myCourses.slice(0, 3).map((course) => {
                  const progress = Math.max(0, Math.min(100, course.progress));
                  return (
                    <div key={course.id} className="rounded-xl border border-[#eadcf0] bg-[#fffdfb] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0"><p className="truncate text-sm font-semibold text-[#151116]">{course.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{course.next_lesson || "Continue with your next lesson"}</p></div>
                        <span className="shrink-0 text-xs font-bold text-[#4d176e]">{progress}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f2eaf4]"><div className="h-full rounded-full bg-[#f47945] transition-all" style={{ width: `${progress}%` }} /></div>
                      <Link href={`/learner/courses/${course.id}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#4d176e] hover:text-[#b94920]">{progress > 0 ? "Continue course" : "Start course"}<ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                    </div>
                  );
                }) : <div className="rounded-xl border border-dashed border-[#d9c6e1] p-6 text-center text-sm text-muted-foreground">No active courses yet. Choose a programme to begin.</div>}
              </CardContent>
            </Card>

            <Card className="border-[#4d176e] bg-[#1f0d2e] text-white">
              <CardContent className="space-y-5 p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f6b39a]"><NextActionIcon className="h-4 w-4" aria-hidden /> Next step</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{nextAction.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">{nextAction.detail}</p>
                </div>
                <Button asChild className="w-full rounded-full bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]"><Link href={nextAction.href}>Open next step <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /></Link></Button>
                {data.nextClass ? <div className="border-t border-white/15 pt-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f6b39a]"><CalendarDays className="h-4 w-4" aria-hidden /> Upcoming class</div><p className="mt-2 text-sm font-semibold">{data.nextClass.course}</p><p className="mt-1 text-xs text-white/65">Today · {data.nextClass.start_time}–{data.nextClass.end_time}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-white/65"><MapPin className="h-3.5 w-3.5" aria-hidden />{data.nextClass.venue}</p></div> : <div className="flex items-center gap-2 border-t border-white/15 pt-4 text-xs text-white/65"><CheckCircle2 className="h-4 w-4 text-[#f47945]" aria-hidden />No upcoming class scheduled.</div>}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
