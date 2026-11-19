#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson, sha256Value} from './lib/lock-utils.mjs';
import {conceptDraftPayload} from './lib/v3-utils.mjs';

const args = process.argv.slice(2); const lockArg = args[0]; const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; }; const conceptsArg = value('--concepts'); const libraryArg = value('--library');
if (!lockArg || !conceptsArg || !libraryArg) { console.error('Dùng: node scripts/check-production-source-review.mjs production-source-review.lock.json --concepts concept-candidates.json --library production-source-library.json'); process.exit(2); }
const lock = await readJson(resolve(lockArg)); const concepts = await readJson(resolve(conceptsArg)); const library = await readJson(resolve(libraryArg)); const errors = [];
if (lock.schemaVersion !== 1) errors.push('Source review lock phải dùng schemaVersion 1.');
if (lock.conceptDraftSha256 !== sha256Value(conceptDraftPayload(concepts))) errors.push('Source review lock không khớp concept draft.');
if (lock.sourceLibrarySha256 !== library.librarySha256) errors.push('Source review lock không khớp source library.');
const reviewedAt = Date.parse(lock.reviewedAt); const draftAt = Date.parse(concepts.draftLockedAt); if (!Number.isFinite(reviewedAt) || !Number.isFinite(draftAt) || reviewedAt <= draftAt) errors.push('Source chỉ được review sau concept draft.');
const units = new Set((library.lessons ?? []).flatMap((lesson) => (lesson.sourceUnits ?? []).map((unit) => unit.id))); const rows = new Map((lock.scenes ?? []).map((scene) => [scene.sceneId, scene])); const usage = new Map();
for (const scene of concepts.sceneConceptSets ?? []) { const row = rows.get(scene.sceneId); if (!row) { errors.push(`Thiếu source review cho ${scene.sceneId}.`); continue; } if (row.thesisUnchanged !== true || !row.techniquesToLearn?.length || !row.elementsNotToCopy?.length) errors.push(`${scene.sceneId}: thiếu thesis/technique/anti-copy note.`); if (!row.sourceUnitIds?.length || row.sourceUnitIds.length > 2) errors.push(`${scene.sceneId}: chọn 1–2 source unit.`); for (const id of row.sourceUnitIds ?? []) { if (!units.has(id)) errors.push(`${scene.sceneId}: sourceUnit không tồn tại ${id}.`); usage.set(id, (usage.get(id) ?? 0) + 1); } }
if ([...usage.values()].some((count) => count > 2)) errors.push('Một source unit không được là reference chính cho quá hai scene.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Production source review: ${rows.size} scene, ${usage.size} source unit được truy xuất sau ideation.`);
