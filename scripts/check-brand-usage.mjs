#!/usr/bin/env node
import {readFile, readdir} from 'node:fs/promises';
import {extname, join, resolve} from 'node:path';

const root = resolve(process.argv[2] ?? 'assets/remotion-starter');
const src = join(root, 'src');
const rootSource = await readFile(join(src, 'Root.tsx'), 'utf8');
const indexSource = await readFile(join(src, 'index.ts'), 'utf8');
const fontSource = await readFile(join(src, 'fonts.ts'), 'utf8');
const primitiveSource = await readFile(join(src, 'primitives.tsx'), 'utf8');
const config = JSON.parse(await readFile(join(src, 'brand.config.json'), 'utf8'));
const failures = [];
const passes = [];

const expected = {
  header: 'CỘNG ĐỒNG ALPHA INTELLIGENCE',
  tagline: 'Học sinh làm chủ AI và Vibecode',
  hero: 'Montserrat',
  vietnamese: 'Be Vietnam Pro',
  heroWeight: 800,
  bodyWeight: 700,
  heroMin: 80,
  bodyMin: 48,
  labelMin: 32,
};
for (const [key, value] of Object.entries(expected)) {
  const actual = key in config.brand ? config.brand[key] : key in config.fonts ? config.fonts[key] : config.sizes[key];
  (actual === value ? passes : failures).push(`${key} = ${JSON.stringify(value)}`);
}

if (indexSource.includes("import './fonts'")) passes.push('Font được tải tập trung tại entrypoint.');
else failures.push("src/index.ts phải import './fonts'.");
for (const face of ["@fontsource/montserrat/800.css", "@fontsource/be-vietnam-pro/700.css"]) {
  if (fontSource.includes(face)) passes.push(`Có font face ${face}.`);
  else failures.push(`Thiếu font face ${face}.`);
}
for (const request of ['800 80px "Montserrat"', '700 48px "Be Vietnam Pro"']) {
  if (primitiveSource.includes(`document.fonts.load('${request}')`)) passes.push(`FontGate yêu cầu ${request}.`);
  else failures.push(`FontGate chưa yêu cầu ${request}.`);
}

const components = [...rootSource.matchAll(/component=\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]);
for (const component of components) {
  const source = await readFile(join(src, `${component}.tsx`), 'utf8');
  if (source.includes('<BrandFrame')) passes.push(`${component} dùng BrandFrame.`);
  else failures.push(`${component} chưa dùng BrandFrame.`);
}

const entries = await readdir(src, {withFileTypes: true});
for (const entry of entries) {
  if (!entry.isFile() || !['.ts', '.tsx'].includes(extname(entry.name))) continue;
  if (entry.name === 'theme.ts') continue;
  const source = await readFile(join(src, entry.name), 'utf8');
  if (/#[0-9a-f]{6}/i.test(source)) failures.push(`Màu hex inline: src/${entry.name}`);
}

for (const name of ['HeroText', 'BodyText', 'MutedText', 'DataLabel']) {
  const source = await readFile(join(src, 'typography.tsx'), 'utf8');
  if (source.includes(`export const ${name}`)) passes.push(`Có typography role ${name}.`);
  else failures.push(`Thiếu typography role ${name}.`);
}

passes.forEach((pass) => console.log(`PASS ${pass}`));
failures.forEach((failure) => console.error(`FAIL ${failure}`));
if (failures.length) process.exit(1);
