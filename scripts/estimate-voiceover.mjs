#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const args = process.argv.slice(2);
const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : ''; };
const file = value('--file');
const inline = value('--text');
if (!file && !inline) {
  console.error('Dùng: node scripts/estimate-voiceover.mjs --file <script.txt> hoặc --text "Nội dung"');
  process.exit(1);
}

const text = file ? await readFile(resolve(file), 'utf8') : inline;
const words = text.match(/[\p{L}\p{M}\p{N}]+(?:[-‑][\p{L}\p{M}\p{N}]+)*/gu) ?? [];
const ellipses = (text.match(/\.\.\.|…/g) ?? []).length;
const emDashes = (text.match(/—/g) ?? []).length;
const commas = (text.match(/[,;]/g) ?? []).length;
const sentenceEnds = (text.match(/[.!?](?!\.)/g) ?? []).length;
const paragraphBreaks = (text.match(/\n\s*\n/g) ?? []).length;
const baseSeconds = words.length / 155 * 60;
const pauseSeconds = ellipses * 0.45 + emDashes * 0.25 + commas * 0.15 + sentenceEnds * 0.35 + paragraphBreaks * 0.6;
const totalSeconds = Math.ceil(baseSeconds + pauseSeconds);
const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;
const result = {words: words.length, baseWpm: 155, estimatedSeconds: totalSeconds, underTwoMinutes: totalSeconds < 120, pauses: {ellipses, emDashes, commas, sentenceEnds, paragraphBreaks}};

if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`[Độ dài: ~${words.length} chữ | Thời lượng ước tính: ~${minutes} phút ${seconds} giây]`);
  console.log(totalSeconds < 120 ? 'PASS Dưới 2 phút.' : 'FAIL Cần rút gọn để dưới 2 phút.');
}
if (args.includes('--strict') && totalSeconds >= 120) process.exit(1);
