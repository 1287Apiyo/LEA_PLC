"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Clock, MapPin, Send } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TutorRequest = {
  id: string;
  course_title: string;
  mode: "in_person" | "online";
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  quoted_price_kes: number | null;
  status: string;
};

type TutoringData = {
  requests: TutorRequest[] | null;
  classes: Array<Record<string, unknown>> | null;
  enrolledCourses: Array<{ id: string; title: string; price_kes: number | null }> | null;
  pricing: {
    in_person: { single: number | null; bundle: number | null; label: string };
    online: { single: number | null; bundle: number | null; label: string };
  } | null;
};

function kes(value: unknown) {
  if (value === null || value === undefined || value === "") return "KES —";
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? `KES ${amount.toLocaleString("en-KE")}` : "KES —";
}

function isUpcoming(row: Record<string, unknown>): boolean {
  const date = new Date(String(row.date ?? ""));
  return date.getTime() >= Date.now() - 86400000;
}

/** Learner calendar — schedule, tutor requests, and transparent learning support pricing. */
export function LearnerCalendar() {
  const queryClient = useQueryClient();
  const [courseId, setCourseId] = useState("");
  const [mode, setMode] = useState<"in_person" | "online">("in_person");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["learner-tutoring"],
    queryFn: () => api.get<{ data: TutoringData }>("/learner/tutoring"),
  });
  const tutoring = data?.data;
  const classes = useMemo(() => (Array.isArray(tutoring?.classes) ? tutoring.classes : []), [tutoring?.classes]);
  const enrolledCourses = Array.isArray(tutoring?.enrolledCourses) ? tutoring.enrolledCourses : [];
  const requests = Array.isArray(tutoring?.requests) ? tutoring.requests : [];
  const pricing = tutoring?.pricing ?? null;
  const upcoming = useMemo(() => classes.filter(isUpcoming).slice(0, 6), [classes]);
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
      queryClient.invalidateQueries({ queryKey: ["learner-tutoring"] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar & tutor support"
        description="Plan your classes, request focused help, and keep your next learning step visible."
      />

      <Card className="border-[#f47945]/25 bg-[#fff8f4]">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1f0d2e]">Need a face-to-face class?</p>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Your course tuition does not change. Tutor support is an optional add-on, so you only pay for the extra time you request.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <span className="rounded-lg border bg-white px-3 py-2">In person<br /><b>{kes(pricing?.in_person?.single ?? 2500)}</b> / 60 min</span>
            <span className="rounded-lg border bg-white px-3 py-2">In person<br /><b>{kes(pricing?.in_person?.bundle ?? 9000)}</b> / 4 sessions</span>
            <span className="rounded-lg border bg-white px-3 py-2">Online<br /><b>{kes(pricing?.online?.single ?? 1800)}</b> / 60 min</span>
            <span className="rounded-lg border bg-white px-3 py-2">Online<br /><b>{kes(pricing?.online?.bundle ?? 6500)}</b> / 4 sessions</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><CalendarDays className="h-4 w-4 text-muted-foreground" />Your calendar</CardTitle></CardHeader>
          <CardContent className="flex justify-center p-4"><Calendar mode="single" className="rounded-md border" /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Upcoming classes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? <p className="text-sm text-muted-foreground">Loading schedule…</p> : upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No confirmed classes yet. You can request tutor support below.</p> : upcoming.map((row) => {
              const day = new Date(String(row.date)).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
              return <div key={String(row.id)} className="flex items-start gap-3 rounded-lg border p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-muted-foreground"><Clock className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-sm font-medium">{String(row.course ?? "Tutor class")}</p><p className="text-xs text-muted-foreground">{day} · {String(row.start_time ?? "").slice(0, 5)}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{String(row.venue ?? row.mode ?? "To be confirmed")}</p></div></div>;
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Request a tutor session</CardTitle><p className="text-sm text-muted-foreground">Requests are reviewed by the LEA team before a class is confirmed.</p></CardHeader>
        <CardContent className="space-y-4">
          {!enrolledCourses.length ? <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Enrol in a course first, then return here to request tutor support for that course.</p> : <>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5 text-sm"><span className="font-medium">Course</span><select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">Choose an enrolled course</option>{enrolledCourses.map((course) => <option key={course.id} value={course.id}>{course.title} · {kes(course.price_kes)}</option>)}</select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Session type</span><select value={mode} onChange={(event) => setMode(event.target.value as "in_person" | "online")} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="in_person">Face-to-face · Applewood Adams, 13th Floor</option><option value="online">Online tutor session</option></select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Package</span><select value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value={60}>One 60-minute session · {kes(selectedPricing?.single ?? 0)}</option><option value={240}>Four-session package · {kes(selectedPricing?.bundle ?? 0)}</option></select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Preferred date</span><Input type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} min={new Date().toISOString().slice(0, 10)} /></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Preferred time</span><Input type="time" value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)} /></label>
              <div className="flex items-end rounded-lg bg-muted/40 p-3 text-sm"><div><span className="text-muted-foreground">Estimated tutor add-on</span><p className="font-semibold text-[#1f0d2e]">{kes(quotedPrice)}</p></div></div>
            </div>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What would you like the tutor to help you with?" rows={4} />
            <Button className="bg-[#1f0d2e] hover:bg-[#4d176e]" disabled={!courseId || !preferredDate || requestMutation.isPending} onClick={() => requestMutation.mutate()}><Send className="mr-2 h-4 w-4" />{requestMutation.isPending ? "Sending request…" : "Request tutor session"}</Button>
            {requestMutation.isSuccess ? <p className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />Request sent. The LEA team will confirm the time and next steps.</p> : null}
            {requestMutation.isError ? <p className="text-sm text-destructive">{requestMutation.error instanceof Error ? requestMutation.error.message : "Unable to send request."}</p> : null}
          </>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Your tutor requests</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {requests.length ? requests.map((request) => <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div><p className="font-medium">{request.course_title}</p><p className="text-xs text-muted-foreground">{request.mode === "in_person" ? "Face-to-face" : "Online"} · {request.preferredDate} at {request.preferredTime} · {kes(request.quoted_price_kes)}</p></div><span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", request.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{request.status}</span></div>) : <p className="text-sm text-muted-foreground">No tutor requests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
