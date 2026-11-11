#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';
import {basename, resolve} from 'node:path';
import {scriptHash, sha256File} from './lib/lock-utils.mjs';

const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith('--'));
const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
if (!input) {
  console.error('Dùng: node scripts/lock-approved-script.mjs approved-script.md --out script.lock.json [--language vi]');
  process.exit(2);
}
const source = resolve(input); const out = resolve(value('--out', 'script.lock.json')); const language = value('--language', 'vi');
const raw = await readFile(source, 'utf8');
const paragraphs = raw.replace(/^\uFEFF/, '').split(/\r?\n\s*\r?\n/g).map((part) => part.trim()).filter(Boolean);
const invalid = paragraphs.filter((part) => /^#{1,6}\s|^[-*+]\s|^\d+[.)]\s/.test(part));
if (!paragraphs.length || invalid.length) {
  console.error('FAIL Script phải là UTF-8 với một đơn vị lời đọc trong mỗi paragraph; không dùng heading hoặc bullet làm lời đọc.');
  process.exit(1);
}
const lock = {
  schemaVersion: 1,
  kind: 'approved-script',
  sourceScript: {fileName: basename(source), sha256: await sha256File(source)},
  language,
  segments: paragraphs.map((text, index) => ({id: `script-${String(index + 1).padStart(3, '0')}`, text})),
};
lock.scriptSha256 = scriptHash(lock);
await writeFile(out, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');
console.log(`PASS Đã khóa script đã duyệt: ${lock.segments.length} đoạn → ${out}`);
