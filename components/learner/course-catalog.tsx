"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Clock, Code2, PlayCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { courseService } from "@/services/courses";
import { cn } from "@/lib/utils";

/** One flat color per card, matching the learner portal's playful palette. */
const CARD_COLORS = [
  "bg-orange-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-pink-500",
];

const formatMinutes = (total: number) => {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/** Course catalog — browse available courses and enrol. */
export function CourseCatalog() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["course-catalog"],
    queryFn: () => courseService.catalog(),
  });

  const enroll = useMutation({
    mutationFn: (courseId: string) => courseService.enroll(courseId),
    onSuccess: () => {
      toast.success("You're enrolled — happy learning!");
      void queryClient.invalidateQueries({ queryKey: ["course-catalog"] });
      void queryClient.invalidateQueries({ queryKey: ["learner-dashboard"] });
    },
    onError: () => toast.error("Could not enrol in this course."),
  });

  const courses = useMemo(() => {
    const all = data?.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.programme.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course catalog"
        description="Pick a course, enrol, and start learning right away."
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-52 pl-8 sm:w-64"
            />
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-2 w-16 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">Could not load the course catalog.</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {search ? "No courses match your search." : "No courses available yet."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => {
            const color = CARD_COLORS[index % CARD_COLORS.length];
            const isEnrolled = course.enrolled;
            return (
              <Card
                key={course.id}
                className="group overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className={cn("h-1.5 w-full", color)} aria-hidden />
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {course.programme || "Programme"}
                    </span>
                    {course.coding ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Code2 className="h-3.5 w-3.5" aria-hidden />
                        coding
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-base font-semibold tracking-tight">{course.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                      {course.lessons_count} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {formatMinutes(course.total_minutes)}
                    </span>
                  </div>

                  {isEnrolled && course.progress !== null ? (
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.progress}% complete</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full", color)}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-auto pt-1">
                    {isEnrolled ? (
                      <Button asChild className="w-full" variant="outline">
                        <Link href={`/learner/courses/${course.id}`}>
                          Continue
                          <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        disabled={enroll.isPending}
                        onClick={() => enroll.mutate(course.id)}
                      >
                        {enroll.isPending ? "Enrolling…" : "Enrol"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
