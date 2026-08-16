// Seeds rich lesson content (in-depth notes + YouTube videos) into the 4 LEA Labs
// courses. Reads content packs from ./course-content/*.js (ES modules) and
// updates each course's `lessons` array in Firestore, preserving all other
// course fields. Existing enrolment/progress data is untouched.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

const packs = [
  await import("./course-content/crs-web.js"),
  await import("./course-content/crs-scratch.js"),
  await import("./course-content/crs-app.js"),
  await import("./course-content/crs-computer.js"),
];
const assignments = (await import("./course-content/assignments.js")).default;

let updated = 0;
let skipped = 0;
const problems = [];

for (const pack of packs) {
  const course = pack.default;
  const docRef = db.collection("courses").doc(course.id);
  const snap = await docRef.get();

  if (!snap.exists) {
    skipped += 1;
    problems.push(`${course.id}: course document not found in Firestore`);
    continue;
  }

  const lessons = course.lessons.map((l) => ({
    id: String(l.id),
    title: String(l.title),
    duration_minutes: Number(l.duration_minutes),
    video_url: String(l.video_url ?? ""),
    description: String(l.description ?? ""),
    notes: String(l.notes ?? ""),
    assignment: String(assignments[l.id] ?? ""),
    order: Number(l.order),
  }));

  // Sanity checks before writing.
  for (const l of lessons) {
    if (!l.notes || l.notes.length < 500) {
      problems.push(`${course.id}/${l.id}: notes too short (${l.notes?.length ?? 0} chars)`);
    }
    if (!l.video_url || !/^https?:\/\//.test(l.video_url)) {
      problems.push(`${course.id}/${l.id}: missing video_url`);
    }
    if (!l.assignment || l.assignment.length < 100) {
      problems.push(`${course.id}/${l.id}: missing assignment`);
    }
  }

  await docRef.update({ lessons, updated_at: new Date().toISOString() });
  updated += 1;
  const words = lessons.reduce((sum, l) => sum + l.notes.split(/\s+/).length, 0);
  console.log(`Updated ${course.id}: ${lessons.length} lessons, ~${words} words of notes`);
}

console.log(`\nDone: ${updated} courses updated, ${skipped} skipped.`);
if (problems.length) {
  console.log("Problems:");
  for (const p of problems) console.log(` - ${p}`);
} else {
  console.log("No problems found.");
}
await app.delete();
