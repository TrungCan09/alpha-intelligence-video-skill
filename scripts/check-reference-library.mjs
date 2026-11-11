#!/usr/bin/env node
import {stat} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {readJson, sha256File, sha256Value} from './lib/lock-utils.mjs';
import {resolveMediaTool, run} from './lib/media-tools.mjs';

const args = process.argv.slice(2); const input = args[0]; const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; }; const configArg = value('--config', resolve(import.meta.dirname,'..','production-reference.config.json'));
if (!input) { console.error('Dùng: node scripts/check-reference-library.mjs knowledge/reference-library.json'); process.exit(2); }
const path = resolve(input); const library = await readJson(path); const config = await readJson(resolve(configArg)); const errors = []; const ids = new Set(); let total = 0;
const skipMediaProbe = args.includes('--skip-media-probe'); const ffprobe = skipMediaProbe ? null : await resolveMediaTool('ffprobe');
if (library.librarySha256 !== sha256Value({schemaVersion: library.schemaVersion, lessons: library.lessons})) errors.push('librarySha256 không hợp lệ.');
const lessons = new Map((library.lessons ?? []).map((lesson) => [lesson.lessonId, lesson]));
for (const id of config.lessonIds) if (!lessons.has(id)) errors.push(`Thiếu ${id}.`);
for (const lesson of library.lessons ?? []) {
  if (!config.lessonIds.includes(lesson.lessonId)) errors.push(`lessonId không hợp lệ: ${lesson.lessonId}.`);
  const video = resolve(dirname(path), lesson.videoFile); try { const info = await stat(video); total += info.size; if (info.size > config.maxVideoBytes) errors.push(`${lesson.lessonId}: video vượt 20 MiB.`); if (await sha256File(video) !== lesson.videoSha256) errors.push(`${lesson.lessonId}: videoSha256 không khớp.`); if (ffprobe) { const media = JSON.parse(run(ffprobe,['-v','error','-show_streams','-show_format','-of','json',video]).stdout); const v = media.streams?.find((stream) => stream.codec_type === 'video'); const a = media.streams?.find((stream) => stream.codec_type === 'audio'); const [fpsNum,fpsDen] = String(v?.avg_frame_rate ?? '0/1').split('/').map(Number); const fps=fpsNum/fpsDen; if (v?.codec_name !== 'h264' || Number(v?.width) !== config.width || Number(v?.height) !== config.height || !Number.isFinite(fps) || Math.abs(fps-config.fps) > 0.01 || !a || a.codec_name !== 'aac') errors.push(`${lesson.lessonId}: media phải H.264/AAC ${config.width}×${config.height}/${config.fps}fps.`); } } catch (error) { errors.push(`${lesson.lessonId}: media không hợp lệ (${error.message}).`); }
  for (const shot of lesson.shots ?? []) { const label = `${lesson.lessonId}/${shot.id}`; if (ids.has(shot.id)) errors.push(`Shot ID trùng: ${shot.id}.`); ids.add(shot.id); if (shot.lessonId !== lesson.lessonId) errors.push(`${label}: lessonId sai.`); if (!(shot.start >= 0 && shot.end > shot.start && shot.end - shot.start >= 2 && shot.end - shot.start <= 8.001 && shot.end <= lesson.durationSeconds + 0.05)) errors.push(`${label}: thời lượng phải 2–8 giây và nằm trong video.`); for (const field of ['spokenMeaning','semanticFunction','layoutFamily','cameraPattern','motionFingerprint']) if (!String(shot[field] ?? '').trim()) errors.push(`${label}: thiếu ${field}.`); for (const field of ['motionVerbs','elementKinds','usefulFor','avoidWhen','qualityNotes','sourceCueIds']) if (!Array.isArray(shot[field]) || !shot[field].length) errors.push(`${label}: ${field} phải là mảng không rỗng.`); if (JSON.stringify(shot).includes('REVIEW_REQUIRED')) errors.push(`${label}: còn placeholder REVIEW_REQUIRED.`); }
}
if (total > config.maxTotalBytes) errors.push('Tổng production references vượt 60 MiB.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); } console.log(`PASS Production reference library: ${lessons.size} bài, ${ids.size} shot, ${(total / 1048576).toFixed(1)} MiB.`);
