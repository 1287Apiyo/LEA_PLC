// Creates the REAL LEA Labs course catalog in Firestore:
// programmes + 4 courses (Web Dev, Scratch, App Dev, Basic Computer Skills),
// each with a 6-lesson structure. video_url is left empty until real videos exist.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\frontend\\");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ credential: cert(JSON.parse(readFileSync("C:\\Users\\Volo\\Desktop\\LEASYSTEM\\backend\\storage\\firebase\\service-account.json", "utf8"))) });
const db = getFirestore(app);

const NOW = new Date().toISOString();
let count = 0;
const setDoc = async (col, id, data) => { await db.collection(col).doc(id).set(data); count++; };

const programmes = [
  { id: "prg-coding", title: "Coding Programme", description: "Programming courses for young and future-ready coders." },
  { id: "prg-dl", title: "Digital Literacy", description: "Foundational computer and digital skills for everyone." },
];

const courses = [
  {
    id: "crs-web",
    title: "Web Development",
    description: "Build your own web pages with HTML and CSS — from your first heading to a published site.",
    programme: "prg-coding",
    coding: true,
    playground_language: "html",
    lessons: [
      { id: "web-1", title: "How the web works", duration_minutes: 8, description: "What happens when you type a web address — browsers, servers and URLs." },
      { id: "web-2", title: "Your first HTML page", duration_minutes: 12, description: "Structure a page with headings, paragraphs and the HTML skeleton." },
      { id: "web-3", title: "Text, links and images", duration_minutes: 14, description: "Add content to your page and link it to other pages and resources." },
      { id: "web-4", title: "Styling with CSS", duration_minutes: 16, description: "Colours, fonts and spacing — make your page look the way you want." },
      { id: "web-5", title: "Layouts with Flexbox", duration_minutes: 18, description: "Arrange elements into clean rows and columns with Flexbox." },
      { id: "web-6", title: "Publishing your site", duration_minutes: 10, description: "Put your finished site online and share the link with the world." },
    ],
  },
  {
    id: "crs-scratch",
    title: "Scratch Programming",
    description: "Learn to code by snapping blocks together — create animations, stories and games.",
    programme: "prg-coding",
    coding: true,
    playground_language: "python",
    lessons: [
      { id: "scr-1", title: "Meet Scratch — your coding playground", duration_minutes: 8, description: "Explore the stage, sprites and the block palette." },
      { id: "scr-2", title: "Sprites, costumes and backdrops", duration_minutes: 12, description: "Choose your characters and design the world they live in." },
      { id: "scr-3", title: "Motion and looks blocks", duration_minutes: 14, description: "Make sprites move, glide, talk and change appearance." },
      { id: "scr-4", title: "Events and loops", duration_minutes: 16, description: "Trigger actions with events and repeat them with loops." },
      { id: "scr-5", title: "My first animated story", duration_minutes: 20, description: "Put it all together into a short animated story." },
      { id: "scr-6", title: "Share your project", duration_minutes: 8, description: "Publish your project and get feedback from friends." },
    ],
  },
  {
    id: "crs-app",
    title: "App Development",
    description: "Design and build mobile apps — screens, buttons, data and publishing.",
    programme: "prg-coding",
    coding: true,
    playground_language: "javascript",
    lessons: [
      { id: "app-1", title: "How apps are built", duration_minutes: 10, description: "From idea to app store — the anatomy of a mobile app." },
      { id: "app-2", title: "Designing your app's screens", duration_minutes: 14, description: "Plan the screens, navigation and user experience." },
      { id: "app-3", title: "Buttons, inputs and events", duration_minutes: 16, description: "Make your app respond when users tap, type and swipe." },
      { id: "app-4", title: "Making it talk to the web", duration_minutes: 18, description: "Fetch data from an API and display it in your app." },
      { id: "app-5", title: "Testing on your device", duration_minutes: 12, description: "Run your app, find bugs and fix them like a pro." },
      { id: "app-6", title: "Publishing your app", duration_minutes: 12, description: "Package your app and prepare it for release." },
    ],
  },
  {
    id: "crs-computer",
    title: "Basic Computer Skills",
    description: "Everything a first-time computer user needs — hardware, files, email and online safety.",
    programme: "prg-dl",
    coding: false,
    playground_language: null,
    lessons: [
      { id: "bc-1", title: "Parts of a computer", duration_minutes: 8, description: "The monitor, keyboard, mouse and tower — what each part does." },
      { id: "bc-2", title: "Using the keyboard and mouse", duration_minutes: 10, description: "Typing basics, clicking, right-clicking and dragging." },
      { id: "bc-3", title: "Files, folders and storage", duration_minutes: 12, description: "Save, organise and find your files." },
      { id: "bc-4", title: "Email essentials", duration_minutes: 14, description: "Write, send, reply and keep your inbox organised." },
      { id: "bc-5", title: "Staying safe online", duration_minutes: 14, description: "Strong passwords, spotting scams and protecting your information." },
      { id: "bc-6", title: "Connecting to the internet", duration_minutes: 10, description: "Wi-Fi, networks and getting your device online." },
    ],
  },
];

for (const p of programmes) {
  await setDoc("programmes", p.id, { ...p, status: "active", created_at: NOW });
}
for (const c of courses) {
  const lessons = c.lessons.map((l, i) => ({ ...l, order: i + 1, video_url: "" }));
  const { lessons: _ignore, ...rest } = c;
  await setDoc("courses", c.id, { ...rest, lessons, status: "active", created_at: NOW });
}

console.log(`Created ${count} documents (${programmes.length} programmes, ${courses.length} courses).`);
await app.delete();
