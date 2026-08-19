"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Download,
  PlayCircle,
  Target,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { courseService, type CourseCatalogItem } from "@/services/courses";
import { getProgramme } from "@/lib/programmes";

const MODULE_ACCENTS = ["#f47945", "#6f3b8d", "#248c7b", "#d97706"];

const formatMinutes = (total: number) => {
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

function matchesProgramme(course: CourseCatalogItem, programme: NonNullable<ReturnType<typeof getProgramme>>) {
  return programme.catalogueKeys?.includes(course.programme_id) || course.programme.toLowerCase() === programme.title.toLowerCase();
}

export function LearnerProgrammePage({ slug }: { slug: string }) {
  const programme = getProgramme(slug);
  const queryClient = useQueryClient();
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  const coursesQuery = useQuery({
    queryKey: ["learner-programme", slug],
    queryFn: () => courseService.catalog(),
    enabled: Boolean(programme),
  });

  const courses = useMemo(
    () => (coursesQuery.data?.data ?? []).filter((course) => programme && matchesProgramme(course, programme)).sort((a, b) => a.sequence - b.sequence),
    [coursesQuery.data?.data, programme]
  );

  const enrol = useMutation({
    mutationFn: (courseId: string) => courseService.enroll(courseId),
    onMutate: (courseId) => setEnrollingCourseId(courseId),
    onSuccess: () => {
      toast.success("You're enrolled — happy learning!");
      void queryClient.invalidateQueries({ queryKey: ["learner-programme", slug] });
      void queryClient.invalidateQueries({ queryKey: ["course-catalog"] });
      void queryClient.invalidateQueries({ queryKey: ["learner-dashboard"] });
    },
    onError: () => toast.error("Could not enrol in this course."),
    onSettled: () => setEnrollingCourseId(null),
  });

  if (!programme) return null;

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons_count, 0);
  const enrolledCount = courses.filter((course) => course.enrolled).length;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title={programme.title}
        description={programme.short}
        actions={
          <Button asChild variant="outline" className="rounded-md border-[#4d176e]/25 bg-white hover:border-[#f47945] hover:bg-[#fff7f2]">
            <Link href="/learner/courses"><ArrowLeft className="mr-1.5 h-4 w-4" /> All programmes</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#eadfe9] py-3 text-xs font-medium text-[#6e6072]">
        <span><strong className="text-[#4d176e]">{courses.length}</strong> courses</span>
        <span><strong className="text-[#4d176e]">{totalLessons}</strong> lessons</span>
        <span><strong className="text-[#4d176e]">{programme.duration}</strong></span>
        <span><strong className="text-[#4d176e]">{enrolledCount}</strong> active</span>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b94920]">Course sequence</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#151116]">All courses in this programme</h2></div><span className="hidden text-xs font-medium text-[#6e6072] sm:block">{courses.length} courses</span></div>

        {coursesQuery.isLoading ? <div className="border border-dashed border-[#d9cbdc] bg-white p-8 text-center text-sm text-[#6e6072]">Loading your live course sequence…</div> : null}
        {coursesQuery.isError ? <div className="border border-[#f47945]/30 bg-[#fff7f2] p-8 text-center text-sm text-[#6e6072]">We could not load this programme. Please refresh and try again.</div> : null}
        {!coursesQuery.isLoading && !coursesQuery.isError && courses.length === 0 ? <div className="border border-dashed border-[#d9cbdc] bg-white p-8 text-center text-sm text-[#6e6072]">No live courses are available for this programme yet.</div> : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const accent = MODULE_ACCENTS[(course.sequence - 1) % MODULE_ACCENTS.length];
            const progress = course.progress ?? 0;
            return (
              <Card key={course.id} className="group flex h-full flex-col overflow-hidden rounded-xl border-[#f47945]/25 bg-white shadow-[0_10px_25px_rgba(77,23,110,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#f47945] hover:shadow-[0_16px_36px_rgba(77,23,110,0.1)]">
                <div className="h-1.5" style={{ backgroundColor: accent }} aria-hidden />
                <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-black" style={{ backgroundColor: `${accent}18`, color: accent }}>{String(course.sequence).padStart(2, "0")}</span>{course.enrolled ? <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">In progress</span> : null}</div>
                  <div><h3 className="text-lg font-semibold leading-tight tracking-[-0.03em] text-[#151116]">{course.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6e6072]">{course.summary}</p></div>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-[#6e6072]"><span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden />{course.lessons_count} lessons</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden />{formatMinutes(course.total_minutes)}</span>{course.video_count ? <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden />{course.video_count} videos</span> : null}{course.resource_count ? <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" aria-hidden />{course.resource_count} resources</span> : null}</div>
                  <div className="rounded-lg bg-[#fbf8fd] p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-[#4d176e]"><Target className="h-3.5 w-3.5" aria-hidden />Build outcome</div><p className="mt-1.5 line-clamp-2 text-sm leading-5 text-[#3f3445]">{course.project || course.deliverable || course.outcomes[0]}</p></div>
                  {course.enrolled ? <div><div className="mb-1.5 flex items-center justify-between text-[11px] text-[#6e6072]"><span>{progress}% complete</span><span>{progress >= 100 ? "Complete" : "Keep going"}</span></div><div className="h-2 overflow-hidden rounded-sm bg-[#f2eaf4]"><div className="h-full rounded-sm transition-all" style={{ width: `${progress}%`, backgroundColor: accent }} /></div></div> : null}
                  <div className="mt-auto flex flex-col gap-2 pt-1"><Button asChild className="w-full rounded-md bg-[#4d176e] hover:bg-[#351039]"><Link href={`/learner/courses/${course.id}`}>{course.enrolled ? (progress > 0 ? "Continue course" : "Start course") : "View course"}<ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /></Link></Button>{!course.enrolled ? <Button className="w-full rounded-md bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]" disabled={enrollingCourseId === course.id} onClick={() => enrol.mutate(course.id)}>{enrollingCourseId === course.id ? "Enrolling…" : "Enrol now"}</Button> : null}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default LearnerProgrammePage;
