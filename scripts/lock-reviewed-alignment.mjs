#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {alignmentHash, readJson} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const input = args.find((arg) => !arg.startsWith('--')); const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
if (!input || !args.includes('--confirm-reviewed')) { console.error('Dùng: node scripts/lock-reviewed-alignment.mjs script-audio-alignment.lock.json --confirm-reviewed [--out file]'); process.exit(2); }
const alignment = await readJson(resolve(input));
if (alignment.kind !== 'script-audio-alignment' || !alignment.mappings?.length) { console.error('FAIL Alignment lock không hợp lệ.'); process.exit(1); }
alignment.reviewed = true; alignment.alignmentSha256 = alignmentHash(alignment);
const out = resolve(value('--out', input)); await writeFile(out, `${JSON.stringify(alignment, null, 2)}\n`, 'utf8');
console.log(`PASS Alignment đã được review và khóa: ${out}`);
