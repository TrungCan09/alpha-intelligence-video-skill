#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';
import {findConcept, RENDER_MODES} from './lib/v3-utils.mjs';

const planArg = process.argv[2]; const conceptsArg = process.argv[3]; const cueArg = process.argv[4];
if (!planArg || !conceptsArg || !cueArg) { console.error('Dùng: node scripts/check-v3-plan.mjs video-plan.v3.json concept-candidates.json cue-sheet.lock.json'); process.exit(2); }
const plan = await readJson(resolve(planArg)); const concepts = await readJson(resolve(conceptsArg)); const cueLock = await readJson(resolve(cueArg)); const cueIds = new Set((cueLock.cues ?? []).map((cue) => cue.id)); const errors = [];
if (plan.schemaVersion !== 3) errors.push('Video plan phải dùng schemaVersion 3.');
const productionTiming = plan.timingSource === 'script-audio-alignment';
for (const scene of plan.scenes ?? []) {
  if (!RENDER_MODES.includes(scene.renderMode)) errors.push(`${scene.id}: renderMode không hợp lệ.`);
  if (!findConcept(concepts, scene.id, scene.conceptId)) errors.push(`${scene.id}: conceptId không tồn tại trong exploration file.`);
  if (!cueIds.has(scene.startCueId) || !cueIds.has(scene.endCueId)) errors.push(`${scene.id}: cue boundary không tồn tại.`);
  if (!scene.layout?.family || !scene.layout?.opticalBalance || !scene.beats?.length) errors.push(`${scene.id}: thiếu layout hoặc beats.`);
  if (scene.renderMode === 'graph' && (!scene.motionGraph || scene.customComponentId || scene.legacyRecipe)) errors.push(`${scene.id}: graph mode có payload sai.`);
  if (scene.renderMode === 'custom' && (!scene.customComponentId || scene.motionGraph || scene.legacyRecipe)) errors.push(`${scene.id}: custom mode có payload sai.`);
  if (scene.renderMode === 'legacy' && (!scene.legacyRecipe || !scene.fallbackReason || scene.motionGraph || scene.customComponentId)) errors.push(`${scene.id}: legacy mode phải có recipe + fallbackReason và không có payload khác.`);
  for (const beat of scene.beats ?? []) {
    const sourceIds = productionTiming ? beat.scriptSegmentIds : beat.segmentIds;
    if (!cueIds.has(beat.cueId) || !sourceIds?.length || !beat.action || !beat.target || !beat.visualMeaning) errors.push(`${scene.id}/${beat.id}: beat thiếu cue/source/action/target/visualMeaning.`);
    if (productionTiming && beat.segmentIds?.length) errors.push(`${scene.id}/${beat.id}: production plan không được dùng ASR segmentIds.`);
  }
}
if (!(plan.scenes?.length)) errors.push('Video plan v3 không có scene.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Video plan v3: ${plan.scenes.length} scene.`);
