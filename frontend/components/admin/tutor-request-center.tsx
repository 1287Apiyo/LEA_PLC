"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck2, CheckCircle2, Clock3, ExternalLink, Link2, MapPin, MessageSquare, UserRound, Video } from "lucide-react";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";

interface TutorRequest {
  id: string;
  learner_name: string;
  learner_email: string;
  course_title: string;
  mode: "in_person" | "online";
  durationMinutes: number;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  quoted_price_kes: number | null;
  status: string;
  admin_response?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  venue?: string;
  meetingLink?: string;
  meetingPlatform?: string;
  instructorId?: string;
  instructorName?: string;
  instructorEmail?: string;
}

interface InstructorOption {
  id: string;
  name: string;
  email: string;
}

interface TutorResponse {
  data: TutorRequest[];
  instructors?: InstructorOption[];
}

function money(value: unknown) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? `KES ${amount.toLocaleString("en-KE")}` : "KES —";
}

function statusTone(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed") return "default";
  if (["declined", "cancelled"].includes(status)) return "destructive";
  if (["requested", "under_review", "quoted"].includes(status)) return "secondary";
  return "outline";
}

function RequestCard({ request, instructors }: { request: TutorRequest; instructors: InstructorOption[] }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(request.status || "under_review");
  const [responseMessage, setResponseMessage] = useState(request.admin_response ?? "");
  const [confirmedDate, setConfirmedDate] = useState(request.confirmedDate ?? request.preferredDate ?? "");
  const [confirmedTime, setConfirmedTime] = useState(request.confirmedTime ?? request.preferredTime ?? "");
  const [venue, setVenue] = useState(request.venue ?? (request.mode === "in_person" ? "Applewood Adams, 13th Floor" : "Online session"));
  const [meetingPlatform, setMeetingPlatform] = useState(request.meetingPlatform ?? (request.mode === "online" ? "Google Meet" : ""));
  const [meetingLink, setMeetingLink] = useState(request.meetingLink ?? "");
  const [instructorId, setInstructorId] = useState(request.instructorId ?? "");
  const [instructorName, setInstructorName] = useState(request.instructorName ?? "");
  const [instructorEmail, setInstructorEmail] = useState(request.instructorEmail ?? "");

  const mutation = useMutation({
    mutationFn: () => api.patch<{ data: TutorRequest }>("/admin/tutoring", {
      requestId: request.id,
      status,
      responseMessage,
      confirmedDate,
      confirmedTime,
      venue,
      meetingPlatform: request.mode === "online" ? meetingPlatform : "",
      meetingLink: request.mode === "online" ? meetingLink : "",
      instructorId,
      instructorName,
      instructorEmail,
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-tutor-requests"] });
    },
  });

  const requiresSchedule = status === "confirmed";
  return (
    <Card className="border-border/80">
      <CardHeader className="gap-3 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{request.course_title}</CardTitle>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><UserRound className="h-3.5 w-3.5" />{request.learner_name}{request.learner_email ? ` · ${request.learner_email}` : ""}</p>
          </div>
          <Badge variant={statusTone(request.status)} className="capitalize">{request.status.replace(/_/g, " ")}</Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarCheck2 className="h-3.5 w-3.5" />{request.preferredDate}</span>
          <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{request.preferredTime} · {request.durationMinutes === 240 ? "4 sessions" : "60 minutes"}</span>
          <span>{request.mode === "in_person" ? "Face-to-face" : "Online"} · {money(request.quoted_price_kes)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {request.notes ? <div className="rounded-lg bg-muted/40 p-3 text-sm"><p className="mb-1 font-medium">Learner notes</p><p className="text-muted-foreground">{request.notes}</p></div> : null}
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5 text-sm"><span className="font-medium">Response status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="under_review">Under review</option><option value="quoted">Quoted</option><option value="confirmed">Confirmed</option><option value="declined">Declined</option><option value="cancelled">Cancelled</option></select></label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">{request.mode === "online" ? "Session note" : "Venue"}{requiresSchedule ? " *" : ""}</span><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={venue} onChange={(event) => setVenue(event.target.value)} placeholder={request.mode === "online" ? "Online session" : "Applewood Adams, 13th Floor"} /></div></label>
          {requiresSchedule ? <>
            <label className="space-y-1.5 text-sm"><span className="font-medium">Confirmed date *</span><Input type="date" value={confirmedDate} onChange={(event) => setConfirmedDate(event.target.value)} /></label>
            <label className="space-y-1.5 text-sm"><span className="font-medium">Confirmed time *</span><Input type="time" value={confirmedTime} onChange={(event) => setConfirmedTime(event.target.value)} /></label>
          </> : null}
          <label className="space-y-1.5 text-sm"><span className="font-medium">Assign instructor</span>{instructors.length ? <select value={instructorId} onChange={(event) => { const selected = instructors.find((instructor) => instructor.id === event.target.value); setInstructorId(event.target.value); setInstructorName(selected?.name ?? ""); setInstructorEmail(selected?.email ?? ""); }} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">Choose an instructor</option>{instructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}{instructor.email ? ` · ${instructor.email}` : ""}</option>)}</select> : <Input value={instructorName} onChange={(event) => setInstructorName(event.target.value)} placeholder="Assign an instructor" />}</label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">Instructor email</span><Input type="email" value={instructorEmail} onChange={(event) => setInstructorEmail(event.target.value)} placeholder="instructor@lealabs.org" /></label>
          {request.mode === "online" ? <>
            <label className="space-y-1.5 text-sm"><span className="flex items-center gap-1.5 font-medium"><Video className="h-4 w-4 text-muted-foreground" />Meeting platform</span><select value={meetingPlatform} onChange={(event) => setMeetingPlatform(event.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="Google Meet">Google Meet</option><option value="Zoom">Zoom</option><option value="Microsoft Teams">Microsoft Teams</option><option value="Other">Other</option></select></label>
            <label className="space-y-1.5 text-sm"><span className="flex items-center gap-1.5 font-medium"><Link2 className="h-4 w-4 text-muted-foreground" />Online meeting link{requiresSchedule ? " *" : ""}</span><Input type="url" value={meetingLink} onChange={(event) => setMeetingLink(event.target.value)} placeholder="https://meet.google.com/..." /></label>
            <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:col-span-2"><ExternalLink className="h-3.5 w-3.5" aria-hidden />Create the session in Google Meet, then paste the invite link here so the learner sees a Join button. <a href="https://meet.google.com/new" target="_blank" rel="noreferrer" className="font-medium text-[#4d176e] underline underline-offset-2">Open Google Meet</a></p>
          </> : null}
        </div>
        <label className="block space-y-1.5 text-sm"><span className="flex items-center gap-1.5 font-medium"><MessageSquare className="h-4 w-4 text-muted-foreground" />Message to learner</span><Textarea value={responseMessage} onChange={(event) => setResponseMessage(event.target.value)} rows={3} placeholder="Explain the next step, payment instruction, or reason for the decision…" /></label>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || (requiresSchedule && (!confirmedDate || !confirmedTime || !venue || (request.mode === "online" && !meetingLink)))}>{mutation.isPending ? "Saving response…" : "Save response"}</Button>
          {mutation.isSuccess ? <span className="flex items-center gap-1.5 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />Saved and shared with learner</span> : null}
          {mutation.isError ? <span className="text-sm text-destructive">{mutation.error instanceof Error ? mutation.error.message : "Could not save response."}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function TutorRequestCenter() {
  const [filter, setFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-tutor-requests"],
    queryFn: () => api.get<TutorResponse>("/admin/tutoring"),
  });
  const requests = data?.data ?? [];
  const instructors = data?.instructors ?? [];
  const filtered = filter === "all" ? requests : requests.filter((request) => request.status === filter);
  const pendingCount = requests.filter((request) => ["requested", "under_review", "quoted"].includes(request.status)).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Tutor requests" description="Review learner requests, respond with next steps, and confirm face-to-face or online sessions." />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">All requests</p><p className="mt-1 text-2xl font-semibold text-[#1f0d2e]">{requests.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Needs response</p><p className="mt-1 text-2xl font-semibold text-[#f47945]">{pendingCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Confirmed</p><p className="mt-1 text-2xl font-semibold text-emerald-700">{requests.filter((request) => request.status === "confirmed").length}</p></CardContent></Card>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="all">All statuses</option><option value="requested">Requested</option><option value="under_review">Under review</option><option value="quoted">Quoted</option><option value="confirmed">Confirmed</option><option value="declined">Declined</option></select>
        <Button variant="outline" onClick={() => void refetch()} disabled={isLoading}>Refresh requests</Button>
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading tutor requests…</p> : isError ? <p className="text-sm text-destructive">Could not load tutor requests. Check your administrator session and try again.</p> : filtered.length ? <div className="space-y-4">{filtered.map((request) => <RequestCard key={request.id} request={request} instructors={instructors} />)}</div> : <Card><CardContent className="p-8 text-center"><p className="font-medium">No tutor requests in this view.</p><p className="mt-1 text-sm text-muted-foreground">New face-to-face and online requests will appear here as learners submit them.</p></CardContent></Card>}
    </div>
  );
}
