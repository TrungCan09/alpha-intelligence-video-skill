#!/usr/bin/env node
import {mkdir, writeFile} from 'node:fs/promises';
import {basename, resolve} from 'node:path';
import {cueHash, readJson, sha256File} from './lib/lock-utils.mjs';
import {resolveMediaTool, run} from './lib/media-tools.mjs';

const args = process.argv.slice(2);
const videoArg = args[0]; const cueArg = args[1];
const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
if (!videoArg || !cueArg) { console.error('Dùng: node scripts/build-qa-pack.mjs master.mp4 cue-sheet.lock.json --out qa/'); process.exit(2); }
const video = resolve(videoArg); const lock = await readJson(resolve(cueArg)); const out = resolve(value('--out', 'qa'));
const until = Number(value('--until', String(lock.durationSeconds)));
const selectedCues = (lock.cues ?? []).filter((cue) => cue.start <= until + 0.001);
if (lock.cueSheetSha256 !== cueHash(lock)) { console.error('FAIL cue lock không hợp lệ.'); process.exit(1); }
await mkdir(out, {recursive: true});
const ffmpeg = await resolveMediaTool('ffmpeg');
const frames = [];
for (const cue of selectedCues) {
  const points = [
    ['before', Math.max(0, cue.start - 0.1)],
    ['cue', cue.start],
    ['readable', Math.min(lock.durationSeconds, cue.start + 0.2)],
    ['mid', Math.min(lock.durationSeconds, (cue.start + cue.end) / 2)],
  ];
  for (const [kind, time] of points) {
    const fileName = `${cue.id.replace(/[^a-z0-9_-]/gi, '_')}-${kind}.png`;
    run(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', Number(time).toFixed(3), '-i', video, '-vf', 'scale=360:-2', '-frames:v', '1', resolve(out, fileName)]);
    frames.push({cueId: cue.id, kind, time: Number(Number(time).toFixed(3)), fileName});
  }
}
const videoSha256 = await sha256File(video);
const index = {schemaVersion: 2, sourceVideo: basename(video), videoSha256, cueSheetSha256: lock.cueSheetSha256, frames};
await writeFile(resolve(out, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
const report = {schemaVersion: 2, sourceVideo: basename(video), videoSha256, cueSheetSha256: lock.cueSheetSha256, reviewedUntilSeconds: until, reviewer: '', reviewedAt: '', playback1x: null, playback05x: null, cues: selectedCues.map((cue) => ({cueId: cue.id, oldIdeaExited: null, expectedStateVisible: null, readable: null, noClippingOrOverlap: null, visualMeaningClear: null, notes: ''}))};
await writeFile(resolve(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
const cards = frames.map((frame) => `<figure><img src="${frame.fileName}" alt="${frame.cueId} ${frame.kind}"><figcaption>${frame.cueId} · ${frame.kind} · ${frame.time.toFixed(3)}s</figcaption></figure>`).join('\n');
await writeFile(resolve(out, 'contact-sheet.html'), `<!doctype html><meta charset="utf-8"><title>Alpha QA Pack</title><style>body{background:#050D1D;color:#F9F9F9;font:16px system-ui;margin:24px}main{display:grid;grid-template-columns:repeat(4,minmax(180px,1fr));gap:20px}figure{margin:0;background:#081938;padding:10px;border-radius:12px}img{width:100%;display:block;border-radius:8px}figcaption{margin-top:8px;color:#ACDDFA}</style><h1>Alpha QA Pack</h1><main>${cards}</main>`, 'utf8');
console.log(`PASS QA pack: ${frames.length} frame tại ${out}`);
