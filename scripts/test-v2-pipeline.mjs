#!/usr/bin/env node
import {cp, mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {cueHash} from './lib/lock-utils.mjs';
import {sha256Value} from './lib/lock-utils.mjs';

const root = resolve(process.argv[2] ?? '.');
const temp = await mkdtemp(join(tmpdir(), 'alpha-v2-tests-'));
const run = (script, args, shouldPass, label) => {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts', script), ...args], {encoding: 'utf8'});
  if ((result.status === 0) !== shouldPass) throw new Error(`${label}: trạng thái không đúng.\n${result.stdout}\n${result.stderr}`);
};
const load = async (path) => JSON.parse(await readFile(path, 'utf8'));
const save = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
try {
  const canonicalFixture = await load(resolve(root, 'tests/fixtures/canonical-hash.json'));
  const pythonHash = spawnSync('python', ['-c', `import importlib.util,json; s=importlib.util.spec_from_file_location('t',r'${resolve(root, 'scripts/transcribe-audio.py')}');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);v=json.load(open(r'${resolve(root, 'tests/fixtures/canonical-hash.json')}',encoding='utf-8'));print(__import__('hashlib').sha256(m.canonical_bytes(v)).hexdigest())`], {encoding: 'utf8'});
  if (pythonHash.status !== 0 || pythonHash.stdout.trim() !== sha256Value(canonicalFixture)) throw new Error(`Canonical hash Python/Node không khớp: ${pythonHash.stderr || pythonHash.stdout}`);
  const source = resolve(root, 'assets/remotion-starter/src');
  const transcriptPath = join(temp, 'transcript.lock.json'); const cuePath = join(temp, 'cue-sheet.lock.json'); const planPath = join(temp, 'video-plan.json');
  await cp(join(source, 'transcript.lock.json'), transcriptPath); await cp(join(source, 'cue-sheet.lock.json'), cuePath); await cp(join(source, 'video-plan.json'), planPath);
  run('check-cue-lock.mjs', [transcriptPath, cuePath], true, 'valid cue lock');
  run('check-scene-diversity.mjs', [planPath], true, 'valid scene diversity');

  const invalids = [];
  const audioHash = await load(cuePath); audioHash.audioSha256 = 'f'.repeat(64); audioHash.cueSheetSha256 = cueHash(audioHash); invalids.push(['audio-hash', null, audioHash]);
  const changedTranscript = await load(transcriptPath); changedTranscript.segments[0].text += ' sửa'; invalids.push(['transcript-changed', changedTranscript, await load(cuePath)]);
  const missingSegment = await load(cuePath); missingSegment.cues[0].segmentIds = ['missing']; missingSegment.cueSheetSha256 = cueHash(missingSegment); invalids.push(['missing-segment', null, missingSegment]);
  const drift = await load(cuePath); drift.cues.at(-1).end = 81.984; drift.cueSheetSha256 = cueHash(drift); invalids.push(['regression-drift-20-30-40-70', null, drift]);
  const wrongWords = await load(cuePath); wrongWords.cues[0].spokenText = 'Không khớp transcript'; wrongWords.cueSheetSha256 = cueHash(wrongWords); invalids.push(['spoken-text', null, wrongWords]);
  for (const [name, transcript, cue] of invalids) { const t = join(temp, `${name}.transcript.json`); const c = join(temp, `${name}.cue.json`); await save(t, transcript ?? await load(transcriptPath)); await save(c, cue); run('check-cue-lock.mjs', [t, c], false, name); }

  const repeated = await load(planPath); repeated.scenes = [repeated.scenes[0], structuredClone(repeated.scenes[0]), structuredClone(repeated.scenes[0])]; repeated.scenes.forEach((scene, index) => { scene.id = `repeat-${index}`; }); const repeatedPath = join(temp, 'repeated.json'); await save(repeatedPath, repeated); run('check-scene-diversity.mjs', [repeatedPath], false, 'three repeated recipes');

  const project = join(temp, 'magic-project'); await mkdir(join(project, 'src'), {recursive: true});
  await writeFile(join(project, 'src/cue-sheet.lock.json'), '{}');
  await writeFile(join(project, 'src/cue-timeline.ts'), `export const cueStart=()=>0; export const useCueProgress=()=>1;\n`);
  await writeFile(join(project, 'src/AlphaVideoV2.tsx'), `import './cue-sheet.lock.json'; import {cueStart,useCueProgress} from './cue-timeline'; export const AlphaVideoV2=()=>{interpolate(frame,[30,60],[0,1]);cueStart('a');useCueProgress('a');return null};\n`);
  run('check-timeline-binding.mjs', [project], false, 'magic timestamp');

  const slow = await load(planPath); slow.scenes[0].endCueId = 'answer-fast'; const slowPath = join(temp, 'video-plan.json'); await save(slowPath, slow); run('check-scene-diversity.mjs', [slowPath], false, 'long semantic hold');
  console.log('PASS V2 regression suite: hash, transcript, segment, drift, spoken text, recipe, magic timing và long hold đều bị chặn.');
} finally { await rm(temp, {recursive: true, force: true}); }
