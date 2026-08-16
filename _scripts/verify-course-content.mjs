// Read-back check: confirms the seeded lesson content is actually in Firestore.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

const ids = ["crs-web", "crs-scratch", "crs-app", "crs-computer"];
let ok = true;

for (const id of ids) {
  const snap = await db.collection("courses").doc(id).get();
  if (!snap.exists) { console.log(`${id}: MISSING`); ok = false; continue; }
  const lessons = snap.data()?.lessons ?? [];
  let bad = 0;
  for (const l of lessons) {
    const notesLen = String(l.notes ?? "").length;
    const assignLen = String(l.assignment ?? "").length;
    const url = String(l.video_url ?? "");
    const yt = /youtube\.com\/watch\?v=|youtu\.be\//.test(url);
    if (notesLen < 500 || !yt || Number(l.order) < 1 || assignLen < 100) bad += 1;
    console.log(`  ${id}/${l.id} order=${l.order} notes=${notesLen}ch assign=${assignLen}ch video=${url ? (yt ? "OK" : "NOT-YT") : "MISSING"}`);
  }
  console.log(`${id}: ${lessons.length} lessons, ${bad} problems`);
  if (lessons.length !== 6 || bad > 0) ok = false;
}

console.log(ok ? "READBACK_PASS" : "READBACK_FAIL");
await app.delete();
