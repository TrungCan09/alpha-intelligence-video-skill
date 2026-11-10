#!/usr/bin/env node
import {dirname, resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';

const input = process.argv[2];
if (!input) { console.error('Dùng: node scripts/check-scene-diversity.mjs video-plan.json'); process.exit(2); }
const plan = await readJson(resolve(input));
let cueSheet = null;
try { cueSheet = await readJson(resolve(dirname(resolve(input)), 'cue-sheet.lock.json')); } catch {}
const cueMap = new Map((cueSheet?.cues ?? []).map((cue) => [cue.id, cue]));
const errors = [];
if (plan.schemaVersion !== 2) errors.push('Video plan phải dùng schemaVersion 2.');
const allowed = new Set(['problem-resolve', 'prompt-response', 'focus-transfer-ab', 'progressive-process', 'cause-effect', 'accumulating-checklist', 'verification-mismatch', 'freeze-question', 'next-lesson-outro']);
const counts = new Map();
for (const [index, scene] of (plan.scenes ?? []).entries()) {
  if (!allowed.has(scene.recipe)) errors.push(`${scene.id}: recipe không hợp lệ.`);
  counts.set(scene.recipe, (counts.get(scene.recipe) ?? 0) + 1);
  if ((counts.get(scene.recipe) ?? 0) > 2) errors.push(`${scene.id}: recipe ${scene.recipe} xuất hiện quá hai lần.`);
  if (!scene.startCueId || !scene.endCueId) errors.push(`${scene.id}: thiếu startCueId/endCueId.`);
  if (!scene.motionConcept || !scene.layoutFamily) errors.push(`${scene.id}: thiếu motionConcept/layoutFamily.`);
  if (!(scene.beats?.length)) errors.push(`${scene.id}: thiếu beats.`);
  const previous = plan.scenes[index - 1];
  if (previous?.recipe === scene.recipe) errors.push(`${scene.id}: lặp recipe của scene liền trước.`);
  if (previous && previous.layoutFamily === scene.layoutFamily && previous.motionConcept === scene.motionConcept) errors.push(`${scene.id}: lặp cả layoutFamily và motionConcept.`);
  for (const beat of scene.beats ?? []) {
    if (!beat.cueId || !beat.segmentIds?.length || !beat.action || !beat.target || !beat.visualMeaning) errors.push(`${scene.id}/${beat.id}: beat thiếu cueId, segmentIds, action, target hoặc visualMeaning.`);
  }
  if (cueSheet) {
    const start = cueMap.get(scene.startCueId)?.start;
    const end = cueMap.get(scene.endCueId)?.end;
    if (Number.isFinite(start) && Number.isFinite(end) && end - start > 4) {
      if ((scene.beats?.length ?? 0) < 2 && !scene.holdReason) errors.push(`${scene.id}: scene dài hơn 4 giây cần ít nhất hai semantic state changes hoặc holdReason.`);
      const beatTimes = (scene.beats ?? []).map((beat) => cueMap.get(beat.cueId)?.start).filter(Number.isFinite).sort((a, b) => a - b);
      const boundaries = [start, ...beatTimes, end];
      for (let position = 1; position < boundaries.length; position++) if (boundaries[position] - boundaries[position - 1] > 3 && !scene.holdReason) errors.push(`${scene.id}: khoảng semantic change vượt 3 giây.`);
    }
  }
}
if (!(plan.scenes?.length)) errors.push('Video plan không có scene.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Scene diversity hợp lệ: ${plan.scenes.length} scene, ${counts.size} recipe.`);
