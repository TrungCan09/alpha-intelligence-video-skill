#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';
import {ELEMENT_KINDS, hasNumericTimingKey, LAYOUTS, OPERATORS} from './lib/v3-utils.mjs';

const planArg = process.argv[2]; const cueArg = process.argv[3];
if (!planArg || !cueArg) { console.error('Dùng: node scripts/check-motion-graph.mjs video-plan.v3.json cue-sheet.lock.json'); process.exit(2); }
const plan = await readJson(resolve(planArg)); const cueLock = await readJson(resolve(cueArg)); const cueIds = new Set((cueLock.cues ?? []).map((cue) => cue.id)); const errors = [];
if (plan.schemaVersion !== 3) errors.push('Motion graph chỉ nhận video plan schemaVersion 3.');
if (hasNumericTimingKey(plan)) errors.push('Video plan v3 chứa timing số; mọi transition phải tham chiếu cueId.');
for (const scene of plan.scenes ?? []) {
  if (!LAYOUTS.includes(scene.layout?.family)) errors.push(`${scene.id}: layout family không hợp lệ.`);
  if (!cueIds.has(scene.startCueId) || !cueIds.has(scene.endCueId)) errors.push(`${scene.id}: start/end cue không tồn tại.`);
  if (scene.renderMode !== 'graph') continue;
  if (!scene.motionGraph) { errors.push(`${scene.id}: graph scene thiếu motionGraph.`); continue; }
  const elements = new Map();
  for (const element of scene.motionGraph.elements ?? []) {
    if (!element.id || elements.has(element.id)) errors.push(`${scene.id}: element id thiếu hoặc trùng ${element.id}.`); else elements.set(element.id, element);
    if (!ELEMENT_KINDS.includes(element.kind)) errors.push(`${scene.id}/${element.id}: element kind không hợp lệ.`);
    if (element.kind === 'connector' && (!element.sourceId || !element.targetId || !element.sourceAnchor || !element.targetAnchor)) errors.push(`${scene.id}/${element.id}: connector thiếu source/target/anchor.`);
  }
  for (const operation of scene.motionGraph.operations ?? []) {
    if (!OPERATORS.includes(operation.operator)) errors.push(`${scene.id}/${operation.id}: operator không hợp lệ.`);
    if (!cueIds.has(operation.cueId)) errors.push(`${scene.id}/${operation.id}: cue không tồn tại.`);
    if (!operation.visualMeaning || !operation.targetIds?.length) errors.push(`${scene.id}/${operation.id}: thiếu visualMeaning hoặc targetIds.`);
    for (const target of operation.targetIds ?? []) if (!elements.has(target)) errors.push(`${scene.id}/${operation.id}: target không tồn tại ${target}.`);
  }
  for (const element of elements.values()) if (element.kind === 'connector' && (!elements.has(element.sourceId) || !elements.has(element.targetId))) errors.push(`${scene.id}/${element.id}: connector tham chiếu element không tồn tại.`);
  if (!(scene.motionGraph.operations?.length)) errors.push(`${scene.id}: motionGraph không có operation.`);
}
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Motion graph hợp lệ cho ${(plan.scenes ?? []).filter((scene) => scene.renderMode === 'graph').length} scene.`);
