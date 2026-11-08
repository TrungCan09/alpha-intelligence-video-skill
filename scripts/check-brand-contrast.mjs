#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {contrastRatio} from './lib/contrast.mjs';

const args = process.argv.slice(2);
const index = args.indexOf('--config');
const configPath = resolve(index >= 0 ? args[index + 1] : 'assets/remotion-starter/src/brand.config.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const failures = [];

for (const pair of config.allowedTextPairs ?? []) {
  const foreground = config.colors[pair.foreground];
  const background = config.colors[pair.background];
  if (!foreground || !background) {
    failures.push(`Token không tồn tại: ${pair.foreground}/${pair.background}`);
    continue;
  }
  const ratio = contrastRatio(foreground, background);
  const label = `${pair.foreground} ${foreground} / ${pair.background} ${background}: ${ratio.toFixed(2)}:1`;
  if (ratio < pair.min) failures.push(`${label} < ${pair.min}:1`);
  else console.log(`PASS ${label}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`PASS ${config.allowedTextPairs.length} cặp chữ–nền đạt chuẩn.`);
