"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, GitBranch, MonitorSmartphone, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Textarea } from "@/components/ui/textarea";
import { resourceService, type ResourceRow } from "@/services/resources";

function projectTags(row: ResourceRow): string[] {
  if (Array.isArray(row.tags)) return row.tags.map(String).filter(Boolean);
  return String(row.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);
}

function projectDate(row: ResourceRow) {
  const value = row.updated_at ?? row.created_at ?? row.date;
  if (!value) return "Recently added";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en", { month: "short", year: "numeric" });
}

/** Learner portfolio — persisted project evidence, links, tags, and reflections. */
export function LearnerPortfolio() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [reflection, setReflection] = useState("");

  const projectsQuery = useQuery({
    queryKey: ["learner-portfolio-projects"],
    queryFn: () => resourceService.list("projects", { per_page: 100, sort: "created_at", order: "desc" }),
  });

  const createProject = useMutation({
    mutationFn: () => resourceService.create("projects", {
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      reflection: reflection.trim(),
      kind: "portfolio_project",
      status: "draft",
    }),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setLink("");
      setTags("");
      setReflection("");
      queryClient.invalidateQueries({ queryKey: ["learner-portfolio-projects"] });
    },
  });

  const projects = ((projectsQuery.data?.data ?? []) as ResourceRow[]).filter((project) => project.kind !== "workspace_snippet");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createProject.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Portfolio" description="Turn your coursework into project evidence you can refine and share with employers." />

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Add a project</CardTitle>
            <p className="text-sm text-muted-foreground">Save a project only when it reflects work you have actually built.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submit}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project title" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What did you build?" rows={4} required />
              <Input value={link} onChange={(event) => setLink(event.target.value)} type="url" placeholder="Project or repository link (optional)" />
              <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags separated by commas" />
              <Textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="What did you learn, improve, or solve?" rows={4} />
              <Button type="submit" disabled={!title.trim() || !description.trim() || createProject.isPending} className="w-full bg-[#1f0d2e] hover:bg-[#4d176e]"><Plus className="mr-2 h-4 w-4" />{createProject.isPending ? "Saving project…" : "Save project"}</Button>
              {createProject.isSuccess ? <p className="text-sm text-emerald-700">Project saved to your portfolio.</p> : null}
              {createProject.isError ? <p className="text-sm text-destructive">{createProject.error instanceof Error ? createProject.error.message : "Unable to save project."}</p> : null}
            </form>
          </CardContent>
        </Card>

        <div>
          {projectsQuery.isLoading ? <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading your portfolio…</CardContent></Card> : projects.length === 0 ? <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No portfolio projects yet. Add your first project to begin building visible evidence of your skills.</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2">{projects.map((project) => {
            const projectLink = String(project.link ?? "");
            const tagsForProject = projectTags(project);
            return <Card key={String(project.id)} className="flex flex-col"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><MonitorSmartphone className="h-4 w-4 shrink-0 text-muted-foreground" />{String(project.title ?? "Untitled project")}</CardTitle></CardHeader><CardContent className="flex flex-1 flex-col gap-3"><p className="flex-1 text-sm text-muted-foreground">{String(project.description ?? "")}</p>{project.reflection ? <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground"><span className="font-medium text-foreground">Reflection: </span>{String(project.reflection)}</div> : null}<div className="flex flex-wrap gap-1.5">{tagsForProject.map((tag) => <Badge key={tag} variant="secondary" className="text-[11px]">{tag}</Badge>)}</div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{projectDate(project)}</span>{projectLink ? <Button variant="ghost" size="sm" asChild><a href={projectLink} target="_blank" rel="noreferrer">{projectLink.includes("github") ? <GitBranch className="mr-1 h-3.5 w-3.5" /> : <ExternalLink className="mr-1 h-3.5 w-3.5" />}Open</a></Button> : <span className="text-xs text-muted-foreground">No link added</span>}</div></CardContent></Card>;
          })}</div>}
        </div>
      </div>
    </div>
  );
}
