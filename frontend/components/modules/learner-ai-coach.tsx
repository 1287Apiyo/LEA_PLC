"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { courseService, type CourseDetail, type CourseLesson } from "@/services/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type CoachResponse = {
  data: {
    answer: string;
    source?: string;
  };
};

const starterPrompts = [
  "Explain the key idea in this lesson in simpler words.",
  "Give me a small hint for the assignment without doing it for me.",
  "What should I practise next to build confidence?",
];

function welcomeMessage(courseTitle?: string) {
  return courseTitle
    ? `I’m your LEA Learning Coach for ${courseTitle}. Ask about the selected lesson, request a simpler explanation, or get a hint for your practice. I’ll guide your thinking without completing assessed work for you.`
    : "I’m your LEA Learning Coach. Choose an enrolled course to ground our conversation in your lesson notes, then ask for an explanation, hint, study plan, or debugging question.";
}

export function LearnerAiCoach() {
  const catalogQuery = useQuery({
    queryKey: ["learner-ai-coach", "catalog"],
    queryFn: () => courseService.catalog(),
    staleTime: 5 * 60 * 1000,
  });
  const enrolledCourses = useMemo(
    () => (catalogQuery.data?.data ?? []).filter((course) => course.enrolled),
    [catalogQuery.data?.data]
  );

  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: welcomeMessage() },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const detailQuery = useQuery({
    queryKey: ["learner-ai-coach", "course", courseId],
    queryFn: () => courseService.detail(courseId),
    enabled: Boolean(courseId),
    staleTime: 5 * 60 * 1000,
  });
  const course: CourseDetail | null = detailQuery.data?.data ?? null;
  const lessons: CourseLesson[] = useMemo(() => course?.lessons ?? [], [course?.lessons]);
  const selectedLesson = lessons.find((lesson) => lesson.id === lessonId) ?? lessons[0];
  const selectedCourse = enrolledCourses.find((item) => item.id === courseId);

  useEffect(() => {
    if (!courseId && enrolledCourses[0]) setCourseId(enrolledCourses[0].id);
  }, [courseId, enrolledCourses]);

  useEffect(() => {
    if (lessons.length && !lessons.some((lesson) => lesson.id === lessonId)) {
      setLessonId(lessons[0].id);
    }
  }, [lessonId, lessons]);

  useEffect(() => {
    setMessages([{ id: `welcome-${courseId || "general"}`, role: "assistant", content: welcomeMessage(selectedCourse?.title) }]);
    setError("");
  }, [courseId, selectedCourse?.title]);

  function selectCourse(nextCourseId: string) {
    setCourseId(nextCourseId);
    setLessonId("");
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const message = draft.trim();
    if (!message || isSending) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: message };
    const history = messages.slice(-8);
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const response = await api.post<CoachResponse>("/learner/ai-coach", {
        message,
        courseId: courseId || undefined,
        lessonId: selectedLesson?.id || undefined,
        history,
      });
      setMessages((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, role: "assistant", content: response.data.answer },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The AI Coach could not respond. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function resetConversation() {
    setMessages([{ id: `welcome-${courseId || "general"}-${Date.now()}`, role: "assistant", content: welcomeMessage(selectedCourse?.title) }]);
    setError("");
  }

  const isLoadingContext = Boolean(courseId) && detailQuery.isLoading;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-[#1f0d2e] px-6 py-8 text-white shadow-[0_18px_50px_rgba(31,13,46,0.18)] sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#f47945]/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f8b49a]"><BrainCircuit className="h-4 w-4" aria-hidden />LEA AI Learning Coach</div>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Get unstuck without losing the learning.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">Ask for clearer explanations, practical hints, debugging questions, and a next step grounded in the LEA Labs course you are taking.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/75 lg:pb-1"><Sparkles className="h-5 w-5 text-[#f47945]" aria-hidden /><span>Course-aware guidance</span></div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <Card className="border-[#d9c6e1] bg-[#fffdfb]">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm font-medium"><BookOpen className="h-4 w-4 text-[#f47945]" aria-hidden />Learning context</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {catalogQuery.isLoading ? <Skeleton className="h-10 w-full" /> : enrolledCourses.length ? <label className="block text-xs font-medium text-muted-foreground">Course<select value={courseId} onChange={(event) => selectCourse(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-[#d9c6e1] bg-white px-3 text-sm text-[#151116] outline-none focus:border-[#f47945] focus:ring-2 focus:ring-[#f47945]/20"><option value="">Choose a course</option>{enrolledCourses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label> : <p className="text-sm leading-6 text-muted-foreground">Enrol in a course to unlock grounded lesson guidance.</p>}
              {isLoadingContext ? <Skeleton className="h-10 w-full" /> : lessons.length ? <label className="block text-xs font-medium text-muted-foreground">Lesson<select value={selectedLesson?.id ?? ""} onChange={(event) => setLessonId(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-[#d9c6e1] bg-white px-3 text-sm text-[#151116] outline-none focus:border-[#f47945] focus:ring-2 focus:ring-[#f47945]/20">{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.order}. {lesson.title}</option>)}</select></label> : null}
              {selectedLesson ? <div className="rounded-2xl bg-[#f6eef9] p-3"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Current focus</p><p className="mt-1 text-sm font-semibold text-[#151116]">{selectedLesson.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{selectedLesson.description || "Ask questions about the concepts, practice, or assignment."}</p></div> : null}
              <Button variant="outline" size="sm" className="w-full rounded-full" onClick={resetConversation}><RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />Reset conversation</Button>
            </CardContent>
          </Card>

          <Card className="border-[#f47945]/35 bg-[#fffaf7]">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Lightbulb className="h-4 w-4 text-[#b94920]" aria-hidden />Good questions to ask</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm leading-5 text-muted-foreground"><p>“What is the difference between these two concepts?”</p><p>“What should I check first in this error?”</p><p>“Can you help me plan my practice time?”</p></CardContent>
          </Card>
        </aside>

        <Card className="flex min-h-[640px] flex-col overflow-hidden border-[#d9c6e1] bg-white">
          <CardHeader className="flex-row items-center justify-between border-b border-[#eee5f1] bg-[#fffdfb] pb-4">
            <div><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-4 w-4 text-[#4d176e]" aria-hidden />Coach conversation</CardTitle><p className="mt-1 text-xs text-muted-foreground">{selectedCourse?.title ?? "General learning support"}{selectedLesson ? ` · ${selectedLesson.title}` : ""}</p></div>
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden />Hints, not shortcuts</div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite">
              {messages.map((message) => <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}><div className={cn("max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[78%]", message.role === "user" ? "rounded-br-md bg-[#4d176e] text-white" : "rounded-bl-md bg-[#f6eef9] text-[#25172a]")}><p className="whitespace-pre-wrap">{message.content}</p></div></div>)}
              {isSending ? <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-[#f6eef9] px-4 py-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Thinking through your lesson context…</div></div> : null}
            </div>

            <div className="border-t border-[#eee5f1] pt-4">
              <div className="mb-3 flex flex-wrap gap-2">{starterPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="rounded-full border border-[#d9c6e1] bg-white px-3 py-1.5 text-xs font-medium text-[#4d176e] transition hover:border-[#f47945] hover:bg-[#fffaf7]">{prompt}</button>)}</div>
              {error ? <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
              <form onSubmit={sendMessage} className="flex items-end gap-2 rounded-2xl border border-[#d9c6e1] bg-[#fffdfb] p-2 focus-within:border-[#f47945] focus-within:ring-2 focus-within:ring-[#f47945]/15"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKeyDown} rows={2} maxLength={1200} placeholder="Ask about the lesson, your code, or your next practice step…" className="min-h-[58px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 text-[#151116] outline-none placeholder:text-muted-foreground" aria-label="Ask the LEA AI Learning Coach" /><Button type="submit" disabled={!draft.trim() || isSending} className="rounded-xl bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]" aria-label="Send question"><Send className="h-4 w-4" aria-hidden /></Button></form>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">The Coach supports your learning. Verify important decisions with your instructor and never share passwords or private personal information.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d9c6e1] bg-[#fffdfb] px-4 py-3 text-sm"><p className="text-muted-foreground">Need human guidance instead?</p><Button asChild variant="outline" size="sm" className="rounded-full"><Link href="/learner/tutor-sessions">Request a tutor session <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden /></Link></Button></div>
    </div>
  );
}
