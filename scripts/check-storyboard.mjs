#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const input = process.argv[2];
if (!input) { console.error('Dùng: node scripts/check-storyboard.mjs <storyboard.json>'); process.exit(1); }
const data = JSON.parse(await readFile(resolve(input), 'utf8'));
const errors = [];
for (const [index, scene] of (data.scenes ?? []).entries()) {
  const id = scene.id ?? `scene-${index + 1}`;
  if (!(scene.end > scene.start)) errors.push(`${id}: thời gian scene không hợp lệ.`);
  if (scene.supportStart != null && scene.titleReady != null && scene.supportStart < scene.titleReady) errors.push(`${id}: supporting content xuất hiện trước khi title hoàn tất.`);
  const minimum = (scene.onScreenWords ?? 0) / 6;
  if ((scene.displaySeconds ?? scene.end - scene.start) + 0.001 < minimum) errors.push(`${id}: thời gian đọc dưới 1 giây/6 từ.`);
  if (scene.list && scene.list.items?.length !== scene.list.sourceCount) errors.push(`${id}: số item không khớp nguồn.`);
  if (scene.parallelLabels && !(['', 'A/B'].includes(scene.parallelLabels))) errors.push(`${id}: lựa chọn song song chỉ dùng A/B hoặc không nhãn.`);
  if (/Episode XX|Part XX|Bài \?/i.test(scene.episodeLabel ?? '')) errors.push(`${id}: episode placeholder không hợp lệ.`);
  if (scene.episodeLabel && !scene.episodeVerified) errors.push(`${id}: episode label chưa được xác minh.`);
  if ((scene.contentCentroidY ?? 0.5) < 0.4) errors.push(`${id}: nội dung bị dồn vào 40% phía trên.`);
}
if (!Array.isArray(data.scenes) || !data.scenes.length) errors.push('Storyboard không có scene.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Storyboard hợp lệ: ${data.scenes.length} scene.`);
