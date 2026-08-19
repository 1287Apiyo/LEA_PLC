const path = require('path');
const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const credentialPath = path.resolve(process.cwd(), '../backend/storage/firebase/service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  const sessions = await db.collection('sessions').get();
  let selected = null;
  for (const doc of sessions.docs) {
    const data = doc.data();
    if (!data.expiresAt || new Date(data.expiresAt).getTime() <= Date.now()) continue;
    const user = await db.collection('users').doc(String(data.userId ?? '')).get();
    if (user.exists && user.data()?.role === 'learner') {
      selected = { token: doc.id, role: user.data()?.role };
      break;
    }
  }
  if (!selected) throw new Error('No active learner session found for safe API probe.');
  const response = await fetch('http://127.0.0.1:3000/api/v1/courses', {
    headers: { Authorization: `Bearer ${selected.token}` },
  });
  const payload = await response.json();
  const data = Array.isArray(payload?.data) ? payload.data : [];
  console.log(JSON.stringify({
    status: response.status,
    role: selected.role,
    courseCount: data.length,
    programmes: [...new Set(data.map((course) => course.programme_id))],
    courses: data.map((course) => ({
      id: course.id,
      title: course.title,
      programmeId: course.programme_id,
      sequence: course.sequence,
      lessons: course.lessons_count,
      project: course.project,
      trendTags: course.trend_tags,
    })),
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
