// Sets workspace_type on the real courses: scratch studio for Scratch, code editor for the rest.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

const mapping = {
  "crs-web": "code",
  "crs-scratch": "scratch",
  "crs-app": "code",
  "crs-computer": null,
};

for (const [id, type] of Object.entries(mapping)) {
  const ref = db.collection("courses").doc(id);
  const snap = await ref.get();
  if (!snap.exists) { console.log(`skip ${id} (not found)`); continue; }
  await ref.update({ workspace_type: type, updated_at: new Date().toISOString() });
  console.log(`${id} -> ${type}`);
}
await app.delete();
