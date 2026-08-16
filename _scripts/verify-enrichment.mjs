// Simulates the API enrichment (enrolment counts + reference resolution)
// directly against Firestore to confirm what the admin UI will now display.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

// 1) Courses list payload (dedicated /courses route)
const courseSnap = await db.collection("courses").limit(200).get();
const prgSnap = await db.collection("programmes").get();
const prgTitles = new Map(prgSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)]));
const enrSnap = await db.collection("enrolments").limit(2000).get();
const counts = new Map();
for (const d of enrSnap.docs) {
  const cid = String(d.data().courseId ?? "");
  if (cid) counts.set(cid, (counts.get(cid) ?? 0) + 1);
}
const userSnap = await db.collection("users").limit(500).get();
const userNames = new Map(userSnap.docs.map((d) => [d.id, String(d.data().name ?? d.data().email ?? d.id)]));

console.log("== COURSES LIST (admin table rows) ==");
for (const c of courseSnap.docs) {
  const d = c.data();
  const lessons = d.lessons ?? [];
  console.log(`  ${c.id} | title=${d.title} | programme=${prgTitles.get(String(d.programme)) ?? ""} | lessons=${lessons.length} | learners=${counts.get(c.id) ?? 0} | trainer=${d.trainer ? userNames.get(String(d.trainer)) ?? d.trainer : "—"}`);
}

// 2) Course detail enrolments (dedicated /courses/[id] route, admin view)
console.log("\n== COURSE DETAIL ENROLMENTS (admin view) ==");
const courseIds = courseSnap.docs.map((d) => d.id);
for (const cid of courseIds) {
  const enr = await db.collection("enrolments").where("courseId", "==", cid).get();
  if (enr.empty) { console.log(`  ${cid}: no enrolments`); continue; }
  for (const e of enr.docs) {
    const ed = e.data();
    const uid = String(ed.learnerId ?? "");
    console.log(`  ${cid} -> learner=${userNames.get(uid) ?? uid} | progress=${ed.progress ?? 0} | done=${(ed.completed_lessons ?? []).length} | enrolled_at=${ed.enrolled_at ?? ""}`);
  }
}

// 3) Learner detail enrolments (generic /learners/[id] route)
console.log("\n== LEARNER DETAIL ENROLMENTS (admin view) ==");
const courseTitles = new Map(courseSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)]));
const learners = userSnap.docs.filter((d) => d.data().role === "learner");
for (const l of learners) {
  const enr = await db.collection("enrolments").where("learnerId", "==", l.id).get();
  console.log(`  ${l.id} (${l.data().name ?? "?"}): ${enr.empty ? "not enrolled" : enr.docs.map((e) => `${courseTitles.get(String(e.data().courseId)) ?? e.data().courseId} ${e.data().progress ?? 0}%`).join(", ")}`);
}
await app.delete();
console.log("\nENRICHMENT_SIM_OK");
