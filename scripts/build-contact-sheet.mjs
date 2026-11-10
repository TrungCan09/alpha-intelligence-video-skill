#!/usr/bin/env node
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {deflateSync, inflateSync} from 'node:zlib';
import {resolveMediaTool} from './lib/media-tools.mjs';

const args = process.argv.slice(2);
const video = args.find((arg) => !arg.startsWith('--'));
const value = (flag, fallback = '') => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const output = value('--out');
const times = value('--times', '1,3,6,10').split(',').map(Number);
if (!video || !output || times.some((time) => !Number.isFinite(time))) {
  console.error('Dùng: node scripts/build-contact-sheet.mjs <video> --times 1,3,6,10 --out contact-sheet.png');
  process.exit(1);
}

const crcTable = Array.from({length: 256}, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buffer) => { let c = 0xffffffff; for (const byte of buffer) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const name = Buffer.from(type); const result = Buffer.alloc(data.length + 12); result.writeUInt32BE(data.length, 0); name.copy(result, 4); data.copy(result, 8); result.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8); return result; };
const paeth = (a, b, c) => { const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
const decode = (png) => {
  let cursor = 8; let width = 0; let height = 0; let colorType = 0; const idat = [];
  while (cursor + 12 <= png.length) { const length = png.readUInt32BE(cursor); const type = png.toString('ascii', cursor + 4, cursor + 8); const data = png.subarray(cursor + 8, cursor + 8 + length); if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9]; } if (type === 'IDAT') idat.push(data); cursor += length + 12; }
  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : 0;
  if (!channels) throw new Error(`PNG color type ${colorType} chưa được hỗ trợ.`);
  const packed = inflateSync(Buffer.concat(idat)); const stride = width * channels; const pixels = Buffer.alloc(stride * height); let source = 0;
  for (let y = 0; y < height; y++) { const filter = packed[source++]; const row = y * stride; for (let x = 0; x < stride; x++) { const raw = packed[source++]; const left = x >= channels ? pixels[row + x - channels] : 0; const up = y ? pixels[row - stride + x] : 0; const upperLeft = y && x >= channels ? pixels[row - stride + x - channels] : 0; pixels[row + x] = (filter === 0 ? raw : filter === 1 ? raw + left : filter === 2 ? raw + up : filter === 3 ? raw + Math.floor((left + up) / 2) : raw + paeth(left, up, upperLeft)) & 255; } }
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) { rgba[i * 4] = pixels[i * channels]; rgba[i * 4 + 1] = pixels[i * channels + 1]; rgba[i * 4 + 2] = pixels[i * channels + 2]; rgba[i * 4 + 3] = channels === 4 ? pixels[i * 4 + 3] : 255; }
  return {width, height, rgba};
};
const encode = ({width, height, rgba}) => { const rows = Buffer.alloc((width * 4 + 1) * height); for (let y = 0; y < height; y++) { const offset = y * (width * 4 + 1); rows[offset] = 0; rgba.copy(rows, offset + 1, y * width * 4, (y + 1) * width * 4); } const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6; return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(rows, {level: 9})), chunk('IEND', Buffer.alloc(0))]); };

await mkdir(dirname(resolve(output)), {recursive: true});
const temporary = await mkdtemp(resolve(tmpdir(), 'alpha-contact-'));
try {
  const ffmpeg = await resolveMediaTool('ffmpeg'); const frames = [];
  for (const [index, time] of times.entries()) { const path = resolve(temporary, `${index}.png`); const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-ss', String(time), '-i', resolve(video), '-vf', 'scale=540:960:flags=lanczos', '-frames:v', '1', '-y', path], {encoding: 'utf8'}); if (result.status !== 0) throw new Error(result.stderr || `ffmpeg thất bại: ${result.status}`); frames.push(decode(await readFile(path))); }
  const width = frames.reduce((sum, frame) => sum + frame.width, 0); const height = Math.max(...frames.map((frame) => frame.height)); const rgba = Buffer.alloc(width * height * 4); let offsetX = 0;
  for (const frame of frames) { for (let y = 0; y < frame.height; y++) frame.rgba.copy(rgba, (y * width + offsetX) * 4, y * frame.width * 4, (y + 1) * frame.width * 4); offsetX += frame.width; }
  await writeFile(resolve(output), encode({width, height, rgba}));
} finally { await rm(temporary, {recursive: true, force: true}); }
console.log(`PASS Contact sheet được trích trực tiếp từ MP4: ${resolve(output)}`);
