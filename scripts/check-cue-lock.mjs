#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {cueHash, normalizeText, readJson, sha256File, transcriptHash} from './lib/lock-utils.mjs';

const args = process.argv.slice(2);
const transcriptArg = args[0]; const cueArg = args[1];
const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
if (!transcriptArg || !cueArg) {
  console.error('Dùng: node scripts/check-cue-lock.mjs transcript.lock.json cue-sheet.lock.json [--audio voice.mp3]');
  process.exit(2);
}
const transcript = await readJson(resolve(transcriptArg));
const lock = await readJson(resolve(cueArg));
const errors = [];
if (transcript.schemaVersion !== 2 || lock.schemaVersion !== 2) errors.push('Transcript và cue lock phải dùng schemaVersion 2.');
if (!transcript.reviewed) errors.push('Transcript chưa được rà soát.');
const expectedTranscriptHash = transcriptHash(transcript);
if (transcript.transcriptSha256 !== expectedTranscriptHash) errors.push('transcriptSha256 không khớp.');
if (lock.transcriptSha256 !== expectedTranscriptHash) errors.push('Cue lock không trỏ tới transcript hiện tại.');
if (lock.cueSheetSha256 !== cueHash(lock)) errors.push('cueSheetSha256 không khớp.');
if (lock.audioSha256 !== transcript.sourceAudio?.sha256) errors.push('Audio hash giữa transcript và cue lock không khớp.');
const audioArg = value('--audio');
if (audioArg) {
  const audioPath = resolve(audioArg);
  if (!existsSync(audioPath)) errors.push(`Không tìm thấy audio: ${audioPath}`);
  else if (await sha256File(audioPath) !== lock.audioSha256) errors.push('Audio thực tế không khớp audioSha256 trong cue lock.');
}
const segments = new Map((transcript.segments ?? []).map((segment) => [segment.id, segment]));
const mapped = new Set();
const tolerance = Number(lock.maxCueLagSeconds ?? 0.2);
let previousStart = -Infinity;
for (const cue of lock.cues ?? []) {
  const selected = (cue.segmentIds ?? []).map((id) => segments.get(id)).filter(Boolean);
  if (selected.length !== (cue.segmentIds ?? []).length) errors.push(`${cue.id}: segment reference không tồn tại.`);
  selected.forEach((segment) => mapped.add(segment.id));
  if (!selected.length) continue;
  const start = Math.min(...selected.map((segment) => segment.start));
  const end = Math.max(...selected.map((segment) => segment.end));
  const spoken = selected.map((segment) => segment.text).join(' ');
  if (Math.abs(cue.start - start) > 0.001 || Math.abs(cue.end - end) > 0.001) errors.push(`${cue.id}: start/end không được suy ra từ segment.`);
  if (cue.visualHit < start - 0.001 || cue.visualHit - start > tolerance + 0.001) errors.push(`${cue.id}: visualHit lệch semantic cue quá ${tolerance}s.`);
  if (cue.readableBy < start - 0.001 || cue.readableBy - start > tolerance + 0.001) errors.push(`${cue.id}: readableBy lệch semantic cue quá ${tolerance}s.`);
  if (normalizeText(cue.spokenText) !== normalizeText(spoken)) errors.push(`${cue.id}: spokenText không khớp transcript.`);
  if (cue.start < previousStart) errors.push(`${cue.id}: cue không đơn điệu theo thời gian.`);
  previousStart = cue.start;
}
const voiceOnly = new Set((lock.voiceOnlySegments ?? []).map((item) => item.segmentId));
for (const segment of transcript.segments ?? []) if (!mapped.has(segment.id) && !voiceOnly.has(segment.id)) errors.push(`Segment chưa được cover: ${segment.id}`);
const lastTranscriptEnd = Math.max(0, ...(transcript.segments ?? []).map((segment) => segment.end));
const lastCueEnd = Math.max(0, ...(lock.cues ?? []).map((cue) => cue.end));
if (Math.abs(lastTranscriptEnd - lastCueEnd) > Number(lock.maxCumulativeDriftSeconds ?? 0.25) && !voiceOnly.has((transcript.segments ?? []).at(-1)?.id)) errors.push('Drift tích lũy cuối video vượt giới hạn.');
if (Math.abs(Number(lock.durationSeconds) - Number(transcript.durationSeconds)) > 0.05) errors.push('Duration transcript và cue lock lệch quá 50ms.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Cue lock hợp lệ: ${(lock.cues ?? []).length} cue, drift ≤ ${lock.maxCumulativeDriftSeconds}s.`);
