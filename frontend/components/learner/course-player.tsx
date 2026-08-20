"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Download,
  ExternalLink,
  FileText,
  ListChecks,
  PenLine,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { CodingPlayground, type Language } from "@/components/modules/coding-playground";
import { ScratchWorkspace } from "@/components/modules/scratch-workspace";
import { LessonAlignedContent, LessonNotesBody } from "@/components/learner/lesson-notes";
import { Textarea } from "@/components/ui/textarea";
import { courseService } from "@/services/courses";
import { cn } from "@/lib/utils";

/** Extract a YouTube video id from watch / youtu.be / shorts / embed URLs. */
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/** Video stage — YouTube embeds, direct video files, or a friendly placeholder. */
function VideoStage({
  lesson,
  completed,
}: {
  lesson: { title: string; video_url: string; description: string };
  completed: boolean;
}) {
  const youTubeId = getYouTubeId(lesson.video_url);
  if (youTubeId) {
    return (
      <div className="overflow-hidden rounded-xl bg-black">
        <iframe
          key={youTubeId}
          src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    );
  }
  if (lesson.video_url) {
    return (
      <video
        key={lesson.video_url}
        src={lesson.video_url}
        controls
        className="aspect-video w-full rounded-xl bg-black"
      />
    );
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/40 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PlayCircle className="h-7 w-7" aria-hidden />
      </span>
      <div>
        <p className="text-sm font-medium">Video coming soon</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          This lesson&apos;s video is being prepared. In the meantime, read the lesson notes below.
        </p>
      </div>
      {completed ? (
        <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          Lesson completed
        </span>
      ) : null}
    </div>
  );
}

interface StepDef {
  id: string;
  label: string;
}

/** Single-course player — lessons broken into digestible steps with navigation. */
export function CoursePlayer({ courseId }: { courseId: string }) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [submissionText, setSubmissionText] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.detail(courseId),
    enabled: Boolean(courseId),
  });

  const course = data?.data;
  const lessons = useMemo(
    () => [...(course?.lessons ?? [])].sort((a, b) => a.order - b.order),
    [course]
  );
  const enrolment = course?.enrolment ?? null;
  const completedSet = useMemo(
    () => new Set(enrolment?.completed_lessons ?? []),
    [enrolment]
  );

  // Default selection: first incomplete lesson, else the first lesson.
  const selected =
    lessons.find((l) => l.id === (selectedId ?? enrolment?.next_lesson)) ??
    lessons.find((l) => !completedSet.has(l.id)) ??
    lessons[0];

  useEffect(() => {
    if (!selectedId && selected) setSelectedId(selected.id);
  }, [selectedId, selected]);

  // Reset the step tracker whenever the lesson changes.
  useEffect(() => {
    setStepIndex(0);
    setSubmissionText(selected?.submission?.response_text ?? "");
    setEvidenceUrl(selected?.submission?.evidence_url ?? "");
  }, [selected?.id, selected?.submission?.evidence_url, selected?.submission?.response_text]);

  /* A learner sees the video and lesson notes together, followed by practice. */
  const steps = useMemo<StepDef[]>(() => {
    const list: StepDef[] = [{ id: "watch", label: "Watch & notes" }];
    if (selected?.assignment) list.push({ id: "assignment", label: "Practice" });
    return list;
  }, [selected]);

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isLastStep = stepIndex >= steps.length - 1;
  const selectedIndex = lessons.findIndex((l) => l.id === selected?.id);
  const prevLesson = selectedIndex > 0 ? lessons[selectedIndex - 1] : null;
  const nextLesson = selectedIndex >= 0 ? lessons[selectedIndex + 1] : null;
  const isLessonCompleted = selected ? completedSet.has(selected.id) : false;

  const enroll = useMutation({
    mutationFn: () => courseService.enroll(courseId),
    onSuccess: () => {
      toast.success("You're enrolled — happy learning!");
      void queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      void queryClient.invalidateQueries({ queryKey: ["course-catalog"] });
    },
    onError: () => toast.error("Could not enrol in this course."),
  });

  const complete = useMutation({
    mutationFn: (lessonId: string) => courseService.completeLesson(courseId, lessonId),
    onSuccess: () => {
      toast.success("Lesson completed!");
      void queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      void queryClient.invalidateQueries({ queryKey: ["course-catalog"] });
      void queryClient.invalidateQueries({ queryKey: ["learner-dashboard"] });
      // Auto-advance to the next lesson when there is one.
      if (nextLesson && selected) {
        setSelectedId(nextLesson.id);
        setStepIndex(0);
      }
    },
    onError: () => toast.error("Could not mark this lesson as complete."),
  });

  const submit = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error("Select a lesson before submitting.");
      return courseService.submitAssignment(courseId, selected.id, {
        response_text: submissionText,
        evidence_url: evidenceUrl || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Assignment submitted. Your work is saved.");
      void queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      void queryClient.invalidateQueries({ queryKey: ["learner-dashboard"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not submit this assignment.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return <p className="text-sm text-muted-foreground">Could not load this course.</p>;
  }



  const goToStep = (index: number) =>
    setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title={course.title}
        description={course.description}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/learner/courses">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Back to catalog
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden rounded-[1rem] border-black/[0.06] shadow-none">
        <div className="h-1 bg-[#4d176e]" />
        <CardContent className="p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b94920]">Course brief</p>
                <span className="text-xs text-muted-foreground">{course.level ?? "Applied"}</span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{course.summary ?? course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>{course.resource_count ?? lessons.length} learning resources</span>
                <span className="text-[#f47945]" aria-hidden>•</span>
                <span>{course.video_count ?? 0} videos</span>
                {course.duration_weeks ? <><span className="text-[#f47945]" aria-hidden>•</span><span>{course.duration_weeks} weeks</span></> : null}
                {course.trend_tags?.slice(0, 2).map((tag) => <span key={tag} className="text-[#b94920]">{tag}</span>)}
              </div>
            </div>

          </div>

          <div className="mt-6 grid gap-6 border-t border-border pt-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">By the end, you can</p>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {(course.outcomes ?? []).slice(0, 4).map((outcome) => (
                  <li key={outcome} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#f47945]/40 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Evidence of work</p>
              <p className="mt-2 text-sm font-medium leading-6">{course.project ?? course.deliverable ?? "A practical project you can explain and improve."}</p>
              {course.skills?.length ? <p className="mt-2 text-xs leading-5 text-muted-foreground">Skills: {course.skills.slice(0, 5).join(" · ")}</p> : null}
            </div>
          </div>

          {course.course_materials?.length ? (
            <div className="mt-6 border-t border-border pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Course files</p>
                  <p className="mt-1 text-xs text-muted-foreground">Download the materials attached to this course.</p>
                </div>
                <FileText className="h-4 w-4 text-[#f47945]" aria-hidden />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {course.course_materials.map((material) => {
                  const href = material.download_url || material.url;
                  const isExternal = href.startsWith("http");
                  return (
                    <a
                      key={material.id}
                      href={href}
                      download={!isExternal}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      className="group flex min-w-0 items-start gap-2 border border-border bg-background px-3 py-2.5 hover:border-[#f47945]/60 hover:bg-[#fffaf7]"
                    >
                      <Download className="mt-0.5 h-4 w-4 shrink-0 text-[#f47945]" aria-hidden />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-foreground group-hover:text-[#b94920]">{material.title}</span>
                        {material.description ? <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-muted-foreground">{material.description}</span> : null}
                        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4d176e]">PDF download</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Progress */}
      {enrolment ? (
        <Card className="rounded-[1.25rem] border-black/[0.06] shadow-sm">
          <CardContent className="p-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Course progress</span>
              <span className="font-medium">{enrolment.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-orange-500 transition-all"
                style={{ width: `${enrolment.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[1.25rem] border-black/[0.06] shadow-sm">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">You&apos;re not enrolled yet</p>
              <p className="text-xs text-muted-foreground">
                Enrol to unlock the lessons, videos and progress tracking.
              </p>
            </div>
            <Button disabled={enroll.isPending} onClick={() => enroll.mutate()}>
              {enroll.isPending ? "Enrolling…" : "Enrol in this course"}
            </Button>
          </CardContent>
        </Card>
      )}

      {enrolment ? (
        <>
          <div className="grid items-start gap-4 lg:grid-cols-[248px_minmax(0,1fr)]">
            {/* Lesson list */}
            <Card className="rounded-[1.5rem] border-black/[0.06] shadow-sm lg:sticky lg:top-5">
              <CardContent className="p-3">
                <p className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {lessons.length} lessons
                </p>
                <ul className="max-h-[34rem] space-y-1 overflow-y-auto pr-1">
                  {lessons.map((lesson, index) => {
                    const done = completedSet.has(lesson.id);
                    const active = selected?.id === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(lesson.id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                              active
                              ? "bg-[#f4ecf8] text-[#4d176e] shadow-sm"
                              : "text-muted-foreground hover:bg-[#fbf8fd] hover:text-foreground"
                          )}
                        >
                          {done ? (
                            <CheckCircle2
                              className="h-4 w-4 shrink-0 text-emerald-500"
                              aria-hidden
                            />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0" aria-hidden />
                          )}
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block truncate text-sm",
                                done && "text-muted-foreground"
                              )}
                            >
                              <span className="mr-1.5 text-xs text-muted-foreground">
                                {index + 1}.
                              </span>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration_minutes} min
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            {/* Lesson content: stepped */}
            <div className="space-y-4">
              {selected ? (
                <>
                  <Card className="rounded-[1.5rem] border-black/[0.06] shadow-sm">
                    <CardContent className="space-y-4 p-4 sm:p-5">
                      {/* Step tracker */}
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            {selected.order}. {selected.title}
                          </p>
                          <span className="shrink-0 text-xs font-medium text-muted-foreground">
                            Step {Math.min(stepIndex + 1, steps.length)} of {steps.length}
                          </span>
                        </div>
                        <div
                          className="flex gap-1.5 overflow-x-auto pb-1"
                          role="tablist"
                          aria-label="Lesson steps"
                        >
                          {steps.map((step, idx) => {
                            const activeStep = idx === stepIndex;
                            const doneStep = idx < stepIndex;
                            return (
                              <button
                                key={step.id}
                                type="button"
                                role="tab"
                                aria-selected={activeStep}
                                onClick={() => goToStep(idx)}
                                title={step.label}
                                className={cn(
                                  "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                                  activeStep
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : doneStep
                                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                                )}
                              >
                                {doneStep ? (
                                  <Check className="h-3 w-3" aria-hidden />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                                <span className="max-w-28 truncate">{step.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step body */}
                      {currentStep?.id === "watch" ? (
                        <div className="space-y-5">
                          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-[#4d176e]" aria-hidden />
                                <h3 className="text-sm font-semibold text-foreground">Slide lesson</h3>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                The teaching content comes first. Use the smaller video companion only when it helps you understand the lesson.
                              </p>
                            </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#4d176e]" aria-hidden /> {selected.duration_minutes} min</span>
                                <a href={`/api/v1/courses/${course.id}/lesson-pack`} download className="inline-flex items-center gap-1.5 font-semibold text-[#4d176e] hover:text-[#b94920]">
                                  <Download className="h-3.5 w-3.5" aria-hidden /> Download notes
                                </a>
                              </div>
                          </div>

                          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start">
                            <div className="min-w-0 border border-[#4d176e]/15 bg-[#fffdfb] px-4 py-4 sm:px-7 sm:py-7">
                              <LessonAlignedContent content={selected.lesson_content} fallbackNotes={selected.notes} />
                            </div>

                            <aside className="space-y-3 xl:sticky xl:top-6">
                              <div className="border border-[#4d176e]/15 bg-[#fbf8fd] p-3">
                                <div className="mb-3 flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Optional companion</p>
                                    <h4 className="mt-1 text-sm font-semibold text-foreground">Watch the video</h4>
                                  </div>
                                  <PlayCircle className="h-4 w-4 shrink-0 text-[#b94920]" aria-hidden />
                                </div>
                                <div className="overflow-hidden border border-black/10 bg-black">
                                  <VideoStage lesson={selected} completed={isLessonCompleted} />
                                </div>
                                <div className="mt-3 space-y-2">
                                  <p className="text-xs leading-5 text-muted-foreground">Watch a short explanation, then return to the slide lesson to work through the examples and checks.</p>
                                  {selected.video_url ? (
                                    <a
                                      href={selected.video_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4d176e] hover:text-[#b94920]"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                                      Open source video
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                              <div className="border-l-4 border-[#f47945] bg-[#fff8f4] px-3 py-2.5 text-xs leading-5 text-[#7b3218]">
                                <p className="font-semibold">Learn actively</p>
                                <p className="mt-1">Pause after each section and try the example before moving to practice.</p>
                              </div>
                            </aside>
                          </div>

                          {selected.resources?.length ? (
                            <div className="rounded-2xl border border-[#4d176e]/10 bg-[#fbf8fd] p-3">
                              <div className="mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#4d176e]" aria-hidden />
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Lesson resources</p>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {selected.resources.map((resource) => {
                                  const href = resource.download_url || resource.url;
                                  const isExternal = href.startsWith("http");
                                  const isDownload = Boolean(resource.download_url) || resource.type === "download";
                                  return (
                                    <a
                                      key={resource.id}
                                      href={href}
                                      download={isDownload ? true : undefined}
                                      target={isExternal ? "_blank" : undefined}
                                      rel={isExternal ? "noreferrer" : undefined}
                                      className="group flex items-start gap-2 rounded-lg border bg-background p-2.5 transition-colors hover:border-[#f47945]/60 hover:bg-[#fffaf7]"
                                    >
                                      {isDownload ? (
                                        <Download className="mt-0.5 h-4 w-4 shrink-0 text-[#f47945]" aria-hidden />
                                      ) : (
                                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[#4d176e]" aria-hidden />
                                      )}
                                      <span className="min-w-0">
                                        <span className="block text-xs font-medium text-foreground group-hover:text-[#b94920]">{resource.title}</span>
                                        {resource.description ? <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{resource.description}</span> : null}
                                      </span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                          <div className="flex items-center gap-2">
                            <Button
                              disabled={isLessonCompleted || complete.isPending}
                              onClick={() => complete.mutate(selected.id)}
                            >
                              {isLessonCompleted ? (
                                <>
                                  <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden />
                                  Completed
                                </>
                              ) : complete.isPending ? (
                                "Saving…"
                              ) : (
                                "Mark lesson as complete"
                              )}
                            </Button>
                            {enrolment.next_lesson === selected.id ? (
                              <span className="text-xs text-muted-foreground">
                                Next up in your course
                              </span>
                            ) : null}
                          </div>
                        </div>
                                            ) : null}

                      {currentStep?.id === "assignment" && selected.assignment ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 rounded-xl border border-[#f47945]/35 bg-[#fffaf7] p-4">
                            <PenLine className="h-4 w-4 shrink-0 text-[#b94920]" aria-hidden />
                            <div>
                              <h3 className="text-sm font-semibold">Your assignment</h3>
                              <p className="mt-0.5 text-xs text-muted-foreground">Complete the task, then save your work below so you can return to it later.</p>
                            </div>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-4">
                            <LessonNotesBody body={selected.assignment} />
                          </div>
                          {course.coding ? (
                            <div className="flex items-start gap-2 rounded-lg border-l-4 border-orange-400 bg-orange-50 px-3 py-2.5 text-sm text-orange-900">
                              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                              <p>
                                Build your answer in the coding workspace below, then describe what you built and what you learned in the submission box.
                              </p>
                            </div>
                          ) : null}
                          <div className="space-y-3 rounded-xl border border-[#4d176e]/15 bg-[#fbf8fd] p-4">
                            <div>
                              <label htmlFor={`submission-${selected.id}`} className="text-sm font-semibold text-foreground">Submit your work</label>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">Write at least 20 characters describing your solution, process, or reflection. You can update your submission later.</p>
                            </div>
                            <Textarea
                              id={`submission-${selected.id}`}
                              value={submissionText}
                              onChange={(event) => setSubmissionText(event.target.value)}
                              placeholder="What did you build or discover? What would you improve next?"
                              rows={6}
                              disabled={submit.isPending}
                              aria-describedby={`submission-help-${selected.id}`}
                            />
                            <div>
                              <label htmlFor={`evidence-${selected.id}`} className="text-xs font-semibold text-foreground">Evidence link (optional)</label>
                              <input
                                id={`evidence-${selected.id}`}
                                type="url"
                                value={evidenceUrl}
                                onChange={(event) => setEvidenceUrl(event.target.value)}
                                placeholder="https://github.com/... or https://your-project.example"
                                disabled={submit.isPending}
                                className="mt-1 flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                              />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#4d176e]/10 pt-3">
                              <p id={`submission-help-${selected.id}`} className="text-xs text-muted-foreground">
                                {selected.submission ? `Last saved ${new Date(selected.submission.submitted_at).toLocaleDateString()}` : `${submissionText.trim().length}/20 characters minimum`}
                              </p>
                              <Button
                                type="button"
                                onClick={() => submit.mutate()}
                                disabled={submit.isPending || submissionText.trim().length < 20}
                                className="bg-[#4d176e] text-white hover:bg-[#35104f]"
                              >
                                {submit.isPending ? "Saving…" : selected.submission ? "Update submission" : "Submit assignment"}
                              </Button>
                            </div>
                          </div>
                          {selected.submission ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                                  <p className="text-sm font-semibold text-emerald-900">Assignment submitted</p>
                                </div>
                                <span className="text-xs text-emerald-800">{new Date(selected.submission.submitted_at).toLocaleString()}</span>
                              </div>
                              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-emerald-950">{selected.submission.response_text}</p>
                              {selected.submission.evidence_url ? (
                                <a href={selected.submission.evidence_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-[#4d176e] underline underline-offset-2 hover:text-[#b94920]">Open submitted evidence</a>
                              ) : null}
                              {selected.submission.feedback ? <p className="mt-3 border-t border-emerald-200 pt-3 text-xs leading-5 text-emerald-900"><strong>Feedback:</strong> {selected.submission.feedback}</p> : null}
                            </div>
                          ) : null}
                          <Button
                            size="lg"
                            disabled={!selected.submission || isLessonCompleted || complete.isPending}
                            onClick={() => complete.mutate(selected.id)}
                            className="w-full sm:w-auto"
                          >
                            {isLessonCompleted ? (
                              <>
                                <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden />
                                Lesson completed
                              </>
                            ) : complete.isPending ? (
                              "Saving…"
                            ) : !selected.submission ? (
                              <>
                                <ListChecks className="mr-1.5 h-4 w-4" aria-hidden />
                                Submit work to complete lesson
                              </>
                            ) : (
                              <>
                                <ListChecks className="mr-1.5 h-4 w-4" aria-hidden />
                                Mark lesson complete
                              </>
                            )}
                          </Button>
                        </div>
                      ) : null}

                      {/* Step navigation */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={stepIndex === 0}
                          onClick={() => goToStep(stepIndex - 1)}
                        >
                          <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden />
                          Back
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isLastStep}
                          onClick={() => goToStep(stepIndex + 1)}
                        >
                          Next
                          <ChevronRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lesson navigation */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={selected.id} onValueChange={setSelectedId}>
                      <SelectTrigger size="sm" className="max-w-56">
                        <SelectValue placeholder="Jump to lesson…" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessons.map((lesson, index) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {index + 1}. {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="ml-auto flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!prevLesson}
                        onClick={() => prevLesson && setSelectedId(prevLesson.id)}
                      >
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden />
                        Previous lesson
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!nextLesson}
                        onClick={() => nextLesson && setSelectedId(nextLesson.id)}
                      >
                        Next lesson
                        <ChevronRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select a lesson to start learning.</p>
              )}
            </div>
          </div>

          {/* Connected coding workspace */}
          {course.coding ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
                <h3 className="text-sm font-semibold">Coding workspace</h3>
                <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  connected to this course
                </span>
              </div>
              {course.workspace_type === "scratch" ? (
                <ScratchWorkspace />
              ) : (
                <CodingPlayground
                  initialLanguage={
                    (course.playground_language as Language | null) ?? "html"
                  }
                />
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
