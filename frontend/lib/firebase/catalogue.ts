import { getDb } from "@/lib/firebase/admin";

export type LiveCatalogueCourse = {
  id: string;
  title: string;
  programme: string;
  summary: string;
  topics: string[];
  deliverable: string;
  price: string;
  lessonCount: number;
  lessonTitles: string[];
  durationMinutes: number;
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function list(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lessonItems(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (!item || typeof item !== "object") return "";
      const lesson = item as Record<string, unknown>;
      return text(lesson.title ?? lesson.name ?? lesson.label);
    })
    .filter(Boolean);
}

/**
 * Read the live dashboard catalogue using the same Firestore collections as
 * the authenticated dashboards. The caller can fall back to the public
 * marketing catalogue when this returns an empty list.
 */
export async function loadLiveCatalogue(): Promise<LiveCatalogueCourse[]> {
  const db = getDb();
  const [courseSnap, programmeSnap] = await Promise.all([
    db.collection("courses").limit(200).get(),
    db.collection("programmes").limit(100).get(),
  ]);

  const programmeTitles = new Map(
    programmeSnap.docs.map((doc) => [
      doc.id,
      text(doc.data().title, doc.id),
    ])
  );

  return courseSnap.docs
    .filter((doc) => text(doc.data().status, "active") !== "archived")
    .map((doc) => {
    const data = doc.data();
    const rawProgramme = text(data.programme ?? data.programmeId);
    const programme = programmeTitles.get(rawProgramme) ?? rawProgramme;
    const lessonTitles = lessonItems(data.lessons);
    const durationMinutes = Array.isArray(data.lessons)
      ? data.lessons.reduce((total, item) => {
          if (!item || typeof item !== "object") return total;
          const lesson = item as Record<string, unknown>;
          return total + Number(lesson.duration_minutes ?? lesson.duration ?? 0);
        }, 0)
      : 0;
    return {
      id: doc.id,
      title: text(data.title, doc.id),
      programme,
      summary: text(data.summary ?? data.description, "Practical, guided course work with a clear outcome."),
      topics: list(data.topics ?? data.modules ?? data.outcomes),
      deliverable: text(data.deliverable ?? data.project ?? data.outcome, "A completed project or practical learning outcome."),
      price: text(data.price ?? data.tuition, "Ask admissions"),
      lessonCount: lessonTitles.length,
      lessonTitles,
      durationMinutes,
    };
    });
}

export async function loadLiveCatalogueSafely() {
  try {
    const courses = await loadLiveCatalogue();
    return { connected: true, courses, error: null as string | null };
  } catch (error) {
    return {
      connected: false,
      courses: [] as LiveCatalogueCourse[],
      error: error instanceof Error ? error.message : "Firestore catalogue unavailable.",
    };
  }
}

/** Match a live course to a marketing programme using id, slug, or title. */
export function courseBelongsToProgramme(course: LiveCatalogueCourse, programme: { slug: string; title: string; catalogueKeys?: string[] }) {
  const key = normalise(course.programme);
  const aliases = [programme.slug, programme.title, ...(programme.catalogueKeys ?? [])].map(normalise);
  return aliases.some((alias) => key === alias || key.includes(alias) || alias.includes(key));
}
