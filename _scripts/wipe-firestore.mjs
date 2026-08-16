// Wipes every document from the app collections — leaves the database empty
// so that only real data entered through the app lives in Firestore.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const KEY_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? join(process.cwd(), "..", "backend", "storage", "firebase", "service-account.json");
const app = initializeApp({ credential: cert(JSON.parse(readFileSync(KEY_PATH, "utf8"))) });
const db = getFirestore(app);

const COLLECTIONS = [
  "users", "sessions", "programmes", "courses", "classes", "enrolments",
  "assignments", "submissions", "certificates", "achievements", "payments",
  "attendance", "announcements", "notifications",
];

let total = 0;
for (const name of COLLECTIONS) {
  const snap = await db.collection(name).get();
  let count = 0;
  for (const doc of snap.docs) {
    await doc.ref.delete();
    count++;
  }
  total += count;
  console.log(`${name}: removed ${count}`);
}
console.log(`Total removed: ${total}`);
await app.delete();
