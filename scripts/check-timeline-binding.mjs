#!/usr/bin/env node
import {readFile, readdir} from 'node:fs/promises';
import {extname, join, resolve} from 'node:path';

const project = resolve(process.argv[2] ?? 'assets/remotion-starter');
const src = join(project, 'src');
const walk = async (directory) => {
  const found = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walk(path));
    else if (['.ts', '.tsx'].includes(extname(entry.name))) found.push(path);
  }
  return found;
};
const files = await walk(src);
const errors = [];
const production = files.filter((file) => /AlphaVideoV[23]|scene-recipes|scene-registry|motion-graph-renderer|custom-scenes|cue-timeline|[\\/]scenes[\\/]/.test(file));
if (!production.length) errors.push('Thiếu production composition v2.');
const combined = (await Promise.all(production.map((file) => readFile(file, 'utf8')))).join('\n');
for (const token of ['cue-sheet.lock.json', 'cueStart(', 'useCueProgress(']) if (!combined.includes(token)) errors.push(`Production timeline thiếu binding: ${token}`);
for (const file of production) {
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/frameAt\(\s*\d|startSeconds\s*=\s*\d|cueStartSeconds\s*=\s*\d|interpolate\(\s*frame\s*,\s*\[\s*\d|frame\s*:\s*frame\s*-\s*\d|<Sequence[^>]*from=\{\s*\d/.test(line)) errors.push(`${file}:${index + 1}: magic timestamp trong production composition.`);
  });
}
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Timeline binding hợp lệ: ${production.length} file production dùng cue lock.`);
