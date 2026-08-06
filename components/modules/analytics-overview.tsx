"use client";

import { Activity, Award, CalendarDays, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { CategoryBarChart, TrendLineChart } from "@/components/dashboard/charts";
import { useInstructorDashboard } from "@/hooks/use-dashboard";

/** Instructor analytics — attendance trend, grade distribution, engagement. */
export function AnalyticsOverview() {
  const { data, isLoading } = useInstructorDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learner analytics"
        description="Engagement, attendance and performance across your classes."
      />

      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Active learners" value={data.stats.activeLearners.value} delta={data.stats.activeLearners.delta} hint="across your classes" />
            <StatCard icon={Activity} label="Avg attendance" value={data.stats.attendanceRate.value} delta={data.stats.attendanceRate.delta} />
            <StatCard icon={Award} label="Avg score" value="81%" hint="recent assessments" />
            <StatCard icon={CalendarDays} label="Classes this week" value="8" hint="2 online" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="Attendance trend"
              subtitle="Weekly average, last 8 weeks"
              className="lg:col-span-2"
            >
              <TrendLineChart data={data.attendanceByWeek} />
            </ChartCard>
            <ChartCard title="Grade distribution" subtitle="All assessments">
              <CategoryBarChart data={data.gradeDistribution} />
            </ChartCard>
          </div>

          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="text-sm font-medium">Top performers this month</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {["Wanjiru Kamau · 96%", "Brian Otieno · 93%", "Faith Mwangi · 91%"].map(
                  (entry) => (
                    <div
                      key={entry}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {entry.charAt(0)}
                      </span>
                      {entry}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
