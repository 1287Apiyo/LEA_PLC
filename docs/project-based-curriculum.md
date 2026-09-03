# LEA Labs Project-Based Curriculum Blueprint

## Purpose

LEA Labs should teach learners to make useful things, not only complete exercises. The curriculum therefore moves from small, visible artefacts to integrated products that solve a real problem for a real audience. Each project has a driving question, sustained inquiry, learner choice, reflection, critique and revision, and a public product. These elements follow the Gold Standard Project Based Learning model from PBLWorks.[1]

The programme should use live systems only where they are safe and appropriate. Payment projects use a simulator or sandbox and never request real customer money. Public read-only APIs, such as Open-Meteo for forecast data, are suitable for early API practice because the service documents a JSON forecast endpoint and does not require an API key for non-commercial use.[2] GitHub’s REST API is useful for teaching authenticated integrations, pagination, rate limits, and secure credential handling without inventing a pretend API.[3] Safaricom Daraja is reserved for a later, simulated payment gateway project until LEA has the required credentials and production controls; its official STK Push documentation describes an asynchronous request, customer confirmation, and callback result flow.[4]

## The LEA project loop

Every project follows the same six-step loop: understand the user and problem, inspect real data or workflows, plan a small version, build and test, receive critique and revise, then present the result with evidence. Learners submit a working artefact, a short README, a test or verification record, a reflection, and a two-minute demonstration. This makes progress visible to the learner, mentor, and future employer.

| Stage | Learner activity | Evidence |
|---|---|---|
| Discover | Interview or observe a user and write a problem statement | Problem brief and user assumptions |
| Investigate | Read documentation, inspect data, and list constraints | Source notes, API notes, or workflow map |
| Build | Produce a small working version before adding features | Working prototype and commits |
| Verify | Test normal, empty, invalid, and failure cases | Test checklist and screenshots |
| Improve | Use mentor or peer feedback to revise the product | Before/after change log |
| Present | Explain the problem, trade-offs, result, and next step | Demo, README, and reflection |

## Software Engineering: projects by stage

| Current curriculum stage | Practical project | Real-world capability | Portfolio evidence |
|---|---|---|---|
| Digital foundations, Weeks 1–2 | **LEA learner profile page**: create a simple accessible page for a learner, mentor, or community organisation | File structure, browser tools, Git, semantic HTML, and a clear user goal | Published page, README, and a short explanation of design choices |
| Frontend foundations, Weeks 3–5 | **Community services directory**: build a responsive directory for local learning, health, or business resources | Responsive layout, forms, accessibility, content modelling, and user-centred design | Mobile and desktop screenshots, content model, and usability feedback |
| JavaScript and interaction, Weeks 6–8 | **Live conditions dashboard**: use Open-Meteo to show current or forecast conditions for selected African cities, with loading, empty, invalid, and error states | Fetch, JSON, async state, search, date/time display, and resilient UI behaviour | Working dashboard, API documentation note, test matrix, and fallback screenshot |
| Mid-programme reset, Week 9 | **Portfolio and product review** | Scope control, reflection, feedback, and prioritisation | Revised backlog and mentor review record |
| Backend and data, Weeks 10–12 | **Learner enrolment API**: create courses, learners, enrolments, and progress records behind a REST API | Routing, relational data, validation, authentication concepts, and role-aware access | API contract, database diagram, seed data, and endpoint tests |
| Full-stack integration, Weeks 13–14 | **LEA enrolment and payment simulator**: learner checkout, simulated M-Pesa STK Push, pending/success/failure states, admin cash confirmation, and receipts | Client-server flow, payment state machines, idempotency, audit trails, and admin workflows | Working full-stack demo, state diagram, test cases, and security checklist. No real money. |
| Capstone, Weeks 15–16 | **Community learning operations portal**: combine catalogue, enrolment, progress, payments, and an admin dashboard for a chosen organisation | Product scoping, deployment, monitoring, documentation, and public presentation | Deployed product, README, architecture note, demo video, and capstone presentation |

The Daraja-inspired project must teach the payment lifecycle, not expose learners to a live merchant account. The simulator should model an initial request, a pending state, a callback-like result, duplicate callbacks, cancellation, timeout, and reconciliation. Production integration becomes a later extension after Safaricom onboarding, HTTPS callback hosting, secrets management, and business reconciliation are ready.[4]

## Applied AI: projects by stage

| Current curriculum stage | Practical project | Real-world capability | Portfolio evidence |
|---|---|---|---|
| AI in plain language, Weeks 1–2 | **AI use-case map**: compare manual, rules-based, and AI-assisted approaches to a real LEA task | Problem framing, limits, costs, risks, and choosing the right tool | Decision memo and process map |
| Prompt and workflow design, Weeks 3–5 | **Admissions or support workflow assistant**: turn incoming questions into drafts, categories, and next actions using a fixed test set | Structured prompts, schemas, evaluation examples, and human review | Prompt versions, evaluation table, and failure examples |
| Studio reset, Week 6 | **Workflow audit** | Reflection, quality review, and removal of unnecessary automation | Revised workflow and risk register |
| Research and verification, Weeks 7–8 | **Source-backed research brief**: use AI to gather a shortlist of public sources, then verify claims and produce a cited brief | Search strategy, source quality, extraction, citations, and uncertainty | Research log, evidence table, and corrected draft |
| Responsible AI practice, Weeks 9–10 | **Fairness and privacy review**: inspect a fictional learner-support workflow for sensitive data, bias, and unsafe decisions | Data minimisation, human oversight, bias checks, and escalation | Risk assessment, red-team examples, and mitigation plan |
| Applied AI studio, Weeks 11–12 | **Human-in-the-loop learner support assistant**: answer routine questions from an approved knowledge base, cite its source, and escalate uncertain cases | Retrieval, grounding, evaluation, guardrails, and operational handoff | Working demo, evaluation set, escalation policy, and user guide |

## Digital Foundations: projects by stage

| Current curriculum stage | Practical project | Real-world capability | Portfolio evidence |
|---|---|---|---|
| Meet your computer, Weeks 1–2 | **My digital workspace**: organise files, create folders, name documents, and back up a small project | Device confidence, file management, and safe habits | Before/after folder map and learner checklist |
| Files and documents, Weeks 3–4 | **Useful community document pack**: create a flyer, simple budget, timetable, and shared folder for a family or group activity | Documents, formatting, spreadsheets, sharing, and version awareness | Final document pack and sharing plan |
| Practice pause, Week 5 | **Digital confidence check-in** | Reflection, repetition, and support planning | Skills checklist and next-step plan |
| Internet confidence, Weeks 6–7 | **Safer online choices guide**: create a beginner-friendly guide for spotting suspicious messages, unsafe links, and privacy risks | Search, email, online safety, and responsible communication | Illustrated guide and scenario walkthrough |
| First digital project, Week 8 | **My first helpful digital product**: choose a small family, school, or community need and make a poster, form, guide, or simple webpage | Planning, making, sharing, and explaining a result | Finished product, audience feedback, and short presentation |

## Assessment model

Projects should be assessed on the work and the reasoning behind it, not only on whether the final screen looks attractive. A 100-point rubric can be used across the three programmes, with the technical depth adjusted by stage.

| Criterion | Weight | What mentors look for |
|---|---:|---|
| Problem and user understanding | 15 | The learner can explain who the project helps and what success means. |
| Core knowledge and implementation | 25 | The learner applies the programme concepts correctly at the appropriate level. |
| Verification and reliability | 20 | The learner tests expected, invalid, empty, and failure cases and records the results. |
| Iteration and feedback | 15 | The learner responds to critique with visible improvements. |
| Communication and documentation | 15 | The README, demo, and explanation make the work understandable to another person. |
| Responsible practice | 10 | The learner protects private data, distinguishes simulation from reality, and identifies limits. |

## How to integrate this into the current LEA product

The existing `CurriculumItem` structure already contains the module number, title, weeks, summary, and topics. Add a `project` field and render it as a dedicated **Build project** block in each curriculum accordion. Keep the current topics as **Covers** so the project explains why the concepts matter. Add a project badge to the module summary and expose the project title in the learner course catalogue when course data is available.

The first implementation should update the programme metadata and detail-page display. The next instructional layer is to add project briefs, milestone checklists, submission prompts, mentor review, and a project evidence area to the learner portal. The payment simulator already provides an excellent internal case study for Software Engineering because it connects frontend state, backend contracts, admin operations, and responsible handling of financial workflows without using real funds.

## References

[1]: https://www.pblworks.org/what-is-pbl/gold-standard-project-design "PBLWorks — Gold Standard PBL: Essential Project Design Elements"
[2]: https://open-meteo.com/en/docs "Open-Meteo — Weather Forecast API Documentation"
[3]: https://docs.github.com/en/rest?apiVersion=2026-03-10 "GitHub — REST API Documentation"
[4]: https://developer.safaricom.co.ke/apis/MpesaExpressSimulate "Safaricom Daraja — M-Pesa Express / STK Push Simulation Documentation"
