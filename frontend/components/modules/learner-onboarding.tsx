"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { resourceService, type ResourceRow } from "@/services/resources";
import { useAuthStore } from "@/lib/auth-store";

const OPTIONS = {
  goal: [
    ["software", "Build websites, apps, and digital products"],
    ["ai", "Work with AI, automation, and data"],
    ["foundations", "Build confidence with essential computer skills"],
  ],
  experience: [
    ["new", "I am starting from the beginning"],
    ["some", "I have practised a little"],
    ["projects", "I have already built small projects"],
  ],
  pace: [
    ["steady", "2–4 hours a week"],
    ["focused", "5–8 hours a week"],
    ["intensive", "9 or more hours a week"],
  ],
  support: [
    ["guided", "Step-by-step guidance and regular check-ins"],
    ["balanced", "A mix of guidance and independent practice"],
    ["independent", "Mostly independent challenges"],
  ],
} as const;

type AnswerKey = keyof typeof OPTIONS;
type Answers = Record<AnswerKey, string>;

const DEFAULT_ANSWERS: Answers = {
  goal: "software",
  experience: "new",
  pace: "steady",
  support: "guided",
};

function recommendation(answers: Answers) {
  if (answers.goal === "ai") {
    return {
      programme: "Applied AI",
      programmeId: "prg-ai",
      description: "Start with practical AI literacy, then move into workflows, automation, and applied projects.",
      tone: "AI, automation, and data",
    };
  }
  if (answers.goal === "foundations" || answers.experience === "new") {
    return {
      programme: "Digital Foundations",
      programmeId: "prg-dl",
      description: "Build a confident digital foundation before progressing into more technical project work.",
      tone: "Digital foundations",
    };
  }
  return {
    programme: "Software Engineering",
    programmeId: "prg-coding",
    description: "Follow a project-based route through web, app, API, Scratch, and product development.",
    tone: "Software and product building",
  };
}

export function LearnerOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [saved, setSaved] = useState(false);

  const assessmentQuery = useQuery({
    queryKey: ["learner-onboarding"],
    queryFn: () => resourceService.list("onboarding_assessments", { per_page: 5, sort: "updated_at", order: "desc" }),
    enabled: Boolean(user?.id),
  });

  const existing = useMemo(
    () => ((assessmentQuery.data?.data ?? []) as ResourceRow[])[0],
    [assessmentQuery.data?.data],
  );

  useEffect(() => {
    const stored = existing?.answers;
    if (!stored || typeof stored !== "object") return;
    const values = stored as Partial<Answers>;
    setAnswers({
      goal: values.goal && OPTIONS.goal.some(([id]) => id === values.goal) ? values.goal : DEFAULT_ANSWERS.goal,
      experience: values.experience && OPTIONS.experience.some(([id]) => id === values.experience) ? values.experience : DEFAULT_ANSWERS.experience,
      pace: values.pace && OPTIONS.pace.some(([id]) => id === values.pace) ? values.pace : DEFAULT_ANSWERS.pace,
      support: values.support && OPTIONS.support.some(([id]) => id === values.support) ? values.support : DEFAULT_ANSWERS.support,
    });
  }, [existing]);

  const result = recommendation(answers);
  const saveAssessment = useMutation({
    mutationFn: () => {
      const payload = {
        title: "Learner onboarding assessment",
        type: "diagnostic",
        answers,
        recommendation: result,
        completed: true,
        completed_at: new Date().toISOString(),
      };
      return existing?.id
        ? resourceService.update("onboarding_assessments", String(existing.id), payload)
        : resourceService.create("onboarding_assessments", payload);
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["learner-onboarding"] });
      queryClient.invalidateQueries({ queryKey: ["learner-dashboard"] });
    },
  });

  const updateAnswer = (key: AnswerKey, value: string) => {
    setSaved(false);
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="overflow-hidden border-l-4 border-[#d9c6e1] border-l-[#f47945] bg-white text-[#151116] shadow-sm">
        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#b94920]"><Compass className="h-4 w-4 text-[#f47945]" aria-hidden /> Learning setup</div>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-[#151116] sm:text-4xl">Let’s find the right place to begin.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Answer four short questions. Your responses help LEA recommend a practical starting programme and the kind of support that will help you keep moving.</p>
          </div>
          <div className="rounded-2xl border border-[#eadcf0] bg-[#f6eef9] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b94920]">Your recommendation</p><p className="mt-2 text-xl font-semibold text-[#4d176e]">{result.programme}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{result.tone}</p></div>
        </CardContent>
      </Card>

      {assessmentQuery.isLoading ? <Card><CardContent className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading your learning setup…</CardContent></Card> : <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card className="border-[#eadcf0] bg-[#fffdfb]"><CardHeader><CardTitle className="text-xl">Tell us about your starting point</CardTitle></CardHeader><CardContent className="space-y-7">
          {(Object.keys(OPTIONS) as AnswerKey[]).map((key, index) => <fieldset key={key} className="space-y-3"><legend className="text-sm font-semibold text-[#151116]">{index + 1}. {key === "goal" ? "What would you most like to do?" : key === "experience" ? "How much digital or coding experience do you have?" : key === "pace" ? "How much time can you make for learning?" : "What kind of support suits you best?"}</legend><RadioGroup value={answers[key]} onValueChange={(value) => updateAnswer(key, value)} className="grid gap-2 sm:grid-cols-3">{OPTIONS[key].map(([id, label]) => <Label key={id} htmlFor={`${key}-${id}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#eadcf0] bg-white p-3 text-sm font-normal leading-5 transition hover:border-[#f47945] has-[:checked]:border-[#4d176e] has-[:checked]:bg-[#f6eef9]"><RadioGroupItem id={`${key}-${id}`} value={id} className="mt-0.5" />{label}</Label>)}</RadioGroup></fieldset>)}
          <div className="flex flex-wrap items-center gap-3 border-t border-[#eadcf0] pt-5"><Button type="button" onClick={() => saveAssessment.mutate()} disabled={saveAssessment.isPending} className="gap-2 bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]">{saveAssessment.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CheckCircle2 className="h-4 w-4" aria-hidden />} {existing ? "Update my learning setup" : "Save my learning setup"}</Button>{saved ? <span role="status" className="text-sm font-medium text-emerald-700">Saved. Your dashboard will use this recommendation.</span> : null}</div>
        </CardContent></Card>
        <Card className="h-fit border-[#eadcf0] bg-white"><CardHeader><CardTitle className="text-base text-[#151116]">Why this path?</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm leading-6 text-muted-foreground">{result.description}</p><div className="rounded-xl border border-[#eadcf0] bg-[#fff7ef] p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b94920]">Next step</p><p className="mt-1 text-sm font-medium text-[#151116]">Save your answers, then explore the recommended programme.</p><Button type="button" variant="link" className="mt-2 h-auto p-0 text-[#4d176e]" onClick={() => router.push(`/learner/courses?programme=${result.programmeId}`)}>Explore {result.programme}<ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden /></Button></div></CardContent></Card>
      </div>}
    </div>
  );
}
