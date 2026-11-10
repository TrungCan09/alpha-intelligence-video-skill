#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const input = args[0]; const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
if (!input) { console.error('Dùng: node scripts/migrate-plan-v2-to-v3.mjs video-plan.json --out video-plan.v3.json --locked-at ISO'); process.exit(2); }
const source = await readJson(resolve(input));
if (source.schemaVersion !== 2) { console.error('FAIL Source plan phải dùng schemaVersion 2.'); process.exit(1); }
const lockedAt = value('--locked-at', '2026-01-01T00:00:00.000Z'); const out = resolve(value('--out', 'video-plan.v3.json'));
const migrated = {schemaVersion: 3, fps: source.fps, conceptDraftLockedAt: lockedAt, referenceReviewedAt: lockedAt, voiceOnlySegments: source.voiceOnlySegments ?? [], scenes: source.scenes.map((scene) => ({id: scene.id, startCueId: scene.startCueId, endCueId: scene.endCueId, conceptId: `legacy-${scene.id}`, renderMode: 'legacy', layout: {family: 'stage', opticalBalance: `Migrated from ${scene.layoutFamily}`}, beats: scene.beats, legacyRecipe: scene.recipe, fallbackReason: 'Migrated automatically from schema v2; preserve renderer until the scene receives v3 ideation.'}))};
await writeFile(out, `${JSON.stringify(migrated, null, 2)}\n`, 'utf8');
console.log(`PASS Migrated ${migrated.scenes.length} scene v2 → v3 tại ${out}`);
