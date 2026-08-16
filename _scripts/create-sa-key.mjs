// Creates a service account key for firebase-adminsdk on lea-labs-f9e16
// and saves it to backend/storage/firebase/service-account.json (never printed).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

const PROJECT = "lea-labs-f9e16";
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

const cfg = JSON.parse(readFileSync(join(os.homedir(), ".config", "configstore", "firebase-tools.json"), "utf8"));
const refreshToken = cfg.tokens?.refresh_token;
if (!refreshToken) throw new Error("No refresh token");

const tokRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }).toString(),
});
const tok = await tokRes.json();
if (!tok.access_token) throw new Error("Token exchange failed");
const accessToken = tok.access_token;

async function authed(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${url} -> ${res.status}: ${text.slice(0, 400)}`);
  try { return JSON.parse(text); } catch { return text; }
}

// Verify database exists (read-only check)
const db = await authed(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)`);
console.log("Firestore DB state:", db.state, "| location:", db.locationId);

// Find admin service account
const sas = await authed(`https://iam.googleapis.com/v1/projects/${PROJECT}/serviceAccounts?pageSize=100`);
const adminSa = (sas.accounts || []).find((sa) => sa.email.startsWith("firebase-adminsdk-"));
if (!adminSa) throw new Error("Admin service account not found");
console.log("Service account:", adminSa.email);

// Create key
const keyBody = JSON.stringify({ keyAlgorithm: "KEY_ALG_RSA_2048", privateKeyType: "TYPE_GOOGLE_CREDENTIALS_FILE" });
let keyResp = null;
const variants = [
  `https://iam.googleapis.com/v1/projects/${PROJECT}/serviceAccounts/${adminSa.email}/keys`,
  `https://iam.googleapis.com/v1/projects/${PROJECT}/serviceAccounts/${adminSa.email.replace("@", "%40")}/keys`,
];
for (const url of variants) {
  try {
    keyResp = await authed(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: keyBody });
    break;
  } catch (err) {
    console.log("Key attempt failed for", url, "->", String(err.message).slice(0, 120));
  }
}
if (!keyResp) throw new Error("Could not create service account key via any variant");

const keyDir = "C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase";
mkdirSync(keyDir, { recursive: true });
const keyPath = join(keyDir, "service-account.json");
writeFileSync(keyPath, JSON.stringify(keyResp, null, 2), "utf8");
console.log("Key saved to:", keyPath);
console.log("Key id:", keyResp.name?.split("/").pop());
