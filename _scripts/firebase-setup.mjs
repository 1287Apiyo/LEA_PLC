// Firebase project setup for LEA Labs (lea-labs-f9e16)
// Uses the Firebase CLI's stored refresh token to obtain an access token,
// enables + creates the Firestore database, and generates a service account key.
// Secrets (refresh token, access token, key JSON) are never printed.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

const PROJECT = "lea-labs-f9e16";
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

const configstorePath = join(os.homedir(), ".config", "configstore", "firebase-tools.json");
const cfg = JSON.parse(readFileSync(configstorePath, "utf8"));
const refreshToken = cfg.tokens?.refresh_token;
if (!refreshToken) throw new Error("No refresh token in configstore");

async function postForm(url, params) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  return res.json();
}

async function authed(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`${options.method || "GET"} ${url} -> ${res.status}: ${text.slice(0, 500)}`);
  return json;
}

// 1. Access token
const tok = await postForm("https://oauth2.googleapis.com/token", {
  grant_type: "refresh_token",
  refresh_token: refreshToken,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
});
if (!tok.access_token) throw new Error("Token exchange failed: " + JSON.stringify(tok).slice(0, 300));
const accessToken = tok.access_token;
console.log("[1/4] Access token obtained.");

// 2. Create Firestore database (native mode)
let db = null;
try {
  db = await authed(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases?databaseId=%28default%29`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "FIRESTORE_NATIVE", location_id: "europe-west1" }) }
  );
} catch (err) {
  if (!String(err.message).includes("already exists")) throw err;
  console.log("[2/4] Firestore database already exists.");
}
if (db) console.log("[2/4] Firestore database creation accepted:", db.name || JSON.stringify(db).slice(0, 120));

// 3. Find the Firebase Admin service account and create a key
const sas = await authed(`https://iam.googleapis.com/v1/projects/${PROJECT}/serviceAccounts?pageSize=200`);
const adminSa = (sas.accounts || []).find((sa) => sa.email.startsWith("firebase-adminsdk-"));
if (!adminSa) throw new Error("firebase-adminsdk service account not found: " + JSON.stringify(sas).slice(0, 300));
console.log("[3/4] Admin service account:", adminSa.email);

const keyResp = await authed(
  `https://iam.googleapis.com/v1/projects/${PROJECT}/serviceAccounts/${encodeURIComponent(adminSa.email)}/keys:create`,
  { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }
);

const keyDir = "C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase";
mkdirSync(keyDir, { recursive: true });
const keyPath = join(keyDir, "service-account.json");
writeFileSync(keyPath, JSON.stringify(keyResp, null, 2), "utf8");
console.log("[4/4] Service account key saved to:", keyPath);
