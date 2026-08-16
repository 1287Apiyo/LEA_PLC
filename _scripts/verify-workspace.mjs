const BASE = "http://localhost:3000/api/v1";
const stamp = Date.now().toString(36);
const email = `learner-${stamp}@verify.test`;

async function call(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} -> ${res.status}: ${text.slice(0, 200)}`);
  return json;
}

let learnerId;
try {
  const reg = await call("/auth/register", { method: "POST", body: JSON.stringify({ name: "Workspace Tester", email, password: "lealabs-demo", role: "learner" }) });
  learnerId = reg.user.id;
  const token = reg.token;

  const catalog = await call("/courses", { headers: { Authorization: `Bearer ${token}` } });
  const byId = Object.fromEntries(catalog.data.map((c) => [c.id, c.workspace_type]));
  console.log("catalog workspace types:", JSON.stringify(byId));
  console.log(byId["crs-scratch"] === "scratch" ? "PASS  Scratch course → scratch workspace" : "FAIL  scratch type");
  console.log(byId["crs-web"] === "code" ? "PASS  Web Dev course → code workspace" : "FAIL  web type");

  const detail = await call("/courses/crs-scratch", { headers: { Authorization: `Bearer ${token}` } });
  console.log(detail.data.workspace_type === "scratch" ? "PASS  detail returns workspace_type" : "FAIL  detail type");
} catch (err) {
  console.log("ERROR:", err.message);
} finally {
  try {
    const relogin = await call("/auth/login", { method: "POST", body: JSON.stringify({ email, password: "lealabs-demo" }) });
    if (learnerId) await call(`/learners/${learnerId}`, { method: "DELETE", headers: { Authorization: `Bearer ${relogin.token}` } }).catch(() => {});
    console.log("Cleanup done.");
  } catch { console.log("Cleanup skipped."); }
}
