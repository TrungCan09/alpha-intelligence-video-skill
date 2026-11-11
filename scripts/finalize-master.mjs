#!/usr/bin/env node
import {copyFile, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2); const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const candidate = value('--candidate'); const transcript = value('--transcript'); const cueLock = value('--cue-lock'); const plan = value('--plan'); const concepts = value('--concepts'); const project = value('--project'); const report = value('--report'); const visualReview = value('--visual-review'); const visualPack = value('--visual-pack'); const referenceReview = value('--reference-review'); const referenceLibrary = value('--reference-library'); const scriptLock = value('--script-lock'); const asrLock = value('--asr-lock'); const alignmentLock = value('--alignment-lock'); const voice = value('--voice'); const out = value('--out');
if (![candidate, cueLock, plan, project, report, out].every(Boolean)) {
  console.error('Dùng: node scripts/finalize-master.mjs --candidate candidate.mp4 --cue-lock cue-sheet.lock.json --plan video-plan.json --project project --report qa/report.json --visual-review review.json --visual-pack index.json [--transcript transcript.lock.json | --script-lock script.lock.json --asr-lock asr-transcript.lock.json --alignment-lock script-audio-alignment.lock.json --voice final-voice.mp3] [--reference-review lock.json --reference-library library.json] --out master.mp4'); process.exit(2);
}
const planData = JSON.parse(await readFile(resolve(plan), 'utf8'));
const productionTiming = planData.timingSource === 'script-audio-alignment';
if (productionTiming && (![scriptLock, asrLock, alignmentLock, voice].every(Boolean))) { console.error('Production v3.3 bắt buộc --script-lock, --asr-lock, --alignment-lock và --voice.'); process.exit(2); }
if (!productionTiming && !transcript) { console.error('Pipeline legacy bắt buộc --transcript transcript.lock.json.'); process.exit(2); }
if (planData.schemaVersion === 3 && !concepts) { console.error('Plan v3 bắt buộc truyền --concepts concept-candidates.json'); process.exit(2); }
if (planData.schemaVersion === 3 && (!visualReview || !visualPack)) { console.error('Plan v3+ bắt buộc truyền --visual-review và --visual-pack.'); process.exit(2); }
if (Boolean(referenceReview) !== Boolean(referenceLibrary)) { console.error('V3.2 phải truyền đồng thời --reference-review và --reference-library.'); process.exit(2); }
const checks = [
  ...(productionTiming ? [
    ['check-script-lock.mjs', [scriptLock]],
    ['check-script-audio-alignment.mjs', [scriptLock, asrLock, alignmentLock, '--audio', voice]],
    ['check-cue-lock.mjs', ['--cue-lock', cueLock, '--script', scriptLock, '--asr', asrLock, '--alignment', alignmentLock, '--audio', voice]],
  ] : [['check-cue-lock.mjs', [transcript, cueLock]]]),
  ['check-timeline-binding.mjs', [project]],
  ...(planData.schemaVersion === 3 ? [
    ['check-concept-exploration.mjs', [concepts]],
    ['check-reference-order.mjs', [concepts, plan]],
    ['check-v3-plan.mjs', [plan, concepts, cueLock]],
    ['check-motion-graph.mjs', [plan, cueLock]],
    ['check-motion-novelty.mjs', [plan, concepts]],
    ['check-custom-scene.mjs', [plan, project]],
    ...(referenceReview ? [
      ['check-reference-library.mjs', [referenceLibrary]],
      ['check-reference-review.mjs', [referenceReview, '--concepts', concepts, '--library', referenceLibrary]],
      ['check-reference-novelty.mjs', [plan, '--concepts', concepts, '--review', referenceReview, '--library', referenceLibrary]],
    ] : []),
    ['check-visual-review.mjs', [visualReview, '--video', candidate, '--plan', plan, '--pack-index', visualPack, '--require-pass', ...(referenceReview ? ['--reference-review', referenceReview, '--reference-library', referenceLibrary] : [])]],
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
