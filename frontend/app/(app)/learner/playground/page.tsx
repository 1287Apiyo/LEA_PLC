import { CodingPlayground } from "@/components/modules/coding-playground";
import { ScratchWorkspace } from "@/components/modules/scratch-workspace";

export const metadata = { title: "Coding Workspace" };

interface PlaygroundPageProps {
  searchParams: Promise<{ mode?: string; projectId?: string; language?: string }>;
}

/** Coding playground — opens the general editor by default or Scratch when requested. */
export default async function PlaygroundPage({ searchParams }: PlaygroundPageProps) {
  const params = await searchParams;
  if (params.mode === "scratch") {
    return <ScratchWorkspace projectId={params.projectId ?? null} />;
  }
  const language = ["html", "css", "javascript", "python", "java", "kotlin"].includes(params.language ?? "") ? params.language as "html" | "css" | "javascript" | "python" | "java" | "kotlin" : "html";
  return <CodingPlayground initialLanguage={language} initialProjectId={params.projectId ?? null} />;
}
