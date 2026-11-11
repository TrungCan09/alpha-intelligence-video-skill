#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {alignmentHash, normalizeText, readJson, scriptHash, sha256File, transcriptHash} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const scriptArg = value('--script'); const asrArg = value('--asr'); const outArg = value('--out'); const overridesArg = value('--overrides'); const dictArg = value('--dictionary') ?? 'knowledge/pronunciation-equivalences.json';
if (!scriptArg || !asrArg || !outArg) {
  console.error('Dùng: node scripts/align-script-to-audio.mjs --script script.lock.json --asr asr-transcript.lock.json --out script-audio-alignment.lock.json [--overrides alignment-overrides.json] [--dictionary knowledge/pronunciation-equivalences.json]');
  process.exit(2);
}
const script = await readJson(resolve(scriptArg)); const asr = await readJson(resolve(asrArg)); const dictionary = await readJson(resolve(dictArg));
const errors = [];
if (script.kind !== 'approved-script' || script.scriptSha256 !== scriptHash(script)) errors.push('Script lock không hợp lệ hoặc hash không khớp.');
if (asr.kind !== 'raw-asr-transcript' || asr.schemaVersion !== 3 || asr.transcriptSha256 !== transcriptHash(asr)) errors.push('ASR transcript phải là raw schema v3 với hash hợp lệ.');
if (!asr.engine?.wordTimestamps || !asr.engine?.vad) errors.push('ASR phải bật word timestamps và VAD.');
if (dictionary.schemaVersion !== 1 || !Array.isArray(dictionary.equivalences)) errors.push('Pronunciation dictionary không hợp lệ.');
const compact = (value) => normalizeText(value).replace(/\s+/g, '');
const canonicalCompact = (value) => {
  let text = normalizeText(value);
  for (const entry of dictionary.equivalences ?? []) for (const form of entry.forms ?? []) {
    const needle = normalizeText(form); const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    text = text.replace(new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`, 'gu'), (match) => `${match.startsWith(' ') ? ' ' : ''}${entry.canonical}`);
  }
  return compact(text);
};
const words = [];
for (const segment of asr.segments ?? []) for (const [index, word] of (segment.words ?? []).entries()) {
  if (!word?.text || !Number.isFinite(word.start) || !Number.isFinite(word.end)) continue;
  words.push({...word, id: word.id ?? `${segment.id}-word-${String(index + 1).padStart(3, '0')}`, sourceSegmentId: segment.id});
}
if (!words.length) errors.push('ASR không có word timestamps để alignment.');
const overrides = overridesArg ? await readJson(resolve(overridesArg)) : {schemaVersion: 1, entries: []};
if (overrides.schemaVersion !== 1 || !Array.isArray(overrides.entries)) errors.push('Override phải dùng schemaVersion 1 và entries array.');
const overrideByScript = new Map((overrides.entries ?? []).map((entry) => [entry.scriptSegmentId, entry]));
const wordById = new Map(words.map((word) => [word.id, word])); const mappings = []; let cursor = 0;
for (const segment of script.segments ?? []) {
  const override = overrideByScript.get(segment.id);
  if (override) {
    if (!override.reviewer || !override.reason || !Array.isArray(override.asrWordIds) || !override.asrWordIds.length) { errors.push(`${segment.id}: override cần reviewer, reason và asrWordIds.`); continue; }
    const selected = override.asrWordIds.map((id) => wordById.get(id));
    if (selected.some((word) => !word)) { errors.push(`${segment.id}: override tham chiếu ASR word không tồn tại.`); continue; }
    const first = words.findIndex((word) => word.id === selected[0].id); const last = words.findIndex((word) => word.id === selected.at(-1).id);
    if (first < cursor || last < first || words.slice(first, last + 1).some((word, index) => word.id !== selected[index]?.id)) { errors.push(`${segment.id}: override phải là một khoảng word ASR liên tiếp và theo thứ tự.`); continue; }
    mappings.push({scriptSegmentId: segment.id, asrWordIds: selected.map((word) => word.id), start: selected[0].start, end: selected.at(-1).end, matchType: 'manual-override', reviewer: override.reviewer, reason: override.reason}); cursor = last + 1; continue;
  }
  const expectedRaw = compact(segment.text); const expected = canonicalCompact(segment.text); let found = null; let joinedRaw = ''; let joinedText = '';
  for (let end = cursor; end < words.length; end++) {
    joinedRaw += compact(words[end].text); joinedText += `${joinedText ? ' ' : ''}${words[end].text}`; const joined = canonicalCompact(joinedText);
    if (joined === expected) { found = {end, matchType: joinedRaw === expectedRaw ? 'exact' : 'pronunciation-equivalence'}; break; }
    if (joined.length > expected.length + 12) break;
  }
  if (!found) { errors.push(`${segment.id}: không map được script vào ASR từ word ${words[cursor]?.id ?? '<end>'}; cần override đã review hoặc voice khớp script.`); continue; }
  const selected = words.slice(cursor, found.end + 1);
  mappings.push({scriptSegmentId: segment.id, asrWordIds: selected.map((word) => word.id), start: selected[0].start, end: selected.at(-1).end, matchType: found.matchType}); cursor = found.end + 1;
}
if (cursor < words.length) errors.push(`ASR có ${words.length - cursor} word dư sau script; không tự bỏ qua nội dung voice.`);
if (mappings.length !== (script.segments ?? []).length) errors.push('Không phải mọi script segment đều được map.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
const alignment = {
  schemaVersion: 1,
  kind: 'script-audio-alignment',
  scriptSha256: script.scriptSha256,
  audioSha256: asr.sourceAudio.sha256,
  asrTranscriptSha256: asr.transcriptSha256,
  durationSeconds: asr.durationSeconds,
  pronunciationDictionarySha256: await sha256File(resolve(dictArg)),
  reviewed: false,
  mappings,
};
alignment.alignmentSha256 = alignmentHash(alignment);
await writeFile(resolve(outArg), `${JSON.stringify(alignment, null, 2)}\n`, 'utf8');
console.log(`PASS Script–audio alignment: ${mappings.length} đoạn → ${resolve(outArg)}`);
