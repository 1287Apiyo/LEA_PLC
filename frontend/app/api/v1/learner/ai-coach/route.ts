import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 1_200;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_ITEM_LENGTH = 1_600;
const MAX_CONTEXT_LENGTH = 12_000;

function text(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function chatEndpoint(baseUrl: string) {
  const base = baseUrl.replace(/\/+$/, "");
  return base.endsWith("/v1") ? `${base}/chat/completions` : `${base}/v1/chat/completions`;
}

function assistantText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") return String((part as Record<string, unknown>).text ?? "");
        return "";
      })
      .join("")
      .trim();
  }
  return "";
}

function serialiseLesson(lesson: Record<string, unknown>) {
  const content = lesson.lesson_content;
  const sections =
    content && typeof content === "object" && Array.isArray((content as Record<string, unknown>).sections)
      ? ((content as Record<string, unknown>).sections as Record<string, unknown>[])
          .slice(0, 8)
          .map((section, index) => `${index + 1}. ${text(section.title, 120)}\n${text(section.body, 900)}`)
          .join("\n\n")
      : "";

  return [
    `Lesson: ${text(lesson.title, 180)}`,
    `Lesson description: ${text(lesson.description, 600)}`,
    `Lesson notes: ${text(lesson.notes, 4_000)}`,
    sections ? `Structured lesson content:\n${sections}` : "",
    `Assignment brief: ${text(lesson.assignment, 1_400)}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function learnerHasCourseAccess(learnerId: string, courseId: string) {
  const db = getDb();
  const snapshot = await db
    .collection("enrolments")
    .where("learnerId", "==", learnerId)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();
  return !snapshot.empty;
}

async function courseContext(courseId: string, lessonId: string) {
  const db = getDb();
  const courseSnapshot = await db.collection("courses").doc(courseId).get();
  if (!courseSnapshot.exists) return null;

  const course = courseSnapshot.data() as Record<string, unknown>;
  const lessons = Array.isArray(course.lessons) ? (course.lessons as Record<string, unknown>[]) : [];
  const selectedLesson =
    lessons.find((lesson, index) => text(lesson.id, 120) === lessonId || `lesson-${index + 1}` === lessonId) ?? null;

  return [
    `Course: ${text(course.title, 220)}`,
    `Programme: ${text(course.programme, 180)}`,
    `Course summary: ${text(course.summary ?? course.description, 1_000)}`,
    `Skills: ${Array.isArray(course.skills) ? course.skills.map(String).slice(0, 12).join(" · ") : ""}`,
    `Learning outcomes: ${Array.isArray(course.outcomes) ? course.outcomes.map(String).slice(0, 10).join("; ") : ""}`,
    selectedLesson ? serialiseLesson(selectedLesson) : "No specific lesson was selected.",
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, MAX_CONTEXT_LENGTH);
}

function fallbackReply(message: string, hasContext: boolean) {
  if (!hasContext) {
    return "I’m ready to help you learn. Open a course or lesson first so I can ground the explanation in your LEA Labs materials, then ask me what you want to understand.";
  }
  return `I can help you work through that step by step. Start by identifying the key idea in the current lesson, then explain what you have tried so far. For your question — “${message.slice(0, 160)}” — share the part that feels unclear and I’ll give you a focused hint rather than completing the work for you.`;
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("The AI Learning Coach is available to learners only.", 403);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Send a valid JSON request.", 400);
  }

  const message = text(body.message, MAX_MESSAGE_LENGTH);
  if (!message) return jsonError("Ask the coach a question first.", 422);

  const courseId = text(body.courseId, 160);
  const lessonId = text(body.lessonId, 160);
  let context = "";

  if (courseId) {
    const hasAccess = await learnerHasCourseAccess(auth.user.id, courseId);
    if (!hasAccess) return jsonError("You can only ask about courses in which you are enrolled.", 403);
    context = (await courseContext(courseId, lessonId)) ?? "";
    if (!context) return jsonError("The selected course could not be found.", 404);
  }

  const history = Array.isArray(body.history)
    ? body.history
        .slice(-MAX_HISTORY_ITEMS)
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: text(item.content, MAX_HISTORY_ITEM_LENGTH),
        }))
        .filter((item) => item.content)
    : [];

  const baseUrl = process.env.BUILT_IN_FORGE_API_URL ?? process.env.OPENAI_API_BASE;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY ?? process.env.OPENAI_API_KEY;

  if (!baseUrl || !apiKey) {
    return jsonOk({
      data: {
        answer: fallbackReply(message, Boolean(context)),
        source: "guided-fallback",
        configured: false,
      },
    });
  }

  const systemPrompt = [
    "You are LEA Labs AI Learning Coach, a warm and precise learning companion for adult and young learners.",
    "Use the supplied LEA course context as the source of truth. Never invent course requirements, grades, policies, deadlines, or learner records.",
    "Teach instead of doing assessed work for the learner: explain concepts, show small illustrative examples, offer debugging questions, and provide step-by-step hints. Do not submit assignments, fabricate citations, reveal hidden answers, or claim to be an instructor.",
    "If the question is outside the supplied course context, say that clearly and offer a safe general explanation or suggest asking an instructor.",
    "Use short headings and readable Markdown. Keep the response under 350 words. End with one practical next step or one reflective question.",
    context ? `LEA course context:\n${context}` : "No course context is currently available. Ask the learner to open a course or lesson for a grounded answer.",
  ].join("\n\n");

  try {
    const response = await fetch(chatEndpoint(baseUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LEA_AI_MODEL ?? "gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message },
        ],
        max_completion_tokens: 900,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      console.error("LEA AI Coach upstream error", response.status, await response.text());
      return jsonError("The AI Coach is temporarily unavailable. Please try again in a moment.", 502);
    }

    const payload = (await response.json()) as { choices?: { message?: { content?: unknown } }[] };
    const answer = assistantText(payload.choices?.[0]?.message?.content);
    if (!answer) return jsonError("The AI Coach returned an empty answer. Please try asking in a different way.", 502);

    return jsonOk({ data: { answer, source: "ai-coach", configured: true } });
  } catch (error) {
    console.error("LEA AI Coach request failed", error);
    return jsonError("The AI Coach could not respond right now. Please try again.", 502);
  }
}
