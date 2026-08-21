"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink, FileCheck2, RotateCcw, Search, Send, Users, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

type ReviewStatus = "submitted" | "graded" | "approved" | "revision_requested";
interface ReviewRow {
  id: string;
  learner_id: string;
  learner_name: string;
  course_id: string;
  course_title: string;
  lesson_id: string;
  lesson_title: string;
  assignment: string;
  response_text: string;
  evidence_url: string | null;
  status: ReviewStatus;
  submitted_at: string;
  submission_count: number;
  versions: Array<Record<string, unknown>>;
  grade: number | null;
  feedback: string;
  rubric: Record<string, number>;
  graded_at: string;
}

interface QueueResponse {
  data: ReviewRow[];
  meta: { total: number; pending: number; revision_requested: number; approved: number; graded: number };
}

const RUBRIC = ["Understanding", "Implementation", "Evidence", "Reflection"];

function statusLabel(status: ReviewStatus) {
  return status === "revision_requested" ? "Revision requested" : status.charAt(0).toUpperCase() + status.slice(1);
}

function ReviewCard({ row }: { row: ReviewRow }) {
  const queryClient = useQueryClient();
  const [grade, setGrade] = useState(row.grade === null ? "" : String(row.grade));
  const [feedback, setFeedback] = useState(row.feedback);
  const [status, setStatus] = useState<ReviewStatus>(row.status === "submitted" ? "approved" : row.status);
  const [rubric, setRubric] = useState<Record<string, string>>(
    Object.fromEntries(RUBRIC.map((criterion) => [criterion, String(row.rubric?.[criterion] ?? "")])),
  );

  const save = useMutation({
    mutationFn: () => api.patch<{ data: ReviewRow }>(`/instructor/submissions/${row.id}`, {
      grade: Number(grade),
      feedback,
      status,
      rubric: Object.fromEntries(Object.entries(rubric).map(([key, value]) => [key, Number(value || 0)])),
    }),
    onSuccess: () => {
      toast.success(status === "revision_requested" ? "Revision request sent to learner." : "Submission review saved.");
      void queryClient.invalidateQueries({ queryKey: ["instructor-submissions"] });
      void queryClient.invalidateQueries({ queryKey: ["instructor-dashboard"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save this review."),
  });

  return (
    <Card className="overflow-hidden rounded-[1.25rem] border-black/[0.06] shadow-sm">
      <div className={cn("h-1", row.status === "submitted" ? "bg-[#f47945]" : row.status === "revision_requested" ? "bg-amber-500" : "bg-emerald-500")} />
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-[#4d176e]">{row.course_title}</span>
              <span aria-hidden>·</span>
              <span>{row.lesson_title}</span>
            </div>
            <h2 className="mt-1 text-base font-semibold text-foreground">{row.learner_name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Submitted {new Date(row.submitted_at).toLocaleString()} · Version {row.submission_count}</p>
          </div>
          <span className={cn(
            "inline-flex items-center border px-2.5 py-1 text-xs font-semibold",
            row.status === "submitted" && "border-[#f47945]/40 bg-[#fff8f4] text-[#7b3218]",
            row.status === "revision_requested" && "border-amber-300 bg-amber-50 text-amber-800",
            row.status === "approved" && "border-emerald-300 bg-emerald-50 text-emerald-800",
            row.status === "graded" && "border-[#4d176e]/20 bg-[#f4ecf8] text-[#4d176e]",
          )}>{statusLabel(row.status)}</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.8fr)]">
          <div className="space-y-3">
            <div className="border border-border bg-[#fffdfb] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Assignment brief</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.assignment || "Learner submission"}</p>
            </div>
            <div className="border border-[#4d176e]/12 bg-[#fbf8fd] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4d176e]">Learner response</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{row.response_text}</p>
              {row.evidence_url ? (
                <a href={row.evidence_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4d176e] underline underline-offset-2 hover:text-[#b94920]">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open evidence
                </a>
              ) : null}
            </div>
            {row.versions.length > 1 ? <p className="text-xs text-muted-foreground">This learner has submitted {row.versions.length} versions. Review the current response above and use the history in the learner course view when needed.</p> : null}
          </div>

          <div className="space-y-3 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <label className="space-y-1.5 text-xs font-semibold">Final grade (0–100)
                <input value={grade} onChange={(event) => setGrade(event.target.value)} type="number" min="0" max="100" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" placeholder="e.g. 78" />
              </label>
              <label className="space-y-1.5 text-xs font-semibold">Review outcome
                <select value={status} onChange={(event) => setStatus(event.target.value as ReviewStatus)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                  <option value="approved">Approved</option>
                  <option value="graded">Graded — keep practising</option>
                  <option value="revision_requested">Request revision</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {RUBRIC.map((criterion) => (
                <label key={criterion} className="space-y-1 text-[11px] font-semibold text-muted-foreground">{criterion}
                  <input value={rubric[criterion] ?? ""} onChange={(event) => setRubric((current) => ({ ...current, [criterion]: event.target.value }))} type="number" min="0" max="100" className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-normal text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" placeholder="0–100" />
                </label>
              ))}
            </div>
            <Textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} rows={5} placeholder="Give specific, actionable feedback: what is working, what to improve, and the next step." />
            <Button type="button" onClick={() => save.mutate()} disabled={save.isPending || !grade || !feedback.trim()} className="w-full bg-[#4d176e] text-white hover:bg-[#35104f]">
              <Send className="mr-1.5 h-4 w-4" aria-hidden />
              {save.isPending ? "Saving review…" : status === "revision_requested" ? "Send revision request" : "Save grade and feedback"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InstructorGrading() {
  const [status, setStatus] = useState("submitted");
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["instructor-submissions", status, search],
    queryFn: () => api.get<QueueResponse>(`/instructor/submissions?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`),
  });
  const rows = data?.data ?? [];
  const meta = data?.meta;

  const statCards: Array<{ label: string; value: number; Icon: LucideIcon; filter: string }> = [
    { label: "Awaiting review", value: meta?.pending ?? 0, Icon: FileCheck2, filter: "submitted" },
    { label: "Revision requests", value: meta?.revision_requested ?? 0, Icon: RotateCcw, filter: "revision_requested" },
    { label: "Approved", value: meta?.approved ?? 0, Icon: CheckCircle2, filter: "approved" },
    { label: "Learner submissions", value: meta?.total ?? 0, Icon: Users, filter: "all" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Grading queue" description="Review learner evidence, score the work, and keep feedback connected to the next learning step." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, Icon, filter }) => (
          <button key={String(label)} type="button" onClick={() => setStatus(String(filter))} className={cn("rounded-xl border bg-background p-4 text-left shadow-sm transition-colors hover:border-[#f47945]/60", status === filter && "border-[#4d176e] bg-[#fbf8fd]")}>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-[#f47945]" aria-hidden /></div>
            <p className="mt-2 text-2xl font-semibold text-[#4d176e]">{value}</p>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search learner, course, lesson, or response…" className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}><RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Refresh queue</Button>
      </div>
      {isLoading ? <div className="space-y-4"><Skeleton className="h-56 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div> : isError ? <div className="border border-dashed p-10 text-center text-sm text-muted-foreground">Could not load the grading queue. <Button variant="outline" size="sm" className="ml-2" onClick={() => void refetch()}>Retry</Button></div> : rows.length ? <div className="space-y-4">{rows.map((row) => <ReviewCard key={row.id} row={row} />)}</div> : <div className="border border-dashed p-12 text-center"><p className="text-sm font-semibold">No submissions in this view</p><p className="mt-1 text-xs text-muted-foreground">New learner work from your assigned courses will appear here.</p></div>}
    </div>
  );
}
