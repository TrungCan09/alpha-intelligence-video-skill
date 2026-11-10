#!/usr/bin/env node
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = resolve(process.argv[2] ?? '.'); const temp = await mkdtemp(join(tmpdir(), 'alpha-v3-tests-'));
const load = async (path) => JSON.parse(await readFile(path, 'utf8')); const save = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
const run = (script, args, shouldPass, label) => { const result = spawnSync(process.execPath, [resolve(root, 'scripts', script), ...args], {encoding: 'utf8'}); if ((result.status === 0) !== shouldPass) throw new Error(`${label}: trạng thái không đúng.\n${result.stdout}\n${result.stderr}`); };
try {
  const src = resolve(root, 'assets/remotion-starter/src'); const conceptsPath = resolve(src, 'concept-candidates.json'); const planPath = resolve(src, 'video-plan.v3.json'); const cuePath = resolve(src, 'cue-sheet.lock.json');
  run('check-concept-exploration.mjs', [conceptsPath], true, 'concept hợp lệ');
  run('check-reference-order.mjs', [conceptsPath, planPath], true, 'reference order hợp lệ');
  run('check-motion-graph.mjs', [planPath, cuePath], true, 'motion graph hợp lệ');
  run('check-motion-novelty.mjs', [planPath, conceptsPath], true, 'novelty hợp lệ');
  run('check-custom-scene.mjs', [planPath, resolve(root, 'assets/remotion-starter')], true, 'custom scene hợp lệ');
  run('check-v3-plan.mjs', [planPath, conceptsPath, cuePath], true, 'plan v3 hợp lệ');

  const concepts = await load(conceptsPath); const badConcepts = structuredClone(concepts); badConcepts.sceneConceptSets[0].candidates[1].approach = 'direct'; const badConceptPath = join(temp, 'bad-concepts.json'); await save(badConceptPath, badConcepts); run('check-concept-exploration.mjs', [badConceptPath], false, 'approach trùng');
  const earlyReference = structuredClone(concepts); earlyReference.referenceReviewedAt = earlyReference.draftLockedAt; const earlyPath = join(temp, 'early-reference.json'); await save(earlyPath, earlyReference); run('check-reference-order.mjs', [earlyPath], false, 'reference xem trước ideation');

  const plan = await load(planPath); const magicPlan = structuredClone(plan); magicPlan.scenes[0].motionGraph.operations[0].delayFrames = 4; const magicPath = join(temp, 'magic-plan.json'); await save(magicPath, magicPlan); run('check-motion-graph.mjs', [magicPath, cuePath], false, 'magic timing');
  const badCustom = structuredClone(plan); badCustom.scenes[2].customComponentId = 'missing-custom'; const customPath = join(temp, 'bad-custom.json'); await save(customPath, badCustom); run('check-custom-scene.mjs', [customPath, resolve(root, 'assets/remotion-starter')], false, 'custom chưa đăng ký');
  const badMode = structuredClone(plan); badMode.scenes[0].customComponentId = 'thinking-threshold'; const modePath = join(temp, 'bad-mode.json'); await save(modePath, badMode); run('check-v3-plan.mjs', [modePath, conceptsPath, cuePath], false, 'graph payload lẫn custom');

  const duplicateConcepts = structuredClone(concepts); const sourceConcept = duplicateConcepts.sceneConceptSets[0].candidates.find((item) => item.id === duplicateConcepts.sceneConceptSets[0].selectedConceptId); const targetSet = duplicateConcepts.sceneConceptSets[1]; const targetConcept = targetSet.candidates.find((item) => item.id === targetSet.selectedConceptId); Object.assign(targetConcept, {motionVerbs: sourceConcept.motionVerbs, layoutFamily: sourceConcept.layoutFamily, primitiveFamilies: sourceConcept.primitiveFamilies}); const duplicatePath = join(temp, 'duplicate-novelty.json'); await save(duplicatePath, duplicateConcepts); const duplicatePlan = structuredClone(plan); duplicatePlan.scenes[1].motionGraph.cameraPattern = duplicatePlan.scenes[0].motionGraph.cameraPattern; const duplicatePlanPath = join(temp, 'duplicate-plan.json'); await save(duplicatePlanPath, duplicatePlan); run('check-motion-novelty.mjs', [duplicatePlanPath, duplicatePath], false, 'fingerprint lặp');

  const migrated = join(temp, 'migrated.json'); run('migrate-plan-v2-to-v3.mjs', [resolve(src, 'video-plan.json'), '--out', migrated, '--locked-at', '2026-01-01T00:00:00.000Z'], true, 'migration v2'); const migratedData = await load(migrated); if (migratedData.schemaVersion !== 3 || migratedData.scenes.some((scene) => scene.renderMode !== 'legacy' || !scene.legacyRecipe)) throw new Error('Migration không giữ legacy recipe.');
  const rebuiltCue = join(temp, 'cue-v3.json'); run('build-cue-lock.mjs', [resolve(src, 'transcript.lock.json'), planPath, '--out', rebuiltCue], true, 'cue lock từ plan v3');
  console.log('PASS V3 regression: ideation, reference order, graph, novelty, custom, migration và cue compatibility.');
} finally { await rm(temp, {recursive: true, force: true}); }
