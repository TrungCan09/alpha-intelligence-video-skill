#!/usr/bin/env node
import {copyFile, mkdir, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname, extname, resolve} from 'node:path';

const args = process.argv.slice(2);
const value = (flag, fallback = '') => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const sourceArg = value('--file');
const project = resolve(value('--project', 'assets/remotion-starter'));
if (!sourceArg) {
  console.error('Dùng: node scripts/install-brand-font.mjs --file "<font.woff2>" [--project assets/remotion-starter]');
  process.exit(1);
}
const source = resolve(sourceArg);
if (extname(source).toLowerCase() !== '.woff2') throw new Error('Cy Grotesk phải ở định dạng .woff2.');
const data = await readFile(source);
if (data.subarray(0, 4).toString('ascii') !== 'wOF2') throw new Error('File không có chữ ký WOFF2 hợp lệ.');
const target = resolve(project, 'public/fonts/cy-grotesk-v3-wide.woff2');
await mkdir(dirname(target), {recursive: true});
await copyFile(source, target);
const sha256 = createHash('sha256').update(data).digest('hex');
console.log(`Đã cài font cục bộ: ${target}`);
console.log(`SHA-256: ${sha256}`);
console.log('Không commit file này; đường dẫn đã nằm trong .gitignore.');
