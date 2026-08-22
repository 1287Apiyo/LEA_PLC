import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFile, access, unlink } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(root, "..", "backend", "storage", "firebase", "service-account.json");
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) : JSON.parse(await readFile(keyPath, "utf8"));
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.firebasestorage.app`;
const app = initializeApp({ credential: cert(serviceAccount), storageBucket: bucketName });
const db = getFirestore(app);
const bucket = getStorage(app).bucket(bucketName);
const dryRun = process.argv.includes("--dry-run");
const removeLocal = process.argv.includes("--remove-local");
const snapshot = await db.collection("documents").get();
let migrated = 0;
let skipped = 0;
let missing = 0;

for (const doc of snapshot.docs) {
  const data = doc.data();
  const storagePath = String(data.storagePath || "");
  if (!storagePath.startsWith("admin-documents/")) {
    skipped++;
    continue;
  }
  const localPath = path.resolve(root, "var", storagePath);
  try {
    await access(localPath);
  } catch {
    missing++;
    console.log(JSON.stringify({ id: doc.id, status: "missing-local-file", storagePath, localPath }));
    continue;
  }
  const target = bucket.file(storagePath);
  const [exists] = await target.exists();
  if (exists) {
    migrated++;
    console.log(JSON.stringify({ id: doc.id, status: "already-in-storage", storagePath }));
    if (removeLocal && !dryRun) await unlink(localPath);
    continue;
  }
  const bytes = await readFile(localPath);
  const contentType = String(data.contentType || "application/octet-stream");
  if (dryRun) {
    console.log(JSON.stringify({ id: doc.id, status: "would-upload", storagePath, bytes: bytes.length }));
    continue;
  }
  await target.save(bytes, { resumable: false, metadata: { contentType } });
  const [verified] = await target.exists();
  if (!verified) throw new Error(`Upload verification failed for ${doc.id}`);
  await doc.ref.update({ storageBackend: "firebase-storage", migratedAt: new Date().toISOString(), updated_at: new Date().toISOString() });
  if (removeLocal) await unlink(localPath);
  migrated++;
  console.log(JSON.stringify({ id: doc.id, status: "migrated", storagePath, bytes: bytes.length, removedLocal: removeLocal }));
}
console.log(JSON.stringify({ summary: { totalRecords: snapshot.size, migrated, skipped, missing, dryRun, removeLocal } }));
