#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {alignmentHash, cueHash, normalizeText, readJson, scriptHash, transcriptHash} from './lib/lock-utils.mjs';

const args = process.argv.slice(2);
const positional = args.filter((arg, index) => !arg.startsWith('--') && (index === 0 || !args[index - 1]?.startsWith('--')));
const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const scriptArg = value('--script'); const alignmentArg = value('--alignment'); const planArg = value('--plan');
if (scriptArg || alignmentArg || planArg) {
  if (!scriptArg || !alignmentArg || !planArg) { console.error('Dùng production: node scripts/build-cue-lock.mjs --script script.lock.json --alignment script-audio-alignment.lock.json --plan video-plan.json --out cue-sheet.lock.json'); process.exit(2); }
  const script = await readJson(resolve(scriptArg)); const alignment = await readJson(resolve(alignmentArg)); const plan = await readJson(resolve(planArg)); const errors=[];
  if (script.kind !== 'approved-script' || script.scriptSha256 !== scriptHash(script)) errors.push('Script lock không hợp lệ.');
  if (alignment.kind !== 'script-audio-alignment' || !alignment.reviewed || alignment.alignmentSha256 !== alignmentHash(alignment)) errors.push('Alignment lock không hợp lệ hoặc chưa reviewed.');
  if (alignment.scriptSha256 !== script.scriptSha256) errors.push('Alignment không trỏ tới script hiện tại.');
  if (!plan.timingSource || plan.timingSource !== 'script-audio-alignment') errors.push('Production plan phải khai timingSource=script-audio-alignment.');
  const mappings = new Map((alignment.mappings ?? []).map((mapping) => [mapping.scriptSegmentId, mapping])); const used = new Set(); const cues=[];
  for (const scene of plan.scenes ?? []) for (const beat of scene.beats ?? []) {
    if (beat.segmentIds?.length) errors.push(`${scene.id}/${beat.id}: production beat không được dùng ASR segmentIds.`);
    const ids = beat.scriptSegmentIds ?? [];
    const selected = ids.map((id) => { const segment = (script.segments ?? []).find((item) => item.id === id); const mapping = mappings.get(id); if (!segment || !mapping) errors.push(`${scene.id}/${beat.id}: script segment hoặc alignment không tồn tại: ${id}`); else used.add(id); return segment && mapping ? {segment, mapping} : null; }).filter(Boolean);
    if (!selected.length) { errors.push(`${scene.id}/${beat.id}: production beat phải có scriptSegmentIds.`); continue; }
    const start=Math.min(...selected.map((item)=>item.mapping.start)); const end=Math.max(...selected.map((item)=>item.mapping.end)); const spokenText=selected.map((item)=>item.segment.text).join(' ').trim();
    if (beat.spokenText && normalizeText(beat.spokenText)!==normalizeText(spokenText)) errors.push(`${scene.id}/${beat.id}: spokenText không khớp approved script.`);
    cues.push({id:beat.cueId,sceneId:scene.id,beatId:beat.id,segmentIds:ids,scriptSegmentIds:ids,start:Number(start.toFixed(3)),end:Number(end.toFixed(3)),visualHit:Number(start.toFixed(3)),readableBy:Number(Math.min(end,start+0.18).toFixed(3)),spokenText,onScreenText:beat.onScreenText??'',action:beat.action,target:beat.target,visualMeaning:beat.visualMeaning});
  }
  for (const segment of script.segments ?? []) if (!used.has(segment.id) && !(plan.voiceOnlySegments ?? []).some((item)=>item.scriptSegmentId===segment.id && item.reason)) errors.push(`Script segment chưa được map hoặc voiceOnly: ${segment.id}`);
  if (new Set(cues.map((cue)=>cue.id)).size!==cues.length) errors.push('cueId phải duy nhất.');
  for (let index=1; index<cues.length; index++) if (cues[index].start<cues[index-1].start) errors.push('Cue phải theo thứ tự audio.');
  if (errors.length) { errors.forEach((error)=>console.error(`FAIL ${error}`)); process.exit(1); }
  const lock={schemaVersion:3,fps:Number(plan.fps??30),audioSha256:alignment.audioSha256,transcriptSha256:alignment.asrTranscriptSha256,scriptSha256:script.scriptSha256,alignmentSha256:alignment.alignmentSha256,durationSeconds:Number(alignment.durationSeconds),maxCueLagSeconds:0.2,maxCumulativeDriftSeconds:0.25,cues,voiceOnlySegments:(plan.voiceOnlySegments??[]).map((item)=>({segmentId:item.scriptSegmentId,reason:item.reason}))};
  lock.cueSheetSha256=cueHash(lock); await writeFile(resolve(value('--out','cue-sheet.lock.json')),`${JSON.stringify(lock,null,2)}\n`,'utf8'); console.log(`PASS Đã khóa ${cues.length} cue từ approved script + alignment.`); process.exit(0);
}
if (positional.length < 2) {
  console.error('Dùng legacy: node scripts/build-cue-lock.mjs transcript.lock.json video-plan.json --out cue-sheet.lock.json');
  process.exit(2);
}
const transcriptPath = resolve(positional[0]);
const planPath = resolve(positional[1]);
const out = resolve(value('--out', 'cue-sheet.lock.json'));
const transcript = await readJson(transcriptPath);
const plan = await readJson(planPath);
const errors = [];
if (transcript.schemaVersion !== 2) errors.push('Transcript phải dùng schemaVersion 2.');
if (transcript.transcriptSha256 !== transcriptHash(transcript)) errors.push('transcriptSha256 không khớp nội dung transcript.');
if (!transcript.reviewed) errors.push('Transcript phải được rà soát và đặt reviewed=true trước khi khóa cue.');
if (![2, 3].includes(plan.schemaVersion)) errors.push('Video plan phải dùng schemaVersion 2 hoặc 3.');
const segments = new Map((transcript.segments ?? []).map((segment) => [segment.id, segment]));
const usedSegments = new Set();
const cues = [];
for (const scene of plan.scenes ?? []) {
  for (const beat of scene.beats ?? []) {
    const selected = (beat.segmentIds ?? []).map((id) => {
      const segment = segments.get(id);
      if (!segment) errors.push(`${scene.id}/${beat.id}: segment không tồn tại: ${id}`);
      else usedSegments.add(id);
      return segment;
    }).filter(Boolean);
    if (!selected.length) continue;
    const start = Math.min(...selected.map((segment) => segment.start));
    const end = Math.max(...selected.map((segment) => segment.end));
    const spokenText = selected.map((segment) => segment.text).join(' ').trim();
    if (beat.spokenText && normalizeText(beat.spokenText) !== normalizeText(spokenText)) errors.push(`${scene.id}/${beat.id}: spokenText không khớp transcript.`);
    cues.push({
      id: beat.cueId,
      sceneId: scene.id,
      beatId: beat.id,
      segmentIds: beat.segmentIds,
      start: Number(start.toFixed(3)),
      end: Number(end.toFixed(3)),
      visualHit: Number(start.toFixed(3)),
      readableBy: Number(Math.min(end, start + 0.18).toFixed(3)),
      spokenText,
      onScreenText: beat.onScreenText ?? '',
      action: beat.action,
      target: beat.target,
      visualMeaning: beat.visualMeaning,
    });
  }
}
const voiceOnly = new Map((plan.voiceOnlySegments ?? []).map((item) => [item.segmentId, item.reason]));
for (const segment of transcript.segments ?? []) {
  if (!usedSegments.has(segment.id) && !voiceOnly.get(segment.id)) errors.push(`Segment chưa được map hoặc đánh dấu voiceOnly: ${segment.id}`);
}
if (new Set(cues.map((cue) => cue.id)).size !== cues.length) errors.push('cueId phải duy nhất.');
for (let index = 1; index < cues.length; index++) if (cues[index].start < cues[index - 1].start) errors.push('Cue phải theo thứ tự thời gian transcript.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
const lock = {
  schemaVersion: 2,
  fps: Number(plan.fps ?? 30),
  audioSha256: transcript.sourceAudio.sha256,
  transcriptSha256: transcript.transcriptSha256,
  durationSeconds: transcript.durationSeconds,
  maxCueLagSeconds: 0.2,
  maxCumulativeDriftSeconds: 0.25,
  cues,
  voiceOnlySegments: [...voiceOnly].map(([segmentId, reason]) => ({segmentId, reason})),
};
lock.cueSheetSha256 = cueHash(lock);
await writeFile(out, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');
console.log(`PASS Đã khóa ${cues.length} cue vào ${out}`);
