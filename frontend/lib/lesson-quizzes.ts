export interface LessonQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface LessonQuiz {
  pass_percent: number;
  questions: LessonQuizQuestion[];
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function questionFrom(raw: unknown, index: number): LessonQuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const options = Array.isArray(item.options)
    ? item.options.map(String).map((option) => option.trim()).filter(Boolean)
    : [];
  if (!text(item.prompt) || options.length < 2) return null;
  const correctIndex = Math.max(
    0,
    Math.min(options.length - 1, Number(item.correct_index ?? item.correctIndex ?? 0) || 0),
  );
  return {
    id: text(item.id, `question-${index + 1}`),
    prompt: text(item.prompt),
    options,
    correct_index: correctIndex,
    explanation: text(item.explanation, "Review the lesson notes and try the example again.") ,
  };
}

/**
 * Every lesson receives a short, repeatable mastery check. Seeded content can
 * override this by adding a quiz/questions object to the lesson document.
 */
export function normaliseLessonQuiz(lesson: Record<string, unknown>): LessonQuiz {
  const raw = lesson.quiz && typeof lesson.quiz === "object"
    ? lesson.quiz as Record<string, unknown>
    : null;
  const rawQuestions = raw?.questions ?? lesson.quiz_questions;
  const questions = Array.isArray(rawQuestions)
    ? rawQuestions.map(questionFrom).filter((item): item is LessonQuizQuestion => Boolean(item))
    : [];
  if (questions.length >= 2) {
    return {
      pass_percent: Math.max(50, Math.min(100, Number(raw?.pass_percent ?? 70) || 70)),
      questions,
    };
  }

  const title = text(lesson.title, "this lesson");
  return {
    pass_percent: 70,
    questions: [
      {
        id: "focus",
        prompt: `What is the central focus of “${title}”?`,
        options: [
          title,
          "Skipping the practice work and moving on immediately",
          "Memorising terms without applying them",
          "Publishing a project before checking it",
        ],
        correct_index: 0,
        explanation: `The lesson focus is stated in its title: ${title}. Use the examples in the notes to explain it in your own words.`,
      },
      {
        id: "mastery",
        prompt: "Which action best demonstrates mastery after reading the lesson?",
        options: [
          "Explain the idea and apply it to a small example",
          "Copy an answer without checking how it works",
          "Skip the example because the notes are enough",
          "Submit an empty response and ask someone else to solve it",
        ],
        correct_index: 0,
        explanation: "Mastery combines explanation with application. Try the smallest useful example before attempting the assignment.",
      },
      {
        id: "evidence",
        prompt: "What is the strongest evidence that you are ready to continue?",
        options: [
          "You can describe what you built, why it works, and what you would improve",
          "You finished reading without trying anything",
          "You used the longest code sample available",
          "You received the answer from a classmate",
        ],
        correct_index: 0,
        explanation: "A clear explanation, a working example, and an honest next improvement show transferable understanding.",
      },
    ],
  };
}
