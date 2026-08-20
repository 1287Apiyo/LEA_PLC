"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Blocks, Code2, ExternalLink, FolderOpen, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { resourceService, type ResourceRow } from "@/services/resources";

const LOCAL_PROJECT_ART = [
  "/lesson-art/block_explorer_hero.png",
  "/lesson-art/reliable_states.png",
  "/lesson-art/request_response.png",
  "/lesson-art/generative_tokens.png",
  "/lesson-art/data_signal.png",
  "/lesson-art/engineering_loop.png",
  "/lesson-art/debugging_evidence.png",
] as const;
type ProjectArt = (typeof LOCAL_PROJECT_ART)[number];

function projectDate(row: ResourceRow) {
  const value = row.updated_at ?? row.created_at;
  if (!value) return "Saved recently";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "Saved recently" : date.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

function blockCount(row: ResourceRow) {
  if (Array.isArray(row.script)) return row.script.length;
  if (typeof row.script === "string") {
    try {
      const parsed = JSON.parse(row.script) as unknown;
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

function codeLineCount(row: ResourceRow) {
  return Math.max(1, String(row.code ?? "").split("\n").length);
}

function kindLabel(row: ResourceRow) {
  if (row.kind === "scratch_project") return "Scratch project";
  if (row.language) return `${String(row.language).toUpperCase()} project`;
  return "Coding project";
}

function technologyLabel(row: ResourceRow) {
  if (row.kind === "scratch_project") return "Blocks + animation";
  const language = String(row.language ?? "").toLowerCase();
  const title = String(row.title ?? "").toLowerCase();
  if (language === "kotlin" || title.includes("android") || title.includes("mobile")) return "Android development";
  if (title.includes("api") || title.includes("integration")) return "API integration";
  if (title.includes("ai") || title.includes("automation")) return "Applied AI";
  if (language === "html") return "Web structure";
  if (language === "css") return "Interface styling";
  if (language === "javascript") return "Web interaction";
  if (language === "python") return "Programming logic";
  if (language === "java") return "Application code";
  return "Coursework project";
}

function projectPreviewAsset(row: ResourceRow): ProjectArt {
  const stored = String(row.preview_asset ?? "");
  if ((LOCAL_PROJECT_ART as readonly string[]).includes(stored)) return stored as ProjectArt;
  if (row.kind === "scratch_project") return "/lesson-art/block_explorer_hero.png";

  const language = String(row.language ?? "").toLowerCase();
  const hint = `${language} ${String(row.title ?? "")}`.toLowerCase();
  if (language === "kotlin" || hint.includes("android") || hint.includes("mobile")) return "/lesson-art/reliable_states.png";
  if (hint.includes("api") || hint.includes("integration")) return "/lesson-art/request_response.png";
  if (hint.includes("ai") || hint.includes("automation")) return "/lesson-art/generative_tokens.png";
  if (language === "python" || language === "javascript") return "/lesson-art/data_signal.png";
  if (language === "css") return "/lesson-art/debugging_evidence.png";
  if (language === "html" || language === "java") return "/lesson-art/engineering_loop.png";
  return "/lesson-art/debugging_evidence.png";
}

function resumeHref(row: ResourceRow) {
  const id = encodeURIComponent(String(row.id));
  if (row.kind === "scratch_project") return `/learner/playground?mode=scratch&projectId=${id}`;
  const language = encodeURIComponent(String(row.language ?? "html"));
  return `/learner/playground?mode=code&projectId=${id}&language=${language}`;
}

/** Unified learner project shelf for Scratch, web, programming, and mobile-code work. */
export function LearnerProjects() {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery({
    queryKey: ["learner-projects"],
    queryFn: () => resourceService.list("projects", { per_page: 100, sort: "updated_at", order: "desc" }),
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => resourceService.remove("projects", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-projects"] });
      queryClient.invalidateQueries({ queryKey: ["learner-coding-projects"] });
      queryClient.invalidateQueries({ queryKey: ["learner-scratch-projects"] });
    },
  });

  const projects = useMemo(
    () => ((projectsQuery.data?.data ?? []) as ResourceRow[]).filter((project) => ["scratch_project", "coding_project", "workspace_snippet"].includes(String(project.kind))),
    [projectsQuery.data?.data],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Keep every creation in one place — Scratch games, websites, Java, Python, Kotlin, and more."
        actions={<div className="flex flex-wrap gap-2"><Button asChild variant="outline" className="gap-2 border-[#eadcf0] text-[#4d176e]"><Link href="/learner/playground?mode=scratch"><Blocks className="h-4 w-4" aria-hidden /> New Scratch project</Link></Button><Button asChild className="gap-2 bg-[#f47945] text-white hover:bg-[#d95d2e]"><Link href="/learner/playground?mode=code"><Plus className="h-4 w-4" aria-hidden /> New coding project</Link></Button></div>}
      />

      <Card className="overflow-hidden border-[#eadcf0] bg-gradient-to-r from-[#1f0d2e] via-[#4d176e] to-[#7e398f] text-white">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="max-w-2xl"><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffd3bd]"><Sparkles className="h-4 w-4" aria-hidden /> Your learning shelf</div><h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Build across every course. Keep the evidence.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Save coding work from any class alongside Scratch projects. Each card opens the right editor with the saved code or blocks ready to continue.</p></div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs sm:min-w-[230px]"><div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-white/60">All projects</p><p className="mt-1 text-xl font-semibold">{projects.length}</p></div><div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-white/60">Code + blocks</p><p className="mt-1 text-xl font-semibold text-[#ffd3bd]">{projects.filter((project) => project.kind === "scratch_project").length} + {projects.filter((project) => project.kind !== "scratch_project").length}</p></div></div>
        </CardContent>
      </Card>

      {projectsQuery.isLoading ? <Card><CardContent className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading your projects…</CardContent></Card> : projectsQuery.isError ? <Card><CardContent className="p-10 text-center text-sm text-destructive">We could not load your projects. Refresh the page and try again.</CardContent></Card> : projects.length === 0 ? <Card className="border-dashed border-[#d9c6e1] bg-[#fffdfb]"><CardContent className="flex flex-col items-center justify-center p-12 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6eef9] text-[#4d176e]"><FolderOpen className="h-8 w-8" aria-hidden /></div><h2 className="text-lg font-semibold text-[#151116]">Your project shelf is ready.</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Create a Scratch project or open the coding workspace, name your work, and save it. Everything will appear here for easy resume access.</p><div className="mt-5 flex flex-wrap justify-center gap-2"><Button asChild variant="outline" className="gap-2 border-[#eadcf0] text-[#4d176e]"><Link href="/learner/playground?mode=scratch"><Blocks className="h-4 w-4" aria-hidden /> Start with Scratch</Link></Button><Button asChild className="gap-2 bg-[#4d176e] hover:bg-[#1f0d2e]"><Link href="/learner/playground?mode=code"><Code2 className="h-4 w-4" aria-hidden /> Start coding</Link></Button></div></CardContent></Card> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => { const id = String(project.id); const title = String(project.title ?? "Untitled project"); const isScratch = project.kind === "scratch_project"; const illustration = projectPreviewAsset(project); const tech = technologyLabel(project); return <Card key={id} className="group flex flex-col overflow-hidden border-[#eadcf0] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(77,23,110,0.12)]"><div className="relative h-44 overflow-hidden bg-[#f6eef9]"><Image src={illustration} alt={`${tech} project illustration`} fill sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1f0d2e]/75 via-[#1f0d2e]/10 to-transparent" /><div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3"><span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#4d176e]">{isScratch ? "Scratch" : String(project.language ?? "Code").toUpperCase()}</span><span className="rounded-full bg-[#f47945]/95 px-2.5 py-1 text-[10px] font-bold text-white">{isScratch ? "Blocks" : "Coursework"}</span></div><div className="absolute inset-x-3 bottom-3"><p className="text-xs font-semibold text-white/80">{tech}</p><p className="mt-0.5 text-[10px] text-white/65">LEA Labs project preview</p></div></div><CardHeader className="pb-2"><CardTitle className="line-clamp-1 text-base text-[#151116]">{title}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col gap-4"><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge variant="secondary" className="bg-[#f6eef9] text-[#4d176e]">{kindLabel(project)}</Badge>{isScratch ? <span>{blockCount(project)} blocks</span> : <span>{codeLineCount(project)} lines</span>}<span>·</span><span>{projectDate(project)}</span></div><div className="mt-auto flex items-center gap-2"><Button asChild className="flex-1 gap-1.5 bg-[#f47945] text-white hover:bg-[#d95d2e]"><Link href={resumeHref(project)}><ExternalLink className="h-3.5 w-3.5" aria-hidden /> Resume</Link></Button><Button type="button" variant="outline" size="icon" aria-label={`Delete ${title}`} disabled={deleteProject.isPending} onClick={() => { if (window.confirm(`Delete “${title}”?`)) deleteProject.mutate(id); }} className="border-[#eadcf0] text-muted-foreground hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" aria-hidden /></Button></div></CardContent></Card>; })}</div>}
    </div>
  );
}

/** Backwards-compatible export for existing imports. */
export const ScratchProjects = LearnerProjects;
