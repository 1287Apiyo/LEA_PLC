'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { randomUUID } = require('node:crypto');

const workDir = __dirname;
const rootDir = path.resolve(workDir, '..', '..');
const publicDir = path.join(rootDir, 'frontend', 'public');
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.join(publicDir, 'lea-real-site-walkthrough.webm');
const htmlPath = path.join(workDir, 'render-walkthrough.html');
const profileDir = path.join(workDir, `chrome-video-${process.pid}-${randomUUID()}`);

function imageData(name) {
  const file = path.join(workDir, name);
  if (!fs.existsSync(file)) throw new Error(`Missing genuine capture frame: ${file}`);
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

function audioData() {
  const file = path.join(workDir, 'lea-walkthrough-bgm.mp3');
  if (!fs.existsSync(file)) throw new Error(`Missing walkthrough music: ${file}`);
  return `data:audio/mpeg;base64,${fs.readFileSync(file).toString('base64')}`;
}

function makeHtml() {
  const sources = {
    hero: imageData('home-hero.png'),
    homeFull: imageData('home-tall.png'),
    bootcamp: imageData('home-bootcamp.png'),
    dashboard: imageData('dashboard-catalog.png'),
  };
  const soundtrack = audioData();
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Rendering LEA platform tour</title></head>
<body style="margin:0;background:#12091a"><canvas id="stage" width="1600" height="900"></canvas>
<script>
(async()=>{
  const sourceData=${JSON.stringify(sources)};
  const soundtrack=${JSON.stringify(soundtrack)};
  const loadImage=(src)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Capture frame failed to load'));img.src=src});
  const [hero,homeFull,bootcamp,dashboard]=await Promise.all([loadImage(sourceData.hero),loadImage(sourceData.homeFull),loadImage(sourceData.bootcamp),loadImage(sourceData.dashboard)]);
  const audioContext=new AudioContext();
  await audioContext.resume();
  const music=new Audio(soundtrack);
  music.loop=true;
  music.preload='auto';
  music.load();
  await new Promise((resolve,reject)=>{if(music.readyState>=2){resolve();return;}music.addEventListener('canplay',resolve,{once:true});music.addEventListener('error',()=>reject(new Error('Walkthrough music failed to load')), {once:true});});
  const musicSource=audioContext.createMediaElementSource(music);
  const musicGain=audioContext.createGain();
  const audioDestination=audioContext.createMediaStreamDestination();
  musicSource.connect(musicGain);
  musicGain.connect(audioDestination);
  const gainStart=audioContext.currentTime;
  musicGain.gain.setValueAtTime(0.0001,gainStart);
  musicGain.gain.linearRampToValueAtTime(0.15,gainStart+0.9);
  musicGain.gain.setValueAtTime(0.15,gainStart+20.5);
  musicGain.gain.linearRampToValueAtTime(0.0001,gainStart+22);
  const canvas=document.getElementById('stage');
  const ctx=canvas.getContext('2d',{alpha:false});
  ctx.imageSmoothingEnabled=false;
  const fps=24;
  const sceneDuration=5500;
  const duration=sceneDuration*4;
  const fadeDuration=450;
  const drawScene=(index,progress)=>{
    if(index===0){ctx.drawImage(hero,0,0,1600,900);return;}
    if(index===1){const eased=progress*progress*(3-2*progress);const y=850+350*eased;ctx.drawImage(homeFull,0,y,1600,900,0,0,1600,900);return;}
    if(index===2){ctx.drawImage(bootcamp,0,0,1600,900);return;}
    ctx.drawImage(dashboard,0,0,1600,900);
  };
  const mimeType=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));
  if(!mimeType)throw new Error('This local browser does not support WebM recording.');
  const canvasStream=canvas.captureStream(fps);
  const stream=new MediaStream([...canvasStream.getVideoTracks(),...audioDestination.stream.getAudioTracks()]);
  const recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:3000000});
  const chunks=[];
  recorder.ondataavailable=(event)=>{if(event.data&&event.data.size)chunks.push(event.data)};
  recorder.onerror=(event)=>{document.title='RECORDING_ERROR';document.body.textContent=String(event.error||event)};
  let renderTimer;
  const finish=()=>{
    if(renderTimer)clearInterval(renderTimer);
    if(recorder.state==='recording')recorder.stop();
  };
  recorder.onstop=()=>{
    stream.getTracks().forEach(track=>track.stop());
    music.pause();
    audioContext.close();
    const blob=new Blob(chunks,{type:mimeType});
    const reader=new FileReader();
    reader.onerror=()=>{document.title='ENCODING_ERROR';document.body.textContent='Unable to read recorded video.'};
    reader.onload=()=>{
      const resultUrl=String(reader.result);
      const data=resultUrl.slice(resultUrl.lastIndexOf(',')+1);
      document.title='LEA_VIDEO_READY_'+blob.size+'_'+duration;
      document.body.innerHTML='<pre id="video-data">'+data+'</pre>';
    };
    reader.readAsDataURL(blob);
  };
  drawScene(0,0);
  await music.play();
  recorder.start(250);
  let frameIndex=0;
  const totalFrames=Math.round(duration/1000*fps);
  const drawAt=(elapsed)=>{
    const scene=Math.min(3,Math.floor(elapsed/sceneDuration));
    const inScene=(elapsed-scene*sceneDuration)/sceneDuration;
    const untilBoundary=sceneDuration-(elapsed%sceneDuration);
    if(scene<3&&untilBoundary<=fadeDuration){
      drawScene(scene,inScene);
      ctx.globalAlpha=1-untilBoundary/fadeDuration;
      drawScene(scene+1,0);
      ctx.globalAlpha=1;
    }else drawScene(scene,inScene);
  };
  renderTimer=setInterval(()=>{
    frameIndex++;
    const elapsed=Math.min(duration,frameIndex/fps*1000);
    drawAt(elapsed);
    if(frameIndex>=totalFrames)finish();
  },1000/fps);
  setTimeout(finish,duration+250);
})().catch(error=>{document.title='RENDER_ERROR';document.body.textContent=String(error.stack||error)});
</script></body></html>`;
}

function readVint(buffer, offset, isId = false) {
  const first = buffer[offset];
  if (first === undefined || first === 0) throw new Error(`Invalid EBML VINT at ${offset}.`);
  let mask = 0x80;
  let length = 1;
  while (!(first & mask)) { mask >>= 1; length++; }
  if (length > 8) throw new Error(`Unsupported EBML VINT length ${length}.`);
  let value = BigInt(isId ? first : first & (mask - 1));
  for (let index = 1; index < length; index++) value = (value << 8n) | BigInt(buffer[offset + index]);
  const unknown = !isId && value === (1n << BigInt(7 * length)) - 1n;
  return { length, value, unknown };
}

function encodeVintSize(value) {
  const n = BigInt(value);
  for (let length = 1; length <= 8; length++) {
    if (n > (1n << BigInt(7 * length)) - 2n) continue;
    const bytes = Buffer.alloc(length);
    let remaining = n;
    for (let index = length - 1; index >= 0; index--) {
      bytes[index] = Number(remaining & 0xffn);
      remaining >>= 8n;
    }
    bytes[0] |= 1 << (8 - length);
    return bytes;
  }
  throw new Error(`EBML element is too large: ${value} bytes.`);
}

function readUnsigned(buffer, start, length) {
  let value = 0n;
  for (let index = 0; index < length; index++) value = (value << 8n) | BigInt(buffer[start + index]);
  return value;
}

function findChild(buffer, start, end, targetId) {
  let cursor = start;
  while (cursor < end) {
    const id = readVint(buffer, cursor, true);
    const size = readVint(buffer, cursor + id.length);
    const dataStart = cursor + id.length + size.length;
    if (size.unknown) {
      if (id.value === BigInt(targetId)) return { start: cursor, idLength: id.length, sizeLength: size.length, dataStart, end, size: end - dataStart, unknown: true };
      throw new Error(`Unexpected unknown-size child in EBML element at ${cursor}.`);
    }
    const elementEnd = dataStart + Number(size.value);
    if (elementEnd > end) throw new Error(`Invalid EBML child size at ${cursor}.`);
    if (id.value === BigInt(targetId)) return { start: cursor, idLength: id.length, sizeLength: size.length, dataStart, end: elementEnd, size: Number(size.value), unknown: false };
    cursor = elementEnd;
  }
  return null;
}

function addDurationMetadata(buffer, durationSeconds) {
  const header = findChild(buffer, 0, buffer.length, 0x1a45dfa3);
  if (!header) throw new Error('Missing EBML header.');
  const segment = findChild(buffer, header.end, buffer.length, 0x18538067);
  if (!segment) throw new Error('Missing WebM Segment.');
  const info = findChild(buffer, segment.dataStart, buffer.length, 0x1549a966);
  if (!info) throw new Error('Missing WebM Segment Info.');

  let timecodeScale = 1000000n;
  let insertionOffset = info.size;
  let existingDuration = null;
  let cursor = info.dataStart;
  while (cursor < info.end) {
    const id = readVint(buffer, cursor, true);
    const size = readVint(buffer, cursor + id.length);
    if (size.unknown) throw new Error('Unexpected unknown-sized Segment Info child.');
    const dataStart = cursor + id.length + size.length;
    const elementEnd = dataStart + Number(size.value);
    if (elementEnd > info.end) throw new Error('Invalid Segment Info child size.');
    if (id.value === 0x2ad7b1n && Number(size.value) <= 8) {
      timecodeScale = readUnsigned(buffer, dataStart, Number(size.value));
      insertionOffset = elementEnd - info.dataStart;
    }
    if (id.value === 0x4489n) {
      existingDuration = { start: cursor - info.dataStart, end: elementEnd - info.dataStart };
      if (insertionOffset > existingDuration.start) insertionOffset = existingDuration.start;
    }
    cursor = elementEnd;
  }
  if (timecodeScale === 0n) throw new Error('Invalid zero TimecodeScale.');
  const durationUnits = durationSeconds * 1000000000 / Number(timecodeScale);
  const durationValue = Buffer.alloc(8);
  durationValue.writeDoubleBE(durationUnits, 0);
  const durationElement = Buffer.concat([Buffer.from([0x44, 0x89, 0x88]), durationValue]);
  const infoData = buffer.subarray(info.dataStart, info.end);
  const before = infoData.subarray(0, insertionOffset);
  const after = infoData.subarray(existingDuration ? existingDuration.end : insertionOffset);
  const newInfoData = Buffer.concat([before, durationElement, after]);
  const infoIdBytes = buffer.subarray(info.start, info.start + info.idLength);
  const newInfoElement = Buffer.concat([infoIdBytes, encodeVintSize(newInfoData.length), newInfoData]);
  const updated = Buffer.concat([buffer.subarray(0, info.start), newInfoElement, buffer.subarray(info.end)]);
  if (!segment.unknown && segment.sizeLength !== encodeVintSize(segment.size + newInfoElement.length - (info.end - info.start)).length) {
    throw new Error('A known Segment size would need to be rewritten; this recorder output uses an unknown Segment size.');
  }
  return updated;
}

function main() {
  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(profileDir, { recursive: true });
  fs.writeFileSync(htmlPath, makeHtml(), 'utf8');
  const args = [
    '--headless=new', '--no-sandbox', '--no-proxy-server', '--disable-gpu',
    '--no-first-run', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir=${profileDir}`, '--window-size=1600,900',
    '--virtual-time-budget=30000', '--dump-dom', pathToFileURL(htmlPath).href,
  ];
  const result = spawnSync(chromePath, args, { encoding: 'utf8', maxBuffer: 96 * 1024 * 1024, windowsHide: true, timeout: 90000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome video render failed (exit ${result.status}): ${(result.stderr || '').slice(-1800)}`);
  const title = (result.stdout.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const match = result.stdout.match(/<pre id="video-data">([A-Za-z0-9+/=\s]+)<\/pre>/i);
  if (!match) {
    const dumpPath = path.join(workDir, 'render-walkthrough-dump.html');
    fs.writeFileSync(dumpPath, result.stdout || '', 'utf8');
    const marker = (result.stdout || '').indexOf('video-data');
    const excerpt = marker >= 0 ? result.stdout.slice(Math.max(0, marker - 80), marker + 220) : (result.stdout || '').slice(-400);
    throw new Error(`No recorded WebM payload matched; title=${title}; stdoutBytes=${Buffer.byteLength(result.stdout || '')}; markerAt=${marker}; excerpt=${JSON.stringify(excerpt)}; dump=${dumpPath}; stderr=${(result.stderr || '').slice(-1800)}`);
  }
  const rawVideo = Buffer.from(match[1].replace(/\s/g, ''), 'base64');
  const video = addDurationMetadata(rawVideo, 22);
  if (video.length < 100000 || video.subarray(0, 4).toString('hex') !== '1a45dfa3') throw new Error(`Recorded output is not a complete WebM file (${video.length} bytes).`);
  fs.writeFileSync(outputPath, video);
  console.log(JSON.stringify({ outputPath, bytes: video.length, container: 'WebM/EBML', targetDurationSeconds: 22, title }, null, 2));
}

try { main(); } catch (error) { console.error(error && error.stack || error); process.exitCode = 1; }
