#!/usr/bin/env node
import {resolve} from 'node:path';
import {cueHash, readJson, sha256File} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const reportArg = args[0];
const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
if (!reportArg || !value('--video') || !value('--cue-lock')) { console.error('Dùng: node scripts/check-qa-report.mjs qa/report.json --video candidate.mp4 --cue-lock cue-sheet.lock.json'); process.exit(2); }
const report = await readJson(resolve(reportArg)); const lock = await readJson(resolve(value('--cue-lock'))); const video = resolve(value('--video'));
const until = Number(value('--until') ?? report.reviewedUntilSeconds ?? lock.durationSeconds);
const errors = [];
if (report.schemaVersion !== 2) errors.push('QA report phải dùng schemaVersion 2.');
if (lock.cueSheetSha256 !== cueHash(lock) || report.cueSheetSha256 !== lock.cueSheetSha256) errors.push('QA report không khớp cue lock.');
if (report.videoSha256 !== await sha256File(video)) errors.push('QA report không khớp candidate video.');
if (!report.reviewer || !report.reviewedAt) errors.push('Thiếu reviewer hoặc reviewedAt.');
if (report.playback1x !== true || report.playback05x !== true) errors.push('Phải xác nhận playback 1× và 0,5×.');
const rows = new Map((report.cues ?? []).map((row) => [row.cueId, row]));
for (const cue of (lock.cues ?? []).filter((cue) => cue.start <= until + 0.001)) {
  const row = rows.get(cue.id);
  if (!row) { errors.push(`Thiếu QA cue: ${cue.id}`); continue; }
  for (const field of ['oldIdeaExited', 'expectedStateVisible', 'readable', 'noClippingOrOverlap', 'visualMeaningClear']) if (row[field] !== true) errors.push(`${cue.id}: ${field} chưa đạt.`);
}
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS QA report hoàn tất cho ${(lock.cues ?? []).filter((cue) => cue.start <= until + 0.001).length} cue.`);
