#!/usr/bin/env node
import {mkdir, readFile} from 'node:fs/promises';
import {basename, resolve} from 'node:path';
import {resolveMediaTool, run} from './lib/media-tools.mjs';

const args = process.argv.slice(2);
const videoArg = args.find((x) => !x.startsWith('--'));
const value = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : fallback; };
if (!videoArg) { console.error('Dùng: node scripts/extract-qa-frames.mjs <video> --times 0,2.5 [--cues cues.json] [--fps 30] [--out qa-frames]'); process.exit(1); }
const video = resolve(videoArg); const fps = Number(value('--fps', '30')); const out = resolve(value('--out', 'qa-frames'));
const explicit = value('--times', '').split(',').filter(Boolean).map(Number);
const cuePath = value('--cues', '');
let cueTimes = [];
if (cuePath) {
  const cueData = JSON.parse(await readFile(resolve(cuePath), 'utf8'));
  cueTimes = (cueData.cues ?? cueData.cueCandidates ?? []).flatMap((c) => [c.start - 3 / fps, c.start, c.start + 3 / fps]);
}
const times = [...new Set([...explicit, ...cueTimes].filter((n) => Number.isFinite(n) && n >= 0).map((n) => Number(n.toFixed(4))))].sort((a, b) => a - b);
if (!times.length) throw new Error('Không có timestamp. Dùng --times hoặc --cues.');
await mkdir(out, {recursive: true});
const ffmpeg = await resolveMediaTool('ffmpeg');
for (const time of times) {
  const stamp = time.toFixed(3).replace('.', '_');
  const target = resolve(out, `${basename(video).replace(/\.[^.]+$/, '')}-${stamp}s.png`);
  const frame = Math.round(time * fps);
  run(ffmpeg, ['-y', '-threads', '1', '-i', video, '-vf', `trim=start_frame=${frame}:end_frame=${frame + 1},scale=540:-2`, '-frames:v', '1', target]);
  console.log(target);
}
