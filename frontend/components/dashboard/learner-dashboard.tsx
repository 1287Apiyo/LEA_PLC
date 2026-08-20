"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarDays,
  Download,
  FileCheck2,
  Flame,
  FolderKanban,
  MapPin,
  MessageCircle,
  Layers3,
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
import { resourceService, type ResourceRow } from "@/services/resources";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

function useLearnerResource(resource: string, sort: string, enabled: boolean) {
  return useQuery({
    queryKey: ["learner-dashboard", resource],
    queryFn: () => resourceService.list(resource, { per_page: 5, sort, order: "desc" }),
    enabled,
    staleTime: 60 * 1000,
  });
}

/** Learner dashboard — greeting banner, courses, next class, progress and rewards. */
export function LearnerDashboard() {
  const { data, isLoading, isError, refetch } = useLearnerDashboard();
  const user = useAuthStore((s) => s.user);
  const projectsQuery = useLearnerResource("projects", "updated_at", Boolean(user?.id));
  const downloadsQuery = useLearnerResource("downloads", "downloaded_at", Boolean(user?.id));
  const messagesQuery = useLearnerResource("messages", "created_at", Boolean(user?.id));

  const firstName = user?.name.split(" ")[0] ?? "Learner";
  const avgProgress =
    data && data.myCourses.length > 0
      ? Math.round(
          data.myCourses.reduce((sum, course) => sum + course.progress, 0) /
            data.myCourses.length
        )
      : null;
  const projects = (projectsQuery.data?.data ?? []) as ResourceRow[];
  const downloads = (downloadsQuery.data?.data ?? []) as ResourceRow[];
  const messages = (messagesQuery.data?.data ?? []) as ResourceRow[];
  const nextAssignment = data?.assignments.find((item) => item.status === "open" || item.status === "overdue");
  const nextCourse = data?.myCourses.find((course) => course.progress < 100);
  const latestProject = projects[0];
  const nextAction = nextAssignment
    ? { label: "Submit your next assignment", detail: `${nextAssignment.title} · ${nextAssignment.course}`, href: "/learner/assignments", icon: FileCheck2 }
    : nextCourse
      ? { label: `Continue ${nextCourse.title}`, detail: `${nextCourse.progress}% complete · next lesson: ${nextCourse.next_lesson || "Choose your next lesson"}`, href: `/learner/courses/${nextCourse.id}`, icon: BookOpen }
      : latestProject
        ? { label: "Keep building your project", detail: String(latestProject.title ?? "Open your latest saved project"), href: "/learner/projects", icon: FolderKanban }
        : { label: "Choose your next course", detail: "Explore the LEA Labs curriculum and find a practical place to begin.", href: "/learner/courses", icon: Layers3 };
  const NextActionIcon = nextAction.icon;

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <StatCard icon={BookOpen} {...data.stats.coursesInProgress} />
            <StatCard icon={FileCheck2} {...data.stats.assignmentsDue} />
            <StatCard icon={UserCheck} {...data.stats.attendanceRate} />
            <StatCard icon={Award} {...data.stats.certificates} />
            <StatCard icon={BookOpen} {...data.stats.lessonsCompleted} />
            <StatCard icon={BadgeCheck} {...data.stats.assignmentsSubmitted} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <Card className="overflow-hidden border-[#4d176e] bg-[#1f0d2e] text-white">
              <CardContent className="flex h-full flex-col justify-between gap-6 p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f6b39a]"><NextActionIcon className="h-4 w-4" aria-hidden />Next action</div>
                  <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.04em]">{nextAction.label}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">{nextAction.detail}</p>
                </div>
                <Button asChild className="w-fit rounded-full bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]"><Link href={nextAction.href}>Open next step <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /></Link></Button>
              </CardContent>
            </Card>
            <Card className="border-[#d9c6e1] bg-[#fffdfb]">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Bell className="h-4 w-4 text-[#f47945]" aria-hidden />Your learning pulse</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <Link href="/learner/projects" className="rounded-xl bg-[#f6eef9] p-3 transition hover:bg-[#efe2f7]"><FolderKanban className="h-4 w-4 text-[#4d176e]" aria-hidden /><p className="mt-2 text-lg font-semibold text-[#151116]">{projects.length}</p><p className="text-[11px] text-muted-foreground">Projects</p></Link>
                <Link href="/learner/downloads" className="rounded-xl bg-[#fff4ee] p-3 transition hover:bg-[#ffe8dc]"><Download className="h-4 w-4 text-[#b94920]" aria-hidden /><p className="mt-2 text-lg font-semibold text-[#151116]">{downloads.length}</p><p className="text-[11px] text-muted-foreground">Downloads</p></Link>
                <Link href="/learner/messages" className="rounded-xl bg-[#f6eef9] p-3 transition hover:bg-[#efe2f7]"><MessageCircle className="h-4 w-4 text-[#4d176e]" aria-hidden /><p className="mt-2 text-lg font-semibold text-[#151116]">{messages.length}</p><p className="text-[11px] text-muted-foreground">Updates</p></Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="border-[#f47945]/35 bg-[#fffaf7]">
              <CardContent className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b94920]">Keep your momentum</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#151116]">Small progress becomes a body of work.</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">You have submitted {data.stats.assignmentsSubmitted.value} assignment{Number(data.stats.assignmentsSubmitted.value) === 1 ? "" : "s"}. Keep showing your work and the next milestone will come into view.</p>
                </div>
                <div className="shrink-0 rounded-2xl bg-[#1f0d2e] px-5 py-4 text-white">
                  <Flame className="h-5 w-5 text-[#f47945]" aria-hidden />
                  <p className="mt-2 text-2xl font-semibold">{data.currentStreak}</p>
                  <p className="text-xs text-white/70">active weeks</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#4d176e]/15">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium"><BadgeCheck className="h-4 w-4 text-[#f47945]" aria-hidden />Next badge</CardTitle>
              </CardHeader>
              <CardContent>
                {data.badges.find((badge) => !badge.earned) ? (() => {
                  const badge = data.badges.find((item) => !item.earned)!;
                  return <div><p className="font-semibold">{badge.title}</p><p className="mt-1 text-sm text-muted-foreground">{badge.description}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-[#f47945]" style={{ width: `${Math.round((badge.progress / badge.target) * 100)}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{badge.progress} of {badge.target} completed</p></div>;
                })() : <div><p className="font-semibold">Every badge earned</p><p className="mt-1 text-sm text-muted-foreground">You are building a strong learning record. Keep going.</p></div>}
              </CardContent>
            </Card>
          </div>

          <Card className="group overflow-hidden rounded-[26px] border border-[#f47945]/45 bg-white shadow-[0_16px_40px_rgba(77,23,110,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(77,23,110,0.12)]">
            <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="flex flex-col justify-between gap-5 p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f47945] text-[#351039]">
                    <Layers3 className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b94920]">Your learning path</p>
                    <h2 className="mt-1 max-w-xl text-xl font-semibold leading-tight tracking-[-0.03em] text-[#151116]">Choose a programme, then move through its courses.</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Explore the full LEA Labs curriculum, see the project each course builds toward, and continue from your current progress.</p>
                  </div>
                </div>
                <div>
                  <Button asChild className="rounded-full bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]">
                    <Link href="/learner/courses">
                      Explore programmes
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative min-h-[180px] overflow-hidden bg-[#1f0d2e]">
                <Image src="/lea-hero-purple-orange.png" alt="Learner building practical digital skills" fill sizes="(max-width: 1024px) 100vw, 220px" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1f0d2e]/75 via-[#351039]/20 to-transparent lg:bg-gradient-to-l" />
                <span className="absolute bottom-4 right-4 rounded-full bg-[#f47945] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#351039]">Build forward</span>
              </div>
            </CardContent>
          </Card>

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
                  Your badges
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {data.badges.map((badge) => (
                  <div key={badge.id} className={cn("rounded-xl border p-3", badge.earned ? "border-[#f47945]/40 bg-[#fffaf7]" : "border-border bg-muted/20")}>
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", badge.earned ? "bg-[#f47945] text-[#351039]" : "bg-muted text-muted-foreground")}><Award className="h-4 w-4" aria-hidden /></div>
                      <div className="min-w-0"><p className="text-sm font-semibold">{badge.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{badge.description}</p></div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", badge.earned ? "bg-[#f47945]" : "bg-[#4d176e]")} style={{ width: `${Math.round((badge.progress / badge.target) * 100)}%` }} /></div>
                    <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{badge.earned ? "Earned" : `${badge.progress}/${badge.target} toward this badge`}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
