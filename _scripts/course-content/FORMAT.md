# Course content pack — format & tone spec

This spec defines how to write the in-depth lesson notes for the LEA Labs
learning platform (young learners, roughly ages 8–14). Read it fully before
writing any content.

## Deliverable

A single CommonJS/ES module file per course:

```js
export default {
  id: "crs-xxx",            // exact course id provided in the task
  lessons: [
    {
      id: "xx-1",           // exact lesson id provided in the task
      title: "…",           // exact lesson title provided in the task
      duration_minutes: 8,  // exact value provided in the task
      description: "…",     // short one-liner, provided in the task
      order: 1,             // 1..6
      video_url: "…",       // exact URL provided in the task — copy it verbatim
      notes: "…",           // THE big one — see below
    },
    // …6 lessons total
  ],
};
```

Write the file with `export default`. Do not import anything. No trailing
commas issues — plain valid JS.

## Tone — "in-depth but never boring"

This is a kid's favourite-teacher voice, not a textbook:

- Friendly, playful, energetic. Second person ("you"). Short sentences.
- Each lesson opens with a **hook**: a story, a "have you ever wondered…", a
  mission, a fun analogy, or a joke. Never start with a dry definition.
- Real analogies the way you'd explain to a curious kid (e.g. HTML = skeleton,
  CSS = clothes, JavaScript = the muscles).
- Occasional light humour, exclamation marks, rhetorical questions.
- Respectful of young readers: no slang that ages badly, no sarcasm, no
  negativity. Encourage mistakes ("bugs are just puzzles!").
- In-depth = genuinely useful detail: real concepts, small working examples,
  explanations of WHY, common mistakes with fixes. Do not pad with fluff.

## Notes format — exact mini-markdown

`notes` is ONE string with `\n` newlines. It is rendered by a tiny renderer
that ONLY supports these markers — do not use anything else (no tables, no
images, no ## with different meaning, no emoji, no HTML tags):

```
# Why this matters          → h3 section heading (start every lesson with this)
## A subheading             → h4 subheading (use freely to break up sections)
- a bullet point            → bullet list (group bullets together)
- [ ] an unchecked step     → checklist item (use for hands-on steps)
- [x] a done step           → checked item (rarely needed)
1. first step               → numbered step (group consecutive numbers)
> A callout                 → callout box: tips, warnings, "try this" ideas
```code```                  → fenced code block (code examples only)
**bold**                    → inline bold (keywords, block names, emphasis)
`inline code`               → inline code (tags, functions, file names)
```

Rules:

- Sections per lesson, in this order:
  1. `# Why this matters` — hook + why the learner should care (2–3 short
     paragraphs or a paragraph + bullets). Include a "what you'll be able to
     do" line.
  2. `# What you'll learn` — 3–5 `- ` bullets stating concrete outcomes.
  3. `# Let's learn` — the meat. Use `##` subheadings, short paragraphs,
     bullets, and for coding courses small fenced code blocks (keep each
     block under ~12 lines). Explain concepts step by step with analogies.
  4. `# Try it yourself` — hands-on checklist using `- [ ]` items (4–8 steps).
     For coding courses include a small complete code snippet the learner can
     type into the workspace and run.
  5. `# Mini challenge` — one playful stretch task, `1.` numbered steps and a
     short paragraph; end with "show a friend" or "share it" style line.
  6. `# Remember` — 3–5 `- ` bullet takeaways, punchy one-liners.
- A few `> ` callouts sprinkled through `Let's learn` and `Try it yourself`
  (tips, common mistakes, "watch out!").
- **Length: 800–1,200 words per lesson** (roughly 4,500–7,000 characters).
  That is the "in-depth" promise — no lesson under 800 words.
- Blank line between blocks. Do not use tabs; indent code blocks with spaces.
- No emoji anywhere. No HTML. ASCII apostrophes are fine.
- Avoid text that claims to be from real people, companies, or specific
  versions of software. Concepts and code must be factually correct.

## Topic accuracy

- Web course: HTML5 / CSS3, correct tag names and syntax. The workspace is an
  HTML/CSS playground.
- Scratch course: reference real Scratch 3.0 block names exactly as written
  on the blocks (e.g. "move 10 steps", "say Hello! for 2 seconds",
  "when flag clicked", "repeat 10", "forever", "change size by 10").
- App course: general mobile app concepts; MIT App Inventor style building
  blocks for the button/event lesson; real `fetch()` JavaScript for the
  web/API lesson.
- Computer skills course: plain, correct, beginner-level computer concepts.

## Checks before finishing

- Exactly 6 lessons, ids and orders 1–6 in the exact order given.
- Every `notes` string uses only the markers above and is 800+ words.
- Every `video_url` copied verbatim from the task (never invent one).
- File saves successfully and `node --check` passes on it.
