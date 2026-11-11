#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson, sha256File} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const reportArg = args[0]; const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const videoArg = value('--video'); const planArg = value('--plan'); const packArg = value('--pack-index'); const configArg = value('--config', resolve(import.meta.dirname,'..','visual-review.config.json'));
const referenceReviewArg = value('--reference-review'); const referenceLibraryArg = value('--reference-library');
if (!reportArg || !videoArg || !planArg || !packArg) { console.error('Dùng: node scripts/check-visual-review.mjs report.json --video candidate.mp4 --plan video-plan.v3.json --pack-index visual-review/index.json'); process.exit(2); }
const report = await readJson(resolve(reportArg)); const plan = await readJson(resolve(planArg)); const pack = await readJson(resolve(packArg)); const config = await readJson(resolve(configArg)); const errors = [];
if (Boolean(referenceReviewArg) !== Boolean(referenceLibraryArg)) errors.push('Phải truyền đồng thời --reference-review và --reference-library.');
const referenceReview = referenceReviewArg ? await readJson(resolve(referenceReviewArg)) : null; const referenceLibrary = referenceLibraryArg ? await readJson(resolve(referenceLibraryArg)) : null; const referenceRows = new Map((referenceReview?.scenes ?? []).map((row) => [row.sceneId,row])); const knownShots = new Set((referenceLibrary?.lessons ?? []).flatMap((lesson) => (lesson.shots ?? []).map((shot) => shot.id)));
if (report.schemaVersion !== 1) errors.push('Visual review report phải dùng schemaVersion 1.');
const videoSha256 = await sha256File(resolve(videoArg));
if (report.videoSha256 !== videoSha256 || pack.videoSha256 !== videoSha256) errors.push('Visual review không khớp candidate video.');
if (report.frameAuditSha256 !== pack.frameAuditSha256) errors.push('Visual review không khớp frame audit.');
if (!Number.isInteger(report.iteration) || report.iteration < 1 || report.iteration > config.maximumIterations) errors.push(`Iteration phải nằm trong 1–${config.maximumIterations}.`);
if (!report.reviewer || !report.reviewedAt) errors.push('Thiếu reviewer hoặc reviewedAt.');
if (report.playback1x !== true || report.playback05x !== true) errors.push('Phải xác nhận playback 1× và 0,5×.');
const knownFrames = new Set((pack.frames ?? []).map((frame) => frame.id)); const rows = new Map((report.scenes ?? []).map((scene) => [scene.sceneId, scene])); let allPass = true;
for (const scene of plan.scenes ?? []) {
  const row = rows.get(scene.id); if (!row) { errors.push(`Thiếu review scene ${scene.id}.`); allPass = false; continue; }
  let weighted = 0;
  for (const [dimension, weight] of Object.entries(config.weights)) { const score = row.scores?.[dimension]; if (!Number.isFinite(score) || score < 0 || score > 10 || Math.round(score * 2) !== score * 2) errors.push(`${scene.id}: ${dimension} phải là điểm 0–10 theo bước 0,5.`); else weighted += score * weight; }
  weighted = Number(weighted.toFixed(2)); if (row.weightedScore !== weighted) errors.push(`${scene.id}: weightedScore phải bằng ${weighted}.`);
  if (weighted < config.minimumSceneScore) allPass = false;
  for (const dimension of config.criticalDimensions) if ((row.scores?.[dimension] ?? -1) < config.minimumCriticalScore) allPass = false;
  if (!Array.isArray(row.evidenceFrameIds) || row.evidenceFrameIds.length < 2) errors.push(`${scene.id}: cần ít nhất hai frame evidence.`);
  for (const id of row.evidenceFrameIds ?? []) if (!knownFrames.has(id)) errors.push(`${scene.id}: frame evidence không tồn tại ${id}.`);
  if (!Array.isArray(row.strengths) || !row.strengths.length || !Array.isArray(row.risks) || !row.risks.length) errors.push(`${scene.id}: phải có strength và risk cụ thể.`);
  if (referenceReview) { const comparison = row.referenceComparison; const expected = referenceRows.get(scene.id)?.referenceShotIds ?? []; if (!comparison || !Array.isArray(comparison.shotIds) || !comparison.shotIds.length) errors.push(`${scene.id}: thiếu referenceComparison.`); else { for (const id of comparison.shotIds) if (!knownShots.has(id) || !expected.includes(id)) errors.push(`${scene.id}: comparison dùng shot không nằm trong reference lock ${id}.`); if (!comparison.qualitiesMatched?.length || !comparison.intentionalDifferences?.length) errors.push(`${scene.id}: comparison thiếu quality/difference cụ thể.`); if (!['low','medium','high'].includes(comparison.copyRisk)) errors.push(`${scene.id}: copyRisk không hợp lệ.`); if (!['below','comparable','above'].includes(comparison.executionVerdict)) errors.push(`${scene.id}: executionVerdict không hợp lệ.`); if (comparison.copyRisk === 'high' || comparison.executionVerdict === 'below') allPass = false; } }
  for (const finding of row.findings ?? []) { if (!config.weights[finding.dimension]) errors.push(`${scene.id}: finding dimension không hợp lệ.`); if (!finding.diagnosis || !finding.remediation || !(finding.frameIds?.length) || !(finding.lessonIds?.length)) errors.push(`${scene.id}: finding thiếu evidence, lesson ID, diagnosis hoặc remediation.`); for (const id of finding.frameIds ?? []) if (!knownFrames.has(id)) errors.push(`${scene.id}: finding frame không tồn tại ${id}.`); }
}
const expectedDecision = allPass ? 'pass' : report.iteration >= config.maximumIterations ? 'blocked' : 'revise';
if (report.decision !== expectedDecision) errors.push(`Decision phải là ${expectedDecision}.`);
if (args.includes('--require-pass') && report.decision !== 'pass') errors.push('Master gate yêu cầu visual review decision=pass.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Visual review iteration ${report.iteration}: ${report.decision}, ${plan.scenes.length} scene.`);
