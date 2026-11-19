#!/usr/bin/env node
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {sha256File, sha256Value} from './lib/lock-utils.mjs';

const args = process.argv.slice(2);
const sourceRootArg = args[0]; const outIndex = args.indexOf('--out'); const outArg = outIndex >= 0 ? args[outIndex + 1] : undefined;
if (!sourceRootArg || !outArg) { console.error('Dùng: node scripts/build-production-source-library.mjs assets/reference/production-source --out knowledge/production-source-library.json'); process.exit(2); }
const sourceRoot = resolve(sourceRootArg); const lessonIds = ['lesson-1', 'lesson-2', 'lesson-3']; const lessons = [];
for (const lessonId of lessonIds) {
  const folder = join(sourceRoot, lessonId); const map = JSON.parse(await readFile(join(folder, 'source-map.json'), 'utf8')); const files = [];
  for (const item of map.files ?? []) files.push({...item, sha256: await sha256File(join(folder, item.path))});
  lessons.push({...map, files, sourceMapSha256: await sha256File(join(folder, 'source-map.json'))});
}
const library = {schemaVersion: 1, kind: 'production-source-library', sourceRoot: 'assets/reference/production-source', lessons};
library.librarySha256 = sha256Value(library);
await writeFile(resolve(outArg), `${JSON.stringify(library, null, 2)}\n`, 'utf8');
console.log(`PASS Đã khóa production source library: ${lessons.length} lesson → ${resolve(outArg)}`);
