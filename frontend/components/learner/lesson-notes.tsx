"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonContentSectionKind =
  | "concept"
  | "visual"
  | "example"
  | "code"
  | "practice"
  | "warning"
  | "checklist"
  | "quiz"
  | "project";

export interface LessonContentSection {
  id: string;
  title: string;
  kind: LessonContentSectionKind;
  body: string;
}

export interface LessonContent {
  version: number;
  eyebrow?: string;
  learning_goal?: string;
  deck?: string;
  slide_topic?: string;
  slide_refs?: string[];
  sections: LessonContentSection[];
}

/**
 * LessonNotes — renders the legacy `notes` field safely without HTML injection.
 *
 * Supported markdown-ish syntax:
 *   # / ## headings, bullets, numbered lists, checklists, callouts, fenced code,
 *   **bold**, and `inline code`.
 */

/** Split notes into `#`-sections: { heading, body }[] — retained for older records. */
export function splitLessonNotes(notes: string): { heading: string; body: string }[] {
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string[] } | null = null;
  for (const line of notes.split("\n")) {
    if (line.startsWith("# ")) {
      if (current) sections.push({ heading: current.heading, body: current.body.join("\n") });
      current = { heading: line.slice(2).trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.body.join("\n") });
  return sections;
}

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${keyBase}-b${i}`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(
        <code
          key={`${keyBase}-c${i}`}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const isCheck = (line: string) => /^- \[[ xX]\] /.test(line);
const isBullet = (line: string) => line.startsWith("- ");
const isNumbered = (line: string) => /^\d+\. /.test(line);

/** Render the body of one notes section or assignment prompt. */
export function LessonNotesBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-lg bg-[#151116] p-3 font-mono text-xs leading-relaxed text-[#fffdfb]"
        >
          {buf.join("\n")}
        </pre>
      );
      continue;
    }

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h4 key={key++} className="mt-5 text-sm font-semibold tracking-tight text-[#4d176e]">
          {renderInline(line.slice(3), `h4-${key}`)}
        </h4>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h3 key={key++} className="mt-6 text-base font-semibold tracking-tight text-[#4d176e]">
          {renderInline(line.slice(2), `h3-${key}`)}
        </h3>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(
        <div
          key={key++}
          className="my-3 rounded-lg border-l-4 border-[#f47945] bg-[#fff0e9] px-3 py-2.5 text-sm text-[#7b3218]"
        >
          {renderInline(line.slice(2), `callout-${key}`)}
        </div>
      );
      i += 1;
      continue;
    }

    if (isCheck(line)) {
      const items: string[] = [];
      while (i < lines.length && isCheck(lines[i])) {
        items.push(lines[i]);
        i += 1;
      }
      blocks.push(
        <div key={key++} className="my-3 space-y-1.5">
          {items.map((item, idx) => {
            const checked = /^- \[[xX]\] /.test(item);
            const label = item.replace(/^- \[[ xX]\] /, "");
            return (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40"
                  )}
                >
                  {checked ? <Check className="h-3 w-3" aria-hidden /> : null}
                </span>
                <span className={cn(checked && "text-muted-foreground line-through")}>
                  {renderInline(label, `check-${key}-${idx}`)}
                </span>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i]) && !isCheck(lines[i])) {
        items.push(lines[i]);
        i += 1;
      }
      blocks.push(
        <ul key={key++} className="my-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item.slice(2), `ul-${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (isNumbered(line)) {
      const items: string[] = [];
      while (i < lines.length && isNumbered(lines[i])) {
        items.push(lines[i]);
        i += 1;
      }
      blocks.push(
        <ol key={key++} className="my-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item.replace(/^\d+\. /, ""), `ol-${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    blocks.push(
      <p key={key++} className="my-3 text-sm leading-relaxed text-foreground/85">
        {renderInline(line, `p-${key}`)}
      </p>
    );
    i += 1;
  }

  return <div>{blocks}</div>;
}

/** Render the legacy notes string in its original sectioned form. */
export function LessonNotes({ notes }: { notes: string }) {
  const sections = splitLessonNotes(notes);
  return (
    <div className="lesson-notes">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h3 className="mt-6 text-base font-semibold tracking-tight text-[#4d176e]">{section.heading}</h3>
          <LessonNotesBody body={section.body} />
        </div>
      ))}
    </div>
  );
}

type LessonVisual = {
  src: string;
  alt: string;
  label: string;
};

function lessonVisual(deck: string | undefined, title: string, isIntro: boolean): LessonVisual {
  const haystack = `${deck ?? ""} ${title}`.toLowerCase();

  if (haystack.includes("scratch") || haystack.includes("block") || haystack.includes("sprite") || haystack.includes("game")) {
    if (haystack.includes("sound") || haystack.includes("music")) {
      return { src: "/lesson-art/sounds_music.png", alt: "Scratch sound and music blocks arranged around a stage", label: "Make the project respond" };
    }
    if (haystack.includes("look") || haystack.includes("costume") || haystack.includes("animation")) {
      return { src: "/lesson-art/looks_costumes.png", alt: "Scratch costumes and animation scene", label: "See the idea in motion" };
    }
    if (haystack.includes("operator") || haystack.includes("math")) {
      return { src: "/lesson-art/operations_math.png", alt: "Scratch operators and number blocks", label: "Turn rules into logic" };
    }
    if (haystack.includes("catch") || haystack.includes("score")) {
      return { src: "/lesson-art/catch_action.png", alt: "Scratch catching game action scene", label: "Build the game loop" };
    }
    return { src: isIntro ? "/lesson-art/block_explorer_hero.png" : "/lesson-art/scratch_blocks.png", alt: "Colourful Scratch blocks arranged as a learning visual", label: "Blocks become behaviour" };
  }

  if (haystack.includes("api") || haystack.includes("data product") || haystack.includes("fetch") || haystack.includes("json")) {
    if (haystack.includes("security") || haystack.includes("safe")) {
      return { src: "/lesson-art/security_dashboard.png", alt: "API security dashboard illustration", label: "Make data trustworthy" };
    }
    if (haystack.includes("state") || haystack.includes("error") || haystack.includes("reliab")) {
      return { src: "/lesson-art/reliable_states.png", alt: "Reliable API states shown as a product flow", label: "Design for every response" };
    }
    if (haystack.includes("json") || haystack.includes("payload")) {
      return { src: "/lesson-art/json_payload.png", alt: "JSON payload structure illustration", label: "Read the data shape" };
    }
    return { src: "/lesson-art/request_response.png", alt: "API request and response illustration", label: "A conversation between systems" };
  }

  if (haystack.includes("ai") || haystack.includes("automation") || haystack.includes("workflow") || haystack.includes("agent")) {
    if (haystack.includes("responsib") || haystack.includes("safety") || haystack.includes("privacy")) {
      return { src: "/lesson-art/responsible_ai.png", alt: "Responsible AI illustration", label: "Keep people in the loop" };
    }
    if (haystack.includes("data") || haystack.includes("signal")) {
      return { src: "/lesson-art/data_signal.png", alt: "Data signals flowing into an AI system", label: "Good outputs begin with good inputs" };
    }
    if (haystack.includes("model") || haystack.includes("learn")) {
      return { src: "/lesson-art/model_training.png", alt: "Model training illustration", label: "Patterns become predictions" };
    }
    if (haystack.includes("generat") || haystack.includes("prompt")) {
      return { src: "/lesson-art/generative_tokens.png", alt: "Generative AI tokens illustration", label: "Specify before you generate" };
    }
    return { src: isIntro ? "/lesson-art/ai_literacy_hero.png" : "/lesson-art/engineering_loop.png", alt: "AI-assisted engineering loop illustration", label: "Build a repeatable workflow" };
  }

  if (haystack.includes("software engineering") || haystack.includes("android") || haystack.includes("app development") || haystack.includes("testing") || haystack.includes("debug")) {
    if (haystack.includes("test") || haystack.includes("debug")) {
      return { src: "/lesson-art/debugging_evidence.png", alt: "Debugging evidence collected during software development", label: "Use evidence to improve" };
    }
    if (haystack.includes("security")) {
      return { src: "/lesson-art/security_delivery.png", alt: "Security review during software delivery", label: "Ship with care" };
    }
    return { src: "/lesson-art/engineering_loop.png", alt: "Software engineering loop from idea to tested result", label: "Move from idea to evidence" };
  }

  if (haystack.includes("basic computer") || haystack.includes("computer skills") || haystack.includes("files") || haystack.includes("internet") || haystack.includes("email")) {
    return { src: "/lea-hero-purple-orange.png", alt: "LEA learning visual representing a digital learning path", label: "Practice the everyday tools" };
  }

  return { src: "/lea-hero-purple-orange.png", alt: "LEA learning visual representing a practical learning path", label: isIntro ? "Start with the big picture" : "Connect the idea to practice" };
}

/**
 * Primary renderer for the one canonical lesson content payload. Older lessons
 * still render safely through the markdown notes fallback until they are seeded.
 */
export function LessonAlignedContent({
  content,
  fallbackNotes,
}: {
  content?: LessonContent | null;
  fallbackNotes: string;
}) {
  const sections = content?.sections ?? [];
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [content?.slide_topic, content?.deck]);

  if (!content?.sections?.length) return <LessonNotes notes={fallbackNotes} />;

  const slideCount = sections.length + 1;
  const isIntro = slideIndex === 0;
  const activeSection = isIntro ? null : sections[slideIndex - 1];
  const visual = lessonVisual(content?.deck, activeSection?.title ?? content?.slide_topic ?? "", isIntro);
  const progress = Math.round(((slideIndex + 1) / slideCount) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d176e]">
        <span>{content.eyebrow ?? "LEA lesson"}</span>
        <span>Lesson slide {slideIndex + 1} of {slideCount}</span>
      </div>

      <div className="h-1.5 overflow-hidden bg-[#ead8ef]" aria-label={`${progress}% of lesson slides viewed`}>
        <div className="h-full bg-[#f47945] transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      <article className="relative min-h-[500px] overflow-hidden border border-[#4d176e]/15 bg-[#fffdfb] px-5 py-6 shadow-[0_12px_30px_rgba(77,23,110,0.08)] sm:px-8 sm:py-8">
        <div className="absolute right-[-2.5rem] top-[-2.5rem] h-28 w-28 rounded-full border-[16px] border-[#f47945]/15" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0">
            {isIntro ? (
              <div className="flex min-h-[400px] flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f47945]">{content.deck ?? "LEA learning sequence"}</p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#1f0d2e] sm:text-4xl">
                  {content.slide_topic ?? "Today’s lesson"}
                </h2>
                {content.learning_goal ? (
                  <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/75 sm:text-lg">{content.learning_goal}</p>
                ) : null}
                <div className="mt-8 border-t border-[#ead8ef] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4d176e]">In this lesson</p>
                  <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {sections.slice(0, 6).map((section, index) => (
                      <div key={section.id || `${section.title}-${index}`} className="flex items-start gap-2 text-sm text-foreground/75">
                        <span className="font-semibold text-[#f47945]">{String(index + 1).padStart(2, "0")}</span>
                        <span>{section.title}</span>
                      </div>
                    ))}
                  </div>
                  {sections.length > 6 ? (
                    <p className="mt-3 text-xs text-muted-foreground">Continue through the next slides for examples, checks, practice, and project guidance.</p>
                  ) : null}
                </div>
              </div>
            ) : activeSection ? (
              <div className="flex min-h-[400px] flex-col">
                <div className="flex items-start gap-3 border-b border-[#ead8ef] pb-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f6eef9] text-xs font-semibold text-[#4d176e]">
                    {String(slideIndex).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f47945]">{activeSection.kind}</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1f0d2e] sm:text-3xl">{activeSection.title}</h2>
                  </div>
                </div>
                <div className="pt-5">
                  <LessonNotesBody body={activeSection.body} />
                </div>
              </div>
            ) : null}
          </div>

          <aside className="order-first border-l-4 border-[#f47945] bg-[#f6eef9] p-4 lg:order-none">
            <div className="relative flex min-h-[170px] items-center justify-center bg-[#fffdfb] p-3">
              <Image src={visual.src} alt={visual.alt} width={440} height={300} className="h-auto max-h-[210px] w-full object-contain" priority={isIntro} />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#4d176e]">{visual.label}</p>
            <p className="mt-2 text-sm leading-5 text-foreground/70">A visual anchor for the idea on this lesson slide.</p>
          </aside>
        </div>
      </article>

      <div className="flex items-center justify-between gap-3 border-t border-[#ead8ef] pt-4">
        <button
          type="button"
          onClick={() => setSlideIndex((index) => Math.max(0, index - 1))}
          disabled={slideIndex === 0}
          className="inline-flex items-center gap-2 border border-[#4d176e]/20 px-3 py-2 text-sm font-semibold text-[#4d176e] transition-colors hover:border-[#f47945] hover:text-[#b94920] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
        <div className="flex max-w-[45%] items-center gap-1 overflow-hidden" aria-label="Lesson slide navigation">
          {sections.map((section, index) => (
            <button
              key={section.id || `${section.title}-${index}`}
              type="button"
              onClick={() => setSlideIndex(index + 1)}
              aria-label={`Go to slide ${index + 2}: ${section.title}`}
              aria-current={slideIndex === index + 1 ? "step" : undefined}
              className={cn(
                "h-1.5 min-w-4 flex-1 bg-[#ead8ef] transition-colors",
                slideIndex === index + 1 && "bg-[#f47945]",
                slideIndex > index + 1 && "bg-[#4d176e]/45"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSlideIndex((index) => Math.min(slideCount - 1, index + 1))}
          disabled={slideIndex === slideCount - 1}
          className="inline-flex items-center gap-2 bg-[#4d176e] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#f47945] disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {content.slide_refs?.length ? (
        <div className="border-t border-[#4d176e]/15 pt-3 text-xs leading-5 text-muted-foreground">
          <span className="font-semibold text-[#4d176e]">Slide sequence:</span> {content.slide_refs.join(" · ")}
        </div>
      ) : null}
    </div>
  );
}
