#!/usr/bin/env node

const [foreground, background] = process.argv.slice(2);
if (!foreground || !background) {
  console.error("Dùng: node scripts/check-contrast.mjs '#F9F9F9' '#050D1D'");
  process.exit(1);
}

const parse = (hex) => {
  const value = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`Màu không hợp lệ: ${hex}`);
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
};
const luminance = (hex) => parse(hex).map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
const first = luminance(foreground); const second = luminance(background);
const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
console.log(`${foreground} / ${background}: ${ratio.toFixed(2)}:1`);
if (ratio < 4.5) { console.error('FAIL Contrast dưới 4.5:1.'); process.exit(1); }
console.log('PASS Contrast đạt tối thiểu 4.5:1.');
