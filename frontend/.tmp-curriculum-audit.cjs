const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const keyPath = path.resolve(process.cwd(), '../backend/storage/firebase/service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

function safe(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
}

async function main() {
  const [programmes, courses] = await Promise.all([
    db.collection('programmes').get(),
    db.collection('courses').get(),
  ]);
  const programmeRows = programmes.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: safe(data.title),
      status: safe(data.status),
      slug: safe(data.slug),
      description: safe(data.description),
      keys: Object.keys(data).sort(),
    };
  });
  const courseRows = courses.docs.map((doc) => {
    const data = doc.data();
    const lessons = Array.isArray(data.lessons) ? data.lessons : [];
    return {
      id: doc.id,
      title: safe(data.title),
      programme: safe(data.programme ?? data.programmeId),
      status: safe(data.status),
      description: safe(data.description),
      lessonCount: lessons.length,
      lessonTitles: lessons.map((lesson) => safe(lesson && typeof lesson === 'object' ? lesson.title : lesson)).filter(Boolean),
      keys: Object.keys(data).sort(),
    };
  });
  console.log(JSON.stringify({ projectId: serviceAccount.project_id, programmes: programmeRows, courses: courseRows }, null, 2));
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
