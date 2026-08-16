// Read-only survey of the LEA Labs Firestore ecosystem: users, enrolments,
// courses, classes, assignments — to find broken/raw references.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

const users = (await db.collection("users").limit(300).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const courses = (await db.collection("courses").limit(200).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const enrolments = (await db.collection("enrolments").limit(300).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const classes = (await db.collection("classes").limit(100).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const assignments = (await db.collection("assignments").limit(100).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const programmes = (await db.collection("programmes").limit(100).get()).docs.map((d) => ({ id: d.id, ...d.data() }));

console.log(`USERS: ${users.length}`);
for (const u of users) console.log(`  ${u.id} | role=${u.role} | name=${u.name ?? "?"} | email=${u.email ?? "?"}`);
console.log(`\nPROGRAMMES: ${programmes.length}`);
for (const p of programmes) console.log(`  ${p.id} | ${p.title}`);
console.log(`\nCOURSES: ${courses.length}`);
for (const c of courses) console.log(`  ${c.id} | ${c.title} | lessons=${(c.lessons ?? []).length} | programme=${c.programme} | trainer=${c.trainer ?? "?"}`);
console.log(`\nENROLMENTS: ${enrolments.length}`);
for (const e of enrolments) console.log(`  ${e.id} | learner=${e.learnerId ?? e.learner} | course=${e.courseId ?? e.course} | progress=${e.progress ?? 0} | done=${(e.completed_lessons ?? []).length}`);
console.log(`\nCLASSES: ${classes.length}`);
for (const c of classes) console.log(`  ${c.id} | course=${c.course ?? "?"} | trainer=${c.trainer ?? "?"} | enrolled=${c.enrolled ?? "?"} | capacity=${c.capacity ?? "?"}`);
console.log(`\nASSIGNMENTS: ${assignments.length}`);
for (const a of assignments) console.log(`  ${a.id} | title=${a.title ?? "?"} | course=${a.course ?? a.courseId ?? "?"} | instructor=${a.instructorId ?? a.instructor ?? "?"} | submissions=${a.submissions ?? 0}`);
await app.delete();
