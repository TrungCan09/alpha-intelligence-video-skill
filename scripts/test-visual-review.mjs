#!/usr/bin/env node
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {sha256File} from './lib/lock-utils.mjs';

const root = resolve(process.argv[2] ?? '.'); const temp = await mkdtemp(join(tmpdir(), 'alpha-visual-review-')); const load = async (path) => JSON.parse(await readFile(path, 'utf8')); const save = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
const run = (report, shouldPass, label) => { const result = spawnSync(process.execPath, [resolve(root, 'scripts/check-visual-review.mjs'), report, '--video', video, '--plan', planPath, '--pack-index', packPath, '--config', configPath], {encoding: 'utf8'}); if ((result.status === 0) !== shouldPass) throw new Error(`${label}: trạng thái sai.\n${result.stdout}\n${result.stderr}`); };
const video = resolve(root, 'assets/reference/alpha-video-v3-reference.mp4'); const planPath = resolve(root, 'assets/remotion-starter/src/video-plan.v3.json'); const configPath = resolve(root, 'visual-review.config.json'); const plan = await load(planPath); const config = await load(configPath); const videoSha256 = await sha256File(video); const packPath = join(temp, 'index.json');
try {
  const frames = plan.scenes.flatMap((scene, index) => [{id: `f${index}a`, sceneId: scene.id}, {id: `f${index}b`, sceneId: scene.id}]); const pack = {schemaVersion: 1, videoSha256, frameAuditSha256: 'fixture-audit', frames}; await save(packPath, pack);
  const makeScene = (scene, score = 8.5) => ({sceneId: scene.id, scores: Object.fromEntries(Object.keys(config.weights).map((key) => [key, score])), weightedScore: score, evidenceFrameIds: frames.filter((frame) => frame.sceneId === scene.id).map((frame) => frame.id), strengths: ['Hierarchy rõ tại payoff.'], risks: ['Cần tiếp tục theo dõi optical balance.'], findings: []});
  const base = {schemaVersion: 1, videoSha256, frameAuditSha256: pack.frameAuditSha256, iteration: 1, reviewer: 'regression-agent', reviewedAt: '2026-01-01T00:00:00.000Z', playback1x: true, playback05x: true, decision: 'pass', scenes: plan.scenes.map((scene) => makeScene(scene))};
  const valid = join(temp, 'valid.json'); await save(valid, base); run(valid, true, 'report hợp lệ');
  const lowScene = structuredClone(base); lowScene.scenes[0] = makeScene(plan.scenes[0], 7.5); lowScene.decision = 'revise'; const lowPath = join(temp, 'low.json'); await save(lowPath, lowScene); run(lowPath, true, 'scene thấp phải revise');
  const hiddenLow = structuredClone(base); hiddenLow.scenes[0] = makeScene(plan.scenes[0], 8.5); hiddenLow.scenes[0].scores.semanticClarity = 7.5; hiddenLow.scenes[0].scores.compositionBalance = 9.5; hiddenLow.scenes[0].weightedScore = 8.45; hiddenLow.decision = 'revise'; const hiddenPath = join(temp, 'critical-low.json'); await save(hiddenPath, hiddenLow); run(hiddenPath, true, 'critical thấp phải revise');
  const stale = structuredClone(base); stale.videoSha256 = '0'.repeat(64); const stalePath = join(temp, 'stale.json'); await save(stalePath, stale); run(stalePath, false, 'hash cũ bị chặn');
  const noEvidence = structuredClone(base); noEvidence.scenes[0].evidenceFrameIds = []; const evidencePath = join(temp, 'evidence.json'); await save(evidencePath, noEvidence); run(evidencePath, false, 'thiếu evidence bị chặn');
  const blocked = structuredClone(lowScene); blocked.iteration = config.maximumIterations; blocked.decision = 'blocked'; const blockedPath = join(temp, 'blocked.json'); await save(blockedPath, blocked); run(blockedPath, true, 'vòng cuối phải blocked');
  console.log('PASS Visual review regression: score, critical floor, evidence, stale hash và iteration cap.');
} finally { await rm(temp, {recursive: true, force: true}); }
