"use client";

import { type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LessonNotes — renders the `notes` field of a lesson.
 *
 * Tiny safe markdown-ish renderer (no dangerouslySetInnerHTML):
 *   #        → h3 section heading
 *   ##       → h4 subheading
 *   - item   → bullet list (grouped)
 *   - [ ] / - [x] → interactive-looking checklist
 *   1. item  → numbered list (grouped)
 *   > text   → callout box
 *   ``` … ``` → code block
 *   **bold** and `inline code` inside any line
 *
 * The player splits notes into per-section steps with splitLessonNotes and
 * renders one step at a time via LessonNotesBody.
 */

/** Split notes into `#`-sections: { heading, body }[] — one step per section. */
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

/** Render the body of one notes section (or an assignment prompt). */
export function LessonNotesBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block.
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      blocks.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed"
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
        <h4 key={key++} className="mt-5 text-sm font-semibold tracking-tight">
          {renderInline(line.slice(3), `h4-${key}`)}
        </h4>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h3 key={key++} className="mt-6 text-base font-semibold tracking-tight">
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
          className="my-3 rounded-lg border-l-4 border-orange-400 bg-orange-50 px-3 py-2.5 text-sm text-orange-900"
        >
          {renderInline(line.slice(2), `callout-${key}`)}
        </div>
      );
      i += 1;
      continue;
    }

    // Grouped lists.
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
                    checked
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-muted-foreground/40"
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

    // Plain paragraph.
    blocks.push(
      <p key={key++} className="my-3 text-sm leading-relaxed">
        {renderInline(line, `p-${key}`)}
      </p>
    );
    i += 1;
  }

  return <div>{blocks}</div>;
}

/** Render the full notes string (all sections with their headings). */
export function LessonNotes({ notes }: { notes: string }) {
  const sections = splitLessonNotes(notes);
  return (
    <div className="lesson-notes">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h3 className="mt-6 text-base font-semibold tracking-tight">{section.heading}</h3>
          <LessonNotesBody body={section.body} />
        </div>
      ))}
    </div>
  );
}
