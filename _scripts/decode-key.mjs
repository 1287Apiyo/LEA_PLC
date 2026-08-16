// Decodes the IAM createKey wrapper into the standard service-account JSON.
import { readFileSync, writeFileSync } from "node:fs";

const wrapperPath = "C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json";
const wrapper = JSON.parse(readFileSync(wrapperPath, "utf8"));

if (wrapper.privateKeyData) {
  const decoded = Buffer.from(wrapper.privateKeyData, "base64").toString("utf8");
  const key = JSON.parse(decoded);
  writeFileSync(wrapperPath, JSON.stringify(key, null, 2), "utf8");
  console.log("Decoded service account key. project_id:", key.project_id, "| client_email:", key.client_email);
} else {
  console.log("No privateKeyData found — file may already be a decoded key. project_id:", wrapper.project_id);
}
