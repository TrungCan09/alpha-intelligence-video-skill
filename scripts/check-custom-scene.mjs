#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';

const planArg = process.argv[2]; const projectArg = process.argv[3];
if (!planArg || !projectArg) { console.error('Dùng: node scripts/check-custom-scene.mjs video-plan.v3.json assets/remotion-starter'); process.exit(2); }
const plan = await readJson(resolve(planArg)); const project = resolve(projectArg); const manifest = await readJson(join(project, 'src/custom-scene-manifests.json')); const source = await readFile(join(project, 'src/custom-scenes.tsx'), 'utf8'); const errors = [];
const manifests = new Map((manifest.components ?? []).map((item) => [item.id, item]));
for (const scene of (plan.scenes ?? []).filter((item) => item.renderMode === 'custom')) {
  if (!scene.customComponentId) { errors.push(`${scene.id}: custom scene thiếu customComponentId.`); continue; }
  const item = manifests.get(scene.customComponentId);
  if (!item) errors.push(`${scene.id}: customComponentId chưa có manifest.`);
  else {
    if (!item.motionFingerprint?.layoutFamily || !item.motionFingerprint?.operatorSequence?.length || !item.motionFingerprint?.elementKinds?.length || !item.motionFingerprint?.cameraPattern) errors.push(`${scene.id}: manifest thiếu motion fingerprint.`);
    if (!item.elementRelationships?.length || !item.graphInsufficientReason || item.semanticModePreservesMeaning !== true) errors.push(`${scene.id}: manifest thiếu relationship, graph reason hoặc semantic guarantee.`);
  }
  if (!source.includes(`'${scene.customComponentId}'`)) errors.push(`${scene.id}: component chưa đăng ký trong custom registry.`);
}
for (const token of ['cueStart(', 'cueEnd(', 'useCueProgress(', 'ALPHA_THEME']) if (!source.includes(token)) errors.push(`Custom scene source thiếu ${token}`);
if (/#[0-9a-f]{6}/i.test(source)) errors.push('Custom scene có màu hex inline.');
const magic = /frameAt\(\s*\d|interpolate\(\s*frame\s*,\s*\[\s*\d|<Sequence[^>]*from=\{\s*\d/;
if (magic.test(source)) errors.push('Custom scene có magic timing.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Custom scene: ${(plan.scenes ?? []).filter((scene) => scene.renderMode === 'custom').length} component có manifest và cue binding.`);
