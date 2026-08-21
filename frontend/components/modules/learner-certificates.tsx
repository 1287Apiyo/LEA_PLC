"use client";

import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Award, CheckCircle2, Circle, Loader2, RefreshCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLearnerDashboard } from "@/hooks/use-dashboard";
import type { LearnerCourse } from "@/types/dashboard";

interface CompletionData {
  course_id: string;
  course_title: string;
  eligible: boolean;
  certificate_id: string | null;
  verification_code: string | null;
  rules: {
    lessons_viewed: { passed: boolean; completed: number; required: number };
    assignments_submitted: { passed: boolean; submitted: number; required: number };
    quizzes_passed: { passed: boolean; passed_count: number; required: number };
    grades: { passed: boolean; average: number | null; threshold: number; graded: number; required: number };
  };
}

interface CompletionResponse { data: CompletionData }

const ruleMeta = [
  { key: "lessons_viewed", label: "Lessons viewed", value: (data: CompletionData) => `${data.rules.lessons_viewed.completed}/${data.rules.lessons_viewed.required}` },
  { key: "assignments_submitted", label: "Assignments submitted", value: (data: CompletionData) => `${data.rules.assignments_submitted.submitted}/${data.rules.assignments_submitted.required}` },
  { key: "quizzes_passed", label: "Mastery checks passed", value: (data: CompletionData) => `${data.rules.quizzes_passed.passed_count}/${data.rules.quizzes_passed.required}` },
  { key: "grades", label: "Grade threshold", value: (data: CompletionData) => data.rules.grades.average === null ? `Awaiting grades · ${data.rules.grades.threshold}% required` : `${data.rules.grades.average}% average · ${data.rules.grades.threshold}% required` },
] as const;

function CourseCertificateCard({ course, completion, loading, onRefresh }: { course: LearnerCourse; completion?: CompletionData; loading: boolean; onRefresh: () => void }) {
  const queryClient = useQueryClient();
  const issue = useMutation({
    mutationFn: () => api.post<{ data: { verification_code: string; existing: boolean } }>(`/courses/${course.id}/completion`),
    onSuccess: (response) => {
      toast.success(response.data.existing ? "Your certificate is already available." : "Certificate issued successfully.");
      void queryClient.invalidateQueries({ queryKey: ["learner-resource", "certificates"] });
      void queryClient.invalidateQueries({ queryKey: ["learner-completion", course.id] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Complete the checklist before requesting a certificate."),
  });

  if (loading || !completion) return <Card><CardContent className="p-6"><div className="flex items-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking {course.title} evidence…</div></CardContent></Card>;
  const existing = Boolean(completion.certificate_id);
  return (
    <Card className="overflow-hidden rounded-[1.25rem] border-black/[0.06] shadow-sm">
      <div className="h-1 bg-[#f47945]" />
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div><CardTitle className="text-base text-[#4d176e]">{course.title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{course.programme} · {course.progress}% course progress</p></div>
        {existing ? <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><ShieldCheck className="mr-1 h-3.5 w-3.5" /> Earned</Badge> : completion.eligible ? <Badge className="bg-[#fff1e9] text-[#9b3e1c] hover:bg-[#fff1e9]">Ready to issue</Badge> : <Badge variant="outline">In progress</Badge>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {ruleMeta.map((rule) => {
            const passed = completion.rules[rule.key].passed;
            return <div key={rule.key} className="flex items-center justify-between gap-3 border border-border bg-[#fffdfb] px-3 py-2.5 text-xs"><span className="flex items-center gap-2">{passed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> : <Circle className="h-4 w-4 text-muted-foreground" aria-hidden />}<span className={passed ? "text-foreground" : "text-muted-foreground"}>{rule.label}</span></span><span className="font-semibold text-[#4d176e]">{rule.value(completion)}</span></div>;
          })}
        </div>
        {existing && completion.verification_code ? <div className="flex flex-col gap-3 border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-emerald-900">Certificate verification code</p><p className="mt-1 font-mono text-xs text-emerald-800">{completion.verification_code}</p></div><Button variant="outline" size="sm" asChild><a href={`/verify/${encodeURIComponent(completion.verification_code)}`} target="_blank" rel="noreferrer"><ShieldCheck className="mr-1.5 h-4 w-4" /> Verify publicly</a></Button></div> : <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-muted-foreground">Certificates are issued only when every item above has verified evidence. Keep practising, then refresh this checklist.</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={onRefresh}><RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> Refresh</Button><Button size="sm" disabled={!completion.eligible || issue.isPending} onClick={() => issue.mutate()} className="bg-[#4d176e] text-white hover:bg-[#35104f]"><Award className="mr-1.5 h-4 w-4" />{issue.isPending ? "Issuing…" : "Request certificate"}</Button></div></div>}
      </CardContent>
    </Card>
  );
}

export function LearnerCertificates() {
  const { data: dashboard, isLoading: dashboardLoading } = useLearnerDashboard();
  const courses = dashboard?.myCourses ?? [];
  const completionQueries = useQueries({ queries: courses.map((course) => ({ queryKey: ["learner-completion", course.id], queryFn: () => api.get<CompletionResponse>(`/courses/${course.id}/completion`), enabled: Boolean(course.id) })) });
  return <div className="space-y-4">{dashboardLoading ? <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading enrolled courses…</CardContent></Card> : courses.length ? courses.map((course, index) => <CourseCertificateCard key={course.id} course={course} completion={completionQueries[index]?.data?.data} loading={completionQueries[index]?.isLoading ?? true} onRefresh={() => void completionQueries[index]?.refetch()} />) : <Card><CardContent className="p-10 text-center"><Award className="mx-auto h-8 w-8 text-[#f47945]" /><p className="mt-3 text-sm font-semibold">No enrolled courses yet</p><p className="mt-1 text-xs text-muted-foreground">Your completion checklist will appear after you enrol in a course.</p></CardContent></Card>}</div>;
}
