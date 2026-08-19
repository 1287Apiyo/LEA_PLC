const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../../backend/storage/firebase/service-account.json');
const serviceAccount = require(serviceAccountPath);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

async function seedDocuments() {
  console.log('Seeding admin documents metadata...');
  const docsRef = db.collection('documents');
  
  const doc1 = {
    title: 'Android App Development — Course Pack',
    category: 'Curriculum',
    fileSize: 150000,
    fileName: 'course-pack-android.pdf',
    originalName: 'main.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'admin',
    createdAt: new Date().toISOString()
  };
  
  const doc2 = {
    title: 'Campus Tasks Room Lab — Assignment & Rubric',
    category: 'Curriculum',
    fileSize: 85000,
    fileName: 'lab-android-room.pdf',
    originalName: 'campus-tasks-room-lab.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'admin',
    createdAt: new Date().toISOString()
  };
  
  await docsRef.add(doc1);
  await docsRef.add(doc2);
  
  console.log('Documents metadata seeded successfully.');
}

seedDocuments().catch(console.error);
