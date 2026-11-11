#!/usr/bin/env node
import {mkdir, readdir, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve} from 'node:path';
import {readJson, sha256File, sha256Value} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const rootArg = args[0]; const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; }; const outArg = value('--out');
if (!rootArg || !outArg) { console.error('Dùng: node scripts/build-reference-library.mjs assets/reference/production --out knowledge/reference-library.json'); process.exit(2); }
const root = resolve(rootArg); const out = resolve(outArg); const lessons = [];
for (const lessonId of (await readdir(root, {withFileTypes: true})).filter((item) => item.isDirectory()).map((item) => item.name).sort()) {
  const folder = join(root, lessonId); const manifest = await readJson(join(folder, 'manifest.json')); const shotIndex = await readJson(join(folder, 'shot-index.json')); const transcript = await readJson(join(folder, 'transcript.lock.json')); const video = join(folder, 'video.mp4');
  if (manifest.lessonId !== lessonId || shotIndex.lessonId !== lessonId) throw new Error(`${lessonId}: lessonId không đồng nhất.`);
  if (manifest.publishConsent !== true || manifest.masterApproved !== true || manifest.transcriptReviewed !== true || manifest.shotIndexReviewed !== true) throw new Error(`${lessonId}: manifest chưa xác nhận consent/master/transcript/shot index.`);
  if (shotIndex.reviewed !== true || transcript.reviewed !== true) throw new Error(`${lessonId}: transcript và shot index phải được review.`);
  if (Math.abs(Number(transcript.durationSeconds)-Number(manifest.durationSeconds))>0.2) throw new Error(`${lessonId}: transcript lệch duration master quá 0,2 giây.`);
  const segments=new Map((transcript.segments??[]).map((segment)=>[segment.id,segment]));
  for(const shot of shotIndex.shots??[]){const selected=(shot.sourceCueIds??[]).map((id)=>segments.get(id));if(selected.some((segment)=>!segment))throw new Error(`${lessonId}/${shot.id}: sourceCueIds không tồn tại trong transcript.`);const start=Math.min(...selected.map((segment)=>segment.start));const end=Math.max(...selected.map((segment)=>segment.end));if(Math.abs(start-shot.start)>0.2||Math.abs(end-shot.end)>0.2)throw new Error(`${lessonId}/${shot.id}: shot boundary lệch semantic cue quá 0,2 giây.`);}
  const videoSha256 = await sha256File(video); if (manifest.normalizedSha256 !== videoSha256) throw new Error(`${lessonId}: hash video không khớp manifest.`);
  lessons.push({lessonId, videoFile: relative(dirname(out), video).replaceAll('\\', '/'), videoSha256, durationSeconds: manifest.durationSeconds, shots: shotIndex.shots});
}
const payload = {schemaVersion: 1, generatedAt: new Date().toISOString(), lessons}; payload.librarySha256 = sha256Value({schemaVersion: payload.schemaVersion, lessons});
await mkdir(dirname(out), {recursive:true});
await writeFile(out, `${JSON.stringify(payload, null, 2)}\n`); console.log(`PASS Reference library: ${lessons.length} bài, ${lessons.reduce((sum, item) => sum + item.shots.length, 0)} shot.`);
