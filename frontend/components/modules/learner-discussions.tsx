"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Megaphone, Reply, Send } from "lucide-react";
import { api } from "@/lib/api-client";
import { useLearnerDashboard } from "@/hooks/use-dashboard";
import { type ResourceRow } from "@/services/resources";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DiscussionThread extends ResourceRow {
  threadId?: unknown;
  parentId?: unknown;
  replies?: ResourceRow[];
  replyCount?: number;
}

interface DiscussionResponse {
  data: DiscussionThread[];
}

function formatDate(value: unknown) {
  const date = new Date(String(value ?? ""));
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString("en", { dateStyle: "medium" });
}

function authorLabel(row: ResourceRow) {
  return `${String(row.authorName ?? "LEA learner")} · ${String(row.authorRole ?? "learner")}`;
}

export function LearnerDiscussions() {
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading: dashboardLoading } = useLearnerDashboard();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [replyOpen, setReplyOpen] = useState("");
  const [replyText, setReplyText] = useState("");
  const courses = dashboard?.myCourses ?? [];
  const activeCourseId = selectedCourse || courses[0]?.id || "";
  const activeCourse = courses.find((course) => course.id === activeCourseId);

  const discussionsQuery = useQuery({
    queryKey: ["learner-discussions", activeCourseId],
    queryFn: () => api.get<DiscussionResponse>(`/learner/discussions?courseId=${encodeURIComponent(activeCourseId)}`),
    enabled: Boolean(activeCourseId),
  });

  const postMutation = useMutation({
    mutationFn: () => api.post<{ data: ResourceRow }>("/learner/discussions", {
      courseId: activeCourseId,
      title: title.trim(),
      content: content.trim(),
      kind: "question",
    }),
    onSuccess: () => {
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["learner-discussions", activeCourseId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ rootId, content: replyContent }: { rootId: string; threadKey: string; content: string }) =>
      api.post<{ data: ResourceRow }>("/learner/discussions", {
        courseId: activeCourseId,
        parentId: rootId,
        content: replyContent,
        kind: "reply",
      }),
    onSuccess: (_, variables) => {
      setReplyText("");
      setReplyOpen(variables.threadKey);
      queryClient.invalidateQueries({ queryKey: ["learner-discussions", activeCourseId] });
    },
  });

  const rows = discussionsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Course discussions" description="Ask questions, compare approaches, and follow guidance from your instructor and peers." />
      {dashboardLoading ? <Card><CardContent className="p-8 text-sm text-muted-foreground">Loading your enrolled courses…</CardContent></Card> : !courses.length ? <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Join a course to access its discussion space.</CardContent></Card> : <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Choose a course</CardTitle></CardHeader>
            <CardContent>
              <select value={activeCourseId} onChange={(event) => { setSelectedCourse(event.target.value); setReplyOpen(""); setReplyText(""); }} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#f47945]">
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
              {activeCourse ? <p className="mt-3 text-sm leading-6 text-muted-foreground">Use this space to ask about <span className="font-medium text-foreground">{activeCourse.title}</span>, share a useful approach, or request clarification before submitting your work.</p> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Start a question</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); postMutation.mutate(); }}>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Question title" required />
                <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Explain what you are trying, where you are stuck, or what you discovered…" rows={6} required />
                <Button type="submit" disabled={!activeCourseId || !title.trim() || !content.trim() || postMutation.isPending} className="w-full bg-[#1f0d2e] hover:bg-[#4d176e]"><Send className="mr-2 h-4 w-4" />{postMutation.isPending ? "Posting…" : "Post question"}</Button>
                {postMutation.isSuccess ? <p className="text-sm text-emerald-700">Your question started a new discussion thread.</p> : null}
                {postMutation.isError ? <p className="text-sm text-destructive">{postMutation.error instanceof Error ? postMutation.error.message : "Unable to post your question."}</p> : null}
              </form>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="h-4 w-4 text-[#f47945]" aria-hidden /> {activeCourse?.title ?? "Course"} discussion</CardTitle></CardHeader>
          <CardContent className="divide-y p-0">
            {discussionsQuery.isLoading ? <p className="p-8 text-sm text-muted-foreground">Loading discussion…</p> : rows.length ? rows.map((row) => {
              const rootId = String(row.id ?? "");
              const threadKey = String(row.threadId ?? rootId);
              const replies = Array.isArray(row.replies) ? row.replies : [];
              const isOpen = replyOpen === threadKey;
              return <article key={rootId} className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{String(row.title ?? "Discussion")}</h3>{row.kind === "announcement" ? <Badge variant="secondary"><Megaphone className="mr-1 h-3 w-3" />Announcement</Badge> : <Badge variant="outline">Question</Badge>}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{authorLabel(row)} · {formatDate(row.created_at)}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="border-[#f47945]/40 text-[#b94a1d] hover:bg-[#fff3ed]" onClick={() => { setReplyOpen(isOpen ? "" : threadKey); setReplyText(""); }} aria-expanded={isOpen} aria-controls={`thread-${threadKey}`}><Reply className="mr-2 h-4 w-4" />{isOpen ? "Close thread" : "Reply"}</Button>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{String(row.content ?? "")}</p>
                <div id={`thread-${threadKey}`} className="space-y-3 border-l-2 border-[#f6eef9] pl-4">
                  {replies.length ? replies.map((reply) => <div key={String(reply.id)} className="rounded-lg bg-[#fbf8fc] p-3"><p className="text-sm leading-6 text-foreground">{String(reply.content ?? "")}</p><p className="mt-2 text-xs text-muted-foreground">{authorLabel(reply)} · {formatDate(reply.created_at)}</p></div>) : <p className="text-xs text-muted-foreground">{isOpen ? "This thread has no replies yet. Start the conversation below." : "No replies yet."}</p>}
                  {isOpen ? <form className="space-y-2 pt-1" onSubmit={(event) => { event.preventDefault(); if (replyText.trim()) replyMutation.mutate({ rootId, threadKey, content: replyText.trim() }); }}><Textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Write a reply to this thread…" rows={3} aria-label={`Reply to ${String(row.title ?? "discussion")}`} /><div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">Your reply will be visible to the enrolled course community.</p><Button type="submit" size="sm" disabled={!replyText.trim() || replyMutation.isPending} className="bg-[#1f0d2e] hover:bg-[#4d176e]"><Send className="mr-2 h-4 w-4" />{replyMutation.isPending ? "Sending…" : "Post reply"}</Button></div>{replyMutation.isError ? <p className="text-sm text-destructive">{replyMutation.error instanceof Error ? replyMutation.error.message : "Unable to post your reply."}</p> : null}{replyMutation.isSuccess && replyOpen === threadKey ? <p className="text-sm text-emerald-700">Reply posted to this thread.</p> : null}</form> : null}
                </div>
              </article>;
            }) : <div className="p-10 text-center"><MessageCircle className="mx-auto h-8 w-8 text-[#f47945]" aria-hidden /><p className="mt-3 font-medium">No discussions yet</p><p className="mt-1 text-sm text-muted-foreground">Post a question to create the first thread for this course.</p></div>}
          </CardContent>
        </Card>
      </div>}
    </div>
  );
}
