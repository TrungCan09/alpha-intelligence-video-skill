#!/usr/bin/env node
import {mkdir, mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {basename, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {readJson, sha256File, sha256Value} from './lib/lock-utils.mjs';
import {resolveMediaTool, run} from './lib/media-tools.mjs';
import {decodePng} from './lib/png.mjs';

const args = process.argv.slice(2);
const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const videoArg = args.find((arg) => !arg.startsWith('--'));
const cueArg = value('--cue-lock'); const planArg = value('--plan'); const outArg = value('--out', 'visual-review'); const configArg = value('--config', 'visual-review.config.json');
if (!videoArg || !cueArg || !planArg) { console.error('Dùng: node scripts/build-visual-review-pack.mjs candidate.mp4 --cue-lock cue-sheet.lock.json --plan video-plan.v3.json --out visual-review/iteration-1'); process.exit(2); }

const video = resolve(videoArg); const lock = await readJson(resolve(cueArg)); const plan = await readJson(resolve(planArg)); const config = await readJson(resolve(configArg)); const out = resolve(outArg);
const fps = Number(lock.fps ?? config.frameAuditFps); const duration = Number(lock.durationSeconds); const width = 64; const height = 114; const pixelsPerFrame = width * height;
await mkdir(resolve(out, 'frames'), {recursive: true}); await mkdir(resolve(out, 'sheets'), {recursive: true});
const ffmpeg = await resolveMediaTool('ffmpeg');
const auditTemp = await mkdtemp(resolve(tmpdir(), 'alpha-frame-audit-')); const metrics = []; let previous; let frameCount = 0; const expectedFrames = Math.round(duration * fps);
try {
  const extracted = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', video, '-vf', `scale=${width}:${height}:flags=fast_bilinear`, '-c:v', 'png', '-vsync', '0', resolve(auditTemp, '%06d.png'), '-y'], {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024});
  if (extracted.error || extracted.status !== 0) throw new Error(extracted.stderr || extracted.error?.message || 'Không trích được frame audit.');
  const files = (await readdir(auditTemp)).filter((file) => file.endsWith('.png')).sort(); frameCount = files.length;
  if (Math.abs(frameCount - expectedFrames) > 1) throw new Error(`Frame count ${frameCount} không khớp ${expectedFrames}.`);
  for (let frame = 0; frame < files.length; frame++) {
    const decoded = decodePng(await readFile(resolve(auditTemp, files[frame]))); const current = Buffer.alloc(pixelsPerFrame); let sum = 0; let square = 0; let delta = 0;
    for (let i = 0; i < pixelsPerFrame; i++) { const offset = i * 4; const px = Math.round(decoded.rgba[offset] * 0.2126 + decoded.rgba[offset + 1] * 0.7152 + decoded.rgba[offset + 2] * 0.0722); current[i] = px; sum += px; square += px * px; if (previous) delta += Math.abs(px - previous[i]); }
    const luma = sum / current.length; const variance = square / current.length - luma * luma; const meanDelta = previous ? delta / current.length : 0; const flags = [];
    if (luma <= config.frameAudit.nearBlankLuma && variance <= config.frameAudit.nearBlankVariance) flags.push('near-blank'); if (meanDelta >= config.frameAudit.highDelta) flags.push('high-delta');
    metrics.push({frame, time: Number((frame / fps).toFixed(3)), luma: Number(luma.toFixed(3)), variance: Number(variance.toFixed(3)), delta: Number(meanDelta.toFixed(3)), flags}); previous = current;
  }
} finally { await rm(auditTemp, {recursive: true, force: true}); }
let holdStart = null; const holds = [];
for (let i = 1; i < metrics.length; i++) {
  if (metrics[i].delta <= config.frameAudit.lowMotionDelta) { if (holdStart == null) holdStart = i - 1; }
  else if (holdStart != null) { if (i - holdStart >= config.frameAudit.longHoldFrames) holds.push({startFrame: holdStart, endFrame: i - 1}); holdStart = null; }
}
if (holdStart != null && metrics.length - holdStart >= config.frameAudit.longHoldFrames) holds.push({startFrame: holdStart, endFrame: metrics.length - 1});
for (const hold of holds) { metrics[hold.startFrame].flags.push('long-hold-start'); metrics[hold.endFrame].flags.push('long-hold-end'); }
for (let i = 2; i < metrics.length - 1; i++) if (metrics[i].delta > 12 && metrics[i - 1].delta < 2 && metrics[i + 1].delta < 2) metrics[i].flags.push('single-frame-flicker');

const cueMap = new Map((lock.cues ?? []).map((cue) => [cue.id, cue])); const sceneRanges = plan.scenes.map((scene) => ({sceneId: scene.id, start: cueMap.get(scene.startCueId)?.start ?? 0, end: cueMap.get(scene.endCueId)?.end ?? duration}));
const selected = new Map(); const add = (time, reason, sceneId) => { const clamped = Math.max(0, Math.min(duration - 1 / fps, time)); const frame = Math.round(clamped * fps); const key = `${sceneId}:${frame}`; const prior = selected.get(key); selected.set(key, {id: `f${String(frame).padStart(6, '0')}`, frame, time: Number((frame / fps).toFixed(3)), sceneId, reasons: [...new Set([...(prior?.reasons ?? []), reason])]}); };
for (const range of sceneRanges) { const span = Math.max(0, range.end - range.start); for (const ratio of [0.03, 0.25, 0.5, 0.75, 0.97]) add(range.start + span * ratio, `scene-${ratio}`, range.sceneId); }
for (const cue of lock.cues ?? []) { const range = sceneRanges.find((item) => cue.start >= item.start - 0.001 && cue.start <= item.end + 0.001); if (!range) continue; for (const [label, time] of [['before-cue', cue.start - 0.1], ['cue', cue.start], ['readable', cue.start + 0.2], ['cue-mid', (cue.start + cue.end) / 2]]) add(time, `${cue.id}:${label}`, range.sceneId); }
for (const metric of metrics.filter((item) => item.flags.length)) { const range = sceneRanges.find((item) => metric.time >= item.start && metric.time <= item.end + 0.001); if (range) add(metric.time, metric.flags.join(','), range.sceneId); }

const frames = [];
for (const range of sceneRanges) {
  const sceneFrames = [...selected.values()].filter((item) => item.sceneId === range.sceneId).sort((a, b) => a.frame - b.frame).slice(0, config.maxAiFramesPerScene);
  for (const item of sceneFrames) { const fileName = `frames/${range.sceneId}-${item.id}.png`; run(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', item.time.toFixed(3), '-i', video, '-vf', 'scale=360:640:flags=lanczos', '-frames:v', '1', resolve(out, fileName)]); frames.push({...item, fileName}); }
  for (let offset = 0; offset < sceneFrames.length; offset += config.framesPerContactSheet) { const chunk = sceneFrames.slice(offset, offset + config.framesPerContactSheet); if (!chunk.length) continue; const sheet = `sheets/${range.sceneId}-${Math.floor(offset / config.framesPerContactSheet) + 1}.png`; const result = spawnSync(process.execPath, [resolve(import.meta.dirname, 'build-contact-sheet.mjs'), video, '--times', chunk.map((item) => item.time).join(','), '--out', resolve(out, sheet)], {encoding: 'utf8'}); if (result.status !== 0) throw new Error(result.stderr || result.stdout); }
}
const frameAudit = {schemaVersion: 1, fps, durationSeconds: duration, frameCount, expectedFrames, holds, perFrame: metrics};
await writeFile(resolve(out, 'frame-audit.json'), `${JSON.stringify(frameAudit, null, 2)}\n`);
const index = {schemaVersion: 1, sourceVideo: basename(video), videoSha256: await sha256File(video), frameAuditSha256: sha256Value(frameAudit), planSchemaVersion: plan.schemaVersion, sceneIds: sceneRanges.map((item) => item.sceneId), frames, sheets: sceneRanges.flatMap((range) => frames.some((frame) => frame.sceneId === range.sceneId) ? Array.from({length: Math.ceil(frames.filter((frame) => frame.sceneId === range.sceneId).length / config.framesPerContactSheet)}, (_, index) => `sheets/${range.sceneId}-${index + 1}.png`) : [])};
await writeFile(resolve(out, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
await writeFile(resolve(out, 'review-template.json'), `${JSON.stringify({schemaVersion: 1, videoSha256: index.videoSha256, frameAuditSha256: index.frameAuditSha256, iteration: 1, reviewer: '', reviewedAt: '', playback1x: null, playback05x: null, decision: 'revise', scenes: sceneRanges.map((scene) => ({sceneId: scene.sceneId, scores: Object.fromEntries(Object.keys(config.weights).map((key) => [key, null])), weightedScore: null, evidenceFrameIds: [], strengths: [], risks: [], findings: []}))}, null, 2)}\n`);
console.log(`PASS Visual review pack: ${frameCount} frame được audit, ${frames.length} frame dành cho AI tại ${out}`);
