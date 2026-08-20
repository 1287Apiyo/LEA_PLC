"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Globe2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PublicProject {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  reflection: string;
  published_at: string | null;
}

export function PublicPortfolioProject({ id }: { id: string }) {
  const query = useQuery({ queryKey: ["public-portfolio-project", id], queryFn: () => api.get<{ data: PublicProject }>(`/portfolio/${encodeURIComponent(id)}`) });
  if (query.isLoading) return <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16"><Card className="w-full"><CardContent className="p-10 text-center text-sm text-muted-foreground">Loading portfolio project…</CardContent></Card></main>;
  if (query.isError || !query.data?.data) return <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16"><Card className="w-full"><CardContent className="p-10 text-center"><Globe2 className="mx-auto h-10 w-10 text-[#f47945]" aria-hidden /><h1 className="mt-4 text-xl font-semibold text-[#1f0d2e]">Project unavailable</h1><p className="mt-2 text-sm text-muted-foreground">This project is private or no longer published.</p></CardContent></Card></main>;
  const project = query.data.data;
  return <main className="min-h-screen bg-[#fffaf7] px-6 py-16"><div className="mx-auto max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f47945]">LEA LABS PORTFOLIO</p><div className="mt-3 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight text-[#1f0d2e]">{project.title}</h1><p className="mt-2 text-muted-foreground">A published learner project and evidence of practical work.</p></div><Badge className="bg-emerald-600 text-white"><Globe2 className="mr-1 h-3.5 w-3.5" />Published</Badge></div><Card className="mt-8"><CardHeader><CardTitle className="text-base">Project overview</CardTitle></CardHeader><CardContent className="space-y-6"><p className="text-base leading-8 text-muted-foreground">{project.description}</p>{project.reflection ? <div className="border-l-2 border-[#f47945] pl-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Learner reflection</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{project.reflection}</p></div> : null}<div className="flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>{project.link ? <Button asChild className="bg-[#f47945] text-white hover:bg-[#d85d30]"><a href={project.link} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Open project or repository</a></Button> : null}</CardContent></Card></div></main>;
}
