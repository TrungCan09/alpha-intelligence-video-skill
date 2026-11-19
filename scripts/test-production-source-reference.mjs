#!/usr/bin/env node
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {sha256Value} from './lib/lock-utils.mjs';
import {conceptDraftPayload} from './lib/v3-utils.mjs';

const root = resolve(process.argv[2] ?? '.'); const temp = await mkdtemp(join(tmpdir(), 'alpha-source-reference-')); const load = async (path) => JSON.parse(await readFile(path, 'utf8')); const save = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`); const run = (script, args, pass, label) => { const result = spawnSync(process.execPath, [resolve(root, 'scripts', script), ...args], {encoding: 'utf8'}); if ((result.status === 0) !== pass) throw new Error(`${label}\n${result.stdout}\n${result.stderr}`); };
try {
  const libraryPath = resolve(root, 'knowledge/production-source-library.json'); const conceptsPath = resolve(root, 'assets/remotion-starter/src/concept-candidates.json'); const concepts = await load(conceptsPath); const library = await load(libraryPath);
  run('check-production-source-library.mjs', [libraryPath], true, 'source library hợp lệ');
  const unitIds = ['lesson-1/hook-split', 'lesson-2/mechanism-reveal', 'lesson-3/book-contradiction']; const review = {schemaVersion: 1, conceptDraftSha256: sha256Value(conceptDraftPayload(concepts)), sourceLibrarySha256: library.librarySha256, reviewedAt: '2026-01-01T00:02:00.000Z', scenes: concepts.sceneConceptSets.map((scene, index) => ({sceneId: scene.sceneId, sourceUnitIds: [unitIds[index]], techniquesToLearn: ['semantic state change'], elementsNotToCopy: ['literal copy and timing'], thesisUnchanged: true}))};
  const reviewPath = join(temp, 'production-source-review.lock.json'); await save(reviewPath, review); run('check-production-source-review.mjs', [reviewPath, '--concepts', conceptsPath, '--library', libraryPath], true, 'source review hợp lệ');
  review.scenes[0].thesisUnchanged = false; await save(reviewPath, review); run('check-production-source-review.mjs', [reviewPath, '--concepts', conceptsPath, '--library', libraryPath], false, 'source review thay visual thesis bị chặn');
  console.log('PASS Production source reference regression: code hash, post-ideation review và anti-copy guardrail hợp lệ.');
} finally { await rm(temp, {recursive: true, force: true}); }
