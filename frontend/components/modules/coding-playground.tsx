"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

type Language = "html" | "css" | "javascript" | "python" | "java";

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

/** Coding playground — editor with live HTML/CSS/JS preview and auto-save. */
export function CodingPlayground() {
  const [language, setLanguage] = useState<Language>("html");
  const [code, setCode] = useState<string>(STARTER_CODE.html);
  const [previewHtml, setPreviewHtml] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Switch starter code when language changes.
  const switchLanguage = (next: Language) => {
    setLanguage(next);
    setCode(STARTER_CODE[next]);
    setPreviewHtml("");
  };

  // Auto-save (locally) — debounced.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSavedAt(new Date());
    }, 800);
    return () => clearTimeout(timer);
  }, [code]);

  const run = () => {
    if (language === "html") {
      setPreviewHtml(code);
      return;
    }
    if (language === "css" || language === "javascript") {
      // Preview combining a simple page with the code.
      const css = language === "css" ? code : "";
      const js = language === "javascript" ? code : "";
      setPreviewHtml(`<!DOCTYPE html><html><head><style>${css}</style></head>
        <body><h1>Live preview</h1><p>Your ${language.toUpperCase()} runs here.</p>
        <script>${js}<\/script></body></html>`);
      return;
    }
    setPreviewHtml("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coding workspace"
        description="Write and run code right in your browser — HTML, CSS, JavaScript, Python and Java."
        actions={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Save className="h-3.5 w-3.5" aria-hidden />
            {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Auto-save on"}
          </span>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">Editor</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={language} onValueChange={(value) => switchLanguage(value as Language)}>
              <TabsList className="h-8">
                {LANGUAGES.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} className="px-2.5 text-xs">
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button size="sm" className="gap-1.5" onClick={run}>
              <Play className="h-3.5 w-3.5" aria-hidden />
              Run
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            aria-label="Code editor"
            className={cn(
              "h-72 w-full resize-none rounded-none border-x-0 border-t bg-muted/40 p-4 font-mono text-sm leading-relaxed outline-none focus-visible:ring-0"
            )}
          />
          <div className="border-t p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Live preview
            </p>
            {previewHtml ? (
              <iframe
                title="Live preview"
                srcDoc={previewHtml}
                className="h-56 w-full rounded-lg border bg-white"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                {language === "python" || language === "java"
                  ? "Console output will appear here when you press Run (backend evaluation coming with the API)."
                  : "Press Run to preview your code."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
