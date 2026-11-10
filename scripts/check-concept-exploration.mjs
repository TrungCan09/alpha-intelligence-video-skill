#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';
import {APPROACHES, conceptFingerprint, similarity, weightedScore} from './lib/v3-utils.mjs';

const input = process.argv[2];
if (!input) { console.error('Dùng: node scripts/check-concept-exploration.mjs concept-candidates.json'); process.exit(2); }
const data = await readJson(resolve(input)); const errors = [];
if (data.schemaVersion !== 3) errors.push('Concept candidates phải dùng schemaVersion 3.');
if (!data.draftLockedAt || !Number.isFinite(Date.parse(data.draftLockedAt))) errors.push('Thiếu draftLockedAt hợp lệ.');
for (const set of data.sceneConceptSets ?? []) {
  if (!set.sceneId || !set.semanticGoal || !set.spokenMeaning || !set.selectionRationale) errors.push(`${set.sceneId ?? '<scene>'}: thiếu semanticGoal, spokenMeaning hoặc selectionRationale.`);
  if (set.candidates?.length !== 3) { errors.push(`${set.sceneId}: phải có đúng ba concept.`); continue; }
  const approaches = new Set(set.candidates.map((candidate) => candidate.approach));
  for (const approach of APPROACHES) if (!approaches.has(approach)) errors.push(`${set.sceneId}: thiếu approach ${approach}.`);
  if (approaches.size !== 3) errors.push(`${set.sceneId}: approach bị trùng.`);
  const ids = new Set(); const theses = new Set();
  for (const candidate of set.candidates) {
    if (!candidate.id || ids.has(candidate.id)) errors.push(`${set.sceneId}: concept id thiếu hoặc trùng ${candidate.id}.`); ids.add(candidate.id);
    if (!candidate.visualThesis || theses.has(candidate.visualThesis)) errors.push(`${set.sceneId}/${candidate.id}: visualThesis thiếu hoặc trùng.`); theses.add(candidate.visualThesis);
    for (const field of ['motionVerbs', 'stateSequence', 'primitiveFamilies', 'risks']) if (!Array.isArray(candidate[field]) || !candidate[field].length) errors.push(`${set.sceneId}/${candidate.id}: ${field} phải có dữ liệu.`);
    if (!candidate.layoutFamily || !candidate.visualMeaning) errors.push(`${set.sceneId}/${candidate.id}: thiếu layoutFamily hoặc visualMeaning.`);
    for (const field of ['semanticClarity', 'voiceAlignment', 'brandFit', 'novelty', 'feasibility']) if (!(candidate.scores?.[field] >= 1 && candidate.scores[field] <= 5)) errors.push(`${set.sceneId}/${candidate.id}: score ${field} phải từ 1 đến 5.`);
    if (candidate.id !== set.selectedConceptId && !candidate.rejectionReason) errors.push(`${set.sceneId}/${candidate.id}: concept không chọn phải có rejectionReason.`);
  }
  const selected = set.candidates.find((candidate) => candidate.id === set.selectedConceptId);
  if (!selected) errors.push(`${set.sceneId}: selectedConceptId không tồn tại.`);
  else {
    if (selected.scores.semanticClarity < 4) errors.push(`${set.sceneId}: concept được chọn có semanticClarity dưới 4/5.`);
    const eligible = set.candidates.filter((candidate) => candidate.scores.semanticClarity >= 4);
    const best = Math.max(...eligible.map((candidate) => weightedScore(candidate.scores)));
    if (weightedScore(selected.scores) + 0.0001 < best) errors.push(`${set.sceneId}: concept được chọn không có weighted score cao nhất trong nhóm đủ semantic clarity.`);
  }
  const fingerprints = set.candidates.map((candidate) => conceptFingerprint(candidate));
  for (let left = 0; left < fingerprints.length; left++) for (let right = left + 1; right < fingerprints.length; right++) if (similarity(fingerprints[left], fingerprints[right]) > 0.75) errors.push(`${set.sceneId}: concept ${left + 1} và ${right + 1} có fingerprint quá giống nhau.`);
}
if (!(data.sceneConceptSets?.length)) errors.push('Không có scene concept set.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Concept exploration: ${data.sceneConceptSets.length} scene × 3 concept.`);
