const path = require('path');
const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const credentialPath = path.resolve(process.cwd(), '../backend/storage/firebase/service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  const [programmesSnap, coursesSnap] = await Promise.all([
    db.collection('programmes').orderBy('order').get(),
    db.collection('courses').orderBy('sequence').get(),
  ]);
  const programmes = programmesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const courses = coursesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const programmeMap = new Map(programmes.map((p) => [p.id, p]));
  const summary = programmes.map((programme) => {
    const linked = courses.filter((course) => course.programme === programme.id);
    return {
      id: programme.id,
      title: programme.title,
      courseCount: linked.length,
      lessonCount: linked.reduce((sum, course) => sum + (Array.isArray(course.lessons) ? course.lessons.length : 0), 0),
      courses: linked.map((course) => ({
        id: course.id,
        title: course.title,
        sequence: course.sequence,
        lessons: Array.isArray(course.lessons) ? course.lessons.length : 0,
        project: course.project,
        trendTags: course.trend_tags,
      })),
    };
  });
  console.log(JSON.stringify({
    projectId: serviceAccount.project_id,
    programmeCount: programmes.length,
    courseCount: courses.length,
    orphanCourseCount: courses.filter((course) => !programmeMap.has(course.programme)).length,
    programmes: summary,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
