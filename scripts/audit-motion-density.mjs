#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {inflateSync} from 'node:zlib';
import {resolveMediaTool} from './lib/media-tools.mjs';

const args = process.argv.slice(2);
const value = (flag, fallback = '') => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : fallback; };
const videoArg = args.find((x) => !x.startsWith('--'));
if (!videoArg) {
  console.error('Dùng: node scripts/audit-motion-density.mjs <video> --storyboard storyboard.json [--threshold 1.2]');
  process.exit(1);
}
const storyboardPath = value('--storyboard');
if (!storyboardPath) {
  console.error('Thiếu --storyboard. Motion density phải được đối chiếu với semantic beats, không chỉ pixel chuyển động.');
  process.exit(1);
}
const video = resolve(videoArg);
const storyboard = JSON.parse(await readFile(resolve(storyboardPath), 'utf8'));
const threshold = Number(value('--threshold', '0.3'));
const fps = Number(storyboard.fps ?? 30);
const ffmpeg = await resolveMediaTool('ffmpeg');
const width = 90; const height = 140;
const result = spawnSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-i', video, '-an',
  '-vf', `crop=w=iw-120:h=ih-420:x=60:y=150,scale=${width}:${height}`,
  '-c:v', 'png', '-f', 'image2pipe', '-',
], {encoding: null, maxBuffer: 128 * 1024 * 1024});
if (result.error || result.status !== 0) {
  console.error(`FFmpeg thất bại: ${result.stderr?.toString('utf8') || result.error?.message || result.status}`);
  process.exit(1);
}
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const splitPngs = (buffer) => {
  const frames = []; let offset = 0;
  while (offset < buffer.length) {
    const start = buffer.indexOf(signature, offset);
    if (start < 0) break;
    let cursor = start + 8;
    while (cursor + 12 <= buffer.length) {
      const length = buffer.readUInt32BE(cursor); const type = buffer.toString('ascii', cursor + 4, cursor + 8);
      cursor += 12 + length;
      if (type === 'IEND') { frames.push(buffer.subarray(start, cursor)); offset = cursor; break; }
    }
    if (offset <= start) break;
  }
  return frames;
};
const paeth = (a, b, c) => {
  const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
const decodePng = (png) => {
  let cursor = 8; let w = 0; let h = 0; let colorType = 0; const idat = [];
  while (cursor + 12 <= png.length) {
    const length = png.readUInt32BE(cursor); const type = png.toString('ascii', cursor + 4, cursor + 8); const data = png.subarray(cursor + 8, cursor + 8 + length);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); if (data[8] !== 8) throw new Error('Chỉ hỗ trợ PNG 8-bit.'); colorType = data[9]; }
    if (type === 'IDAT') idat.push(data);
    cursor += 12 + length;
    if (type === 'IEND') break;
  }
  const channels = colorType === 0 ? 1 : colorType === 2 ? 3 : colorType === 4 ? 2 : colorType === 6 ? 4 : 0;
  if (!channels) throw new Error(`PNG color type ${colorType} chưa được hỗ trợ.`);
  const inflated = inflateSync(Buffer.concat(idat)); const stride = w * channels; const pixels = Buffer.alloc(stride * h);
  let source = 0;
  for (let y = 0; y < h; y++) {
    const filter = inflated[source++]; const row = y * stride; const previous = row - stride;
    for (let x = 0; x < stride; x++) {
      const raw = inflated[source++]; const left = x >= channels ? pixels[row + x - channels] : 0; const up = y ? pixels[previous + x] : 0; const upperLeft = y && x >= channels ? pixels[previous + x - channels] : 0;
      const value = filter === 0 ? raw : filter === 1 ? raw + left : filter === 2 ? raw + up : filter === 3 ? raw + Math.floor((left + up) / 2) : filter === 4 ? raw + paeth(left, up, upperLeft) : raw;
      pixels[row + x] = value & 255;
    }
  }
  const luma = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (channels === 1 || channels === 2) luma[i] = pixels[i * channels];
    else luma[i] = Math.round(pixels[i * channels] * 0.299 + pixels[i * channels + 1] * 0.587 + pixels[i * channels + 2] * 0.114);
  }
  return luma;
};
const decoded = splitPngs(result.stdout).map(decodePng);
const deltas = [];
for (let frame = 1; frame < decoded.length; frame++) {
  let total = 0;
  for (let pixel = 0; pixel < decoded[frame].length; pixel++) total += Math.abs(decoded[frame][pixel] - decoded[frame - 1][pixel]);
  deltas.push(total / decoded[frame].length);
}
if (!deltas.length) {
  console.error('Không đọc được frame-difference từ ffmpeg.');
  process.exit(1);
}
const sampleSeconds = 1 / fps;
let longest = 0; let current = 0;
const lowMotionRuns = []; let runStart = 0;
for (const [index, delta] of deltas.entries()) {
  if (delta < threshold) { if (current === 0) runStart = index / fps; current += sampleSeconds; longest = Math.max(longest, current); }
  else { if (current > 0) lowMotionRuns.push({start: runStart, end: (index + 1) / fps, duration: current}); current = 0; }
}
if (current > 0) lowMotionRuns.push({start: runStart, end: decoded.length / fps, duration: current});
const beats = storyboard.scenes.flatMap((scene) => scene.beats ?? []);
// v1 storyboards classified beats with `kind`; v2 plans contain semantic
// beats by construction and bind every beat to a cue id.
const semanticCoverage = beats.filter((beat) => beat.cueId && (!beat.kind || ['semantic', 'focus', 'resolve'].includes(beat.kind))).length;
let cueLock = null;
const cueLockPath = value('--cue-lock', resolve(dirname(resolve(storyboardPath)), 'cue-sheet.lock.json'));
try { cueLock = JSON.parse(await readFile(resolve(cueLockPath), 'utf8')); } catch {}
const cueMap = new Map((cueLock?.cues ?? []).map((cue) => [cue.id, cue]));
const allowedHolds = storyboard.scenes.filter((scene) => scene.holdReason).map((scene) => ({
  start: Number.isFinite(scene.start) ? scene.start : cueMap.get(scene.startCueId)?.start,
  end: Number.isFinite(scene.end) ? scene.end : cueMap.get(scene.endCueId)?.end,
})).filter((interval) => Number.isFinite(interval.start) && Number.isFinite(interval.end));
const unexplainedRuns = lowMotionRuns.filter((run) => run.duration > 3 && !allowedHolds.some((hold) => run.start >= hold.start - 0.05 && run.end <= hold.end + 0.05));
console.log(`INFO ${deltas.length} mẫu hình, semantic beats=${semanticCoverage}, longest-low-motion=${longest.toFixed(2)}s.`);
if (semanticCoverage < 2) {
  console.error('FAIL Video không có đủ semantic beats được khai báo.');
  process.exit(1);
}
if (unexplainedRuns.length) {
  console.error(`FAIL Có khoảng gần như đứng hình vượt 90 frame ngoài holdReason: ${unexplainedRuns.map((run) => `${run.start.toFixed(2)}–${run.end.toFixed(2)}s`).join(', ')}.`);
  process.exit(1);
}
console.log('PASS Motion density không có long hold vô nghĩa theo ngưỡng hiện tại.');
