'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const Module = require('node:module');
const { createRequire } = Module;

const root = path.resolve(__dirname, '..', '..');
const frontend = path.join(root, 'frontend');
const publicDir = path.join(frontend, 'public');
const workDir = __dirname;
const frontendRequire = createRequire(path.join(frontend, 'package.json'));
const React = frontendRequire('react');
const renderToStaticMarkup = frontendRequire('react-dom/server').renderToStaticMarkup;
const ts = frontendRequire('typescript');

function fileUri(file) {
  return pathToFileURL(path.resolve(file)).href;
}

function resolvePublicAsset(src) {
  if (typeof src !== 'string' || !src.startsWith('/')) return src;
  const file = path.join(publicDir, decodeURIComponent(src.slice(1).split('?')[0]));
  return fs.existsSync(file) ? fileUri(file) : src;
}

function NextImage({ src, alt = '', fill, priority, quality, unoptimized, loader, sizes, style, ...props }) {
  const imageStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style;
  return React.createElement('img', {
    ...props,
    src: resolvePublicAsset(src),
    alt,
    style: imageStyle,
    loading: priority ? 'eager' : (props.loading || 'lazy'),
    draggable: false,
  });
}

function NextLink({ href, prefetch, replace, scroll, shallow, passHref, legacyBehavior, ...props }) {
  const target = typeof href === 'string' ? href : (href?.pathname || '/');
  return React.createElement('a', { ...props, href: target });
}

const virtualModules = {
  image: path.join(workDir, '__next_image_stub__.cjs'),
  link: path.join(workDir, '__next_link_stub__.cjs'),
  navigation: path.join(workDir, '__next_navigation_stub__.cjs'),
  auth: path.join(workDir, '__auth_store_stub__.cjs'),
};
function cacheVirtualModule(filename, exports) {
  const mod = new Module(filename);
  mod.filename = filename;
  mod.loaded = true;
  mod.exports = exports;
  require.cache[filename] = mod;
}
let demoAuthState = {
  token: null,
  user: null,
  setAuth(token, user) { demoAuthState = { ...demoAuthState, token, user }; },
  setUser(user) { demoAuthState = { ...demoAuthState, user }; },
  clearAuth() { demoAuthState = { ...demoAuthState, token: null, user: null }; },
};
function useDemoAuthStore(selector) {
  return typeof selector === 'function' ? selector(demoAuthState) : demoAuthState;
}
useDemoAuthStore.getState = () => demoAuthState;
useDemoAuthStore.getInitialState = () => demoAuthState;
useDemoAuthStore.setState = (partial) => {
  const update = typeof partial === 'function' ? partial(demoAuthState) : partial;
  demoAuthState = { ...demoAuthState, ...update };
};
useDemoAuthStore.subscribe = () => () => {};
cacheVirtualModule(virtualModules.image, { __esModule: true, default: NextImage });
cacheVirtualModule(virtualModules.link, { __esModule: true, default: NextLink });
cacheVirtualModule(virtualModules.navigation, {
  __esModule: true,
  usePathname: () => process.env.LEA_TOUR_PATH || '/learner',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push() {}, replace() {}, refresh() {}, prefetch() {}, back() {}, forward() {} }),
  redirect: () => {},
});
cacheVirtualModule(virtualModules.auth, { __esModule: true, useAuthStore: useDemoAuthStore, useIsAuthenticated: () => Boolean(demoAuthState.token) });

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveProjectImports(request, parent, isMain, options) {
  if (request === 'next/image') return virtualModules.image;
  if (request === 'next/link') return virtualModules.link;
  if (request === 'next/navigation') return virtualModules.navigation;
  if (request === '@/lib/auth-store') return virtualModules.auth;
  if (request.startsWith('@/')) request = path.join(frontend, request.slice(2));
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

function registerTypeScriptExtension(extension) {
  Module._extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    const transpiled = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }).outputText;
    module._compile(transpiled, filename);
  };
}
registerTypeScriptExtension('.ts');
registerTypeScriptExtension('.tsx');

function localizeRootAssets(markup) {
  return markup.replace(/(src|poster)="\/([^"?#]+)([?#][^"]*)?"/g, (match, attribute, asset, suffix = '') => {
    const file = path.join(publicDir, decodeURIComponent(asset));
    return fs.existsSync(file) ? `${attribute}="${fileUri(file)}${suffix}"` : match;
  });
}

function htmlDocument(title, markup, css) {
  const safeCss = css.replace(/<\/style/gi, '<\\/style');
  const body = localizeRootAssets(markup);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${safeCss} html{scroll-behavior:auto!important}</style></head><body><div class="min-h-screen bg-background font-sans text-foreground antialiased">${body}</div><script>
const positionCaptureTarget=()=>setTimeout(()=>{const p=new URLSearchParams(location.search);const id=p.get('scroll');const text=p.get('scrollText');requestAnimationFrame(()=>{let e=id?document.getElementById(id):null;if(!e&&text){e=[...document.querySelectorAll('h1,h2,h3,p,span')].find(n=>n.textContent.trim()===text)}if(e){const y=Math.max(0,window.scrollY+e.getBoundingClientRect().top-72);document.documentElement.scrollTop=y;document.body.scrollTop=y}})},800);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',positionCaptureTarget,{once:true});else positionCaptureTarget();
</script></body></html>`;
}

async function compileStyles() {
  const cssPath = path.join(frontend, 'app', 'globals.css');
  const cssOut = path.join(workDir, 'lea-global-styles.css');
  const postcss = frontendRequire('postcss');
  const tailwindModule = frontendRequire('@tailwindcss/postcss');
  const tailwind = tailwindModule.default || tailwindModule;
  const source = fs.readFileSync(cssPath, 'utf8');
  const result = await postcss([tailwind()]).process(source, { from: cssPath, to: cssOut, map: false });
  fs.writeFileSync(cssOut, result.css, 'utf8');
  return result.css;
}

function renderHome() {
  const LandingPage = frontendRequire('@/components/landing/landing-page').default;
  return renderToStaticMarkup(React.createElement(LandingPage));
}

function renderDashboard() {
  const { QueryClient, QueryClientProvider } = frontendRequire('@tanstack/react-query');
  const { DASHBOARD_KEYS } = frontendRequire('@/hooks/use-dashboard');
  const { useAuthStore } = frontendRequire('@/lib/auth-store');
  const { PROGRAMMES } = frontendRequire('@/lib/programmes');
  const { AppShell } = frontendRequire('@/components/shared/app-shell');
  const { LearnerDashboard } = frontendRequire('@/components/dashboard/learner-dashboard');
  const software = PROGRAMMES.find((programme) => programme.slug === 'software-engineering');
  const ai = PROGRAMMES.find((programme) => programme.slug === 'applied-ai');
  const user = {
    id: 'local-demo-learner',
    name: 'Demo Learner',
    email: 'demo.learner@example.test',
    role: 'learner',
    avatar_url: null,
    email_verified_at: null,
    created_at: '2026-10-09T00:00:00.000Z',
  };
  useAuthStore.setState({ user, token: 'local-only-demo-token' });
  const initialAuthState = useAuthStore.getInitialState();
  useAuthStore.getInitialState = () => ({ ...initialAuthState, user, token: 'local-only-demo-token' });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false, refetchOnMount: false, refetchOnWindowFocus: false } },
  });
  queryClient.setQueryData(DASHBOARD_KEYS.learner, {
    stats: {
      coursesInProgress: { label: 'Courses in progress', value: 2, hint: 'Active learning paths' },
      assignmentsDue: { label: 'Assignments due', value: 1, hint: 'One next step ready' },
      attendanceRate: { label: 'Attendance rate', value: '92%', hint: 'Recent sessions' },
      certificates: { label: 'Certificates earned', value: 0 },
      lessonsCompleted: { label: 'Lessons completed', value: 8 },
      assignmentsSubmitted: { label: 'Assignments submitted', value: 3 },
    },
    myCourses: [
      { id: 'demo-software-course', title: software.title, programme: software.title, progress: 68, next_lesson: software.modules[1].title, deadline: null },
      { id: 'demo-ai-course', title: ai.title, programme: ai.title, progress: 42, next_lesson: ai.modules[1].title, deadline: null },
    ],
    nextClass: null,
    assignments: [
      { id: 'demo-assignment-01', title: software.modules[1].title, course: software.title, due_at: '2026-10-16T15:00:00.000Z', status: 'open', grade: null },
    ],
    certificates: [],
    achievements: [],
    badges: [],
    currentStreak: 3,
    progressByWeek: [
      { label: 'W1', value: 12 }, { label: 'W2', value: 19 }, { label: 'W3', value: 27 },
      { label: 'W4', value: 35 }, { label: 'W5', value: 44 }, { label: 'W6', value: 51 },
    ],
  });
  queryClient.setQueryData(['notifications'], { data: [], unread_count: 0 });
  queryClient.setQueryData(['auth', 'me'], user);
  const tree = React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(AppShell, { role: 'learner' }, React.createElement(LearnerDashboard)),
  );
  const markup = renderToStaticMarkup(tree);
  return markup.replace(/(<(?:h[1-6]|p|span)\b[^>]*)(>Current courses<\/(?:h[1-6]|p|span)>)/, '$1 id="tour-current-courses"$2');
}

function renderCourseCatalog() {
  const { QueryClient, QueryClientProvider } = frontendRequire('@tanstack/react-query');
  const { useAuthStore } = frontendRequire('@/lib/auth-store');
  const { PROGRAMMES } = frontendRequire('@/lib/programmes');
  const { AppShell } = frontendRequire('@/components/shared/app-shell');
  const { CourseCatalog } = frontendRequire('@/components/learner/course-catalog');
  const priorPath = process.env.LEA_TOUR_PATH;
  const user = {
    id: 'local-demo-learner', name: 'Demo Learner', email: 'demo.learner@example.test', role: 'learner',
    avatar_url: null, email_verified_at: null, created_at: '2026-10-09T00:00:00.000Z',
  };
  try {
    process.env.LEA_TOUR_PATH = '/learner/courses';
    useAuthStore.setState({ user, token: 'local-only-demo-token' });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity, retry: false, refetchOnMount: false, refetchOnWindowFocus: false } },
    });
    const programmeRows = PROGRAMMES.map((programme, index) => ({
      id: programme.catalogueKeys?.[0] ?? `demo-${programme.slug}`,
      title: programme.title,
      description: programme.short,
      order: index,
      duration: programme.duration,
      level: index === 2 ? 'Beginner' : 'Applied',
      price: programme.price,
      outcomes: [programme.outcome],
      skills: programme.bullets,
      short: programme.short,
      audience: programme.audience,
      bullets: programme.bullets,
      icon: programme.icon,
      image: programme.image,
    }));
    const courseRows = PROGRAMMES.map((programme, index) => ({
      id: `demo-course-${programme.slug}`,
      title: programme.modules[0].title,
      description: programme.modules[0].summary,
      summary: programme.modules[0].summary,
      programme_id: programmeRows[index].id,
      programme: programme.title,
      programme_order: index,
      sequence: 1,
      level: index === 2 ? 'Beginner' : 'Foundation',
      track: programme.title,
      outcomes: [programme.outcome],
      skills: programme.bullets,
      deliverable: programme.modules[0].title,
      project: programme.modules[0].summary,
      trend_tags: [],
      lessons_count: 6,
      total_minutes: 360,
      duration_weeks: 4,
      resource_count: 2,
      video_count: 1,
      coding: index < 2,
      playground_language: null,
      workspace_type: null,
      status: 'published',
      enrolled: index < 2,
      progress: index === 0 ? 68 : index === 1 ? 42 : null,
      enrolment_id: index < 2 ? `demo-enrolment-${index + 1}` : null,
    }));
    queryClient.setQueryData(['course-catalog'], { data: courseRows, meta: { total: courseRows.length } });
    queryClient.setQueryData(['programme-catalog'], { data: programmeRows, meta: { total: programmeRows.length } });
    queryClient.setQueryData(['notifications'], { data: [], unread_count: 0 });
    queryClient.setQueryData(['auth', 'me'], user);
    const tree = React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(AppShell, { role: 'learner' }, React.createElement(CourseCatalog)),
    );
    return renderToStaticMarkup(tree);
  } finally {
    if (priorPath === undefined) delete process.env.LEA_TOUR_PATH;
    else process.env.LEA_TOUR_PATH = priorPath;
  }
}

async function main() {
  fs.mkdirSync(workDir, { recursive: true });
  const css = await compileStyles();
  const homeMarkup = renderHome();
  const dashboardMarkup = renderDashboard();
  const catalogMarkup = renderCourseCatalog();
  fs.writeFileSync(path.join(workDir, 'home.html'), htmlDocument('LEA Labs — Homepage', homeMarkup, css), 'utf8');
  fs.writeFileSync(path.join(workDir, 'dashboard.html'), htmlDocument('LEA Labs — Learner Dashboard Demo', dashboardMarkup, css), 'utf8');
  fs.writeFileSync(path.join(workDir, 'dashboard-catalog.html'), htmlDocument('LEA Labs — Learner Course Catalog Demo', catalogMarkup, css), 'utf8');
  fs.writeFileSync(path.join(workDir, 'render-report.json'), JSON.stringify({
    homeHtmlBytes: Buffer.byteLength(homeMarkup),
    dashboardHtmlBytes: Buffer.byteLength(dashboardMarkup),
    cssBytes: Buffer.byteLength(css),
    homeHasProgrammeCards: homeMarkup.includes('Software Engineering') && homeMarkup.includes('Applied AI'),
    dashboardHasSampleLearner: dashboardMarkup.includes('Good morning, Demo'),
    dashboardHasBothRealProgrammes: dashboardMarkup.includes('Software Engineering') && dashboardMarkup.includes('Applied AI'),
    dashboardHasTourAnchor: dashboardMarkup.includes('id="tour-current-courses"'),
    catalogHasAllProgrammes: ['Software Engineering', 'Applied AI', 'Digital Foundations'].every((title) => catalogMarkup.includes(title)),
    catalogHasSampleLearner: catalogMarkup.includes('Demo Learner'),
    assetsAreLocalFileUris: (homeMarkup.match(/file:\/\//g) || []).length,
  }, null, 2), 'utf8');
  console.log(fs.readFileSync(path.join(workDir, 'render-report.json'), 'utf8'));
}

main().catch((error) => { console.error(error && error.stack || error); process.exitCode = 1; });
