#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {resolveMediaTool, run} from './lib/media-tools.mjs';

const args = process.argv.slice(2);
const input = args.find((x) => !x.startsWith('--'));
const value = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : fallback; };
if (!input) { console.error('Dùng: node scripts/analyze-audio.mjs <audio> [--fps 30] [--out cues.json]'); process.exit(1); }
const fps = Number(value('--fps', '30'));
const out = resolve(value('--out', 'cue-template.json'));
const audio = resolve(input);

const ffprobe = await resolveMediaTool('ffprobe');
const ffmpeg = await resolveMediaTool('ffmpeg');
const durationSeconds = Number(run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', audio]).stdout.trim());
const silence = run(ffmpeg, [
  '-hide_banner',
  '-i', audio,
  '-map', '0:a:0',
  '-vn',
  '-af', 'silencedetect=noise=-38dB:d=0.18',
  '-f', 'null',
  '-',
], {encoding: 'utf8'}).stderr;
const starts = [...silence.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => Number(m[1]));
const ends = [...silence.matchAll(/silence_end: ([0-9.]+)/g)].map((m) => Number(m[1]));
const silences = starts.map((start, i) => ({start, end: ends[i] ?? durationSeconds}));
const boundaries = [0, ...silences.flatMap((s) => [s.start, s.end]), durationSeconds].filter((n, i, a) => n >= 0 && n <= durationSeconds && (i === 0 || Math.abs(n - a[i - 1]) > 0.01));
const candidates = [];
for (let i = 0; i < boundaries.length - 1; i++) {
  const start = boundaries[i]; const end = boundaries[i + 1];
  const insideSilence = silences.some((s) => start >= s.start - 0.01 && end <= s.end + 0.01);
  if (!insideSilence && end - start > 0.1) candidates.push({start, end, spoken: '', semanticCue: '', onScreenText: '', visualHit: start, sfx: null, reason: ''});
}
const result = {source: audio, fps, durationSeconds, durationFrames: Math.ceil(durationSeconds * fps), note: 'Khoảng lặng chỉ là ứng viên. Phải nghe voice và xác nhận semantic cue thủ công.', silences, cueCandidates: candidates};
await writeFile(out, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(`Đã ghi ${out}: ${durationSeconds.toFixed(3)}s, ${result.durationFrames} frame, ${candidates.length} ứng viên cue.`);
