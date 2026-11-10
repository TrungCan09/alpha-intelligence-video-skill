#!/usr/bin/env node
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = resolve(process.argv[2] ?? '.');
const checker = resolve(root, 'scripts/check-knowledge-pack.mjs');
const run = (args, shouldPass, label) => {
  const result = spawnSync(process.execPath, [checker, root, ...args], {encoding: 'utf8'});
  if ((result.status === 0) !== shouldPass) throw new Error(`${label}: trạng thái không đúng.\n${result.stdout}\n${result.stderr}`);
};
const temp = await mkdtemp(join(tmpdir(), 'alpha-knowledge-'));
const privacyProbe = resolve(root, 'privacy-probe.txt');
try {
  run([], true, 'knowledge hợp lệ');
  const source = JSON.parse(await readFile(resolve(root, 'knowledge/lessons.json'), 'utf8'));

  const duplicate = structuredClone(source);
  duplicate.lessons.push(structuredClone(duplicate.lessons[0]));
  const duplicatePath = join(temp, 'duplicate.json');
  await writeFile(duplicatePath, JSON.stringify(duplicate));
  run(['--knowledge', duplicatePath], false, 'lesson ID trùng');

  const missingLink = structuredClone(source);
  missingLink.lessons[0].relatedScripts = ['scripts/does-not-exist.mjs'];
  const missingPath = join(temp, 'missing-link.json');
  await writeFile(missingPath, JSON.stringify(missingLink));
  run(['--knowledge', missingPath], false, 'lesson link mồ côi');

  await writeFile(privacyProbe, 'private source: C:\\Users\\Example\\Downloads\\voice.mp3\n');
  run([], false, 'privacy scan');
  console.log('PASS Knowledge regression: duplicate, orphan link và private path đều bị chặn.');
} finally {
  await rm(privacyProbe, {force: true});
  await rm(temp, {recursive: true, force: true});
}
