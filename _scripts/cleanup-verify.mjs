// Removes verification artifacts (@verify.test users + orphaned sessions).
// NEVER touches real accounts (e.g. anneapiyo0@gmail.com).
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

// 1. Delete verify.test users
const users = await db.collection("users").get();
const verifyIds = [];
for (const d of users.docs) {
  const email = String(d.data().email ?? "");
  if (email.endsWith("@verify.test")) {
    await d.ref.delete();
    verifyIds.push(email);
    console.log("removed user:", email);
  }
}

// 2. Delete orphaned sessions (userId no longer present)
const userIds = new Set(users.docs.map((d) => d.id));
const sessions = await db.collection("sessions").get();
let removedSessions = 0;
for (const s of sessions.docs) {
  if (!userIds.has(String(s.data().userId))) {
    await s.ref.delete();
    removedSessions++;
  }
}
console.log(`removed ${verifyIds.length} verify users, ${removedSessions} orphaned sessions.`);
await app.delete();
