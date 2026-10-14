export type Programme = {
  slug: string;
  number: string;
  title: string;
  short: string;
  audience: string;
  bullets: string[];
  icon: string;
  tone: string;
  image: string;
  eyebrow: string;
  overview: string;
  outcome: string;
  duration: string;
  format: string;
  price: string;
  priceNote: string;
  curriculum: CurriculumItem[];
  projects: ProjectOutcome[];
  modules: Array<{ number: string; title: string; summary: string; price: string }>;
  catalogueKeys?: string[];
  faqs: Array<{ question: string; answer: string }>;
};


export type CurriculumItem = {
  number: string;
  title: string;
  weeks: string;
  summary: string;
  topics: string[];
  project?: string;
  stack?: string[];
  type?: "break";
};

export type ProjectOutcome = {
  title: string;
  build: string;
  integrations: string[];
  evidence: string;
};



export const PROGRAMMES: Programme[] = [
  {
    slug: "software-engineering",
    number: "01",
    title: "Software Engineering",
    short: "Learn to design, build, test, and ship useful digital products through practical project work.",
    audience: "For curious makers ready to turn ideas into working websites and applications.",
    bullets: ["HTML/CSS + TypeScript", "Python for data & AI", "Portfolio projects"],
    icon: "</>",
    tone: "from-[#efe2f7] to-[#f8eef9]",
    image: "/images/programmes/software-engineering-hero.png",
    eyebrow: "Build digital products",
    overview: "A practical route into software engineering for learners who want to understand how digital products are planned, built, tested, and improved.",
    outcome: "Leave with a portfolio-ready project, a clearer technical vocabulary, and a repeatable way to keep building.",
    duration: "16 weeks",
    format: "Guided practice, mentor feedback, and project work",
    price: "KES 40,000",
    priceNote: "Foundation Track fees cover the guided foundations pathway, practical projects, mentor feedback, and the first capstone review.",
    catalogueKeys: ["prg-coding", "coding", "coding-programme"],
    curriculum: [
      { number: "01", title: "Digital foundations", weeks: "Weeks 1–2", summary: "Start with how the web works, semantic structure, modern CSS, developer tools, Git, and a reliable workflow for learning by doing.", topics: ["HTML & CSS", "How the web works", "Git & GitHub", "Accessibility"], project: "Build an accessible LEA learner profile page and publish a README explaining your choices and AI-use boundaries.", stack: ["HTML", "CSS", "Git"] },
      { number: "02", title: "TypeScript web products", weeks: "Weeks 3–5", summary: "Turn ideas into clear, responsive interfaces with typed data, browser interaction, forms, and component thinking.", topics: ["TypeScript", "Responsive CSS", "DOM & events", "Accessible UI"], project: "Build a responsive community services directory that works on a phone and desktop.", stack: ["TypeScript", "HTML", "CSS"] },
      { number: "03", title: "APIs & data products", weeks: "Weeks 6–8", summary: "Connect a product to real services and learn how to reason through state, validation, provenance, and failure.", topics: ["HTTP & JSON", "Async TypeScript", "API contracts", "Data quality"], project: "Build a live conditions or community-information dashboard with loading, empty, error, and retry states.", stack: ["TypeScript", "REST APIs", "JSON"] },
      { number: "BREAK", title: "Mid-programme reset", weeks: "Week 9", summary: "Pause, review your progress, get mentor feedback, and return with a sharper plan for the backend build.", topics: ["Rest & reflection", "Portfolio check-in", "Mentor review"], project: "Complete a portfolio review, prioritised backlog, and mentor feedback record before the backend build.", type: "break" },
      { number: "04", title: "Python, backend & data", weeks: "Weeks 10–12", summary: "Use Python to clean data and build the services behind a product: routes, SQL, validation, authentication, and tests.", topics: ["Python", "Data cleaning", "SQL", "API services"], project: "Build a learner-enrolment data service with a data dictionary, validation, and endpoint tests.", stack: ["Python", "SQL", "REST APIs"] },
      { number: "05", title: "AI-integrated full stack", weeks: "Weeks 13–14", summary: "Connect a TypeScript interface to a Python AI service, then evaluate, secure, and explain the resulting product behaviour.", topics: ["AI-assisted engineering", "Structured output", "Evaluation", "Human review"], project: "Build a learner-support feature grounded in approved information with citations, uncertainty handling, and escalation.", stack: ["TypeScript", "Python", "AI evaluation"] },
      { number: "06", title: "Capstone & portfolio", weeks: "Weeks 15–16", summary: "Bring the full journey together in a guided capstone and shape a clear story around the product, evidence, and trade-offs.", topics: ["Product scope", "Deployment", "Testing", "Portfolio story"], project: "Ship a community learning operations portal combining catalogue, enrolment, progress, payments, and an admin dashboard.", stack: ["TypeScript", "Python", "SQL", "Deployment"] },
    ],
    projects: [
      { title: "Community services directory", build: "A responsive, searchable directory for local learning, health, or business services with accessible forms and mobile-first layouts.", integrations: ["TypeScript UI", "HTML/CSS", "Search and filters"], evidence: "Published URL, repository, content model, accessibility check, and user feedback." },
      { title: "Daraja payment simulator", build: "A safe enrolment checkout that models STK Push request, pending, success, failure, timeout, duplicate callback, receipt, and admin reconciliation states.", integrations: ["Safaricom Daraja sandbox or mock", "REST API", "SQL audit trail"], evidence: "State diagram, test matrix, simulated receipts, security checklist, and no-real-money demo." },
      { title: "Google-connected operations tool", build: "A staff dashboard that reads approved Google data such as Calendar events, Drive files, or Sheets rows and turns it into a useful workflow.", integrations: ["Google OAuth", "Google Sheets/Drive/Calendar APIs", "Python service or TypeScript API route"], evidence: "API contract, consent and scope note, mocked fallback, error handling, and deployment README." },
      { title: "AI-integrated learning portal", build: "A full-stack learner-support feature with a TypeScript interface and Python service that answers from approved information, cites sources, and escalates uncertainty.", integrations: ["Python AI service", "Approved knowledge base", "Structured model output"], evidence: "Evaluation set, red-team examples, human-review policy, demo, and retrospective." },
    ],
    modules: [
      { number: "01", title: "Digital foundations", summary: "Understand how the web works, work confidently with tools, and build a reliable learning workflow.", price: "KES 11,250" },
      { number: "02", title: "Interface and frontend", summary: "Turn ideas into clear, responsive interfaces with accessible HTML, CSS, and modern frontend practice.", price: "KES 11,250" },
      { number: "03", title: "Backend and APIs", summary: "Learn how data, routes, authentication, and services work together behind a digital product.", price: "KES 11,250" },
      { number: "04", title: "Capstone build", summary: "Bring the pieces together in a guided project that shows how you think and what you can make.", price: "KES 11,250" },
    ],
    faqs: [
      { question: "Do I need previous coding experience?", answer: "No. We start with the fundamentals and build confidence through focused practice. Curiosity and consistency matter more than prior experience." },
      { question: "What will I build?", answer: "You will work toward a practical digital product that can become a portfolio piece and a useful story about how you approach problems." },
      { question: "Can I pay by module?", answer: "Yes. The individual module price is shown above, while the full-programme option keeps the learning journey together from foundations through capstone." },
    ],
  },
  {
    slug: "applied-ai",
    number: "02",
    title: "Applied AI",
    short: "Explore how intelligent tools can support research, workflows, decision-making, and creative work.",
    audience: "For builders who want a grounded, responsible starting point in AI.",
    bullets: ["Python + data literacy", "Reliable AI workflows", "Evaluation & safety"],
    icon: "✦",
    tone: "from-[#fff0e8] to-[#f8e2d9]",
    image: "/images/programmes/applied-ai-hero.png",
    eyebrow: "Work thoughtfully with AI",
    overview: "A grounded introduction to applied AI that helps learners move beyond the hype and use intelligent tools with clarity, care, and practical intent.",
    outcome: "Leave with a small library of useful workflows, stronger judgement, and a practical point of view on responsible AI use.",
    duration: "12 weeks",
    format: "Experiments, guided studio work, and feedback",
    price: "KES 35,000",
    priceNote: "Full programme tuition covers all four modules, guided experiments, practical workflow reviews, and the applied AI studio project.",
    curriculum: [
      { number: "01", title: "AI & data foundations", weeks: "Weeks 1–2", summary: "Build a useful mental model of modern AI systems, data quality, Python, and the limits that shape responsible use.", topics: ["AI vocabulary", "Python basics", "Data quality", "Use-case mapping"], project: "Create a Python notebook that explores a small dataset and an AI use-case map with a go, no-go, or pilot recommendation.", stack: ["Python", "Data literacy", "AI foundations"] },
      { number: "02", title: "Python data lab", weeks: "Weeks 3–5", summary: "Use Python to clean, inspect, visualise, and explain data before deciding whether AI belongs in the workflow.", topics: ["CSV & JSON", "Data cleaning", "Visualisation", "Uncertainty"], project: "Produce a reproducible data brief with provenance, assumptions, and a clear explanation of what the data cannot prove.", stack: ["Python", "Data analysis", "Visualisation"] },
      { number: "BREAK", title: "Studio reset", weeks: "Week 6", summary: "Step back from the tools, review what is working, and get feedback before moving into responsible practice.", topics: ["Rest & reflection", "Workflow review", "Mentor check-in"], project: "Audit the workflow, remove unnecessary automation, and document the revised human review step.", type: "break" },
      { number: "03", title: "Prompt & workflow design", weeks: "Weeks 6–7", summary: "Turn repeated tasks into clearer, more reliable workflows with structured outputs, versioned prompts, and human approval.", topics: ["Prompt structure", "Schemas", "Tool boundaries", "Quality checks"], project: "Design an admissions or support workflow assistant and evaluate it on a fixed test set.", stack: ["Python", "Structured outputs", "Evaluation"] },
      { number: "04", title: "Research & verification", weeks: "Week 8", summary: "Use AI to accelerate exploration without outsourcing judgement, accuracy, or the responsibility to verify.", topics: ["Source checking", "Fact verification", "Citations", "Uncertainty"], project: "Produce a source-backed research brief with an evidence table and corrections log." },
      { number: "05", title: "Responsible AI practice", weeks: "Weeks 9–10", summary: "Explore privacy, bias, safety, prompt injection, and the judgement needed to use intelligent tools with care.", topics: ["Privacy", "Bias & fairness", "Security", "Human oversight"], project: "Review a fictional learner-support workflow for privacy, bias, unsafe decisions, and escalation requirements.", stack: ["Responsible AI", "Risk review", "Security"] },
      { number: "06", title: "Applied AI studio", weeks: "Weeks 11–12", summary: "Design, test, and present a small AI-supported project connected to a meaningful real-world outcome.", topics: ["Python service", "Knowledge grounding", "Evaluation", "Showcase"], project: "Build a human-in-the-loop learner-support assistant with a Python service, approved information, citations, and escalation.", stack: ["Python", "AI service", "TypeScript UI"] },
    ],
    projects: [
      { title: "Python data brief", build: "A reproducible notebook that cleans a small local dataset, explains patterns, visualises uncertainty, and records data provenance.", integrations: ["Python", "CSV/JSON", "Notebook and charts"], evidence: "Notebook, cleaned data, data dictionary, visualisations, assumptions, and a two-minute explanation." },
      { title: "Customer-support AI assistant", build: "A support workflow that classifies questions, drafts replies, cites approved information, and sends uncertain cases to a human.", integrations: ["LLM API or approved local model", "Structured JSON output", "Knowledge base"], evidence: "Fixed evaluation set, accuracy and failure table, prompt versions, escalation rules, and privacy checklist." },
      { title: "AI research and verification studio", build: "A source-backed research brief produced with AI assistance but verified by the learner against primary sources and recorded corrections.", integrations: ["Search workflow", "Citations", "Python extraction helpers"], evidence: "Research log, evidence table, corrections log, uncertainty notes, and final brief." },
      { title: "Vision or prediction prototype", build: "A small, clearly scoped computer-vision or forecasting prototype such as object counting, barcode scanning, weather trend analysis, or transport-demand exploration.", integrations: ["Python", "Camera or tabular data", "Evaluation and consent"], evidence: "Dataset note, prototype, test cases, limitations, privacy review, and a recommendation for the next iteration." },
    ],
    modules: [
      { number: "01", title: "AI in plain language", summary: "Build a useful mental model of modern AI systems, their strengths, limits, and everyday applications.", price: "KES 8,750" },
      { number: "02", title: "Prompt and workflow design", summary: "Turn repeated tasks into clearer, more reliable workflows that support real work.", price: "KES 8,750" },
      { number: "03", title: "Responsible AI practice", summary: "Explore privacy, bias, verification, and the judgement needed to use AI well.", price: "KES 8,750" },
      { number: "04", title: "Applied AI studio", summary: "Design and test a small AI-supported project that connects tools to a meaningful outcome.", price: "KES 8,750" },
    ],
    faqs: [
      { question: "Is this only for technical learners?", answer: "No. The programme is designed for people who want to use AI in practical work, whether they come from a technical, creative, operational, or learning background." },
      { question: "Will we build AI models from scratch?", answer: "The focus is applied use, workflow design, and responsible judgement rather than training large models from scratch." },
      { question: "Can I pay by module?", answer: "Yes. You can start with an individual module, or choose the full programme to follow the complete learning journey with a connected studio project." },
    ],
  },
  {
    slug: "basic-computer-knowledge",
    number: "03",
    title: "Digital Foundations",
    short: "Build everyday confidence with devices, files, the internet, and the digital habits that make learning easier.",
    audience: "For beginners, children, and families taking their first steps with computers.",
    bullets: ["Digital confidence", "Beginner friendly", "Kids welcome"],
    icon: "⌘",
    tone: "from-[#e8f2ef] to-[#eef7f4]",
    image: "/images/programmes/digital-foundations-hero.png",
    eyebrow: "Start with confidence",
    overview: "A welcoming first step for beginners and kids who want to feel at home with computers, the internet, and the everyday tools that open up learning.",
    outcome: "Leave with practical digital confidence, safer online habits, and a foundation for your next learning step.",
    duration: "8 weeks",
    format: "Guided practice, simple projects, and supportive coaching",
    price: "KES 25,000",
    priceNote: "Full programme tuition covers all four modules, guided practice, beginner-friendly projects, and supportive coaching for the learner.",
    curriculum: [
      { number: "01", title: "Meet your computer", weeks: "Weeks 1–2", summary: "Learn the parts of a computer, how to use a mouse and keyboard, and how to work confidently with the desktop.", topics: ["Parts of a computer", "Mouse & keyboard", "Desktop basics", "Device care"], project: "Create and organise a personal digital workspace with folders, a backup copy, and a learner checklist." },
      { number: "02", title: "Files & documents", weeks: "Weeks 3–4", summary: "Create, save, find, and organise documents so your work stays easy to follow and share.", topics: ["Folders", "Documents", "Saving work", "Sharing"], project: "Create a useful community document pack with a flyer, simple budget, timetable, and shared folder." },
      { number: "BREAK", title: "Practice pause", weeks: "Week 5", summary: "Take a short pause to practise the essentials, ask questions, and celebrate the progress already made.", topics: ["Rest & practice", "Learner check-in", "Family support"], project: "Complete a digital confidence check-in and agree a supported next-step practice plan.", type: "break" },
      { number: "03", title: "Internet confidence", weeks: "Weeks 6–7", summary: "Search, communicate, and recognise safer online habits while building everyday digital independence.", topics: ["Search skills", "Email basics", "Online safety", "Digital kindness"], project: "Create a beginner-friendly safer online choices guide using real message and link scenarios." },
      { number: "04", title: "First digital project", weeks: "Week 8", summary: "Use new skills to make something simple, useful, and worth sharing with a mentor or family member.", topics: ["Choose an idea", "Make it", "Share it", "Next step"], project: "Make and present a small helpful digital product for a family, school, or community need." },
    ],
    projects: [
      { title: "My digital workspace", build: "A clear folder system with named documents, a backup copy, and a learner checklist.", integrations: ["Files and folders", "Safe sharing", "Backup habits"], evidence: "Before/after folder map, finished files, and a short demonstration." },
      { title: "Safer online choices guide", build: "A beginner-friendly guide that explains suspicious messages, unsafe links, privacy choices, and respectful communication.", integrations: ["Search", "Email", "Online safety"], evidence: "Published guide, scenario walkthrough, and family or mentor feedback." },
      { title: "First helpful digital product", build: "A poster, form, timetable, guide, or simple webpage that solves a small family, school, or community need.", integrations: ["Documents", "Presentation or design tool", "Sharing"], evidence: "Finished product, audience feedback, and a short presentation." },
    ],
    modules: [
      { number: "01", title: "Meet your computer", summary: "Learn the parts of a computer, how to use a mouse and keyboard, and how to work confidently with the desktop.", price: "KES 4,500" },
      { number: "02", title: "Files and documents", summary: "Create, save, find, and organise documents so your work stays easy to follow.", price: "KES 4,500" },
      { number: "03", title: "Internet confidence", summary: "Search, communicate, and recognise safer online habits while building digital independence.", price: "KES 4,500" },
      { number: "04", title: "First digital project", summary: "Use your new skills to make something simple, useful, and worth sharing with a mentor or family member.", price: "KES 4,500" },
    ],
    faqs: [
      { question: "Is this programme suitable for children?", answer: "Yes. The pathway is designed to be welcoming for beginners, children, and families, with a supportive pace and practical activities." },
      { question: "What should a learner bring?", answer: "A willingness to practise is the most important thing. The admissions team can explain the device and access requirements for the chosen format." },
      { question: "Can I pay by module?", answer: "Yes. Families can begin with a single module or enrol for the full four-module pathway at the programme price shown above." },
    ],
  },
];

export function getProgramme(slug: string) {
  return PROGRAMMES.find((programme) => programme.slug === slug);
}
