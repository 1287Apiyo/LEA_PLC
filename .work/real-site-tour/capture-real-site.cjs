'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const workDir = __dirname;
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const width = 1600;
const height = 900;
const profileDir = path.join(workDir, `chrome-cdp-${process.pid}-${Date.now()}`);
const pages = [
  { name: 'home-hero', file: 'home.html' },
  { name: 'home-programmes', file: 'home.html', selector: '#programmes' },
  { name: 'home-bootcamp', file: 'home.html', selector: '#community' },
  { name: 'dashboard-courses', file: 'dashboard.html', text: 'Current courses' },
];

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function waitForFile(file, timeoutMs = 12000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    try {
      if (fs.existsSync(file)) {
        const contents = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
        if (contents[0] && contents[1]) return { port: Number(contents[0]), browserPath: contents[1] };
      }
    } catch {}
    await sleep(100);
  }
  throw new Error(`Chrome did not create its DevToolsActivePort file: ${file}`);
}

function connectWebSocket(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map();
    const listeners = new Map();
    let nextId = 0;
    socket.addEventListener('open', () => resolve({
      socket,
      send(method, params = {}) {
        const id = ++nextId;
        return new Promise((res, rej) => {
          pending.set(id, { res, rej, method });
          socket.send(JSON.stringify({ id, method, params }));
        });
      },
      on(method, handler) {
        const handlers = listeners.get(method) || new Set();
        handlers.add(handler);
        listeners.set(method, handlers);
        return () => handlers.delete(handler);
      },
      close() { socket.close(); },
    }), { once: true });
    socket.addEventListener('error', (event) => reject(event.error || new Error('DevTools WebSocket error')), { once: true });
    socket.addEventListener('message', async (event) => {
      const raw = typeof event.data === 'string' ? event.data : await event.data.text();
      const message = JSON.parse(raw);
      if (message.id && pending.has(message.id)) {
        const { res, rej, method } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) rej(new Error(`${method}: ${message.error.message}`));
        else res(message.result || {});
        return;
      }
      for (const handler of listeners.get(message.method) || []) handler(message.params || {});
    });
  });
}

async function main() {
  fs.mkdirSync(profileDir, { recursive: true });
  const child = spawn(chromePath, [
    '--headless=new', '--no-sandbox', '--no-proxy-server', '--disable-gpu',
    '--allow-file-access-from-files', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`, `--window-size=${width},${height}`,
    require('node:url').pathToFileURL(path.join(workDir, 'home.html')).href,
  ], { stdio: 'ignore', windowsHide: true });

  let browser;
  try {
    const { port } = await waitForFile(path.join(profileDir, 'DevToolsActivePort'));
    const endpoint = `http://127.0.0.1:${port}`;
    let targets;
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        targets = await fetch(`${endpoint}/json/list`).then((response) => response.json());
        if (targets.length) break;
      } catch {}
      await sleep(150);
    }
    let target = targets && targets.find((item) => item.type === 'page');
    if (!target) {
      try {
        target = await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' }).then((response) => response.json());
      } catch {}
    }
    if (!target) throw new Error('Chrome has no controllable page target.');
    browser = await connectWebSocket(target.webSocketDebuggerUrl);
    await browser.send('Page.enable');
    await browser.send('Runtime.enable');
    await browser.send('Page.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });

    for (const page of pages) {
      const file = path.join(workDir, page.file);
      const url = require('node:url').pathToFileURL(file).href;
      let loaded;
      const removeLoadListener = browser.on('Page.loadEventFired', () => { if (loaded) loaded(); });
      const loadEvent = new Promise((resolve) => { loaded = resolve; });
      await browser.send('Page.navigate', { url });
      await Promise.race([loadEvent, sleep(5000)]);
      removeLoadListener();
      await sleep(700);
      await browser.send('Runtime.evaluate', {
        expression: 'document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true',
        awaitPromise: true,
        returnByValue: true,
      });

      if (page.selector || page.text) {
        const query = page.selector
          ? `document.querySelector(${JSON.stringify(page.selector)})`
          : `[...document.querySelectorAll('h1,h2,h3,p,span')].find(node => node.textContent.trim() === ${JSON.stringify(page.text)})`;
        const expression = `(() => { const target = ${query}; if (!target) return { error: 'capture target not found', height: document.documentElement.scrollHeight }; const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 72); document.documentElement.scrollTop = top; document.body.scrollTop = top; return { top, target: target.textContent.trim().slice(0, 90), height: document.documentElement.scrollHeight }; })()`;
        const result = await browser.send('Runtime.evaluate', { expression, returnByValue: true });
        const details = result.result && result.result.value;
        if (!details || details.error) throw new Error(`${page.name}: ${details?.error || 'no scroll result'}`);
        await sleep(700);
      }

      const capture = await browser.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
      const output = path.join(workDir, `${page.name}.png`);
      fs.writeFileSync(output, Buffer.from(capture.data, 'base64'));
      console.log(`${page.name}: ${output} (${detailsSummary(page)})`);
    }
    await browser.send('Browser.close').catch(() => {});
  } finally {
    browser?.close();
    if (child && child.exitCode === null) child.kill();
  }
}

function detailsSummary(page) {
  return page.selector || page.text || 'top of page';
}

main().catch((error) => { console.error(error && error.stack || error); process.exitCode = 1; });
