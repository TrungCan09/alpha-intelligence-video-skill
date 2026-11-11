#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const args = process.argv.slice(2); const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const script = value('--script'); const audio = value('--audio'); const mode = value('--mode') ?? 'production'; const errors = [];
if (mode === 'synthetic-cue-track') { console.log('PASS Synthetic cue track được miễn input contract production.'); process.exit(0); }
if (!script || !audio) errors.push('Production bắt buộc truyền --script approved-script.md và --audio final-voice.mp3.');
if (script && !existsSync(resolve(script))) errors.push(`Không tìm thấy script: ${script}`);
if (audio && !existsSync(resolve(audio))) errors.push(`Không tìm thấy voice: ${audio}`);
if (script && !['.md', '.txt'].includes(extname(script).toLowerCase())) errors.push('Script chỉ nhận .md hoặc .txt UTF-8.');
if (audio && !['.mp3', '.wav', '.m4a', '.aac'].includes(extname(audio).toLowerCase())) errors.push('Voice chỉ nhận .mp3, .wav, .m4a hoặc .aac.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log('PASS Input contract production: script đã duyệt + final voice.');
