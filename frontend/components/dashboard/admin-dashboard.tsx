"use client";

import {
  CalendarDays,
  CheckCircle2,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { GreetingBanner } from "@/components/dashboard/greeting-banner";
import {
  CategoryBarChart,
  TrendAreaChart,
  TrendLineChart,
} from "@/components/dashboard/charts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  RecentPayments,
  RecentRegistrations,
  TodaySchedule,
} from "@/components/dashboard/dashboard-lists";
import { useAdminDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/lib/auth-store";

/** Administrator dashboard — platform-wide metrics, charts and activity. */
export function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name.split(" ")[0] ?? "Administrator";

  return (
    <div className="space-y-6">
      <GreetingBanner
        firstName={firstName}
        message="Platform overview — learning, operations and finance at a glance."
        chip={
          <>
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {data?.stats.todayClasses.value ?? "—"} classes today
          </>
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch();
            }}
          >
            Refresh
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          Could not load the dashboard.
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard icon={Users} {...data.stats.activeLearners} />
            <StatCard icon={CalendarDays} {...data.stats.todayClasses} />
            <StatCard icon={Wallet} {...data.stats.revenueThisMonth} />
            <StatCard icon={UserCheck} {...data.stats.attendanceRate} />
            <StatCard icon={CheckCircle2} {...data.stats.completionRate} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="Revenue trend"
              subtitle="Monthly income, last 12 months"
              className="lg:col-span-2"
            >
              <TrendAreaChart data={data.revenueTrend} />
            </ChartCard>
            <ChartCard title="Enrolment by programme" subtitle="Active enrolments">
              <CategoryBarChart data={data.enrolmentByProgramme} />
            </ChartCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <TodaySchedule classes={data.todaySchedule} />
            <RecentRegistrations items={data.recentRegistrations} />
            <RecentPayments items={data.recentPayments} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="Attendance rate"
              subtitle="Weekly average, last 8 weeks"
              className="lg:col-span-2"
            >
              <TrendLineChart data={data.attendanceByWeek} />
            </ChartCard>
            <QuickActions role="administrator" />
          </div>
        </>
      )}
    </div>
  );
}
