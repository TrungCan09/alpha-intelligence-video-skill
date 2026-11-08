#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const args = process.argv.slice(2);
const value = (flag, fallback = '') => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const project = resolve(value('--project', 'assets/remotion-starter'));
const required = args.includes('--require-cy');
const font = resolve(project, 'public/fonts/cy-grotesk-v3-wide.woff2');

try {
  const data = await readFile(font);
  if (data.subarray(0, 4).toString('ascii') !== 'wOF2') throw new Error('chữ ký WOFF2 không hợp lệ');
  if (data.length < 1024) throw new Error('file quá nhỏ để là font hợp lệ');
  const sha256 = createHash('sha256').update(data).digest('hex');
  console.log(`PASS Cy Grotesk sẵn sàng: ${font}`);
  console.log(`SHA-256: ${sha256}`);
} catch (error) {
  const message = `Cy Grotesk chưa sẵn sàng (${error.message}); starter sẽ dùng Montserrat 800.`;
  if (required) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
  console.warn(`WARN ${message}`);
}
