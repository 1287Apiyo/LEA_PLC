import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_KEY_PATH = path.join(process.cwd(), "..", "backend", "storage", "firebase", "service-account.json");

export function getFirebaseApp(): App {
  if (getApps().length === 0) {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? DEFAULT_KEY_PATH, "utf8");
    const serviceAccount = JSON.parse(json) as { project_id?: string };
    initializeApp({
      credential: cert(serviceAccount as Parameters<typeof cert>[0]),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || (serviceAccount.project_id ? `${serviceAccount.project_id}.firebasestorage.app` : undefined),
    });
  }
  return getApp();
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getBucket() {
  const configuredBucket = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  return getStorage(getFirebaseApp()).bucket(configuredBucket || undefined);
}
