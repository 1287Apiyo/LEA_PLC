export interface CourseMaterial {
  id: string;
  title: string;
  type: "pdf";
  url: string;
  download_url: string;
  description: string;
}

const staticPdf = (
  courseId: string,
  id: string,
  title: string,
  filename: string,
  description: string,
): CourseMaterial => ({
  id: `${courseId}-${id}`,
  title,
  type: "pdf",
  url: `/course-packs/${filename}`,
  download_url: `/course-packs/${filename}`,
  description,
});

/**
 * Files shown in the learner portal for each course.
 *
 * This manifest intentionally contains only PDF files explicitly supplied by
 * the LEA team. It must not invent generated packs or expose structured JSON.
 */
export function courseMaterialsFor(courseId: string): CourseMaterial[] {
  switch (courseId) {
    case "crs-app":
      return [
        staticPdf(
          courseId,
          "android-app-development-made-understandable",
          "Android App Development, Made Understandable",
          "android-app-development-made-understandable.pdf",
          "Beginner Android Studio, Kotlin, Jetpack Compose, and mobile-app foundations.",
        ),
        staticPdf(
          courseId,
          "android-app-development-visual-slides",
          "Android beginner visual slides",
          "android-app-development-visual-slides.pdf",
          "Visual-first Android beginner teaching slides for guided classroom learning.",
        ),
        staticPdf(
          courseId,
          "campus-tasks-project-walkthrough",
          "Project 1: Build Campus Tasks",
          "campus-tasks-project-walkthrough.pdf",
          "Step-by-step project walkthrough for building the Campus Tasks Android app.",
        ),
        staticPdf(
          courseId,
          "campus-tasks-room-advanced-state",
          "Campus Tasks: State and Room",
          "campus-tasks-room-advanced-state.pdf",
          "Advanced state management and Room local database storage project deck.",
        ),
      ];

    case "crs-web":
      return [
        staticPdf(
          courseId,
          "web-development-course-pack",
          "Web Development course pack",
          "web-development-course-pack.pdf",
          "The supplied Web Development course pack for the full web pathway.",
        ),
        staticPdf(
          courseId,
          "html-foundations",
          "HTML Foundations",
          "html-foundations.pdf",
          "HTML structure, semantic elements, and the first accessible page.",
        ),
        staticPdf(
          courseId,
          "html-content-media",
          "HTML Content and Media",
          "html-content-media.pdf",
          "Links, images, media, page structure, and content-rich HTML.",
        ),
        staticPdf(
          courseId,
          "html-forms-accessibility",
          "HTML Forms and Accessibility",
          "html-forms-accessibility.pdf",
          "Accessible forms, labels, validation, and inclusive page structure.",
        ),
        staticPdf(
          courseId,
          "html-capstone",
          "HTML Capstone Project",
          "html-capstone.pdf",
          "A complete HTML project walkthrough from page plan to finished build.",
        ),
        staticPdf(
          courseId,
          "css-foundations",
          "CSS Foundations",
          "css-foundations.pdf",
          "Selectors, properties, the box model, typography, and first visual styles.",
        ),
        staticPdf(
          courseId,
          "css-cascade",
          "CSS Cascade and Theming",
          "css-cascade.pdf",
          "Cascade, specificity, inheritance, variables, and reusable themes.",
        ),
        staticPdf(
          courseId,
          "css-layout",
          "CSS Layout",
          "css-layout.pdf",
          "Flexbox, Grid, layout systems, alignment, and responsive composition.",
        ),
        staticPdf(
          courseId,
          "css-responsive",
          "CSS Responsive Design",
          "css-responsive.pdf",
          "Responsive breakpoints, mobile-first thinking, and adaptive components.",
        ),
        staticPdf(
          courseId,
          "css-capstone",
          "CSS Capstone Project",
          "css-capstone.pdf",
          "A complete responsive styling project with polish and deployment checks.",
        ),
        staticPdf(
          courseId,
          "javascript-foundations",
          "JavaScript Foundations",
          "javascript-foundations.pdf",
          "JavaScript syntax, values, variables, functions, and foundational logic.",
        ),
        staticPdf(
          courseId,
          "javascript-data",
          "JavaScript Data and Arrays",
          "javascript-data.pdf",
          "Objects, arrays, iteration, transformations, and data-driven interfaces.",
        ),
        staticPdf(
          courseId,
          "javascript-dom",
          "JavaScript DOM and Events",
          "javascript-dom.pdf",
          "DOM selection, events, forms, stateful interfaces, and browser interaction.",
        ),
        staticPdf(
          courseId,
          "javascript-async",
          "JavaScript Async and APIs",
          "javascript-async.pdf",
          "Promises, async/await, fetch, loading states, errors, and API workflows.",
        ),
      ];

    case "crs-api":
      return [
        staticPdf(
          courseId,
          "api-integration-intro",
          "API Integration Intro",
          "api-integration-intro.pdf",
          "Requests, responses, JSON, state, errors, and the first API-integrated product.",
        ),
      ];

    case "crs-ai-foundations":
      return [
        staticPdf(
          courseId,
          "applied-ai-foundations-literacy",
          "Applied AI Foundations & Literacy",
          "applied-ai-foundations-literacy.pdf",
          "AI concepts, prompting, evaluation, failure modes, responsible AI, and the learner lab.",
        ),
      ];

    case "crs-ai-dev":
      return [
        staticPdf(
          courseId,
          "ai-assisted-engineering",
          "AI-Assisted Engineering: You Are Still the Pilot",
          "ai-assisted-engineering.pdf",
          "AI-assisted coding, verification, testing, security, and human engineering judgement.",
        ),
      ];

    case "crs-capstone":
      return [
        staticPdf(
          courseId,
          "software-product-studio",
          "Software Product Studio: Ship a Product That Proves Your Skills",
          "software-product-studio.pdf",
          "Product discovery, scope, delivery, testing, deployment, and capstone presentation.",
        ),
      ];

    case "crs-ai-workflows":
      return [
        staticPdf(
          courseId,
          "ai-workflows-automation",
          "AI Workflows & Automation",
          "ai-workflows-automation.pdf",
          "Workflow mapping, prompt pipelines, automation candidates, human checkpoints, and safe AI-assisted workflows.",
        ),
      ];

    case "crs-scratch":
      return [
        staticPdf(
          courseId,
          "scratch-starter-lab",
          "Scratch Starter Lab",
          "scratch-starter-lab.pdf",
          "Scratch stage, sprites, events, sequences, and a first creative project.",
        ),
        staticPdf(
          courseId,
          "scratch-game-makers",
          "Scratch Game Makers",
          "scratch-game-makers.pdf",
          "Build a catching game with motion, scoring, rules, and interactive feedback.",
        ),
        staticPdf(
          courseId,
          "scratch-block-explorer",
          "Scratch Block Explorer",
          "scratch-block-explorer.pdf",
          "A broad visual tour of Scratch block categories and creative experiments.",
        ),
      ];

    default:
      return [];
  }
}

export default courseMaterialsFor;
