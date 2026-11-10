#!/usr/bin/env node
import {dirname, resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {cueHash, readJson, sha256File} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const reportArg = args[0];
const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
if (!reportArg || !value('--video') || !value('--cue-lock')) { console.error('Dùng: node scripts/check-qa-report.mjs qa/report.json --video candidate.mp4 --cue-lock cue-sheet.lock.json'); process.exit(2); }
const report = await readJson(resolve(reportArg)); const lock = await readJson(resolve(value('--cue-lock'))); const video = resolve(value('--video'));
const until = Number(value('--until') ?? report.reviewedUntilSeconds ?? lock.durationSeconds);
const errors = [];
const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const knowledge = JSON.parse(await readFile(resolve(skillRoot, 'knowledge/lessons.json'), 'utf8'));
const lessonIds = new Set((knowledge.lessons ?? []).map((lesson) => lesson.id));
if (report.schemaVersion !== 2) errors.push('QA report phải dùng schemaVersion 2.');
if (lock.cueSheetSha256 !== cueHash(lock) || report.cueSheetSha256 !== lock.cueSheetSha256) errors.push('QA report không khớp cue lock.');
if (report.videoSha256 !== await sha256File(video)) errors.push('QA report không khớp candidate video.');
if (!report.reviewer || !report.reviewedAt) errors.push('Thiếu reviewer hoặc reviewedAt.');
if (report.playback1x !== true || report.playback05x !== true) errors.push('Phải xác nhận playback 1× và 0,5×.');
const rows = new Map((report.cues ?? []).map((row) => [row.cueId, row]));
for (const cue of (lock.cues ?? []).filter((cue) => cue.start <= until + 0.001)) {
  const row = rows.get(cue.id);
  if (!row) { errors.push(`Thiếu QA cue: ${cue.id}`); continue; }
  const fields = ['oldIdeaExited', 'expectedStateVisible', 'readable', 'noClippingOrOverlap', 'visualMeaningClear'];
  const failed = fields.filter((field) => row[field] === false);
  if (failed.length && !(row.lessonIds?.length)) errors.push(`${cue.id}: QA fail phải tham chiếu lessonIds.`);
  for (const id of row.lessonIds ?? []) if (!lessonIds.has(id)) errors.push(`${cue.id}: lesson ID không tồn tại ${id}.`);
  for (const field of fields) if (row[field] !== true) errors.push(`${cue.id}: ${field} chưa đạt.`);
}
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS QA report hoàn tất cho ${(lock.cues ?? []).filter((cue) => cue.start <= until + 0.001).length} cue.`);
