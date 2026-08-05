"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/shared/page-header";
import { resourceService, type ResourceRow } from "@/services/resources";
import { cn } from "@/lib/utils";

function isUpcoming(row: ResourceRow): boolean {
  const date = new Date(String(row.date ?? ""));
  return date.getTime() >= Date.now() - 86400000;
}

/** Learner calendar — month view with upcoming classes listed. */
export function LearnerCalendar() {
  const { data, isLoading } = useQuery({
    queryKey: ["calendar", "classes"],
    queryFn: () => resourceService.list("classes", { per_page: 100 }),
  });

  const upcoming = (data?.data ?? []).filter(isUpcoming).slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Your class schedule, events and deadlines."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
              This month
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <Calendar mode="single" className="rounded-md border" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading schedule…</p>
            ) : upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming classes scheduled.
              </p>
            ) : (
              upcoming.map((row) => {
                const day = new Date(String(row.date ?? "")).toLocaleDateString("en", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={String(row.id)}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary"
                      )}
                    >
                      <Clock className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{String(row.course)}</p>
                      <p className="text-xs text-muted-foreground">
                        {day} · {String(row.start_time).slice(0, 5)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {String(row.venue)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
