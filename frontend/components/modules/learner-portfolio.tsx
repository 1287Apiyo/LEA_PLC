"use client";

import { ExternalLink, GitBranch, Globe, MonitorSmartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface PortfolioProject {
  title: string;
  description: string;
  tags: string[];
  link: string;
  date: string;
}

/** Demo portfolio — the learner's own projects (wired to the API with the backend). */
const PROJECTS: PortfolioProject[] = [
  {
    title: "Personal budget tracker",
    description:
      "A spreadsheet-based budget tracker built in Digital Literacy Level 2 — income, expenses and savings goals with charts.",
    tags: ["Spreadsheets", "Data", "Level 2"],
    link: "https://portfolio.example.com/budget-tracker",
    date: "July 2026",
  },
  {
    title: "My first web page",
    description:
      "A personal profile page built with semantic HTML and CSS — the capstone project for the Web Development course.",
    tags: ["HTML", "CSS", "Capstone"],
    link: "https://portfolio.example.com/profile-page",
    date: "June 2026",
  },
  {
    title: "Python mini-project: quiz game",
    description:
      "A console quiz game with score tracking and difficulty levels, from the Python Basics module.",
    tags: ["Python", "Logic", "Coursework"],
    link: "https://github.com/learner/quiz-game",
    date: "May 2026",
  },
];

/** Learner portfolio — project cards with links and reflection. */
export function LearnerPortfolio() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Your projects, repositories and reflections — shareable with employers."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href="https://portfolio.example.com" target="_blank" rel="noreferrer">
              <Globe className="h-3.5 w-3.5" aria-hidden />
              Public portfolio
            </a>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MonitorSmartphone className="h-4 w-4" aria-hidden />
                </span>
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="flex-1 text-sm text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{project.date}</span>
                <div className="flex items-center gap-1">
                  {project.link.includes("github") ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <a href={project.link} target="_blank" rel="noreferrer" aria-label="Open repository">
                        <GitBranch className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <a href={project.link} target="_blank" rel="noreferrer" aria-label="Open project">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
