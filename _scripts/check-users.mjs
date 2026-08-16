import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);
const snap = await db.collection("users").get();
console.log(`users count: ${snap.size}`);
for (const d of snap.docs) {
  console.log(d.id, "|", d.data().email, "|", d.data().role, "| created:", d.data().created_at);
}
const sessions = await db.collection("sessions").get();
console.log(`sessions count: ${sessions.size}`);
await app.delete();
