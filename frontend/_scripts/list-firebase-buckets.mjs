import { Storage } from "@google-cloud/storage";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(root, "..", "backend", "storage", "firebase", "service-account.json");
const account = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) : JSON.parse(await readFile(keyPath, "utf8"));
const storage = new Storage({ credentials: account, projectId: account.project_id });
const [buckets] = await storage.getBuckets({ project: account.project_id });
for (const bucket of buckets) console.log(bucket.name);
