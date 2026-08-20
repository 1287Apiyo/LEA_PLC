"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Code2, FileCode2, Loader2, Play, RotateCcw, Save, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { resourceService, type ResourceRow } from "@/services/resources";

export type Language = "html" | "css" | "javascript" | "python" | "java" | "kotlin";

const STARTER_CODE: Record<Language, string> = {
  html: `<!DOCTYPE html>
<html>
  <body>
    <main class="welcome">
      <h1>Hello, LEA Labs!</h1>
      <p>Edit this page and press Run to see your creation.</p>
    </main>
  </body>
</html>`,
  css: `body {
  font-family: system-ui, sans-serif;
  background: #f6eef9;
  color: #1f0d2e;
  padding: 32px;
}

.welcome {
  max-width: 620px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 20px;
  background: white;
}

h1 {
  color: #4d176e;
}`,
  javascript: `// Your first JavaScript program
const name = "Learner";
console.log("Hello, " + name + "!");

for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}`,
  python: `# Your first Python program
name = "Learner"
print(f"Hello, {name}!")

for i in range(1, 6):
    print(f"Count: {i}")`,
  java: `public class Main {
    public static void main(String[] args) {
        String name = "Learner";
        System.out.println("Hello, " + name + "!");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
  kotlin: `fun main() {
    val name = "Learner"
    println("Hello, " + name + "!")

    for (i in 1..5) {
        println("Count: " + i)
    }
}`,
};

const LANGUAGES: { id: Language; label: string; description: string }[] = [
  { id: "html", label: "HTML", description: "Structure" },
  { id: "css", label: "CSS", description: "Style" },
  { id: "javascript", label: "JavaScript", description: "Interaction" },
  { id: "python", label: "Python", description: "Logic" },
  { id: "java", label: "Java", description: "Applications" },
  { id: "kotlin", label: "Kotlin", description: "Android" },
];

const LANGUAGE_DOTS: Record<Language, string> = {
  html: "bg-orange-500",
  css: "bg-sky-500",
  javascript: "bg-yellow-400",
  python: "bg-emerald-500",
  java: "bg-violet-500",
  kotlin: "bg-indigo-500",
};

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.some((item) => item.id === value);
}

function languageLabel(language: Language) {
  return LANGUAGES.find((item) => item.id === language)?.label ?? language;
}

function projectTitle(language: Language) {
  return `${languageLabel(language)} learning project`;
}

function projectPreviewAsset(language: Language, title: string) {
  const hint = `${language} ${title}`.toLowerCase();
  if (hint.includes("android") || hint.includes("mobile") || language === "kotlin") return "/lesson-art/reliable_states.png";
  if (hint.includes("api") || hint.includes("integration")) return "/lesson-art/request_response.png";
  if (hint.includes("ai") || hint.includes("automation")) return "/lesson-art/generative_tokens.png";
  if (language === "python") return "/lesson-art/data_signal.png";
  if (language === "java") return "/lesson-art/engineering_loop.png";
  if (language === "html" || language === "css" || language === "javascript") return "/lesson-art/engineering_loop.png";
  return "/lesson-art/debugging_evidence.png";
}

/** General coding playground — a polished editor with live preview and persisted learner projects. */
export function CodingPlayground({ initialLanguage = "html", initialProjectId = null }: { initialLanguage?: Language; initialProjectId?: string | null }) {
  const queryClient = useQueryClient();
  const safeInitialLanguage = isLanguage(initialLanguage) ? initialLanguage : "html";
  const [language, setLanguage] = useState<Language>(safeInitialLanguage);
  const [code, setCode] = useState<string>(STARTER_CODE[safeInitialLanguage]);
  const [title, setTitle] = useState(projectTitle(safeInitialLanguage));
  const [previewHtml, setPreviewHtml] = useState("");
  const [projectId, setProjectId] = useState<string | null>(initialProjectId);
  const [hydrated, setHydrated] = useState(false);
  const [saveNotice, setSaveNotice] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const projectsQuery = useQuery({
    queryKey: ["learner-coding-projects"],
    queryFn: () => resourceService.list("projects", { per_page: 100, sort: "updated_at", order: "desc" }),
  });
  const rows = useMemo(() => (projectsQuery.data?.data ?? []) as ResourceRow[], [projectsQuery.data?.data]);

  useEffect(() => {
    if (projectsQuery.isLoading || hydrated) return;
    const selected = initialProjectId
      ? rows.find((row) => String(row.id) === initialProjectId)
      : rows.find((row) => row.kind === "workspace_snippet" && row.language === language);
    const selectedLanguage = String(selected?.language ?? language);
    const safeLanguage: Language = isLanguage(selectedLanguage)
      ? selectedLanguage
      : (isLanguage(language) ? language : "html");
    setProjectId(selected?.id ? String(selected.id) : initialProjectId);
    setLanguage(safeLanguage);
    setTitle(String(selected?.title ?? projectTitle(safeLanguage)));
    setCode(String(selected?.code ?? STARTER_CODE[safeLanguage]));
    setHydrated(true);
  }, [hydrated, initialProjectId, language, projectsQuery.isLoading, rows]);

  const saveProject = useMutation({
    mutationFn: () => {
      const payload = {
        title: title.trim() || projectTitle(language),
        editor: "coding",
        language,
        code,
        preview_asset: projectPreviewAsset(language, title),
        status: "draft",
      };
      return projectId ? resourceService.update("projects", projectId, payload) : resourceService.create("projects", payload);
    },
    onMutate: () => {
      setSaveNotice("saving");
    },
    onSuccess: (result) => {
      setProjectId(String(result.data.id));
      setSaveNotice("saved");
      queryClient.invalidateQueries({ queryKey: ["learner-coding-projects"] });
      queryClient.invalidateQueries({ queryKey: ["learner-projects"] });
    },
    onError: () => {
      setSaveNotice("error");
    },
  });

  const switchLanguage = (next: Language) => {
    setHydrated(false);
    setProjectId(null);
    setLanguage(next);
    setTitle(projectTitle(next));
    setCode(STARTER_CODE[next]);
    setPreviewHtml("");
  };

  const resetStarter = () => {
    setCode(STARTER_CODE[language]);
    setPreviewHtml("");
  };

  const run = () => {
    const source = String(code ?? "");
    if (language === "html") {
      setPreviewHtml(source);
      return;
    }
    if (language === "css" || language === "javascript") {
      const css = language === "css" ? source : "";
      const js = language === "javascript" ? source : "";
      setPreviewHtml(`<!DOCTYPE html><html><head><style>${css}</style></head><body><main class="welcome"><h1>Live preview</h1><p>Your ${languageLabel(language)} runs here.</p></main><script>${js}\\u003c/script></body></html>`);
    }
  };

  const isConsole = language === "python" || language === "java" || language === "kotlin";

  return (
    <div className="space-y-6">

      <Card className="overflow-hidden border-[#eadcf0]">
        <CardHeader className="flex flex-col gap-4 border-b bg-[#fffdfb] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6eef9] text-[#4d176e]"><Code2 className="h-4 w-4" aria-hidden /></span><div className="min-w-0"><CardTitle className="truncate text-base">{title || "Untitled coding project"}</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Saved work stays in your Projects shelf.</p></div></div>
          <div className="flex flex-wrap items-center gap-2"><Input value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Project title" className="h-9 w-full min-w-[190px] max-w-[260px] bg-white text-sm" placeholder="Project title" /><Button type="button" variant="outline" size="sm" onClick={resetStarter} className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset</Button><Button type="button" size="sm" onClick={() => saveProject.mutate()} disabled={saveProject.isPending} className="gap-1.5 bg-[#f47945] text-white hover:bg-[#d95d2e]"><Save className="h-3.5 w-3.5" aria-hidden /> Save project</Button>{saveNotice === "saving" ? <span role="status" className="flex items-center gap-1.5 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />Saving…</span> : null}{saveNotice === "saved" ? <span role="status" className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden />Saved to Projects</span> : null}{saveNotice === "error" ? <span role="alert" className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700"><AlertCircle className="h-3.5 w-3.5" aria-hidden />Save failed</span> : null}</div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-[#f7f3f8] px-4 py-3"><Tabs value={language} onValueChange={(value) => switchLanguage(value as Language)}><TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0"><>{LANGUAGES.map((item) => <TabsTrigger key={item.id} value={item.id} className="gap-2 rounded-lg border border-transparent bg-white px-3 py-2 text-xs data-[state=active]:border-[#d9c6e1] data-[state=active]:bg-[#4d176e] data-[state=active]:text-white"><span aria-hidden className={cn("h-2 w-2 rounded-full", LANGUAGE_DOTS[item.id])} />{item.label}<span className="hidden text-[10px] opacity-60 sm:inline">{item.description}</span></TabsTrigger>)}</></TabsList></Tabs></div>
          <div className="grid min-h-[760px] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-w-0 border-b lg:border-b-0 lg:border-r"><div className="flex items-center justify-between border-b bg-[#21152a] px-4 py-2.5 text-xs text-white/75"><span className="flex items-center gap-2"><FileCode2 className="h-3.5 w-3.5" aria-hidden />{languageLabel(language)} source</span><span className="font-mono text-[10px] text-white/45">{String(code ?? "").split("\n").length} lines</span></div><textarea value={String(code ?? "")} onChange={(event) => setCode(event.target.value)} spellCheck={false} aria-label={`${languageLabel(language)} code editor`} className="h-[700px] w-full resize-none bg-[#120b17] p-5 font-mono text-sm leading-7 text-[#f4eafa] outline-none placeholder:text-white/30 focus-visible:ring-0" /></div>
            <div className="flex min-h-[700px] flex-col bg-[#fffdfb]"><div className="flex items-center justify-between border-b px-4 py-2.5"><span className="flex items-center gap-2 text-xs font-medium text-[#4d176e]"><Terminal className="h-3.5 w-3.5" aria-hidden />{isConsole ? "Language workspace" : "Live preview"}</span>{!isConsole ? <Button type="button" size="sm" onClick={run} className="h-8 gap-1.5 rounded-full bg-emerald-500 px-3 text-xs text-white hover:bg-emerald-600"><Play className="h-3.5 w-3.5" aria-hidden /> Run</Button> : <Badge variant="secondary" className="bg-[#f6eef9] text-[#4d176e]">Saved for coursework</Badge>}</div><div className="min-h-0 flex-1 p-4">{previewHtml && !isConsole ? <iframe title="Live preview" srcDoc={previewHtml} className="h-full min-h-[630px] w-full rounded-xl border border-[#eadcf0] bg-white" sandbox="allow-scripts" /> : <div className={cn("flex h-full min-h-[630px] items-center justify-center rounded-xl border border-dashed border-[#d9c6e1] bg-[#fbf8fc] p-6 text-center", isConsole && "border-[#261635] bg-[#0f0a14] font-mono text-xs text-slate-300")}><div className="max-w-sm"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6eef9] text-[#4d176e]"><Terminal className="h-5 w-5" aria-hidden /></div><p className="mt-4 font-medium text-foreground">{isConsole ? `${languageLabel(language)} is ready to explore.` : "Press Run to preview your creation."}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{isConsole ? `${languageLabel(language)} projects are saved to your learner account for coursework and later continuation. You can run them in the appropriate local development environment.` : "HTML, CSS, and JavaScript preview directly in the browser."}</p></div></div>}</div></div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
