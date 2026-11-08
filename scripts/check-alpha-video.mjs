#!/usr/bin/env node
import {readFile, readdir} from 'node:fs/promises';
import {extname, join, resolve} from 'node:path';
import {resolveMediaTool, run} from './lib/media-tools.mjs';

const args = process.argv.slice(2);
const value = (flag, fallback = '') => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : fallback; };
const root = resolve(value('--project', 'assets/remotion-starter'));
const video = value('--video');
const expectAudio = args.includes('--expect-audio');
const failures = []; const passes = [];
async function files(dir) { return (await readdir(dir, {withFileTypes: true})).flatMap((e) => e.isDirectory() ? [] : [join(dir, e.name)]); }
const src = join(root, 'src');
const sourceFiles = (await files(src)).filter((f) => ['.ts', '.tsx'].includes(extname(f)));
const all = (await Promise.all(sourceFiles.map((f) => readFile(f, 'utf8')))).join('\n');
const must = ['CỘNG ĐỒNG ALPHA INTELLIGENCE', 'Học sinh làm chủ AI và Vibecode', '#050D1D', '#081938', '#20F669', '#00FCFE', '#263BE1', '#4FA8D5'];
for (const token of must) (all.includes(token) ? passes : failures).push(`Có token bắt buộc: ${token}`);
for (const token of ['width: 1080', 'height: 1920', 'fps: 30', 'safe: {x: 60, top: 150, bottom: 270}']) (all.includes(token) ? passes : failures).push(`Có invariant: ${token}`);
if (!all.includes('frameAt(')) failures.push('Timeline phải đổi giây sang frame qua frameAt().'); else passes.push('Timeline dùng frameAt().');
for (const file of sourceFiles.filter((file) => !file.endsWith('theme.ts'))) {
  const content = await readFile(file, 'utf8');
  if (/#[0-9a-f]{6}/i.test(content)) failures.push(`Màu hex inline ngoài theme: ${file}`);
}
if (!failures.some((message) => message.startsWith('Màu hex inline'))) passes.push('Không có màu hex inline ngoài theme.');

if (video) {
  const ffprobe = await resolveMediaTool('ffprobe', root);
  const probe = JSON.parse(run(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', resolve(video)]).stdout);
  const v = probe.streams.find((s) => s.codec_type === 'video'); const a = probe.streams.find((s) => s.codec_type === 'audio');
  for (const [ok, msg] of [[v?.codec_name === 'h264', 'Codec video H.264'], [v?.width === 1080 && v?.height === 1920, 'Kích thước 1080×1920']]) (ok ? passes : failures).push(msg);
  if (expectAudio) (a?.codec_name === 'aac' ? passes : failures).push('Codec audio AAC');
  else if (a) (a.codec_name === 'aac' ? passes : failures).push('Nếu có audio, codec phải là AAC');
}
passes.forEach((x) => console.log(`PASS ${x}`));
failures.forEach((x) => console.error(`FAIL ${x}`));
if (failures.length) process.exit(1);
