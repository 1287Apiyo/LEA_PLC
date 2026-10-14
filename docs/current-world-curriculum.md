# LEA Labs Current-World Curriculum

## Decision

LEA Labs should not choose between HTML/CSS, TypeScript, and Python. They solve different layers of the same product:

- **HTML and CSS remain essential.** HTML gives a product meaningful structure, accessibility, and content semantics. CSS makes that structure usable across devices. They are not obsolete; they are the browser platform every web product still depends on.
- **TypeScript becomes the default web-product language.** It gives learners a practical path from browser interaction to typed frontend components, API clients, testing, and maintainable team code.
- **Python becomes the default data-and-AI language.** It is the clearest bridge into data cleaning, analysis, evaluation, automation, model use, and AI services.
- **AI is integrated into engineering rather than isolated from it.** Learners use AI tools as assistants, but they must still frame the problem, inspect the output, test the result, protect data, and explain what they shipped.

The curriculum therefore teaches a shared product loop and then uses the best language for each job. Learners should be able to explain why a technology was chosen instead of repeating a tool name.

## The shared product loop

Every pathway uses the same sequence:

1. Understand a real user and write a small problem statement.
2. Inspect the data, workflow, or API involved.
3. Build the smallest useful version.
4. Verify normal, empty, invalid, slow, and failure cases.
5. Get critique, revise, and record the decision.
6. Present the product, evidence, limitations, and next step.

Every substantial project produces a working artefact, repository or notebook, README, verification record, reflection, and short demonstration. This keeps the programme portfolio-oriented without reducing learning to screenshots.

## Software Engineering pathway: 16 weeks

| Stage | Stack and capability | Project evidence |
|---|---|---|
| Digital foundations, weeks 1–2 | How the web works, semantic HTML, modern CSS, browser DevTools, terminal, Git, GitHub, accessibility, and AI-assisted learning habits | An accessible learner profile page with a README and a short record of what AI assistance was accepted, changed, or rejected |
| TypeScript web products, weeks 3–5 | TypeScript fundamentals, DOM and events, typed data, responsive CSS, component thinking, forms, and browser testing | A responsive community-services directory that works on phone and desktop and documents its content model |
| APIs and data products, weeks 6–8 | HTTP, JSON, async TypeScript, API contracts, loading and error states, validation, data provenance, and privacy | A live conditions or community-information dashboard using a public API with a test matrix and fallback state |
| Studio reset, week 9 | Portfolio review, feedback, scope control, and backlog prioritisation | A revised backlog, mentor review, and one before/after improvement |
| Python, backend, and data, weeks 10–12 | Python fundamentals, data structures, CSV/JSON, data cleaning, SQL, a small API service, authentication concepts, and automated tests | A learner-enrolment data service or reporting API with a data dictionary, endpoint tests, and a database diagram |
| AI-integrated full stack, weeks 13–14 | TypeScript interface, Python data/AI service, structured model output, retrieval from approved information, evaluation sets, guardrails, and human escalation | A learner-support feature that cites approved information, handles uncertainty, and includes an evaluation report |
| Capstone and portfolio, weeks 15–16 | Product discovery, deployment, observability basics, documentation, security checklist, and professional presentation | A deployed community-learning operations portal with a case study, demo, test evidence, and retrospective |

### Required engineering habits

- Use TypeScript for browser and product-facing code unless there is a clear reason not to.
- Use Python for data preparation, analysis, evaluation, automation, and AI-facing services.
- Keep HTML semantic and CSS responsive; neither is treated as disposable boilerplate.
- Use Git with small commits and readable README files.
- Treat generated code as an untrusted draft until the learner can explain and verify it.
- Test empty, invalid, slow, and permission-denied states, not only the happy path.
- Never place private keys, personal learner data, or real payment credentials in a classroom prompt or repository.

## Applied AI pathway: 12 weeks

| Stage | Capability | Project evidence |
|---|---|---|
| AI and data foundations, weeks 1–2 | AI vocabulary, data quality, Python basics, notebooks, probability intuition, machine-learning concepts, and the difference between prediction, generation, and automation | A Python notebook that explores a small dataset and an AI use-case map with a go, no-go, or pilot recommendation |
| Python data lab, weeks 3–5 | Python functions, CSV/JSON, tabular cleaning, simple visualisation, reproducible analysis, and communicating uncertainty | A cleaned dataset and short data brief with a provenance note, assumptions, and a reproducible notebook |
| Prompt and workflow design, weeks 6–7 | Structured prompts, context design, tool boundaries, schemas, prompt versions, and human approval steps | An admissions or support workflow assistant tested on a fixed set of examples with an evaluation table |
| Research and verification, week 8 | Search strategy, source quality, citations, extraction, fact checking, and uncertainty notes | A source-backed research brief with an evidence table and corrections log |
| Responsible AI practice, weeks 9–10 | Privacy, bias, fairness, prompt injection, security, accessibility, and escalation design | A risk assessment and red-team record for a fictional learner-support workflow |
| Applied AI studio, weeks 11–12 | Python AI service, approved knowledge base, structured output, citations, evaluation, and a TypeScript or browser interface | A human-in-the-loop learner-support assistant with a user guide, evaluation set, and escalation policy |

## Assessment

Assess reasoning as well as the final interface:

- Problem and user understanding: 15%
- Core knowledge and implementation: 25%
- Verification and reliability: 20%
- Iteration and feedback: 15%
- Communication and documentation: 15%
- Responsible practice: 10%

A learner does not need to use every tool. A smaller product with clear decisions, tests, and limitations is stronger evidence than a large unfinished build.

## Product configuration changes

The application should treat the following fields as curriculum metadata for every course or module:

- `stack`: the technologies practised, such as `HTML`, `CSS`, `TypeScript`, `Python`, `SQL`, or `AI evaluation`;
- `project`: the product or analysis artefact learners build;
- `evidence`: the files or demonstrations used for assessment;
- `trend_tags`: searchable capability labels such as `typed web`, `data products`, `AI-assisted engineering`, and `responsible AI`;
- `integration`: the cross-pathway connection, such as `TypeScript UI + Python AI service`.

The learner interface should show **Covers**, **Build project**, and **Stack** together. This answers the corporate question directly: the learner sees the underlying web platform, the language used for product delivery, the language used for data and AI, and the evidence they will leave with.

## Rollout

1. Update public programme metadata and curriculum accordions first.
2. Add `stack`, `evidence`, and `integration` to course records and admin editing.
3. Publish the TypeScript web and Python data workspaces.
4. Add project briefs, milestone checklists, mentor review, and evidence uploads.
5. Seed or migrate existing courses without deleting learner progress.
6. Review the stack every six months through employer feedback, learner outcomes, and project quality rather than hype cycles.

## Project catalogue for the programme pages

### Scratch Programming (ages 8–12)

The Scratch course should end with three shareable builds, not only isolated block exercises:

1. **Interactive story or comic strip:** a digital story with scenes, dialogue, sound, and branching choices where clicks or key presses change the ending.
2. **Custom arcade game:** a catching game or maze runner with a scoreboard, timer, lives, collision logic, and increasing difficulty.
3. **Educational mini-app:** a multiplication quiz, Kenyan counties game, vocabulary game, or similar activity with instant feedback and a restart path.

The evidence is three Scratch project links, play-test notes from another learner, a one-minute walkthrough, and an explanation of where sequences, events, loops, conditions, and variables appear. Scratch learners do not need to call Daraja or Google APIs. They learn the logic that later makes API integration understandable.

### Software Engineering (teens and advanced learners)

The end-of-course portfolio should contain a responsive website, a data-driven application, and one integration-heavy capstone:

- A **local business or community website** with semantic HTML, responsive CSS, TypeScript interaction, accessible forms, search, and a published URL.
- A **full-stack school library, learner-enrolment, or neighbourhood commerce tool** with create, read, update, and delete flows, a live database, validation, role-aware access, and endpoint tests.
- A **Daraja payment simulator or sandbox project** that models STK Push request, pending, success, failure, timeout, duplicate callback, receipt, and admin reconciliation. Real customer money is never used in class.
- A **Google-connected operations tool** that reads approved Calendar events, Drive files, or Sheets rows using OAuth and narrow scopes. Google Android Management API may be discussed as an architecture case study, but classroom work uses mock devices or read-only test data. Learners must not lock, wipe, or change real devices.
- A **Python AI service with a TypeScript interface** that grounds answers in approved information, cites sources, evaluates test cases, and escalates uncertain cases to a human.

The final evidence is a deployed product, repository, README, API contract, architecture diagram, test matrix, integration screenshots, security checklist, and two-minute product demonstration. A mock is acceptable when credentials or production controls are not available, but the learner must label the boundary clearly and explain how production readiness would be achieved.

### Applied AI foundations

Applied AI learners should finish with practical systems rather than a collection of chatbot conversations:

- A **customer-support or homework-helper assistant** connected to an LLM API or approved local model, with structured outputs, a knowledge boundary, citations, and human escalation.
- A **smart computer-vision prototype** that counts objects, scans barcodes, or recognises a simple hand gesture, with consent and a clear limitations note.
- An **AI data predictor** that explores local weather, transport, attendance, or other small datasets and reports uncertainty instead of presenting guesses as facts.
- A **research and verification studio** that uses AI for exploration but produces a source-backed brief, evidence table, corrections log, and uncertainty notes.

The final evidence is a working prototype or notebook, a fixed evaluation set, output-quality rubric, red-team examples, privacy and bias review, prompt or code version history, and a short recommendation about whether the system is ready for a pilot. The goal is not to promise perfect AI. The goal is to show useful judgement, reliable evaluation, and responsible handoff.
