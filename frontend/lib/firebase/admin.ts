import { applicationDefault, cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_KEY_PATH = path.join(process.cwd(), "..", "backend", "storage", "firebase", "service-account.json");

type ServiceAccount = { project_id?: string; [key: string]: unknown };

function firebaseConfig(): { projectId?: string; storageBucket?: string } {
  const value = process.env.FIREBASE_CONFIG?.trim();
  if (!value) return {};
  try {
    return JSON.parse(value) as { projectId?: string; storageBucket?: string };
  } catch {
    return {};
  }
}

export function getFirebaseApp(): App {
  if (getApps().length === 0) {
    const config = firebaseConfig();
    const explicitJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
    const localKeyPath = explicitPath || DEFAULT_KEY_PATH;
    const hasServiceAccount = Boolean(explicitJson) || Boolean(explicitPath) || existsSync(localKeyPath);
    const serviceAccount = explicitJson
      ? (JSON.parse(explicitJson) as ServiceAccount)
      : explicitPath || existsSync(localKeyPath)
        ? (JSON.parse(readFileSync(localKeyPath, "utf8")) as ServiceAccount)
        : undefined;

    initializeApp({
      credential: serviceAccount ? cert(serviceAccount as Parameters<typeof cert>[0]) : applicationDefault(),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
        config.storageBucket ||
        (serviceAccount?.project_id ? `${serviceAccount.project_id}.firebasestorage.app` : undefined),
      projectId: config.projectId || serviceAccount?.project_id,
    });

    void hasServiceAccount;
  }
  return getApp();
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getBucket() {
  const configuredBucket = process.env.FIREBASE_STORAGE_BUCKET?.trim() || firebaseConfig().storageBucket;
  return getStorage(getFirebaseApp()).bucket(configuredBucket || undefined);
}
