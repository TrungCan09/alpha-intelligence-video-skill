#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {alignmentHash, readJson, scriptHash, sha256File, transcriptHash} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const scriptArg = args[0]; const asrArg = args[1]; const alignmentArg = args[2]; const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
if (!scriptArg || !asrArg || !alignmentArg) { console.error('Dùng: node scripts/check-script-audio-alignment.mjs script.lock.json asr-transcript.lock.json script-audio-alignment.lock.json [--audio final-voice.mp3] [--dictionary file]'); process.exit(2); }
const script = await readJson(resolve(scriptArg)); const asr = await readJson(resolve(asrArg)); const alignment = await readJson(resolve(alignmentArg)); const dictionaryArg = value('--dictionary') ?? 'knowledge/pronunciation-equivalences.json'; const dictionary = await readJson(resolve(dictionaryArg)); const errors = [];
if (script.kind !== 'approved-script' || script.scriptSha256 !== scriptHash(script)) errors.push('Script lock không hợp lệ.');
if (asr.kind !== 'raw-asr-transcript' || asr.schemaVersion !== 3 || asr.transcriptSha256 !== transcriptHash(asr)) errors.push('Raw ASR transcript không hợp lệ.');
if (!asr.engine?.wordTimestamps || !asr.engine?.vad) errors.push('ASR phải có word timestamps và VAD.');
if (alignment.kind !== 'script-audio-alignment' || alignment.schemaVersion !== 1 || alignment.alignmentSha256 !== alignmentHash(alignment)) errors.push('Alignment hash hoặc schema không hợp lệ.');
if (!alignment.reviewed) errors.push('Alignment chưa được rà soát và khóa reviewed=true.');
if (alignment.scriptSha256 !== script.scriptSha256) errors.push('Alignment không trỏ tới script lock hiện tại.');
if (alignment.audioSha256 !== asr.sourceAudio?.sha256) errors.push('Audio hash giữa ASR và alignment không khớp.');
if (alignment.asrTranscriptSha256 !== asr.transcriptSha256) errors.push('Alignment không trỏ tới ASR transcript hiện tại.');
if (alignment.pronunciationDictionarySha256 !== await sha256File(resolve(dictionaryArg))) errors.push('Pronunciation dictionary đã thay đổi; phải align lại.');
const words=[]; for (const segment of asr.segments ?? []) for (const [index, word] of (segment.words ?? []).entries()) words.push({...word, id:word.id ?? `${segment.id}-word-${String(index+1).padStart(3,'0')}`});
const byId = new Map(words.map((word)=>[word.id,word])); const mappedWords = new Set(); let previousEnd = -Infinity;
for (const segment of script.segments ?? []) {
  const mapping = (alignment.mappings ?? []).find((item)=>item.scriptSegmentId===segment.id);
  if (!mapping) { errors.push(`${segment.id}: không có alignment mapping.`); continue; }
  const selected=(mapping.asrWordIds ?? []).map((id)=>byId.get(id));
  if (!selected.length || selected.some((word)=>!word)) { errors.push(`${segment.id}: mapping word ID không hợp lệ.`); continue; }
  const first=words.findIndex((word)=>word.id===selected[0].id); const last=words.findIndex((word)=>word.id===selected.at(-1).id);
  if (words.slice(first,last+1).some((word,index)=>word.id!==selected[index]?.id)) errors.push(`${segment.id}: mapping phải tham chiếu word ASR liên tiếp.`);
  if (Math.abs(mapping.start-selected[0].start)>0.001 || Math.abs(mapping.end-selected.at(-1).end)>0.001) errors.push(`${segment.id}: timestamp phải suy ra từ word ASR đầu/cuối.`);
  if (mapping.start < previousEnd-0.001) errors.push(`${segment.id}: mapping không theo thứ tự audio.`); previousEnd=mapping.end;
  selected.forEach((word)=>mappedWords.add(word.id));
  if (!['exact','pronunciation-equivalence','manual-override'].includes(mapping.matchType)) errors.push(`${segment.id}: matchType không hợp lệ.`);
  if (mapping.matchType==='manual-override' && (!mapping.reviewer || !mapping.reason)) errors.push(`${segment.id}: manual override cần reviewer và reason.`);
}
if ((alignment.mappings ?? []).length !== (script.segments ?? []).length) errors.push('Alignment phải cover đúng mọi script segment, không thừa/thiếu.');
if (mappedWords.size !== words.length) errors.push('ASR có word chưa map; không tự bỏ qua nội dung voice.');
const audio=value('--audio'); if (audio) { if (!existsSync(resolve(audio))) errors.push(`Không tìm thấy audio: ${audio}`); else if (await sha256File(resolve(audio))!==alignment.audioSha256) errors.push('Final voice đã thay đổi; phải ASR và align lại.'); }
if (errors.length) { errors.forEach((error)=>console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Script–audio alignment hợp lệ: ${alignment.mappings.length} đoạn, ${words.length} ASR word.`);
