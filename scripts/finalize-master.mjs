#!/usr/bin/env node
import {copyFile, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2); const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const candidate = value('--candidate'); const transcript = value('--transcript'); const cueLock = value('--cue-lock'); const plan = value('--plan'); const concepts = value('--concepts'); const project = value('--project'); const report = value('--report'); const out = value('--out');
if (![candidate, transcript, cueLock, plan, project, report, out].every(Boolean)) {
  console.error('Dùng: node scripts/finalize-master.mjs --candidate candidate.mp4 --transcript transcript.lock.json --cue-lock cue-sheet.lock.json --plan video-plan.json --project project --report qa/report.json --out master.mp4'); process.exit(2);
}
const planData = JSON.parse(await readFile(resolve(plan), 'utf8'));
if (planData.schemaVersion === 3 && !concepts) { console.error('Plan v3 bắt buộc truyền --concepts concept-candidates.json'); process.exit(2); }
const checks = [
  ['check-cue-lock.mjs', [transcript, cueLock]],
  ['check-timeline-binding.mjs', [project]],
  ...(planData.schemaVersion === 3 ? [
    ['check-concept-exploration.mjs', [concepts]],
    ['check-reference-order.mjs', [concepts, plan]],
    ['check-v3-plan.mjs', [plan, concepts, cueLock]],
    ['check-motion-graph.mjs', [plan, cueLock]],
    ['check-motion-novelty.mjs', [plan, concepts]],
    ['check-custom-scene.mjs', [plan, project]],
  ] : [['check-scene-diversity.mjs', [plan]]]),
  ['check-qa-report.mjs', [report, '--video', candidate, '--cue-lock', cueLock]],
  ['check-alpha-video.mjs', ['--project', project, '--video', candidate, '--expect-audio']],
];
for (const [script, scriptArgs] of checks) {
  const result = spawnSync(process.execPath, [resolve(import.meta.dirname, script), ...scriptArgs], {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await copyFile(resolve(candidate), resolve(out));
console.log(`PASS Master đã finalize: ${resolve(out)}`);
