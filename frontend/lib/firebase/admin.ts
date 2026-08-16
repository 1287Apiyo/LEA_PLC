import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Firebase Admin bootstrap — single shared instance per process.
 *
 * Credentials resolution order:
 *  1. FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON)
 *  2. FIREBASE_SERVICE_ACCOUNT_PATH (absolute path to the key file)
 *  3. Default: backend/storage/firebase/service-account.json
 *     (generated for project lea-labs-f9e16 — gitignored)
 */
const DEFAULT_KEY_PATH = path.join(
  process.cwd(),
  "..",
  "backend",
  "storage",
  "firebase",
  "service-account.json"
);

export function getFirebaseApp() {
  if (getApps().length === 0) {
    const json =
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON ??
      readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? DEFAULT_KEY_PATH, "utf8");
    initializeApp({ credential: cert(JSON.parse(json)) });
  }
  return getApp();
}

export function getDb(): Firestore {
  getFirebaseApp();
  return getFirestore();
}
