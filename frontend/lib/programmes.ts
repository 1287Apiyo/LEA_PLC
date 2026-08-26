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
  type?: "break";
};

const IMAGE_ROOT = "https://leasystem-jgtiwg7u.manus.space/manus-storage";

export const PROGRAMMES: Programme[] = [
  {
    slug: "software-engineering",
    number: "01",
    title: "Software Engineering",
    short: "Learn to design, build, test, and ship useful digital products through practical project work.",
    audience: "For curious makers ready to turn ideas into working websites and applications.",
    bullets: ["Web foundations", "Product thinking", "Project practice"],
    icon: "</>",
    tone: "from-[#efe2f7] to-[#f8eef9]",
    image: `${IMAGE_ROOT}/lea-programme-collaboration_c9aa5e6b.jpg`,
    eyebrow: "Build digital products",
    overview: "A practical route into software engineering for learners who want to understand how digital products are planned, built, tested, and improved.",
    outcome: "Leave with a portfolio-ready project, a clearer technical vocabulary, and a repeatable way to keep building.",
    duration: "16 weeks",
    format: "Guided practice, mentor feedback, and project work",
    price: "KES 45,000",
    priceNote: "Full programme tuition covers the live course catalogue, guided projects, mentor feedback, and the final capstone review.",
    catalogueKeys: ["prg-coding", "coding", "coding-programme"],
    curriculum: [
      { number: "01", title: "Digital foundations", weeks: "Weeks 1–2", summary: "Start with how the web works, the tools engineers use, and a reliable workflow for learning by doing.", topics: ["How the web works", "Developer tools", "Git & GitHub", "Learning workflow"] },
      { number: "02", title: "Frontend foundations", weeks: "Weeks 3–5", summary: "Turn ideas into clear, responsive interfaces that are structured for real people and real devices.", topics: ["Semantic HTML", "CSS layouts", "Responsive UI", "Accessibility"] },
      { number: "03", title: "JavaScript & interaction", weeks: "Weeks 6–8", summary: "Add behaviour to interfaces and learn how to reason through state, events, APIs, and bugs.", topics: ["Logic & data", "DOM & events", "Async APIs", "Debugging"] },
      { number: "BREAK", title: "Mid-programme reset", weeks: "Week 9", summary: "Pause, review your progress, get mentor feedback, and return with a sharper plan for the backend build.", topics: ["Rest & reflection", "Portfolio check-in", "Mentor review"], type: "break" },
      { number: "04", title: "Backend & data", weeks: "Weeks 10–12", summary: "Build the systems behind a product: routes, data, authentication, validation, and secure services.", topics: ["Node & API routes", "Databases", "Authentication", "Validation"] },
      { number: "05", title: "Full-stack integration", weeks: "Weeks 13–14", summary: "Connect the interface and backend into a complete product, then test and deploy it with confidence.", topics: ["Client-server flow", "Forms & state", "Testing", "Deployment"] },
      { number: "06", title: "Capstone & portfolio", weeks: "Weeks 15–16", summary: "Bring the full journey together in a guided capstone and shape a clear story around the work you made.", topics: ["Product scope", "Build sprint", "Demo day", "Portfolio story"] },
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
    bullets: ["AI foundations", "Practical workflows", "Responsible use"],
    icon: "✦",
    tone: "from-[#fff0e8] to-[#f8e2d9]",
    image: `${IMAGE_ROOT}/lea-hero-learning-current_d35697f7.jpg`,
    eyebrow: "Work thoughtfully with AI",
    overview: "A grounded introduction to applied AI that helps learners move beyond the hype and use intelligent tools with clarity, care, and practical intent.",
    outcome: "Leave with a small library of useful workflows, stronger judgement, and a practical point of view on responsible AI use.",
    duration: "12 weeks",
    format: "Experiments, guided studio work, and feedback",
    price: "KES 35,000",
    priceNote: "Full programme tuition covers all four modules, guided experiments, practical workflow reviews, and the applied AI studio project.",
    curriculum: [
      { number: "01", title: "AI in plain language", weeks: "Weeks 1–2", summary: "Build a useful mental model of modern AI systems, their strengths, limits, and everyday applications.", topics: ["AI vocabulary", "Models & data", "Use-case mapping", "Limits"] },
      { number: "02", title: "Prompt & workflow design", weeks: "Weeks 3–5", summary: "Turn repeated tasks into clearer, more reliable workflows that support research, writing, and decisions.", topics: ["Prompt structure", "Context design", "Reusable workflows", "Quality checks"] },
      { number: "BREAK", title: "Studio reset", weeks: "Week 6", summary: "Step back from the tools, review what is working, and get feedback before moving into responsible practice.", topics: ["Rest & reflection", "Workflow review", "Mentor check-in"], type: "break" },
      { number: "03", title: "Research & verification", weeks: "Weeks 7–8", summary: "Use AI to accelerate exploration without outsourcing judgement, accuracy, or the responsibility to verify.", topics: ["Research prompts", "Source checking", "Fact verification", "Decision notes"] },
      { number: "04", title: "Responsible AI practice", weeks: "Weeks 9–10", summary: "Explore privacy, bias, safety, and the judgement needed to use intelligent tools with care.", topics: ["Privacy", "Bias & fairness", "Safety", "Human oversight"] },
      { number: "05", title: "Applied AI studio", weeks: "Weeks 11–12", summary: "Design, test, and present a small AI-supported project connected to a meaningful real-world outcome.", topics: ["Project brief", "Prototype", "Test & refine", "Showcase"] },
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
    title: "Basic Computer Knowledge",
    short: "Build everyday confidence with devices, files, the internet, and the digital habits that make learning easier.",
    audience: "For beginners, children, and families taking their first steps with computers.",
    bullets: ["Digital confidence", "Beginner friendly", "Kids welcome"],
    icon: "⌘",
    tone: "from-[#e8f2ef] to-[#eef7f4]",
    image: `${IMAGE_ROOT}/lea-community-launch_f1ae296d.jpg`,
    eyebrow: "Start with confidence",
    overview: "A welcoming first step for beginners and kids who want to feel at home with computers, the internet, and the everyday tools that open up learning.",
    outcome: "Leave with practical digital confidence, safer online habits, and a foundation for your next learning step.",
    duration: "8 weeks",
    format: "Guided practice, simple projects, and supportive coaching",
    price: "KES 18,000",
    priceNote: "Full programme tuition covers all four modules, guided practice, beginner-friendly projects, and supportive coaching for the learner.",
    curriculum: [
      { number: "01", title: "Meet your computer", weeks: "Weeks 1–2", summary: "Learn the parts of a computer, how to use a mouse and keyboard, and how to work confidently with the desktop.", topics: ["Parts of a computer", "Mouse & keyboard", "Desktop basics", "Device care"] },
      { number: "02", title: "Files & documents", weeks: "Weeks 3–4", summary: "Create, save, find, and organise documents so your work stays easy to follow and share.", topics: ["Folders", "Documents", "Saving work", "Sharing"] },
      { number: "BREAK", title: "Practice pause", weeks: "Week 5", summary: "Take a short pause to practise the essentials, ask questions, and celebrate the progress already made.", topics: ["Rest & practice", "Learner check-in", "Family support"], type: "break" },
      { number: "03", title: "Internet confidence", weeks: "Weeks 6–7", summary: "Search, communicate, and recognise safer online habits while building everyday digital independence.", topics: ["Search skills", "Email basics", "Online safety", "Digital kindness"] },
      { number: "04", title: "First digital project", weeks: "Week 8", summary: "Use new skills to make something simple, useful, and worth sharing with a mentor or family member.", topics: ["Choose an idea", "Make it", "Share it", "Next step"] },
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
