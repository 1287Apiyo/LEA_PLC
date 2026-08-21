"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, ExternalLink, GraduationCap, Link2, MapPin, MessageSquare, Send, Video } from "lucide-react";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Textarea } from "@/components/ui/textarea";

interface TutorRequest {
  id: string;
  course_title: string;
  mode: "in_person" | "online";
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  quoted_price_kes: number | null;
  status: string;
  notes?: string;
  admin_response?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  venue?: string;
  meetingLink?: string;
  meetingPlatform?: string;
  instructorName?: string;
  instructorEmail?: string;
  updated_at?: string;
}

interface TutoringData {
  requests: TutorRequest[] | null;
  enrolledCourses: Array<{ id: string; title: string; price_kes: number | null }> | null;
  pricing: {
    in_person: { single: number | null; bundle: number | null; label: string };
    online: { single: number | null; bundle: number | null; label: string };
  } | null;
}

function kes(value: unknown) {
  if (value === null || value === undefined || value === "") return "KES —";
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? `KES ${amount.toLocaleString("en-KE")}` : "KES —";
}

function dateLabel(value: unknown) {
  if (!value) return "Date to be confirmed";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function statusTone(status: string) {
  if (status === "confirmed" || status === "scheduled") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (["declined", "cancelled"].includes(status)) return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "quoted") return "border-orange-200 bg-orange-50 text-orange-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function statusCopy(status: string) {
  if (status === "confirmed" || status === "scheduled") return "Confirmed";
  if (status === "declined") return "Declined";
  if (status === "cancelled") return "Cancelled";
  if (status === "quoted") return "Quote shared";
  if (status === "under_review") return "Under review";
  return "Request sent";
}

function durationLabel(duration: number) {
  return duration === 240 ? "4-session package" : "60-minute session";
}

/** Learner-facing tutor request and confirmed-session hub. */
export function LearnerTutorSessions() {
  const queryClient = useQueryClient();
  const [courseId, setCourseId] = useState("");
  const [mode, setMode] = useState<"in_person" | "online">("in_person");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const tutoringQuery = useQuery({
    queryKey: ["learner-tutoring"],
    queryFn: () => api.get<{ data: TutoringData }>("/learner/tutoring"),
  });
  const tutoring = tutoringQuery.data?.data;
  const enrolledCourses = Array.isArray(tutoring?.enrolledCourses) ? tutoring.enrolledCourses : [];
  const pricing = tutoring?.pricing ?? null;
  const requests = useMemo(
    () => [...(Array.isArray(tutoring?.requests) ? tutoring.requests : [])].sort((a, b) => String(b.updated_at ?? "").localeCompare(String(a.updated_at ?? ""))),
    [tutoring?.requests],
  );
  const confirmed = requests.filter((request) => ["confirmed", "scheduled"].includes(request.status));
  const awaiting = requests.filter((request) => ["requested", "under_review", "quoted"].includes(request.status));
  const selectedPricing = pricing?.[mode];
  const quotedPrice = selectedPricing ? (durationMinutes === 240 ? selectedPricing.bundle : selectedPricing.single) : 0;

  const requestMutation = useMutation({
    mutationFn: () => api.post<{ data: TutorRequest }>("/learner/tutoring", {
      courseId,
      mode,
      durationMinutes,
      preferredDate,
      preferredTime,
      notes,
    }),
    onSuccess: () => {
      setNotes("");
      setPreferredDate("");
      setPreferredTime("10:00");
      queryClient.invalidateQueries({ queryKey: ["learner-tutoring"] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Tutor Sessions" description="Request one-to-one support, follow the conversation, and join confirmed online sessions from one place." />

      <Card className="overflow-hidden border-[#eadcf0] bg-gradient-to-r from-[#1f0d2e] via-[#4d176e] to-[#7e398f] text-white">
        <CardContent className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffd3bd]"><GraduationCap className="h-4 w-4" aria-hidden /> Personal tutor support</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Ask for help, get a clear response, keep moving.</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">Choose a course and preferred time. The LEA team will review the request, connect you with an instructor, and share the confirmed details here.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs sm:min-w-[250px]">
            <div className="rounded-xl bg-white/10 px-3 py-3"><p className="text-white/65">Awaiting response</p><p className="mt-1 text-xl font-semibold text-[#ffd3bd]">{awaiting.length}</p></div>
            <div className="rounded-xl bg-white/10 px-3 py-3"><p className="text-white/65">Confirmed sessions</p><p className="mt-1 text-xl font-semibold">{confirmed.length}</p></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Your course tuition</p><p className="mt-1 text-sm font-semibold text-[#1f0d2e]">Unchanged</p><p className="mt-1 text-xs text-muted-foreground">Tutor support is requested separately.</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Face-to-face</p><p className="mt-1 text-sm font-semibold text-[#1f0d2e]">{kes(pricing?.in_person?.single ?? 2500)} / 60 min</p><p className="mt-1 text-xs text-muted-foreground">Applewood Adams, 13th Floor.</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Online</p><p className="mt-1 text-sm font-semibold text-[#1f0d2e]">{kes(pricing?.online?.single ?? 1800)} / 60 min</p><p className="mt-1 text-xs text-muted-foreground">Meeting link appears after confirmation.</p></CardContent></Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <Card className="h-fit border-[#eadcf0]">
          <CardHeader className="pb-3"><CardTitle className="text-base">Request a tutor session</CardTitle><p className="text-sm text-muted-foreground">Tell us what you need and when you would like to meet.</p></CardHeader>
          <CardContent className="space-y-4">
            {!enrolledCourses.length ? <p className="rounded-lg border border-dashed p-4 text-sm leading-6 text-muted-foreground">Enrol in a course first, then return here to request tutor support for that course.</p> : <>
              <label className="block space-y-1.5 text-sm"><span className="font-medium">Course</span><select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">Choose an enrolled course</option>{enrolledCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm"><span className="font-medium">Session format</span><select value={mode} onChange={(event) => setMode(event.target.value as "in_person" | "online")} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="in_person">Face-to-face</option><option value="online">Online</option></select></label>
                <label className="space-y-1.5 text-sm"><span className="font-medium">Package</span><select value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value={60}>One session · {kes(selectedPricing?.single ?? 0)}</option><option value={240}>Four sessions · {kes(selectedPricing?.bundle ?? 0)}</option></select></label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm"><span className="font-medium">Preferred date</span><Input type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} min={new Date().toISOString().slice(0, 10)} /></label>
                <label className="space-y-1.5 text-sm"><span className="font-medium">Preferred time</span><Input type="time" value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)} /></label>
              </div>
              <div className="rounded-lg bg-[#fff8f4] p-3 text-sm"><p className="text-muted-foreground">Estimated tutor add-on</p><p className="mt-0.5 font-semibold text-[#1f0d2e]">{kes(quotedPrice)} <span className="font-normal text-muted-foreground">· {durationLabel(durationMinutes)}</span></p></div>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What would you like the tutor to help you understand or practise?" rows={4} />
              <Button className="w-full bg-[#1f0d2e] hover:bg-[#4d176e]" disabled={!courseId || !preferredDate || !preferredTime || requestMutation.isPending} onClick={() => requestMutation.mutate()}><Send className="mr-2 h-4 w-4" />{requestMutation.isPending ? "Sending request…" : "Request tutor session"}</Button>
              {requestMutation.isSuccess ? <p className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />Request sent. Watch the session updates panel for the LEA response.</p> : null}
              {requestMutation.isError ? <p className="text-sm text-destructive">{requestMutation.error instanceof Error ? requestMutation.error.message : "Unable to send request."}</p> : null}
            </>}
          </CardContent>
        </Card>

        <Card className="border-[#eadcf0]">
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4 text-[#f47945]" aria-hidden />Sessions and updates</CardTitle><p className="text-sm text-muted-foreground">Your request conversation, instructor details, and joining information appear here.</p></CardHeader>
          <CardContent className="space-y-3">
            {tutoringQuery.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading your tutor sessions…</p> : requests.length === 0 ? <div className="rounded-lg border border-dashed p-8 text-center"><GraduationCap className="mx-auto h-8 w-8 text-[#4d176e]" aria-hidden /><p className="mt-3 text-sm font-medium">No tutor requests yet.</p><p className="mt-1 text-sm text-muted-foreground">Your first request will appear here with every response and update.</p></div> : requests.map((request) => {
              const meetingLink = String(request.meetingLink ?? "").trim();
              const isOnline = request.mode === "online";
              return <div key={request.id} className="rounded-xl border border-[#eadcf0] bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-[#151116]">{request.course_title}</p><p className="mt-1 text-xs text-muted-foreground">{isOnline ? "Online session" : "Face-to-face session"} · {kes(request.quoted_price_kes)} · {durationLabel(request.durationMinutes)}</p></div><Badge variant="outline" className={`capitalize ${statusTone(request.status)}`}>{statusCopy(request.status)}</Badge></div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{request.confirmedDate ? dateLabel(request.confirmedDate) : `Preferred: ${dateLabel(request.preferredDate)}`} · {request.confirmedTime ?? request.preferredTime}</span><span className="flex items-center gap-1.5">{isOnline ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}{isOnline ? request.meetingPlatform ?? "Online meeting" : request.venue ?? "Venue to be confirmed"}</span></div>
                {request.instructorName ? <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#f6eef9] px-3 py-2 text-sm text-[#4d176e]"><GraduationCap className="h-4 w-4" aria-hidden /><span><span className="font-medium">Instructor:</span> {request.instructorName}{request.instructorEmail ? ` · ${request.instructorEmail}` : ""}</span></div> : null}
                {request.admin_response ? <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm"><p className="font-medium text-[#1f0d2e]">LEA update</p><p className="mt-1 leading-6 text-muted-foreground">{request.admin_response}</p></div> : <p className="mt-3 text-sm text-muted-foreground">The LEA team has received your request and will share an update here.</p>}
                {(["confirmed", "scheduled"].includes(request.status)) && isOnline ? <div className="mt-3">{meetingLink ? <Button asChild className="w-full gap-2 bg-[#f47945] hover:bg-[#d95d2e]"><a href={meetingLink} target="_blank" rel="noreferrer"><Link2 className="h-4 w-4" aria-hidden />Join online session <ExternalLink className="h-3.5 w-3.5" aria-hidden /></a></Button> : <div className="flex items-center gap-2 rounded-lg border border-dashed border-orange-200 bg-orange-50 p-3 text-sm text-orange-800"><Video className="h-4 w-4" aria-hidden />Your instructor has confirmed the session. The online meeting link will be added here.</div>}</div> : null}
              </div>;
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#eadcf0] bg-[#fffdfb]"><CardContent className="grid gap-4 p-5 text-sm sm:grid-cols-3"><div><p className="font-semibold text-[#1f0d2e]">1. Request</p><p className="mt-1 leading-6 text-muted-foreground">Choose your course, format, preferred time, and what you need help with.</p></div><div><p className="font-semibold text-[#1f0d2e]">2. Get connected</p><p className="mt-1 leading-6 text-muted-foreground">The LEA team reviews the request and connects you with an available instructor.</p></div><div><p className="font-semibold text-[#1f0d2e]">3. Join and learn</p><p className="mt-1 leading-6 text-muted-foreground">Use the confirmed venue or secure online meeting link shown in your session update.</p></div></CardContent></Card>
    </div>
  );
}
