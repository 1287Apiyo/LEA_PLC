"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { resourceService, type ResourceRow } from "@/services/resources";

export type Language = "html" | "css" | "javascript" | "python" | "java";

const STARTER_CODE: Record<Language, string> = {
  html: `<!DOCTYPE html>
<html>
  <body>
    <h1>Hello, LEA Labs!</h1>
    <p>Edit this code and press Run to see your page.</p>
  </body>
</html>`,
  css: `body {
  font-family: sans-serif;
  background: #f4f4f5;
  color: #18181b;
  padding: 24px;
}

h1 {
  color: #2563eb;
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
        System.out.println("Hello, Learner!");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
};

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
];

/** One flat color per language, like Scratch's colored blocks. */
const LANGUAGE_DOTS: Record<Language, string> = {
  html: "bg-orange-500",
  css: "bg-sky-500",
  javascript: "bg-yellow-400",
  python: "bg-emerald-500",
  java: "bg-violet-500",
};

/**
 * Coding playground — editor on the left, live result on the right.
 * HTML/CSS/JS render in a sandboxed preview; Python/Java show a console panel.
 */
export function CodingPlayground({ initialLanguage = "html" }: { initialLanguage?: Language }) {
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [code, setCode] = useState<string>(STARTER_CODE[initialLanguage]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [snippetId, setSnippetId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const snippetsQuery = useQuery({
    queryKey: ["coding-workspace-snippets"],
    queryFn: () => resourceService.list("projects", { per_page: 100, sort: "updated_at", order: "desc" }),
  });
  const rows = useMemo(() => (snippetsQuery.data?.data ?? []) as ResourceRow[], [snippetsQuery.data?.data]);

  useEffect(() => {
    if (snippetsQuery.isLoading) return;
    const existing = rows.find((row) => row.kind === "workspace_snippet" && row.language === language);
    setSnippetId(existing?.id ? String(existing.id) : null);
    setCode(existing?.code ? String(existing.code) : STARTER_CODE[language]);
    setHydrated(true);
  }, [language, snippetsQuery.isLoading, rows]);

  const { mutate: persistSnippet, isError: saveFailed, isPending: savePending } = useMutation({
    mutationFn: () => {
      const payload = {
        title: `Coding workspace · ${language.toUpperCase()}`,
        kind: "workspace_snippet",
        language,
        code,
        status: "active",
      };
      return snippetId ? resourceService.update("projects", snippetId, payload) : resourceService.create("projects", payload);
    },
    onSuccess: (result) => {
      setSnippetId(String(result.data.id));
      setSavedAt(new Date());
      queryClient.invalidateQueries({ queryKey: ["coding-workspace-snippets"] });
    },
  });

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => persistSnippet(), 800);
    return () => window.clearTimeout(timer);
  }, [code, language, hydrated, snippetId, persistSnippet]);

  const switchLanguage = (next: Language) => {
    setHydrated(false);
    setLanguage(next);
    setPreviewHtml("");
  };

  const run = () => {
    if (language === "html") {
      setPreviewHtml(code);
      return;
    }
    if (language === "css" || language === "javascript") {
      const css = language === "css" ? code : "";
      const js = language === "javascript" ? code : "";
      setPreviewHtml(`<!DOCTYPE html><html><head><style>${css}</style></head><body><h1>Live preview</h1><p>Your ${language.toUpperCase()} runs here.</p><script>${js}<\/script></body></html>`);
    }
  };

  const isConsole = language === "python" || language === "java";
  const saveLabel = saveFailed ? "Save failed — retrying" : savePending ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Auto-save on";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coding workspace"
        description="Write and run browser code, while your latest snippet is saved to your learner account."
        actions={<span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Save className="h-3.5 w-3.5" aria-hidden />{saveLabel}</span>}
      />

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-3">
          <div className="flex items-center gap-1.5"><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><CardTitle className="ml-2 text-sm font-medium">Editor</CardTitle></div>
          <div className="flex items-center gap-2">
            <Tabs value={language} onValueChange={(value) => switchLanguage(value as Language)}><TabsList className="h-8">{LANGUAGES.map((item) => <TabsTrigger key={item.id} value={item.id} className="px-2.5 text-xs"><span className="flex items-center gap-1.5"><span aria-hidden className={cn("h-2 w-2 rounded-full", LANGUAGE_DOTS[item.id])} />{item.label}</span></TabsTrigger>)}</TabsList></Tabs>
            <Button size="sm" disabled={isConsole} className="gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600" onClick={run}><Play className="h-3.5 w-3.5" aria-hidden />{isConsole ? "Preview unavailable" : "Run"}</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} aria-label="Code editor" className="h-[460px] w-full resize-none border-x-0 border-t bg-muted/40 p-4 font-mono text-sm leading-relaxed outline-none focus-visible:ring-0 lg:border-r lg:border-t-0" />
            <div className="flex h-[460px] flex-col border-t lg:border-l lg:border-t-0">
              <div className="flex items-center gap-1.5 border-b px-4 py-2.5"><CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden /><p className="text-xs font-medium text-muted-foreground">{isConsole ? "Language note" : "Live preview"}</p></div>
              <div className="min-h-0 flex-1 p-4">{previewHtml && !isConsole ? <iframe title="Live preview" srcDoc={previewHtml} className="h-full w-full rounded-lg border bg-white" sandbox="allow-scripts" /> : <div className={cn("flex h-full min-h-[240px] items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground", isConsole && "border-transparent bg-[#0B1026] p-4 font-mono text-xs text-slate-300")}><p className="max-w-sm leading-relaxed">{isConsole ? "Python and Java snippets are saved to your workspace for coursework and assignment submission. Browser preview is available for HTML, CSS, and JavaScript." : "Press Run to preview your creation."}</p></div>}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
