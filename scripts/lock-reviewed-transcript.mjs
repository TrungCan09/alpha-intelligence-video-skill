#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {readJson, transcriptHash} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const input = args[0];
const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
if (!input || !args.includes('--confirm-reviewed')) {
  console.error('Dùng: node scripts/lock-reviewed-transcript.mjs transcript.lock.json --confirm-reviewed [--out transcript.lock.json]');
  console.error('Chỉ chạy sau khi đã nghe lại và sửa chính tả; script không thay timestamp.');
  process.exit(2);
}
const transcript = await readJson(resolve(input));
if (transcript.schemaVersion !== 2 || !(transcript.segments?.length)) { console.error('FAIL Transcript schema v2 không hợp lệ.'); process.exit(1); }
transcript.reviewed = true;
transcript.transcriptSha256 = transcriptHash(transcript);
const out = resolve(value('--out', input));
await writeFile(out, `${JSON.stringify(transcript, null, 2)}\n`, 'utf8');
console.log(`PASS Transcript đã được khóa sau review: ${out}`);
