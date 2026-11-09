#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const input = process.argv[2];
if (!input) { console.error('Dùng: node scripts/check-storyboard.mjs <storyboard.json>'); process.exit(1); }
const data = JSON.parse(await readFile(resolve(input), 'utf8'));
const errors = [];
const fps = Number(data.fps ?? 30);
const scenes = data.scenes ?? [];
const meaningfulKinds = new Set(['semantic', 'transition', 'focus', 'resolve']);
if (data.hasVoice) {
  const grounding = data.voiceGrounding;
  if (!grounding?.verified || grounding?.visualInference !== false || !grounding?.source) errors.push('Video có voice phải có voiceGrounding đã xác minh; cấm suy cue từ hình ảnh hoặc storyboard cũ.');
}
for (const [index, scene] of scenes.entries()) {
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
  if (!scene.motionConcept) errors.push(`${id}: thiếu motionConcept.`);
  if (!scene.layoutFamily) errors.push(`${id}: thiếu layoutFamily.`);
  if (!scene.layoutChecks?.safeBounds || !scene.layoutChecks?.opticalBalance || !scene.layoutChecks?.diacritics) errors.push(`${id}: thiếu xác nhận safeBounds, opticalBalance hoặc diacritics.`);
  if (!(scene.layoutChecks?.minGapPx >= 16)) errors.push(`${id}: layoutChecks.minGapPx phải tối thiểu 16 px để tránh các cụm liên quan dính nhau khi overshoot.`);
  const beats = scene.beats ?? [];
  if (!beats.length) errors.push(`${id}: thiếu semantic beats.`);
  const sorted = [...beats].sort((a, b) => a.cueStart - b.cueStart);
  const ids = new Set(beats.map((beat) => beat.id));
  for (const beat of beats) {
    const label = `${id}/${beat.id ?? 'beat'}`;
    if (!meaningfulKinds.has(beat.kind)) errors.push(`${label}: kind phải là semantic, transition, focus hoặc resolve.`);
    if (beat.cueStart < scene.start || beat.cueStart > scene.end) errors.push(`${label}: cueStart nằm ngoài scene.`);
    if (beat.visualHit < beat.cueStart - 0.001) errors.push(`${label}: visualHit đi trước semantic cue.`);
    if (beat.onScreenText && beat.readableBy > beat.cueStart + 0.2 + 0.001) errors.push(`${label}: text hoàn tất trễ hơn cue 0,2 giây.`);
    if (!beat.action || !beat.target) errors.push(`${label}: thiếu action hoặc target.`);
    if (data.hasVoice && !beat.spokenText) errors.push(`${label}: thiếu spokenText làm bằng chứng cue từ voice.`);
    if (['connect', 'morph', 'orbit', 'flow'].includes(beat.action) && !beat.visualMeaning) errors.push(`${label}: graphic quan hệ/phép ẩn dụ thiếu visualMeaning.`);
    if (beat.sourceBeatId && !ids.has(beat.sourceBeatId)) errors.push(`${label}: sourceBeatId không tồn tại.`);
    if (beat.action === 'connect' && !beat.sourceBeatId) errors.push(`${label}: connector phải tham chiếu sourceBeatId.`);
    if (beat.action === 'connect') {
      const connector = beat.connector;
      if (!connector?.axis || !connector?.sourceAnchor || !connector?.targetAnchor) errors.push(`${label}: connector thiếu axis/sourceAnchor/targetAnchor.`);
      if (!(connector?.endGapPx >= 8)) errors.push(`${label}: connector cần endGapPx tối thiểu 8 px để tránh bị target che.`);
      if (!['between-cards', 'below-cards'].includes(connector?.layerOrder)) errors.push(`${label}: connector thiếu layerOrder hợp lệ.`);
    }
  }
  const first = sorted[0];
  if (first && first.visualHit - scene.start > 15 / fps + 0.001) errors.push(`${id}: không có thay đổi có nghĩa trong 15 frame đầu.`);
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].visualHit - sorted[i - 1].visualHit;
    if (gap > 90 / fps + 0.001 && !scene.holdReason) errors.push(`${id}: khoảng semantic beat vượt 90 frame mà không có holdReason.`);
  }
  if (scene.end - scene.start > 4 && beats.length < 2 && !scene.holdReason) errors.push(`${id}: scene trên 4 giây phải có diễn tiến nội bộ.`);
  const previous = scenes[index - 1];
  if (previous && previous.motionConcept === scene.motionConcept && previous.layoutFamily === scene.layoutFamily) errors.push(`${id}: lặp cả motionConcept và layoutFamily của scene trước.`);
}
if (!Array.isArray(data.scenes) || !data.scenes.length) errors.push('Storyboard không có scene.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Storyboard hợp lệ: ${data.scenes.length} scene.`);
