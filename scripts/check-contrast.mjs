#!/usr/bin/env node
import {contrastRatio} from './lib/contrast.mjs';

const [foreground, background] = process.argv.slice(2);
if (!foreground || !background) {
  console.error("Dùng: node scripts/check-contrast.mjs '#F9F9F9' '#050D1D'");
  process.exit(1);
}

const ratio = contrastRatio(foreground, background);
console.log(`${foreground} / ${background}: ${ratio.toFixed(2)}:1`);
if (ratio < 4.5) { console.error('FAIL Contrast dưới 4.5:1.'); process.exit(1); }
console.log('PASS Contrast đạt tối thiểu 4.5:1.');
