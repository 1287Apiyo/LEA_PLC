"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, CheckCircle2, FileText, Plus, Target } from "lucide-react";
import { resourceService, type ResourceRow } from "@/services/resources";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const readinessItems = [
  ["profile", "Complete a clear professional profile"],
  ["cv", "Prepare a one-page CV with evidence links"],
  ["portfolio", "Publish at least two portfolio projects"],
  ["interview", "Practise explaining one project end to end"],
  ["applications", "Track applications and follow-ups consistently"],
] as const;

function asBool(row: ResourceRow | undefined, key: string) {
  return row?.[key] === true;
}

export function LearnerCareer() {
  const queryClient = useQueryClient();
  const [showApplication, setShowApplication] = useState(false);
  const [role, setRole] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const profileQuery = useQuery({ queryKey: ["career-profile"], queryFn: () => resourceService.list("career_profiles", { per_page: 10, order: "desc" }) });
  const applicationsQuery = useQuery({ queryKey: ["career-applications"], queryFn: () => resourceService.list("career_applications", { per_page: 100, sort: "created_at", order: "desc" }) });
  const profile = (profileQuery.data?.data?.[0] ?? undefined) as ResourceRow | undefined;
  const applications = applicationsQuery.data?.data ?? [];
  const readiness = useMemo(() => readinessItems.map(([key, label]) => ({ key, label, done: asBool(profile, key) || (key === "applications" && applications.length > 0) })), [applications.length, profile]);
  const completed = readiness.filter((item) => item.done).length;

  const saveProfile = useMutation({
    mutationFn: () => profile ? resourceService.update("career_profiles", String(profile.id), { headline: String(profile.headline ?? ""), summary: String(profile.summary ?? ""), skills: String(profile.skills ?? ""), profile: true, cv: Boolean(profile.cv), portfolio: Boolean(profile.portfolio), interview: Boolean(profile.interview), applications: applications.length > 0 }) : resourceService.create("career_profiles", { headline: "", summary: "", skills: "", profile: true, cv: false, portfolio: false, interview: false, applications: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["career-profile"] }),
  });
  const addApplication = useMutation({
    mutationFn: () => resourceService.create("career_applications", { role: role.trim(), organisation: organisation.trim(), link: link.trim(), notes: notes.trim(), status: "saved", created_at: new Date().toISOString() }),
    onSuccess: () => { setRole(""); setOrganisation(""); setLink(""); setNotes(""); setShowApplication(false); queryClient.invalidateQueries({ queryKey: ["career-applications"] }); },
  });
  const updateProfileField = (field: string, value: string | boolean) => {
    if (!profile) return;
    queryClient.setQueryData(["career-profile"], { data: [{ ...profile, [field]: value }] });
  };
  const submitApplication = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); addApplication.mutate(); };

  return <div className="space-y-6"><PageHeader title="Career centre" description="Turn your learning evidence into a clearer professional story and track the opportunities you want to pursue." /><div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-[#f47945]" aria-hidden />Your professional profile</CardTitle></CardHeader><CardContent className="space-y-4"><Input value={String(profile?.headline ?? "")} onChange={(event) => updateProfileField("headline", event.target.value)} placeholder="Headline, e.g. Junior frontend developer" /><Textarea value={String(profile?.summary ?? "")} onChange={(event) => updateProfileField("summary", event.target.value)} placeholder="Write a short professional summary focused on the work you can show." rows={4} /><Input value={String(profile?.skills ?? "")} onChange={(event) => updateProfileField("skills", event.target.value)} placeholder="Skills separated by commas" /><div className="flex flex-wrap gap-2"><Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending} className="bg-[#1f0d2e] hover:bg-[#4d176e]">{saveProfile.isPending ? "Saving…" : "Save career profile"}</Button><Button variant="outline" asChild><Link href="/learner/portfolio">Build portfolio</Link></Button></div>{saveProfile.isSuccess ? <p className="text-sm text-emerald-700">Career profile saved.</p> : null}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-[#f47945]" aria-hidden />Job-readiness checklist</CardTitle></CardHeader><CardContent><div className="mb-4 flex items-end justify-between"><div><p className="text-3xl font-semibold text-[#1f0d2e]">{completed}/{readiness.length}</p><p className="text-sm text-muted-foreground">milestones complete</p></div><Badge variant="outline">Build evidence</Badge></div><div className="space-y-3">{readiness.map((item) => <div key={item.key} className="flex items-center gap-3 text-sm"><CheckCircle2 className={`h-4 w-4 ${item.done ? "text-emerald-600" : "text-muted-foreground/40"}`} aria-hidden /><span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span></div>)}</div></CardContent></Card></div><Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 text-base"><BriefcaseBusiness className="h-4 w-4 text-[#f47945]" aria-hidden />Opportunity tracker</CardTitle><Button size="sm" onClick={() => setShowApplication((value) => !value)} className="bg-[#f47945] text-white hover:bg-[#d85d30]"><Plus className="mr-1 h-4 w-4" />Track opportunity</Button></div></CardHeader><CardContent>{showApplication ? <form onSubmit={submitApplication} className="mb-5 grid gap-3 border-b pb-5 sm:grid-cols-2"><Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role or opportunity" required /><Input value={organisation} onChange={(event) => setOrganisation(event.target.value)} placeholder="Organisation" required /><Input value={link} onChange={(event) => setLink(event.target.value)} type="url" placeholder="Application link (optional)" /><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Follow-up notes" rows={2} className="sm:col-span-2" /><Button type="submit" disabled={addApplication.isPending} className="sm:col-span-2 bg-[#1f0d2e] hover:bg-[#4d176e]">{addApplication.isPending ? "Saving…" : "Save opportunity"}</Button></form> : null}{applications.length ? <div className="grid gap-3 md:grid-cols-2">{applications.map((application) => <div key={String(application.id)} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{String(application.role ?? "Opportunity")}</p><p className="text-sm text-muted-foreground">{String(application.organisation ?? "Organisation not specified")}</p></div><Badge variant="outline" className="capitalize">{String(application.status ?? "saved")}</Badge></div>{application.notes ? <p className="mt-3 text-sm text-muted-foreground">{String(application.notes)}</p> : null}{application.link ? <a href={String(application.link)} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-[#4d176e] underline">Open opportunity</a> : null}</div>)}</div> : <div className="py-8 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-[#f47945]" aria-hidden /><p className="mt-3 font-medium">No opportunities tracked yet</p><p className="mt-1 text-sm text-muted-foreground">Add internships, jobs, freelance work, or partner opportunities you want to follow.</p></div>}</CardContent></Card></div>;
}
