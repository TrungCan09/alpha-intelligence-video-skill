#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {readJson, scriptHash, sha256File} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const lockArg = args[0]; const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
if (!lockArg) { console.error('Dùng: node scripts/check-script-lock.mjs script.lock.json [--script approved-script.md]'); process.exit(2); }
const lock = await readJson(resolve(lockArg)); const errors = [];
if (lock.schemaVersion !== 1 || lock.kind !== 'approved-script') errors.push('Script lock phải dùng schemaVersion 1 và kind approved-script.');
if (lock.scriptSha256 !== scriptHash(lock)) errors.push('scriptSha256 không khớp nội dung lock.');
if (!['vi'].includes(lock.language)) errors.push('Script production hiện chỉ hỗ trợ language=vi.');
const ids = new Set();
for (const [index, segment] of (lock.segments ?? []).entries()) {
  const expected = `script-${String(index + 1).padStart(3, '0')}`;
  if (segment.id !== expected || ids.has(segment.id)) errors.push(`Script segment ID phải ổn định theo thứ tự: ${expected}.`);
  ids.add(segment.id);
  if (!segment.text?.trim() || /\r/.test(segment.text)) errors.push(`${segment.id}: text rỗng hoặc chứa line ending không hợp lệ.`);
}
if (!lock.segments?.length) errors.push('Script lock không có đoạn lời đọc.');
const source = value('--script');
if (source) {
  if (!existsSync(resolve(source))) errors.push(`Không tìm thấy script nguồn: ${source}`);
  else if (await sha256File(resolve(source)) !== lock.sourceScript?.sha256) errors.push('Script nguồn đã thay đổi; phải lock lại trước khi dựng.');
}
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Script lock hợp lệ: ${lock.segments.length} đoạn.`);
