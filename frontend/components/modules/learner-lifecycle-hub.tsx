"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Plus, RefreshCcw, Send, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Textarea } from "@/components/ui/textarea";
import { useLearnerDashboard } from "@/hooks/use-dashboard";
import { resourceService, type ResourceRow } from "@/services/resources";
import type { LearnerDashboard } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { LearnerCertificates } from "@/components/modules/learner-certificates";

const TITLES: Record<string, { title: string; description: string }> = {
  assignments: { title: "Assignments", description: "Track practice work, submissions, grades, and feedback in one place." },
  certificates: { title: "Certificates", description: "Your earned completion records and verification details." },
  attendance: { title: "Attendance", description: "Keep a clear record of every class, tutor session, and learning touchpoint." },
  messages: { title: "Messages", description: "Ask for help, send a support request, or continue a conversation with LEA Labs." },
  achievements: { title: "Achievements", description: "Milestones that recognise your consistency, evidence, and growth." },
  progress: { title: "Progress", description: "See how your course work is moving forward and what to do next." },
  bookmarks: { title: "Bookmarks", description: "Save lessons and resources you want to return to later." },
  downloads: { title: "Downloads", description: "Your downloaded course packs, certificates, and learning resources." },
};

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en", { dateStyle: "medium" });
}

function status(value: unknown) {
  const label = String(value ?? "pending");
  return <Badge variant={label === "graded" || label === "submitted" || label === "earned" ? "secondary" : "outline"}>{label}</Badge>;
}

function ResourceList({ resource, empty }: { resource: string; empty: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["learner-resource", resource],
    queryFn: () => resourceService.list(resource, { per_page: 100 }),
  });
  const rows = (data?.data ?? []) as ResourceRow[];

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading your {resource}…</CardContent></Card>;
  if (!rows.length) return <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">{empty}</CardContent></Card>;

  return (
    <Card>
      <CardContent className="divide-y p-0">
        {rows.map((row) => (
          <div key={String(row.id)} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-medium">{String(row.title ?? row.name ?? row.subject ?? row.course ?? "Learning record")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {String(row.description ?? row.preview ?? row.type ?? row.status ?? "Saved to your learner account")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {status(row.status ?? row.verified ? "verified" : undefined)}
              <span>{formatDate(row.updated_at ?? row.created_at ?? row.added_at ?? row.downloaded_at ?? row.issued_at)}</span>
              {row.url ? <Button variant="ghost" size="sm" asChild><a href={String(row.url)} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3.5 w-3.5" />Open</a></Button> : null}
              {resource === "certificates" && row.verification_code ? <Button variant="ghost" size="sm" asChild><a href={`/verify/${encodeURIComponent(String(row.verification_code))}`} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3.5 w-3.5" />Verify</a></Button> : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardCard({ data }: { data: LearnerDashboard }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Lessons completed</p><p className="mt-2 text-2xl font-semibold">{data.stats.lessonsCompleted.value}</p></CardContent></Card>
      <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Assignments submitted</p><p className="mt-2 text-2xl font-semibold">{data.stats.assignmentsSubmitted.value}</p></CardContent></Card>
      <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Active streak</p><p className="mt-2 text-2xl font-semibold">{data.currentStreak} weeks</p></CardContent></Card>
    </div>
  );
}

function AssignmentsView() {
  const { data, isLoading } = useLearnerDashboard();
  const submissionsQuery = useQuery({
    queryKey: ["learner-resource", "submissions"],
    queryFn: () => resourceService.list("submissions", { per_page: 100, sort: "updated_at", order: "desc" }),
  });
  const assignments = data?.assignments ?? [];
  const submissions = (submissionsQuery.data?.data ?? []) as ResourceRow[];
  const feedbackRows = submissions.filter((row) => row.feedback || row.comments || row.rubric || row.grade !== undefined || row.resubmission_requested === true);
  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading assignments…</CardContent></Card>;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total work</p><p className="mt-2 text-2xl font-semibold">{assignments.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Submitted</p><p className="mt-2 text-2xl font-semibold">{assignments.filter((a) => ["submitted", "graded"].includes(a.status)).length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Still to do</p><p className="mt-2 text-2xl font-semibold">{assignments.filter((a) => a.status === "open" || a.status === "overdue").length}</p></CardContent></Card>
      </div>
      <Card><CardContent className="divide-y p-0">
        {assignments.length ? assignments.map((assignment) => (
          <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div><p className="font-medium">{assignment.title}</p><p className="mt-1 text-xs text-muted-foreground">{assignment.course} · Due {formatDate(assignment.due_at)}</p></div>
            <div className="flex items-center gap-2">{status(assignment.status)}{assignment.grade !== null ? <span className="text-xs text-muted-foreground">Grade {assignment.grade}%</span> : null}</div>
          </div>
        )) : <p className="p-8 text-center text-sm text-muted-foreground">Your course practice tasks will appear here as you enrol.</p>}
      </CardContent></Card>
      <Card className="border-[#f47945]/30 bg-[#fffaf7]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><RefreshCcw className="h-4 w-4 text-[#f47945]" aria-hidden /> Feedback and grading history</CardTitle></CardHeader>
        <CardContent className="divide-y p-0">
          {submissionsQuery.isLoading ? <p className="p-6 text-sm text-muted-foreground">Loading feedback…</p> : feedbackRows.length ? feedbackRows.map((row) => <div key={String(row.id)} className="space-y-2 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{String(row.assignment_title ?? row.title ?? "Assignment submission")}</p><p className="text-xs text-muted-foreground">{String(row.course_title ?? row.course ?? "Course work")} · {formatDate(row.updated_at ?? row.graded_at ?? row.created_at)}</p></div>{row.grade !== undefined ? <Badge variant="secondary">Grade {String(row.grade)}%</Badge> : status(row.status ?? "reviewed")}</div>{row.feedback || row.comments ? <p className="text-sm leading-6 text-muted-foreground">{String(row.feedback ?? row.comments)}</p> : null}{row.rubric ? <p className="text-xs text-muted-foreground">Rubric: {String(row.rubric)}</p> : null}{row.resubmission_requested === true ? <p className="text-xs font-semibold text-[#b94920]">Resubmission requested — review the feedback and submit an improved version.</p> : null}</div>) : <p className="p-6 text-sm text-muted-foreground">Tutor feedback and rubric results will appear here after your work is reviewed.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressView() {
  const { data, isLoading } = useLearnerDashboard();
  if (isLoading || !data) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading progress…</CardContent></Card>;
  return <div className="space-y-4"><DashboardCard data={data} /><div className="grid gap-4 lg:grid-cols-2">{data.myCourses.map((course) => <Card key={course.id}><CardContent className="p-5"><div className="flex items-center justify-between gap-3"><div><p className="font-medium">{course.title}</p><p className="text-xs text-muted-foreground">{course.programme}</p></div><span className="text-sm font-semibold">{course.progress}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-[#f47945]" style={{ width: `${course.progress}%` }} /></div><p className="mt-3 text-xs text-muted-foreground">Next: {course.next_lesson || "Choose your next lesson"}</p></CardContent></Card>)}</div></div>;
}

function AchievementsView() {
  const { data, isLoading } = useLearnerDashboard();
  if (isLoading || !data) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading achievements…</CardContent></Card>;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.badges.map((badge) => <Card key={badge.id} className={cn("border", badge.earned ? "border-[#f47945]/50 bg-[#fff8f4]" : "opacity-80")}><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f0d2e] text-white"><Trophy className="h-4 w-4" /></div>{badge.earned ? <Badge variant="secondary">Earned</Badge> : <Badge variant="outline">In progress</Badge>}</div><p className="mt-4 font-medium">{badge.title}</p><p className="mt-1 text-sm text-muted-foreground">{badge.description}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-[#f47945]" style={{ width: `${Math.round((badge.progress / badge.target) * 100)}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{badge.progress}/{badge.target}</p></CardContent></Card>)}</div>;
}

function MessagesView() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const mutation = useMutation({
    mutationFn: () => resourceService.create("messages", { subject, body, preview: body.slice(0, 120), status: "open", channel: "learner-support" }),
    onSuccess: () => { setSubject(""); setBody(""); queryClient.invalidateQueries({ queryKey: ["learner-resource", "messages"] }); },
  });
  return <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><ResourceList resource="messages" empty="No messages yet. Send a support request when you need help." /><Card><CardHeader><CardTitle className="text-base">Contact learner support</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" /><Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell us what you need help with…" rows={6} /><Button disabled={!subject.trim() || !body.trim() || mutation.isPending} onClick={() => mutation.mutate()} className="w-full bg-[#1f0d2e] hover:bg-[#4d176e]"><Send className="mr-2 h-4 w-4" />{mutation.isPending ? "Sending…" : "Send message"}</Button></CardContent></Card></div>;
}

function BookmarksView() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const mutation = useMutation({
    mutationFn: () => resourceService.create("bookmarks", { title, url, type: "lesson-resource", added_at: new Date().toISOString() }),
    onSuccess: () => { setTitle(""); setUrl(""); queryClient.invalidateQueries({ queryKey: ["learner-resource", "bookmarks"] }); },
  });
  return <div className="space-y-4"><Card><CardHeader><CardTitle className="text-base">Save a resource</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" /><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" /><Button disabled={!title.trim() || !url.trim() || mutation.isPending} onClick={() => mutation.mutate()}><Plus className="mr-2 h-4 w-4" />Save</Button></CardContent></Card><ResourceList resource="bookmarks" empty="You have no bookmarks yet. Save a lesson or resource to return to it later." /></div>;
}

export function LearnerLifecycleHub({ slug }: { slug: string }) {
  const meta = TITLES[slug] ?? { title: "Learner space", description: "Your learning records and next steps." };
  let content: React.ReactNode;
  if (slug === "assignments") content = <AssignmentsView />;
  else if (slug === "progress") content = <ProgressView />;
  else if (slug === "achievements") content = <AchievementsView />;
  else if (slug === "messages") content = <MessagesView />;
  else if (slug === "bookmarks") content = <BookmarksView />;
  else if (slug === "certificates") content = <LearnerCertificates />;
  else if (slug === "attendance") content = <ResourceList resource="attendance" empty="Your attendance will appear after a scheduled class or tutor session." />;
  else if (slug === "downloads") content = <ResourceList resource="downloads" empty="Your downloaded course packs and certificates will appear here." />;
  else content = <ResourceList resource={slug} empty="Nothing is here yet." />;

  return <div className="space-y-6"><PageHeader title={meta.title} description={meta.description} />{content}</div>;
}
