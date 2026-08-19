const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const keyPath = path.resolve(process.cwd(), '../backend/storage/firebase/service-account.json');
if (!fs.existsSync(keyPath)) {
  throw new Error(`Firebase Admin credential not found at ${keyPath}`);
}
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const now = new Date().toISOString();

const resource = (id, title, type, url, download_url = '', description = '') => ({
  id,
  title,
  type,
  url,
  download_url,
  description,
});

const lesson = (id, title, duration_minutes, description, notes, assignment, video_url = '', resources = []) => ({
  id,
  title,
  duration_minutes,
  video_url,
  video_source: video_url ? 'Curated external learning video' : '',
  description,
  notes,
  assignment,
  resources,
  order: Number(id.split('-').pop()),
});

const programmes = [
  {
    id: 'prg-coding',
    title: 'Software Engineering',
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'A project-led pathway from web foundations to AI-assisted product delivery, APIs, testing, deployment, and a portfolio-ready capstone.',
    status: 'active',
    order: 1,
    duration: '16 weeks',
    level: 'Foundation to applied',
    modules: 5,
    course_count: 5,
    price: 'KES 45,000',
    outcomes: ['Build and publish responsive products', 'Integrate APIs and data safely', 'Use AI tools with verification and code ownership', 'Ship and explain a capstone project'],
    skills: ['TypeScript', 'HTML/CSS', 'APIs', 'Git/GitHub', 'Testing', 'Docker', 'AI-assisted development'],
    trend_tags: ['AI-assisted development', 'TypeScript', 'cloud-native delivery', 'portfolio evidence'],
    updated_at: now,
  },
  {
    id: 'prg-ai',
    title: 'Applied AI',
    name: 'Applied AI',
    slug: 'applied-ai',
    description: 'A grounded route into generative AI, automation, prompt and workflow design, data judgement, and responsible AI delivery.',
    status: 'active',
    order: 2,
    duration: '12 weeks',
    level: 'Foundation to applied',
    modules: 2,
    course_count: 2,
    price: 'KES 35,000',
    outcomes: ['Explain modern AI in practical language', 'Design reliable AI-assisted workflows', 'Evaluate outputs for accuracy, bias, and privacy', 'Deliver an AI-supported work prototype'],
    skills: ['AI literacy', 'Prompt design', 'Workflow automation', 'Evaluation', 'Responsible AI', 'Data storytelling'],
    trend_tags: ['Generative AI', 'AI agents', 'automation', 'responsible use'],
    updated_at: now,
  },
  {
    id: 'prg-dl',
    title: 'Basic Computer Knowledge',
    name: 'Basic Computer Knowledge',
    slug: 'basic-computer-knowledge',
    description: 'A welcoming digital confidence pathway for beginners and kids, covering devices, files, communication, online safety, and first coding experiences.',
    status: 'active',
    order: 3,
    duration: '8 weeks',
    level: 'Beginner',
    modules: 2,
    course_count: 2,
    price: 'KES 18,000',
    outcomes: ['Use a computer with confidence', 'Create and organise digital work', 'Communicate and search more safely online', 'Make and share a first digital project'],
    skills: ['Computer basics', 'Files and folders', 'Online safety', 'Email', 'Scratch', 'Digital confidence'],
    trend_tags: ['digital inclusion', 'online safety', 'youth technology'],
    updated_at: now,
  },
];

const courses = [
  {
    id: 'crs-web',
    title: 'Web Development',
    programme: 'prg-coding',
    sequence: 1,
    level: 'Foundation',
    track: 'Core',
    description: 'Build your own web pages with HTML and CSS, then publish a responsive site that communicates a clear idea.',
    summary: 'The product-facing foundation: structure, style, responsive layouts, accessibility, and deployment.',
    outcomes: ['Create semantic HTML pages', 'Style responsive layouts with modern CSS', 'Use Flexbox and accessible patterns', 'Publish a working site'],
    skills: ['HTML', 'CSS', 'Responsive design', 'Accessibility', 'Git', 'Deployment'],
    deliverable: 'A published responsive portfolio or community information site.',
    project: 'Build and publish a responsive multi-page website for a real audience.',
    assessment: { format: 'Build review', evidence: 'Published URL, repository, README, and short walkthrough' },
    trend_tags: ['web foundations', 'accessibility', 'portfolio evidence'],
    coding: true,
    playground_language: 'html',
    workspace_type: 'code',
    price: 'KES 9,000',
    duration_weeks: 3,
    lessons: [
      lesson('lesson-1', 'How the web works', 60, 'Understand browsers, servers, URLs, requests, responses, and the role of HTML and CSS.', 'Use the browser devtools to inspect a page and trace one request from address bar to response.', 'Create a one-page map showing how a browser reaches a website.'),
      lesson('lesson-2', 'Your first HTML page', 75, 'Use semantic structure, headings, lists, links, images, and meaningful page landmarks.', 'Good HTML is content with structure. Start with meaning before decoration.', 'Build a semantic profile page with a navigation, main content, and footer.'),
      lesson('lesson-3', 'Text, links, and images', 60, 'Add content that is readable, navigable, and inclusive for different users and devices.', 'Write useful link labels and alternative text. Accessibility is product quality, not a final checkbox.', 'Improve the profile page with useful links, images, and accessible text.'),
      lesson('lesson-4', 'Styling with CSS', 90, 'Use selectors, the cascade, spacing, color, typography, and reusable classes to establish a visual system.', 'Keep styles intentional: define a small type scale, spacing rhythm, and color palette.', 'Create a compact design system and apply it to the profile page.'),
      lesson('lesson-5', 'Layouts with Flexbox', 90, 'Build responsive layouts that adapt from mobile to desktop without brittle positioning.', 'Start with the smallest screen and add layout rules only when the content needs them.', 'Turn the profile page into a responsive two-section portfolio landing page.'),
      lesson('lesson-6', 'Publishing your site', 75, 'Prepare a repository, write a README, validate links, and deploy the site so others can use it.', 'A project becomes evidence when another person can open it, understand it, and see what you contributed.', 'Publish the website and submit the URL, repository, README, and a five-sentence reflection.'),
    ],
  },
  {
    id: 'crs-api',
    title: 'API Integration & Data Products',
    programme: 'prg-coding',
    sequence: 2,
    level: 'Applied',
    track: 'Core',
    description: 'Connect a frontend to real services and data, handling loading, errors, validation, authentication, and responsible data use.',
    summary: 'Move from static pages to useful products that communicate with services and data sources.',
    outcomes: ['Read and interpret API documentation', 'Fetch and display remote data', 'Handle loading and error states', 'Validate inputs and protect secrets'],
    skills: ['HTTP', 'REST APIs', 'JSON', 'Async JavaScript', 'Validation', 'Auth basics'],
    deliverable: 'A small data-driven application with a documented API integration.',
    project: 'Build a useful dashboard that consumes a public API and explains its data choices.',
    assessment: { format: 'Product review', evidence: 'Working application, API notes, error-state demo, and security checklist' },
    trend_tags: ['API economy', 'data products', 'security by default'],
    coding: true,
    playground_language: 'typescript',
    workspace_type: 'code',
    price: 'KES 9,000',
    duration_weeks: 3,
    lessons: [
      lesson('lesson-1', 'Requests, responses, and JSON', 75, 'Read API documentation and understand endpoints, methods, status codes, headers, and JSON payloads.', 'Treat an API contract as a conversation: know what you send, what you receive, and what failure looks like.', 'Document one public API endpoint in plain language and with a sample request.'),
      lesson('lesson-2', 'Fetching data in a product', 90, 'Use asynchronous JavaScript to request data and render a useful view without blocking the interface.', 'A useful interface communicates state: loading, success, empty, and error are all part of the product.', 'Build a search screen that fetches and renders live results.'),
      lesson('lesson-3', 'Validation and resilient interfaces', 75, 'Validate user input, handle malformed responses, and make retry and empty states clear.', 'Reliability is designed before production. Assume the network will be slow and data will be incomplete.', 'Add validation, retry, and empty states to the search screen.'),
      lesson('lesson-4', 'Authentication and secrets', 90, 'Understand public versus private keys, bearer tokens, environment variables, and why secrets do not belong in browser code.', 'Security starts with architecture. Keep server-only credentials on the server and make permissions explicit.', 'Write a security checklist and refactor one unsafe secret-handling example.'),
      lesson('lesson-5', 'Data quality and responsible use', 60, 'Check freshness, provenance, bias, and privacy considerations before presenting data to users.', 'A polished chart can still be misleading. Explain what the data means and what it cannot prove.', 'Add a data-source note, last-updated state, and one limitation to the interface.'),
      lesson('lesson-6', 'Ship a data-driven dashboard', 90, 'Bring the integration, interface states, and documentation together into a small product another person can understand.', 'Your README should make setup, API assumptions, and known limitations visible.', 'Publish the dashboard with a README and a short demo of success and failure states.'),
    ],
  },
  {
    id: 'crs-app',
    title: 'App Development',
    programme: 'prg-coding',
    sequence: 3,
    level: 'Applied',
    track: 'Core',
    description: 'Design and build a mobile-first application with clear screens, useful state, device-aware testing, and a credible release plan.',
    summary: 'Learn to turn a user need into a focused app experience that can be tested and improved.',
    outcomes: ['Map a user journey into screens', 'Manage interaction and app state', 'Test on different device sizes', 'Explain a release and feedback plan'],
    skills: ['UX flows', 'Component thinking', 'State', 'Mobile UI', 'Testing', 'Release planning'],
    deliverable: 'A working mobile-first application prototype or small published app.',
    project: 'Build an app that helps a defined user complete one meaningful task.',
    assessment: { format: 'Demo and critique', evidence: 'Working app, user flow, test notes, and iteration summary' },
    trend_tags: ['mobile-first', 'product thinking', 'user feedback'],
    coding: true,
    playground_language: 'typescript',
    workspace_type: 'code',
    price: 'KES 9,000',
    duration_weeks: 3,
    lessons: [
      lesson('lesson-1', 'How apps are built', 60, 'Explore the anatomy of a modern application: screens, components, state, services, and release channels.', 'Start with the user task, not the framework. Technology should make the experience possible, not define the problem.', 'Choose a user and write a one-page product brief for the app.'),
      lesson('lesson-2', 'Designing your app\'s screens', 90, 'Turn a user journey into a small set of screens with clear hierarchy, navigation, and feedback.', 'Small focused flows are easier to test and finish than a long list of imagined features.', 'Create a low-fidelity flow and a polished screen for the highest-value task.'),
      lesson('lesson-3', 'Buttons, inputs, and events', 75, 'Connect interaction to state changes and create interfaces that respond clearly to user actions.', 'Every interactive control needs a visible result, a disabled state when needed, and an accessible label.', 'Implement the core interaction and document its states.'),
      lesson('lesson-4', 'Making it talk to the web', 90, 'Connect an app screen to a service while handling slow responses, errors, and empty data.', 'Reuse the API lessons: mobile users deserve the same reliability and clarity as desktop users.', 'Add one remote data flow with loading, error, and retry states.'),
      lesson('lesson-5', 'Testing on your device', 75, 'Test different screen sizes and input methods, record issues, and prioritise fixes.', 'A test note is evidence of learning: describe the context, expected result, observed result, and next action.', 'Run a five-person or five-scenario usability check and fix the top three issues.'),
      lesson('lesson-6', 'Publishing your app', 60, 'Prepare a release checklist, explain trade-offs, and create a short demo that communicates the value of the app.', 'Shipping is a learning event. Make the next feedback loop obvious.', 'Submit a demo, release checklist, and reflection on what you would build next.'),
    ],
  },
  {
    id: 'crs-ai-dev',
    title: 'AI-Assisted Engineering',
    programme: 'prg-coding',
    sequence: 4,
    level: 'Applied',
    track: 'Core',
    description: 'Use modern AI coding tools as a pair programmer while preserving human judgement, tests, security, and clear ownership of the code.',
    summary: 'Build the AI-native engineering habits employers increasingly expect: instruct, inspect, test, and improve.',
    outcomes: ['Write precise coding tasks and prompts', 'Review generated code critically', 'Use tests and type checks to verify changes', 'Keep an auditable record of AI-assisted work'],
    skills: ['Prompting for code', 'Code review', 'Testing', 'TypeScript', 'Threat awareness', 'Technical communication'],
    deliverable: 'An AI-assisted feature with tests, review notes, and an engineering decision log.',
    project: 'Improve an existing product feature using AI assistance and prove the change is safe and useful.',
    assessment: { format: 'Engineering review', evidence: 'Diff, tests, review checklist, prompt log, and decision record' },
    trend_tags: ['AI coding tools', 'verification', 'developer productivity'],
    coding: true,
    playground_language: 'typescript',
    workspace_type: 'code',
    price: 'KES 9,000',
    duration_weeks: 3,
    lessons: [
      lesson('lesson-1', 'AI as an engineering partner', 60, 'Understand where AI coding tools help, where they fail, and how to keep the human responsible for the result.', 'The goal is not to generate more code. It is to reduce friction while increasing clarity and quality.', 'Write a personal AI-use policy for your project.'),
      lesson('lesson-2', 'Writing precise technical tasks', 75, 'Give an AI tool context, constraints, examples, acceptance criteria, and a clear definition of done.', 'Good prompts look like good tickets: specific, bounded, testable, and connected to user value.', 'Turn a vague feature request into three implementation-ready tasks.'),
      lesson('lesson-3', 'Reviewing generated code', 90, 'Inspect correctness, readability, maintainability, accessibility, and hidden assumptions in generated code.', 'Never accept a code suggestion you cannot explain. Ownership includes the ability to maintain it later.', 'Review a generated pull request and annotate three risks and three strengths.'),
      lesson('lesson-4', 'Tests, types, and verification', 90, 'Use types, unit tests, integration checks, and manual review to verify AI-assisted changes.', 'Verification is the difference between a fast draft and a reliable product.', 'Add tests for a generated feature and record the evidence that it works.'),
      lesson('lesson-5', 'Security and privacy with AI tools', 75, 'Identify secret leakage, insecure dependencies, prompt injection, and inappropriate data sharing.', 'Keep private information out of prompts and treat generated output as untrusted until reviewed.', 'Run a security review on the project and write a safe-use checklist.'),
      lesson('lesson-6', 'Ship with an engineering decision log', 75, 'Communicate what changed, what AI contributed, what you verified, and what remains uncertain.', 'A decision log makes invisible work visible to teammates, reviewers, and your future self.', 'Submit the feature, tests, prompt log, and decision record.'),
    ],
  },
  {
    id: 'crs-capstone',
    title: 'Software Product Studio',
    programme: 'prg-coding',
    sequence: 5,
    level: 'Applied',
    track: 'Capstone',
    description: 'Plan, build, test, deploy, and present a small digital product that brings the programme skills together into portfolio evidence.',
    summary: 'A coached studio that turns isolated exercises into one coherent product story.',
    outcomes: ['Frame a real user problem', 'Plan an achievable product slice', 'Ship a tested product increment', 'Present evidence and next steps professionally'],
    skills: ['Product discovery', 'Planning', 'Delivery', 'Testing', 'Documentation', 'Presentation'],
    deliverable: 'A deployed capstone product with a portfolio case study.',
    project: 'Deliver a useful product for a real or clearly represented user group.',
    assessment: { format: 'Capstone review', evidence: 'Deployed product, repository, case study, demo, and retrospective' },
    trend_tags: ['portfolio evidence', 'product delivery', 'communication'],
    coding: true,
    playground_language: 'typescript',
    workspace_type: 'code',
    price: 'KES 9,000',
    duration_weeks: 4,
    lessons: [
      lesson('lesson-1', 'Find a problem worth solving', 75, 'Interview or observe a user, define the problem, and choose a small outcome that can be delivered in the studio.', 'A strong capstone is specific enough to finish and meaningful enough to explain.', 'Submit a problem statement, user profile, and success measure.'),
      lesson('lesson-2', 'Scope the product slice', 90, 'Convert the idea into a prioritised backlog, user flow, data map, and delivery plan.', 'The best scope is the smallest version that proves the product promise.', 'Create a one-week build plan and identify the highest-risk assumption.'),
      lesson('lesson-3', 'Build the first usable increment', 120, 'Implement the core path with a clean interface, useful feedback, and a working data flow.', 'Build in vertical slices so a real user can try the product before every feature is complete.', 'Release an internal alpha and record what works and what does not.'),
      lesson('lesson-4', 'Test with evidence', 90, 'Use automated checks and real-user feedback to improve reliability, accessibility, and clarity.', 'Evidence beats confidence. Show the test, the observation, the change, and the result.', 'Run a structured test and publish a prioritised improvement list.'),
      lesson('lesson-5', 'Deploy and document', 75, 'Prepare the production release, repository README, environment notes, and a simple maintenance plan.', 'A professional project can be handed over. Document setup, decisions, trade-offs, and known limitations.', 'Deploy the product and complete the technical README.'),
      lesson('lesson-6', 'Present the product story', 90, 'Explain the problem, product decisions, evidence, contribution, and next opportunity in a concise presentation.', 'Your portfolio is not only what you built; it is how clearly you can help another person understand the value.', 'Submit a demo, case study, retrospective, and next-step roadmap.'),
    ],
  },
  {
    id: 'crs-ai-foundations',
    title: 'AI Foundations & Literacy',
    programme: 'prg-ai',
    sequence: 1,
    level: 'Foundation',
    track: 'Core',
    description: 'Build a clear, practical mental model of AI, machine learning, generative systems, and the limits that shape responsible use.',
    summary: 'Understand the technology well enough to ask better questions and make better decisions.',
    outcomes: ['Explain AI concepts in plain language', 'Choose appropriate AI use cases', 'Recognise hallucination, bias, and privacy risk', 'Evaluate outputs with a repeatable method'],
    skills: ['AI literacy', 'Critical thinking', 'Evaluation', 'Privacy', 'Data awareness'],
    deliverable: 'An AI use-case brief and evaluation checklist for a real workflow.',
    project: 'Assess one workflow and recommend where AI should, should not, or may assist.',
    assessment: { format: 'Use-case review', evidence: 'Use-case brief, risk matrix, evaluation rubric, and recommendation' },
    trend_tags: ['AI literacy', 'responsible AI', 'critical thinking'],
    coding: false,
    playground_language: null,
    workspace_type: null,
    price: 'KES 17,500',
    duration_weeks: 6,
    lessons: [
      lesson('lesson-1', 'AI in plain language', 60, 'Distinguish automation, machine learning, generative AI, and AI agents through practical examples.', 'Avoid hype and fear by asking a simple question: what task is being supported, and what evidence is required?', 'Explain one AI system to a non-technical person in under two minutes.'),
      lesson('lesson-2', 'How generative tools produce outputs', 75, 'Understand training data, probability, context windows, multimodal inputs, and why fluent output is not guaranteed truth.', 'Treat an AI response as a draft or hypothesis until it is checked.', 'Create a simple output-quality rubric for your chosen workflow.'),
      lesson('lesson-3', 'Prompt and context design', 75, 'Give a model a role, context, examples, constraints, and output format to improve usefulness and consistency.', 'Better context usually beats longer prompts. Provide the information needed for the decision.', 'Design and compare three prompts for the same task.'),
      lesson('lesson-4', 'Evaluation and verification', 90, 'Check factual accuracy, completeness, tone, bias, and reproducibility using human and source-based verification.', 'Evaluation should be designed before the workflow is scaled.', 'Run ten test cases and record the results against your rubric.'),
      lesson('lesson-5', 'Privacy, bias, and safety', 75, 'Identify personal data, sensitive decisions, representational harms, prompt injection, and unsafe automation.', 'Responsible use is a product requirement. If a workflow cannot be explained, it should not be automated blindly.', 'Write a risk register and safe-use policy.'),
      lesson('lesson-6', 'AI opportunity brief', 60, 'Turn the learning into a practical recommendation that balances value, cost, risk, and human oversight.', 'The strongest AI recommendation is sometimes not to use AI.', 'Submit an opportunity brief with a go, no-go, or pilot recommendation.'),
    ],
  },
  {
    id: 'crs-ai-workflows',
    title: 'AI Workflows & Automation',
    programme: 'prg-ai',
    sequence: 2,
    level: 'Applied',
    track: 'Core',
    description: 'Design reliable AI-assisted workflows for research, content, operations, and decision support with human checkpoints and measurable outcomes.',
    summary: 'Move from experimentation to useful, repeatable, responsible workflow design.',
    outcomes: ['Map a workflow end to end', 'Combine prompts, tools, and human review', 'Measure time and quality improvements', 'Create a safe automation prototype'],
    skills: ['Workflow mapping', 'Prompt chains', 'Automation', 'Evaluation', 'Documentation'],
    deliverable: 'A documented AI workflow prototype with evaluation evidence.',
    project: 'Automate one low-risk, repetitive workflow while preserving human approval.',
    assessment: { format: 'Workflow demonstration', evidence: 'Process map, prototype, before/after measure, and risk controls' },
    trend_tags: ['AI agents', 'automation', 'human-in-the-loop'],
    coding: false,
    playground_language: null,
    workspace_type: null,
    price: 'KES 17,500',
    duration_weeks: 6,
    lessons: [
      lesson('lesson-1', 'Map the work before automating', 75, 'Break a workflow into inputs, decisions, actions, handoffs, and quality checks.', 'Automation should remove friction from a known process, not hide a broken one.', 'Map a current workflow and identify one safe pilot step.'),
      lesson('lesson-2', 'Prompt chains and reusable templates', 75, 'Create modular prompts with stable inputs, expected outputs, and explicit failure handling.', 'A reusable template is a small product: name it, version it, test it, and document it.', 'Build a prompt template and test it on five realistic examples.'),
      lesson('lesson-3', 'Tools, files, and data boundaries', 90, 'Choose tools carefully and define what information can be shared, stored, or transformed.', 'The cheapest workflow is not always the safest. Make data boundaries visible.', 'Create a data-flow diagram and access checklist.'),
      lesson('lesson-4', 'Human checkpoints and exception paths', 75, 'Design approval points, escalation rules, and recovery paths for ambiguous or risky outputs.', 'A human-in-the-loop is meaningful only when the human has time, context, and authority to intervene.', 'Add an approval step and three exception examples to the workflow.'),
      lesson('lesson-5', 'Measure value and quality', 75, 'Compare time, error rate, user satisfaction, and consistency before and after the workflow change.', 'Measure the outcome the user cares about, not only the number of prompts run.', 'Run a small before/after test and report the result.'),
      lesson('lesson-6', 'Deliver the workflow prototype', 90, 'Present the process, prototype, evidence, risks, and next iteration in a way a team can adopt.', 'A workflow is ready when another person can operate it and understand when not to trust it.', 'Submit the workflow kit, demo, evaluation, and rollout recommendation.'),
    ],
  },
  {
    id: 'crs-computer',
    title: 'Basic Computer Skills',
    programme: 'prg-dl',
    sequence: 1,
    level: 'Beginner',
    track: 'Core',
    description: 'Everything a first-time computer user needs: hardware, files, email, internet access, and safer everyday digital habits.',
    summary: 'Build the confidence needed to learn, communicate, and work with a computer.',
    outcomes: ['Use keyboard, mouse, and common settings', 'Create and organise files', 'Send a clear email', 'Recognise safer online behaviour'],
    skills: ['Computer basics', 'File management', 'Email', 'Internet safety', 'Digital confidence'],
    deliverable: 'A personal digital organisation system and first online communication task.',
    project: 'Create, organise, and share a small set of useful digital documents safely.',
    assessment: { format: 'Practical demonstration', evidence: 'Guided task checklist and learner reflection' },
    trend_tags: ['digital inclusion', 'online safety', 'work readiness'],
    coding: false,
    playground_language: null,
    workspace_type: null,
    price: 'KES 9,000',
    duration_weeks: 4,
    lessons: [
      lesson('lesson-1', 'Parts of a computer', 45, 'Identify the main parts of a computer and understand how they work together.', 'You do not need to memorise every technical term. Learn what each part helps you do.', 'Label a computer setup and explain the purpose of five parts.'),
      lesson('lesson-2', 'Using the keyboard and mouse', 45, 'Practise clicking, selecting, typing, shortcuts, and basic settings with confidence.', 'Small shortcuts reduce frustration and make everyday tasks easier.', 'Complete a guided typing, selection, and window-management exercise.'),
      lesson('lesson-3', 'Files, folders, and storage', 60, 'Create, rename, move, find, and back up files using a clear folder system.', 'A simple naming habit prevents lost work and makes collaboration easier.', 'Create a personal folder system and save three documents correctly.'),
      lesson('lesson-4', 'Email essentials', 60, 'Write a clear subject, attach a file, reply respectfully, and spot suspicious messages.', 'Digital communication is part of professional readiness. Be clear, kind, and careful.', 'Send a practice email with an attachment and a useful subject line.'),
      lesson('lesson-5', 'Staying safe online', 60, 'Recognise phishing, strong passwords, software updates, privacy settings, and safer browsing.', 'Pause before clicking. Check the sender, link, request, and urgency.', 'Complete a personal online-safety checklist and identify three scam signals.'),
      lesson('lesson-6', 'Connecting to the internet', 45, 'Connect to a network, search effectively, evaluate sources, and save a useful result.', 'The internet is a tool for learning. Ask who made the information, when, and why.', 'Find and save two trustworthy learning resources with source notes.'),
    ],
  },
  {
    id: 'crs-scratch',
    title: 'Scratch Programming',
    programme: 'prg-dl',
    sequence: 2,
    level: 'Beginner',
    track: 'Young Coders',
    description: 'Learn to code by snapping blocks together to create animations, stories, and games while building logic and creative confidence.',
    summary: 'A playful first coding experience for children, families, and beginner makers.',
    outcomes: ['Use sequences and events', 'Create animated stories', 'Use loops and conditions', 'Share a project and explain the code'],
    skills: ['Computational thinking', 'Sequencing', 'Loops', 'Events', 'Creative problem solving'],
    deliverable: 'A shareable Scratch animation, story, or game.',
    project: 'Create a small interactive story or game for another person to play.',
    assessment: { format: 'Show and explain', evidence: 'Scratch project link and short learner walkthrough' },
    trend_tags: ['youth technology', 'computational thinking', 'creative confidence'],
    coding: true,
    playground_language: 'scratch',
    workspace_type: 'scratch',
    price: 'KES 9,000',
    duration_weeks: 4,
    lessons: [
      lesson('lesson-1', 'Meet Scratch — your coding playground', 45, 'Explore the stage, sprites, blocks, scripts, and how instructions run in sequence.', 'Coding is giving clear instructions. Start small, run the project, and change one thing at a time.', 'Create a project with one sprite that introduces itself.'),
      lesson('lesson-2', 'Sprites, costumes, and backdrops', 45, 'Choose and customise characters and scenes to communicate an idea.', 'Design choices help the audience understand what is happening.', 'Create a scene with two sprites and a clear beginning.'),
      lesson('lesson-3', 'Motion and looks blocks', 45, 'Animate a character with movement, speech, costume changes, and timing.', 'A good animation has intention: decide what the character should make the viewer notice.', 'Animate a character completing a short action sequence.'),
      lesson('lesson-4', 'Events and loops', 60, 'Use events, repeats, and simple conditions to make a project respond to interaction.', 'Loops help you avoid repeating the same instruction. Events make the project feel alive.', 'Build an interactive scene with a key press and a repeating action.'),
      lesson('lesson-5', 'My first animated story', 60, 'Combine scenes, characters, dialogue, timing, and sound into a coherent story.', 'A project is stronger when the creator can explain the idea and the choices behind it.', 'Create a three-scene animated story with a clear ending.'),
      lesson('lesson-6', 'Share your project', 45, 'Test, debug, publish, and explain the code to another learner or family member.', 'Sharing is part of learning. Invite feedback and make one improvement.', 'Publish the project and record a one-minute walkthrough.'),
    ],
  },
];

const additionalLessons = {
  'crs-web': [
    lesson('lesson-7', 'CSS Grid and layout systems', 90, 'Compose two-dimensional page layouts with CSS Grid, responsive tracks, and content-aware alignment.', 'Grid is a planning tool: define the relationships between content areas before styling individual details.', 'Rebuild one portfolio section with Grid and document the responsive breakpoints.'),
    lesson('lesson-8', 'Responsive components and design tokens', 75, 'Create reusable visual patterns with variables, spacing tokens, type scales, and component states.', 'A small design system keeps a product coherent as it grows.', 'Create three reusable components and document their states in a mini style guide.'),
    lesson('lesson-9', 'Accessibility and performance', 90, 'Audit keyboard navigation, contrast, headings, images, loading behavior, and Core Web Vitals basics.', 'Accessibility and performance are part of the experience for everyone, not optional polish.', 'Run an accessibility and performance audit, then fix and explain five findings.'),
    lesson('lesson-10', 'Portfolio polish and deployment checks', 75, 'Prepare a final responsive build with clean content, tested links, metadata, and a professional handover.', 'A portfolio project should make the next action obvious for its audience.', 'Submit the final deployment, a QA checklist, and a two-minute walkthrough.'),
  ],
  'crs-api': [
    lesson('lesson-7', 'REST patterns and query design', 75, 'Design resource-oriented endpoints, query parameters, pagination, and consistent response shapes.', 'Good API design reduces guesswork for the people consuming the service.', 'Write an endpoint contract for a small resource and test it with sample requests.'),
    lesson('lesson-8', 'Type-safe data models and schemas', 90, 'Model API data with TypeScript types, runtime validation, and explicit transformations at the boundary.', 'Types help during development; runtime validation protects the product when data changes.', 'Add a schema boundary and show how invalid payloads are handled.'),
    lesson('lesson-9', 'Caching, pagination, and rate limits', 90, 'Make data fetching efficient and respectful by handling cache freshness, pagination, retries, and service limits.', 'A product that works once is not enough; it must behave well under real usage.', 'Add pagination and a retry or rate-limit message to the dashboard.'),
    lesson('lesson-10', 'Observability and API documentation', 75, 'Record useful errors, define basic service health signals, and write documentation another developer can follow.', 'Documentation and observability turn hidden assumptions into a maintainable product.', 'Publish an API README with setup, endpoints, failure cases, and a troubleshooting section.'),
  ],
  'crs-app': [
    lesson('lesson-7', 'Data modeling and local persistence', 90, 'Choose a small data model and store user progress or preferences in a reliable mobile-friendly way.', 'Start with the data the user needs, then decide what can be local and what belongs on a server.', 'Add one persisted data flow and explain the offline or failure behavior.'),
    lesson('lesson-8', 'Authentication and permissions', 90, 'Design sign-in, session state, protected actions, and clear permission boundaries for an app.', 'Trust is part of the interface. Make access decisions visible and predictable.', 'Create an auth-state map and protect one meaningful action.'),
    lesson('lesson-9', 'Mobile performance and accessibility', 75, 'Improve perceived speed, touch targets, text scaling, focus order, and feedback for mobile users.', 'A mobile interface is used in real contexts: small screens, interruptions, and uneven connectivity.', 'Test the app on two device sizes and resolve the top accessibility issues.'),
    lesson('lesson-10', 'Release candidate and feedback loop', 90, 'Prepare a release candidate, collect structured feedback, and prioritise the next iteration.', 'A release candidate is a learning instrument, not a claim of perfection.', 'Run a feedback session and submit a prioritised iteration plan.'),
  ],
  'crs-ai-dev': [
    lesson('lesson-7', 'AI-assisted debugging', 75, 'Use AI to form hypotheses about defects, reproduce failures, and compare fixes without outsourcing judgement.', 'Debugging is a reasoning activity. Use AI to widen the search, then prove the cause and fix.', 'Document one bug from reproduction to verified resolution.'),
    lesson('lesson-8', 'Repositories and context windows', 90, 'Provide an AI tool with focused repository context, conventions, and constraints without overwhelming the task.', 'Context should be relevant, minimal, and safe to share.', 'Create a context packet for one feature and explain what you excluded.'),
    lesson('lesson-9', 'Dependency and supply-chain review', 75, 'Inspect generated dependencies, licenses, package health, and possible security or maintenance risks.', 'Every dependency is a decision with a future cost.', 'Review a dependency change and record the evidence for keeping, replacing, or removing it.'),
    lesson('lesson-10', 'Team policy and engineering playbook', 75, 'Turn individual AI habits into a team playbook covering privacy, review, testing, attribution, and escalation.', 'Teams move faster when quality and safety expectations are explicit.', 'Publish a one-page AI engineering playbook and a reusable review checklist.'),
  ],
  'crs-capstone': [
    lesson('lesson-7', 'User research and feedback interviews', 75, 'Conduct structured interviews or observations and separate user evidence from assumptions.', 'Listen for repeated needs, workarounds, and language users actually use.', 'Submit interview notes, themes, and one changed product decision.'),
    lesson('lesson-8', 'Iteration sprint and change control', 120, 'Run a focused improvement sprint with a small backlog, acceptance criteria, review points, and a clear finish line.', 'Iteration is disciplined learning: change one important thing, measure it, and decide what follows.', 'Complete a sprint board and demonstrate the before-and-after result.'),
    lesson('lesson-9', 'Portfolio case study and professional README', 75, 'Tell the product story through the problem, decisions, implementation, evidence, and lessons learned.', 'A good case study helps a reviewer understand how you think, not only what the screen looks like.', 'Publish a case study with screenshots, links, contribution notes, and limitations.'),
    lesson('lesson-10', 'Demo day and retrospective', 90, 'Present the product clearly, answer questions, and turn feedback into a realistic next-step roadmap.', 'A strong ending creates the next opportunity for the product and for the maker.', 'Deliver a five-minute demo and a retrospective with three concrete next actions.'),
  ],
  'crs-ai-foundations': [
    lesson('lesson-7', 'Models, data, and uncertainty', 75, 'Connect model behavior to data quality, probability, evaluation sets, and uncertainty in practical decisions.', 'Confidence in tone is not the same as confidence in truth.', 'Compare three outputs and label what is known, inferred, and still uncertain.'),
    lesson('lesson-8', 'Multimodal and agentic systems', 75, 'Understand systems that work across text, images, audio, tools, and multi-step tasks.', 'More capability also means more places where verification and permission are needed.', 'Map the inputs, tools, decisions, and human approvals in one AI system.'),
    lesson('lesson-9', 'Responsible AI principles in practice', 90, 'Apply fairness, privacy, safety, transparency, accountability, and human-oversight principles to a real use case.', 'Principles become useful when they change a design decision.', 'Revise your use-case brief with a risk matrix and mitigation plan.'),
    lesson('lesson-10', 'Build an AI literacy presentation', 75, 'Explain a practical AI opportunity and its limits to a mixed audience using examples and evidence.', 'AI literacy is the ability to ask good questions, not the ability to repeat jargon.', 'Deliver a short AI literacy presentation with a source list and audience takeaway.'),
  ],
  'crs-ai-workflows': [
    lesson('lesson-7', 'Retrieval and grounded answers', 90, 'Ground AI outputs in approved documents or sources and show users where important claims came from.', 'If a workflow cannot show its evidence, it should not be trusted for high-stakes decisions.', 'Design a grounded-answer flow with source display and an unknown-answer path.'),
    lesson('lesson-8', 'Agents, tools, and approval design', 90, 'Break agentic work into tool permissions, actions, checkpoints, and recoverable failure states.', 'Give automation only the permissions it needs and keep irreversible actions behind approval.', 'Create an agent permission matrix and demonstrate one approval checkpoint.'),
    lesson('lesson-9', 'Workflow testing and monitoring', 90, 'Test normal, edge, adversarial, and changed-input cases while monitoring quality, cost, and failure patterns.', 'A workflow is a living system. Test it after changes, not only at launch.', 'Create a ten-case evaluation set and a simple monitoring dashboard or log.'),
    lesson('lesson-10', 'Adoption playbook and handover', 75, 'Prepare training, operating instructions, escalation paths, and a measured rollout plan for a team.', 'The best workflow is one people can use responsibly without its creator in the room.', 'Submit the final workflow kit and a 30-day adoption plan.'),
  ],
  'crs-computer': [
    lesson('lesson-7', 'Documents and spreadsheets', 75, 'Create a well-formatted document, enter simple spreadsheet data, and use basic sorting or totals.', 'Digital confidence grows when tools are connected to a real everyday task.', 'Prepare a one-page document and a small household or work budget sheet.'),
    lesson('lesson-8', 'Video calls and collaboration', 60, 'Join a video meeting, use mute and chat, share a screen safely, and collaborate respectfully.', 'Good online participation is clear, prepared, and considerate of other people’s time.', 'Join a practice meeting and submit a short collaboration checklist.'),
    lesson('lesson-9', 'Cloud storage and backups', 60, 'Use cloud folders, sharing permissions, file versions, and a backup habit to protect important work.', 'Saving a file is not the same as protecting it. Know where the copy is and who can access it.', 'Create a backup plan and share one file with the least access required.'),
    lesson('lesson-10', 'Digital work readiness assessment', 75, 'Bring together files, email, online safety, collaboration, and information-search skills in one practical scenario.', 'Work readiness is a sequence of small dependable habits.', 'Complete a guided digital work task and write a confidence reflection.'),
  ],
  'crs-scratch': [
    lesson('lesson-7', 'Variables and scoring', 60, 'Use variables to track score, time, health, or other changing values inside a project.', 'A variable is a named place where your project remembers something.', 'Add a score and a visible scoreboard to a small game.'),
    lesson('lesson-8', 'Conditions and game rules', 60, 'Use if/then logic, sensing, and comparisons to create rules that respond to player choices.', 'Rules make an interactive project feel fair and understandable.', 'Create a game with a win condition and a reset or try-again path.'),
    lesson('lesson-9', 'Broadcasts and project architecture', 60, 'Use messages to coordinate scenes and keep a larger Scratch project organised.', 'Clear messages and named scripts make creative projects easier to debug and extend.', 'Build a two-scene project that changes stage using broadcasts.'),
    lesson('lesson-10', 'Debug, remix, and showcase', 60, 'Find bugs, remix an existing idea respectfully, test with another player, and explain the design choices.', 'Creators improve through feedback. Sharing credit and learning from others are part of coding culture.', 'Publish the final project, credit any remix sources, and record a one-minute walkthrough.'),
  ],
};

const mediaByCourse = {
  'crs-web': {
    videos: ['https://www.youtube.com/watch?v=916GWv2Qs08', 'https://www.youtube.com/watch?v=jS4aFq5-91M'],
    resources: [
      resource('mdn-html', 'MDN HTML elements reference', 'reference', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', '', 'Semantic HTML and element reference.'),
      resource('mdn-css', 'MDN CSS reference', 'reference', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference', '', 'Modern CSS properties and layout reference.'),
      resource('web-checklist', 'LEA web project checklist', 'download', '/api/v1/courses/crs-web/lesson-pack', '', 'A downloadable checklist is generated by LEA for this course.'),
    ],
  },
  'crs-api': {
    videos: ['https://www.youtube.com/watch?v=2JYT5f2isg4', 'https://www.youtube.com/watch?v=hHLmb3OD7Mo'],
    resources: [
      resource('api-course-notes', 'API course notes', 'download', 'https://github.com/craigsdennis/intro-to-apis-course/blob/master/course-notes.md', 'https://raw.githubusercontent.com/craigsdennis/intro-to-apis-course/master/course-notes.md', 'Companion notes for the freeCodeCamp API course.'),
      resource('mdn-fetch', 'MDN Fetch API reference', 'reference', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API', '', 'Browser networking reference.'),
      resource('api-checklist', 'LEA API product checklist', 'download', '/api/v1/courses/crs-api/lesson-pack', '', 'A downloadable API integration and security checklist.'),
    ],
  },
  'crs-app': {
    videos: ['https://www.youtube.com/watch?v=RdJhqaOIWn0', 'https://www.youtube.com/watch?v=WDunoPNBxKA'],
    resources: [
      resource('react-native-docs', 'React Native documentation', 'reference', 'https://reactnative.dev/docs/getting-started', '', 'Official React Native getting-started documentation.'),
      resource('expo-docs', 'Expo documentation', 'reference', 'https://docs.expo.dev/', '', 'Official Expo workflow and device guidance.'),
      resource('app-checklist', 'LEA app release checklist', 'download', '/api/v1/courses/crs-app/lesson-pack', '', 'A downloadable mobile app QA and release checklist.'),
    ],
  },
  'crs-ai-dev': {
    videos: ['https://www.youtube.com/watch?v=nJ25yl34Uqw', 'https://www.youtube.com/watch?v=mEsleV16qdo'],
    resources: [
      resource('owasp-llm', 'OWASP Top 10 for LLM Applications', 'reference', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', '', 'Security risks to consider when using AI-assisted tools.'),
      resource('github-flow', 'Microsoft Introduction to GitHub', 'reference', 'https://learn.microsoft.com/en-us/training/modules/introduction-to-github/', '', 'Repository and collaboration fundamentals.'),
      resource('ai-engineering-checklist', 'LEA AI engineering review checklist', 'download', '/api/v1/courses/crs-ai-dev/lesson-pack', '', 'A downloadable review checklist for AI-assisted code.'),
    ],
  },
  'crs-capstone': {
    videos: ['https://www.youtube.com/watch?v=RGOj5yH7evk', 'https://www.youtube.com/watch?v=jS4aFq5-91M'],
    resources: [
      resource('github-training', 'GitHub Skills', 'reference', 'https://skills.github.com/', '', 'Interactive GitHub learning paths.'),
      resource('readme-guide', 'GitHub README guidance', 'reference', 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes', '', 'How to communicate a project clearly.'),
      resource('capstone-pack', 'LEA capstone delivery pack', 'download', '/api/v1/courses/crs-capstone/lesson-pack', '', 'A downloadable capstone planning, review, and demo pack.'),
    ],
  },
  'crs-ai-foundations': {
    videos: ['https://www.youtube.com/watch?v=3-xhMXeYIcg', 'https://www.youtube.com/watch?v=k7HaeJs-N-o'],
    resources: [
      resource('google-ai-essentials', 'Google AI Essentials', 'course', 'https://grow.google/ai-essentials/', '', 'Google’s introductory AI, prompting, and responsible-use learning path.'),
      resource('microsoft-ai-beginners', 'Microsoft AI for Beginners', 'curriculum', 'https://github.com/microsoft/AI-For-Beginners', '', 'Open curriculum with lessons and practical exercises.'),
      resource('ai-literacy-brief', 'LEA AI literacy brief', 'download', '/api/v1/courses/crs-ai-foundations/lesson-pack', '', 'A downloadable AI evaluation and risk brief.'),
    ],
  },
  'crs-ai-workflows': {
    videos: ['https://www.youtube.com/watch?v=k7HaeJs-N-o', 'https://www.youtube.com/watch?v=mEsleV16qdo'],
    resources: [
      resource('google-ai-essentials-workflows', 'Google AI Essentials workflow modules', 'course', 'https://grow.google/ai-essentials/', '', 'Practical prompting and responsible workflow concepts.'),
      resource('microsoft-genai', 'Microsoft Generative AI for Beginners', 'curriculum', 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/', '', 'An 18-part beginner series from Microsoft Cloud Advocates.'),
      resource('workflow-pack', 'LEA workflow design pack', 'download', '/api/v1/courses/crs-ai-workflows/lesson-pack', '', 'A downloadable workflow map, evaluation set, and rollout plan.'),
    ],
  },
  'crs-computer': {
    videos: ['https://www.youtube.com/watch?v=rtnPIb6Dszk', 'https://www.youtube.com/watch?v=y2kg3MOk1sY'],
    resources: [
      resource('gcf-computer-basics', 'GCFGlobal Computer Basics', 'course', 'https://edu.gcfglobal.org/en/computerbasics/', '', 'Beginner-friendly computer basics tutorials.'),
      resource('online-safety', 'Google Safety Center', 'reference', 'https://safety.google/', '', 'Practical online safety and privacy guidance.'),
      resource('digital-work-pack', 'LEA digital work readiness pack', 'download', '/api/v1/courses/crs-computer/lesson-pack', '', 'A downloadable file, email, safety, and collaboration practice pack.'),
    ],
  },
  'crs-scratch': {
    videos: ['https://www.youtube.com/watch?v=zOa5o9Yq_ZU', 'https://www.youtube.com/watch?v=D-nW4jvzRr8'],
    resources: [
      resource('scratch-home', 'Scratch official learning community', 'course', 'https://scratch.mit.edu/', '', 'Create, explore, and share Scratch projects.'),
      resource('scratch-starters', 'Scratch starter projects', 'practice', 'https://scratch.mit.edu/starter-projects', '', 'Official starter projects for remixing and exploration.'),
      resource('scratch-cards', 'Scratch coding cards', 'download', 'https://scratch.mit.edu/ideas', '', 'Project ideas and printable-style activity prompts from Scratch.'),
      resource('scratch-pack', 'LEA Scratch project pack', 'download', '/api/v1/courses/crs-scratch/lesson-pack', '', 'A downloadable story, game, testing, and showcase pack.'),
    ],
  },
};

const noteGuidance = {
  'crs-web': {
    principles: ['Start with semantic structure before visual styling.', 'Responsive design is a content and layout decision, not a device checklist.', 'Accessibility, performance, and clear content are part of product quality.'],
    vocabulary: ['semantic HTML', 'cascade', 'responsive breakpoint', 'focus order'],
    practice: 'Build the smallest page that demonstrates the idea, then inspect it on a narrow screen and with keyboard navigation.',
    reminder: 'A strong website makes its content understandable before it makes the content look impressive.',
  },
  'crs-api': {
    principles: ['An API contract describes what a client sends, receives, and should do when something fails.', 'Loading, empty, error, and success states are all part of the interface.', 'Validate data at the boundary and keep secrets on the server.'],
    vocabulary: ['endpoint', 'HTTP method', 'status code', 'schema validation'],
    practice: 'Start with one endpoint, inspect a real response, model the data, and deliberately test a slow, empty, and invalid response.',
    reminder: 'Reliable data products explain their assumptions instead of hiding them behind a polished screen.',
  },
  'crs-app': {
    principles: ['Begin with one user task and a focused journey.', 'Every interaction needs a visible state and a useful response.', 'Mobile products must account for interruptions, touch, network conditions, and different screen sizes.'],
    vocabulary: ['user flow', 'component', 'state', 'release candidate'],
    practice: 'Sketch the flow, build one complete interaction, test it on two screen sizes, and record what a real user found confusing.',
    reminder: 'A small app that completes one meaningful task is stronger evidence than an unfinished app with many features.',
  },
  'crs-ai-dev': {
    principles: ['AI can reduce friction, but the engineer remains responsible for correctness and safety.', 'Good technical prompts include context, constraints, examples, and acceptance criteria.', 'Types, tests, review notes, and a decision log make AI-assisted work auditable.'],
    vocabulary: ['acceptance criteria', 'code review', 'regression test', 'prompt context'],
    practice: 'Ask for a bounded change, inspect every suggestion, run the project checks, and record what you accepted, changed, or rejected.',
    reminder: 'Never ship code you cannot explain simply and maintain confidently.',
  },
  'crs-capstone': {
    principles: ['A capstone is evidence of decisions, not only a finished interface.', 'User feedback should change priorities or clarify what to improve.', 'A professional handover explains setup, limitations, contribution, and next steps.'],
    vocabulary: ['scope', 'acceptance criterion', 'iteration', 'case study'],
    practice: 'Keep a small backlog, define what done means, test the highest-risk assumption, and publish evidence of the change.',
    reminder: 'The best capstone story connects a real need to a thoughtful decision and visible evidence.',
  },
  'crs-ai-foundations': {
    principles: ['AI systems learn patterns from data and can produce fluent but incorrect outputs.', 'Confidence in tone is not proof of accuracy.', 'Responsible AI requires evidence, privacy awareness, human oversight, and clear limits.'],
    vocabulary: ['model', 'training data', 'hallucination', 'human oversight'],
    practice: 'Compare outputs, verify important claims against trusted sources, label uncertainty, and explain what a human should decide.',
    reminder: 'AI literacy means asking better questions and checking the answer, not repeating technical vocabulary.',
  },
  'crs-ai-workflows': {
    principles: ['A useful AI workflow has a clear input, transformation, output, and review point.', 'Ground important answers in approved sources and show the evidence.', 'Automation should use the least privilege needed and keep irreversible actions behind approval.'],
    vocabulary: ['grounding', 'tool permission', 'evaluation set', 'approval checkpoint'],
    practice: 'Map the workflow, define failure and unknown paths, test representative cases, and decide where a person must review.',
    reminder: 'Automation is trustworthy when people can see what happened, why it happened, and how to intervene.',
  },
  'crs-computer': {
    principles: ['Digital confidence grows through repeatable everyday tasks.', 'Files, accounts, devices, and messages all need safe handling habits.', 'When unsure, pause, check the source, and ask for help before sharing or deleting.'],
    vocabulary: ['file type', 'folder', 'backup', 'privacy setting'],
    practice: 'Follow the task slowly, name each step, repeat it without help, and write down one safe habit you want to keep.',
    reminder: 'There is no shame in learning slowly; a clear, repeatable process is a powerful digital skill.',
  },
  'crs-scratch': {
    principles: ['Programs are instructions that run in an order.', 'Events start actions, loops repeat actions, and conditions help projects make decisions.', 'Testing with another person reveals what the creator assumed.'],
    vocabulary: ['sprite', 'event', 'loop', 'condition'],
    practice: 'Make one small change, run the project, observe the result, and explain what each block contributed before adding more.',
    reminder: 'Creative coding becomes easier when you build, test, explain, and improve one tiny idea at a time.',
  },
};

const topicGuidance = [
  {
    matches: ['semantic', 'html', 'document structure'],
    explain: 'Semantic structure gives each part of a page a meaningful role. A heading should describe a section, navigation should identify navigation, and a button should perform an action. This helps people scan the page and gives assistive technology a clearer model of the interface.',
    example: 'Replace a group of generic div elements with a header, main, nav, section, and button where those roles match the content.',
    mistakes: ['Choosing elements only because they are easy to style.', 'Skipping heading levels or using bold text instead of a heading.', 'Using a link for an action or a button for navigation.'],
    questions: ['What is the purpose of this element?', 'Would the structure still make sense without CSS?', 'Can a keyboard user identify and operate the interactive parts?'],
  },
  {
    matches: ['css', 'layout', 'grid', 'responsive', 'design tokens', 'component'],
    explain: 'A dependable layout starts with relationships between content, not isolated pixel values. Use a small spacing and type system, let content wrap naturally, and test the design at the point where the content becomes difficult to read or operate.',
    example: 'Create a card grid with minmax columns, a consistent gap, and a breakpoint only when the content needs more room.',
    mistakes: ['Fixing every alignment with absolute positioning.', 'Using too many breakpoints without testing real content.', 'Choosing colours or type sizes without checking contrast and readability.'],
    questions: ['What should happen when the text is twice as long?', 'Which spacing values repeat across the interface?', 'What is the smallest screen on which this remains comfortable to use?'],
  },
  {
    matches: ['accessibility', 'performance', 'audit', 'core web vitals', 'keyboard'],
    explain: 'Accessibility and performance are measurable parts of the learner experience. Check focus order, labels, contrast, heading structure, image alternatives, loading feedback, and the amount of work needed before the main content is usable.',
    example: 'Run a keyboard-only pass, identify the first confusing focus movement, and fix that before polishing visual details.',
    mistakes: ['Treating accessibility as a final checklist.', 'Relying on colour alone to communicate status.', 'Optimising a score while ignoring a real user’s task.'],
    questions: ['Can the task be completed without a mouse?', 'What does a screen reader user hear first?', 'What happens on a slow connection or older device?'],
  },
  {
    matches: ['api', 'rest', 'endpoint', 'fetch', 'query', 'http'],
    explain: 'An API is a contract between a client and a service. The route, method, parameters, response shape, status code, and failure message should work together so another developer can use the capability without guessing.',
    example: 'For a list endpoint, define the request, a successful response, an empty response, an invalid request, and a service failure before writing the UI.',
    mistakes: ['Returning a success status for an error.', 'Changing response field names without communicating the change.', 'Making the client guess whether an empty list is a valid result.'],
    questions: ['What does the caller need to know after this request?', 'Which errors can the caller recover from?', 'Where is validation performed and what evidence shows it works?'],
  },
  {
    matches: ['schema', 'data model', 'validation', 'database'],
    explain: 'A data model is a set of decisions about names, types, relationships, defaults, and missing values. Validate untrusted data at the boundary and keep the internal model predictable for the rest of the application.',
    example: 'Define a course record with required identity fields, optional display metadata, and a validation rule that rejects an invalid duration.',
    mistakes: ['Assuming TypeScript types validate runtime input.', 'Allowing several meanings for the same field.', 'Storing data without a plan for missing or older records.'],
    questions: ['What values are valid?', 'What should happen when a field is absent?', 'How would this model change without breaking existing records?'],
  },
  {
    matches: ['cache', 'pagination', 'rate limit', 'retry', 'observability', 'monitor'],
    explain: 'Production data flows must account for time, volume, and failure. Cache only what can safely be reused, paginate work that can grow, retry transient failures carefully, and record enough context to diagnose what happened.',
    example: 'Add page and page-size parameters, show a loading state, stop retrying after a bounded number of attempts, and display a clear recovery action.',
    mistakes: ['Retrying every error indefinitely.', 'Caching private or stale data without a freshness rule.', 'Logging sensitive values instead of useful event context.'],
    questions: ['Which failure is temporary?', 'How much data should one request return?', 'What signal would tell the team that users are affected?'],
  },
  {
    matches: ['mobile', 'react native', 'expo', 'touch', 'release candidate'],
    explain: 'Mobile interfaces are used with fingers, interruptions, variable connectivity, and limited space. Keep the primary action visible, make touch targets forgiving, preserve useful state, and test the journey on more than one screen size.',
    example: 'Build a form that keeps typed values after a network failure and gives the user a clear retry action.',
    mistakes: ['Using desktop-sized controls on a small screen.', 'Assuming the network is always available.', 'Showing a spinner without explaining what the user can do next.'],
    questions: ['What does the user see after leaving and returning to the app?', 'Can the main action be reached with one hand?', 'What is the recovery path when the request fails?'],
  },
  {
    matches: ['authentication', 'permission', 'auth', 'security'],
    explain: 'Authentication identifies a user; authorization decides what that user may do. Keep those decisions explicit, protect server-side actions, handle expired sessions, and give the interface a predictable response when access changes.',
    example: 'Map an enrolment action from session check to server authorization to success or a useful error message.',
    mistakes: ['Trusting a hidden button as an access control.', 'Putting secrets in browser code.', 'Leaving the user with a blank screen after a session expires.'],
    questions: ['Who is allowed to perform this action?', 'Where is that decision enforced?', 'What should the learner do if access is denied?'],
  },
  {
    matches: ['ai-assisted', 'ai-assisted debugging', 'prompt', 'repository', 'dependency', 'playbook'],
    explain: 'AI-assisted engineering works best as a reviewable loop: frame a bounded task, provide relevant context, inspect the suggestion, run checks, and record the decision. The tool can widen exploration, but the engineer owns the result.',
    example: 'Ask for two possible causes of a failing test, reproduce each hypothesis, and only accept the fix that resolves the failure without a regression.',
    mistakes: ['Pasting private credentials or unrelated user data into a tool.', 'Accepting generated code without tests or review.', 'Using a vague prompt that hides the acceptance criteria.'],
    questions: ['What evidence would prove this suggestion correct?', 'What context is safe and necessary to share?', 'How will another engineer review the change?'],
  },
  {
    matches: ['research', 'feedback', 'iteration', 'user research', 'case study', 'demo day', 'retrospective'],
    explain: 'Product work improves when observations become decisions. Separate what a user said or did from the team’s interpretation, choose one high-value change, and document the evidence before and after the iteration.',
    example: 'Group interview notes by repeated need, choose one problem to address, and write the acceptance evidence that would show improvement.',
    mistakes: ['Treating one opinion as a complete research finding.', 'Changing several variables at once and losing the learning.', 'Presenting a polished result without explaining the trade-offs.'],
    questions: ['What did we actually observe?', 'Which assumption is most risky?', 'What changed because of the evidence?'],
  },
  {
    matches: ['model', 'data', 'uncertainty', 'multimodal', 'agentic', 'responsible ai', 'ai literacy'],
    explain: 'AI outputs are generated from patterns and context, not from a guarantee of truth. Evaluate the source and uncertainty of important claims, protect personal information, and keep a human accountable for decisions that affect people.',
    example: 'Compare three answers to the same prompt, verify their important claims, and label each statement as supported, uncertain, or incorrect.',
    mistakes: ['Treating fluent language as evidence.', 'Using sensitive personal data without a clear purpose or permission.', 'Removing human review from a high-impact decision.'],
    questions: ['What source supports this claim?', 'What could the model be missing?', 'Where must a person approve or challenge the result?'],
  },
  {
    matches: ['workflow', 'grounded', 'retrieval', 'agent', 'tool', 'approval', 'adoption'],
    explain: 'An AI workflow should make its path visible: what entered, what the system retrieved or generated, what tools it used, what was checked, and who approved the next action. Good workflow design includes an unknown or human-help path.',
    example: 'Design a support-answer flow that searches approved documents, cites its evidence, says when it cannot find an answer, and routes sensitive cases to a person.',
    mistakes: ['Giving an automated tool more permissions than it needs.', 'Hiding the source of an important answer.', 'Measuring only speed while ignoring accuracy and escalation quality.'],
    questions: ['What happens when evidence is missing?', 'Which actions are reversible?', 'How will the team monitor quality after launch?'],
  },
  {
    matches: ['computer', 'file', 'folder', 'document', 'spreadsheet', 'email', 'cloud', 'backup', 'video call', 'digital work'],
    explain: 'Digital work is a collection of small habits: name files clearly, save them where they can be found, share the least access necessary, check messages before acting, and keep a backup of important work.',
    example: 'Create a folder for one task, name the files with dates or versions, share one file with a specific person, and confirm the permission before sending it.',
    mistakes: ['Saving everything to the desktop without a folder system.', 'Opening unexpected attachments or sharing private files quickly.', 'Assuming a synchronised folder is the same as a tested backup.'],
    questions: ['Where will you find this file tomorrow?', 'Who can access it now?', 'What is your safe response when a message feels urgent or unusual?'],
  },
  {
    matches: ['scratch', 'sprite', 'costume', 'backdrop', 'motion', 'looks', 'events', 'loops', 'variables', 'scoring', 'conditions', 'broadcast', 'remix'],
    explain: 'Scratch makes program logic visible. Events start scripts, sequences run in order, loops repeat a pattern, conditions choose a path, variables remember changing values, and broadcasts help scenes coordinate.',
    example: 'When the green flag is clicked, reset the score, show the first backdrop, and wait for a key press before starting the next action.',
    mistakes: ['Adding blocks without testing what each one changes.', 'Using many scripts with unclear event triggers.', 'Changing a project without explaining or crediting the original idea when remixing.'],
    questions: ['What starts this script?', 'What value should change and when?', 'How will another person know what to do in the project?'],
  },
];

function buildDetailedNotes(course, currentLesson) {
  const guide = noteGuidance[course.id] ?? noteGuidance['crs-web'];
  const originalNote = String(currentLesson.notes ?? '').replace(/\s+/g, ' ').trim();
  const haystack = `${currentLesson.title} ${currentLesson.description}`.toLowerCase();
  const topic = topicGuidance.find((item) => item.matches.some((match) => haystack.includes(match))) ?? {
    explain: 'Connect the idea to the current project, make the smallest useful example, and test what happens when the input or context changes.',
    example: `Apply “${currentLesson.title}” to the current project and explain the result to another learner.`,
    mistakes: ['Trying to solve the whole problem before testing a small part.', 'Ignoring the difference between an expected result and an observed result.', 'Moving on without recording what still feels uncertain.'],
    questions: ['What is the main idea?', 'What evidence shows that it works?', 'What would you investigate next?'],
  };
  return [
    `# ${currentLesson.title}`,
    '',
    '## Lesson focus',
    currentLesson.description,
    '',
    '## Core notes',
    ...guide.principles.map((point) => `- ${point}`),
    originalNote ? `- Starting takeaway: ${originalNote}` : '',
    '',
    '## Understand the idea',
    topic.explain,
    '',
    '## Worked example',
    topic.example,
    '',
    '## A practical way to learn it',
    `1. ${guide.practice}`,
    '2. Name the expected result before you run the example or complete the task.',
    '3. Test one normal case and one case that could fail, confuse a user, or produce an unexpected result.',
    '4. Compare what you expected with what actually happened and write down the difference.',
    `5. Complete the lesson activity: ${currentLesson.assignment}`,
    '',
    '## Common mistakes to avoid',
    ...topic.mistakes.map((mistake) => `- ${mistake}`),
    '',
    '## Terms to remember',
    ...guide.vocabulary.map((term) => `- **${term}** — explain this term in your own words and connect it to today\'s task.`),
    '',
    '## Check your understanding',
    '- [ ] I can explain the main idea without copying the lesson description.',
    '- [ ] I can demonstrate the idea in the current project or activity.',
    '- [ ] I can name one limitation, risk, or question I still have.',
    ...topic.questions.map((question) => `- [ ] ${question}`),
    '',
    `> ${guide.reminder}`,
  ].join('\n');
}

for (const course of courses) {
  const extra = additionalLessons[course.id] ?? [];
  course.lessons.push(...extra);
  const media = mediaByCourse[course.id];
  if (!media) continue;
  course.lessons = course.lessons.map((currentLesson, index) => ({
    ...currentLesson,
    notes: buildDetailedNotes(course, currentLesson),
    video_url: currentLesson.video_url || media.videos[index % media.videos.length],
    video_source: currentLesson.video_source || 'Curated external learning video',
    resources: currentLesson.resources?.length
      ? currentLesson.resources
      : media.resources.slice(index % Math.max(1, media.resources.length - 1), index % Math.max(1, media.resources.length - 1) + 2),
  }));
  course.lesson_count = course.lessons.length;
  course.total_minutes = course.lessons.reduce((sum, currentLesson) => sum + Number(currentLesson.duration_minutes ?? 0), 0);
  course.resource_count = media.resources.length;
  course.video_count = new Set(course.lessons.map((currentLesson) => currentLesson.video_url).filter(Boolean)).size;
}

async function upsertCollection(collection, rows) {
  const batch = db.batch();
  for (const row of rows) {
    const ref = db.collection(collection).doc(row.id);
    batch.set(ref, { ...row, created_at: row.created_at ?? now, updated_at: now }, { merge: true });
  }
  await batch.commit();
}

async function main() {
  await upsertCollection('programmes', programmes);
  await upsertCollection('courses', courses);
  console.log(JSON.stringify({ projectId: serviceAccount.project_id, programmes: programmes.length, courses: courses.length, status: 'seeded' }));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
