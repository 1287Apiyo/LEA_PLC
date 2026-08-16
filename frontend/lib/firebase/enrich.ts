import { getDb } from "@/lib/firebase/admin";

/**
 * Ecosystem enrichment helpers.
 *
 * Many documents store references as raw Firestore ids (e.g. a class row has
 * `course: "crs-web"`, an attendance row has `learner: "usr-…"`). These helpers
 * resolve those ids into human-readable labels (course titles, learner names,
 * programme titles, assignment titles) so every admin/instructor table shows
 * real names instead of opaque ids, and attach live enrolment counts to
 * courses.
 */

type Row = Record<string, unknown>;

const COURSE_KEYS = ["course", "courseId"];
const LEARNER_KEYS = ["learner", "learnerId"];
const PERSON_KEYS = ["trainer", "instructor", "instructorId", "posted_by", "owner"];
const PROGRAMME_KEYS = ["programme"];
const ASSIGNMENT_KEYS = ["assignment", "assignmentId"];

export interface RefMaps {
  courses: Map<string, string>;
  programmes: Map<string, string>;
  users: Map<string, string>;
  assignments: Map<string, string>;
}

/** Load id → display-label maps for courses, programmes, users and assignments. */
export async function loadRefMaps(): Promise<RefMaps> {
  const db = getDb();
  const [courseSnap, prgSnap, userSnap, assignSnap] = await Promise.all([
    db.collection("courses").limit(200).get(),
    db.collection("programmes").limit(100).get(),
    db.collection("users").limit(500).get(),
    db.collection("assignments").limit(200).get(),
  ]);
  return {
    courses: new Map(courseSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)])),
    programmes: new Map(prgSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)])),
    users: new Map(
      userSnap.docs.map((d) => [
        d.id,
        String(d.data().name ?? d.data().email ?? d.id),
      ])
    ),
    assignments: new Map(assignSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)])),
  };
}

/**
 * Replace raw reference ids with human-readable labels, in place.
 * A value is only replaced when it matches a known id, so already-readable
 * values (e.g. a stored title) are left untouched.
 */
export function resolveReferences(rows: Row[], maps: RefMaps): Row[] {
  const apply = (row: Row, keys: string[], map: Map<string, string>) => {
    for (const key of keys) {
      const raw = row[key];
      if (typeof raw === "string" && map.has(raw)) row[key] = map.get(raw)!;
    }
  };
  for (const row of rows) {
    apply(row, COURSE_KEYS, maps.courses);
    apply(row, LEARNER_KEYS, maps.users);
    apply(row, PERSON_KEYS, maps.users);
    apply(row, PROGRAMME_KEYS, maps.programmes);
    apply(row, ASSIGNMENT_KEYS, maps.assignments);
    // Support both key conventions: a row storing courseId but read via the
    // "course" column (and learnerId read via "learner") still shows the label.
    if (row.course === undefined && typeof row.courseId === "string") row.course = row.courseId;
    if (row.learner === undefined && typeof row.learnerId === "string") row.learner = row.learnerId;
    if (row.assignment === undefined && typeof row.assignmentId === "string") row.assignment = row.assignmentId;
  }
  return rows;
}

/** Count enrolments per course id (live numbers for the courses table). */
export async function enrolmentCountsByCourse(): Promise<Map<string, number>> {
  const db = getDb();
  const enrSnap = await db.collection("enrolments").limit(2000).get();
  const counts = new Map<string, number>();
  for (const doc of enrSnap.docs) {
    const courseId = String(doc.data().courseId ?? "");
    if (!courseId) continue;
    counts.set(courseId, (counts.get(courseId) ?? 0) + 1);
  }
  return counts;
}

/** Resolve learner ids → { name, email } for enrolment displays. */
export async function learnerNames(
  learnerIds: string[]
): Promise<Map<string, { name: string; email: string }>> {
  const db = getDb();
  const out = new Map<string, { name: string; email: string }>();
  for (const id of [...new Set(learnerIds.filter(Boolean))]) {
    const snap = await db.collection("users").doc(id).get();
    if (!snap.exists) continue;
    const data = snap.data()!;
    out.set(id, {
      name: String(data.name ?? data.email ?? id),
      email: String(data.email ?? ""),
    });
  }
  return out;
}
