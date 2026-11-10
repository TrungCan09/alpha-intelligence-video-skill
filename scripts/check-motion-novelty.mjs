#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';
import {conceptFingerprint, findConcept, similarity} from './lib/v3-utils.mjs';

const planArg = process.argv[2]; const conceptsArg = process.argv[3];
if (!planArg || !conceptsArg) { console.error('Dùng: node scripts/check-motion-novelty.mjs video-plan.v3.json concept-candidates.json'); process.exit(2); }
const plan = await readJson(resolve(planArg)); const concepts = await readJson(resolve(conceptsArg)); const errors = []; const layouts = [];
const fingerprints = (plan.scenes ?? []).map((scene) => {
  const concept = findConcept(concepts, scene.id, scene.conceptId);
  if (!concept) { errors.push(`${scene.id}: concept không tồn tại.`); return new Set(); }
  layouts.push(scene.layout?.family);
  return conceptFingerprint(concept, scene);
});
for (let index = 1; index < fingerprints.length; index++) {
  const score = similarity(fingerprints[index - 1], fingerprints[index]);
  if (score === 1) errors.push(`${plan.scenes[index].id}: fingerprint trùng scene liền trước.`);
  if (score > 0.75 && !plan.scenes[index].similarityReason) errors.push(`${plan.scenes[index].id}: similarity ${score.toFixed(2)} vượt 0,75 mà không có similarityReason.`);
  if (index >= 2 && layouts[index] === layouts[index - 1] && layouts[index] === layouts[index - 2]) errors.push(`${plan.scenes[index].id}: layout family lặp quá hai scene liên tiếp.`);
}
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Motion novelty: ${fingerprints.length} fingerprint khác biệt hợp lệ.`);
