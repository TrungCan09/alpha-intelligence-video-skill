#!/usr/bin/env node
import {readFile, readdir} from 'node:fs/promises';
import {extname, join, resolve} from 'node:path';

const args = process.argv.slice(2);
const value = (flag, fallback = '') => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; };
const root = resolve(value('--project', 'assets/remotion-starter'));
const src = join(root, 'src');
const rootSource = await readFile(join(src, 'Root.tsx'), 'utf8');
const indexSource = await readFile(join(src, 'index.ts'), 'utf8');
const fontSource = await readFile(join(src, 'fonts.ts'), 'utf8');
const primitiveSource = await readFile(join(src, 'primitives.tsx'), 'utf8');
const config = JSON.parse(await readFile(resolve(value('--config', join(src, 'brand.config.json'))), 'utf8'));
const failures = [];
const passes = [];

const expected = {
  header: 'CỘNG ĐỒNG ALPHA INTELLIGENCE',
  tagline: 'Học sinh làm chủ AI và Vibecode',
  brandWide: 'Cy Grotesk V3 Wide',
  support: 'Montserrat',
  brandWeight: 800,
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
const expectedColors = {
  canvas: '#081938', surface: '#1B2D57', steel: '#365380', text: '#F9F9F9',
  cyan: '#00FCFE', green: '#20F669', blueLavender: '#263BE1', lightBlue: '#ACDDFA',
};
for (const [key, value] of Object.entries(expectedColors)) {
  (config.colors[key] === value ? passes : failures).push(`${key} = ${value}`);
}
for (const [role, expectedGradient] of Object.entries({
  alpha: {angle: 180, from: 'text', to: 'blueLavender'},
  intelligence: {angle: 180, from: 'text', to: 'green'},
})) {
  const actual = config.gradients?.[role];
  const matches = actual?.angle === expectedGradient.angle && actual?.from === expectedGradient.from && actual?.to === expectedGradient.to;
  (matches ? passes : failures).push(`Gradient ${role}: 180° ${expectedGradient.from} → ${expectedGradient.to}`);
}
if ((config.allowedTextPairs ?? []).some((pair) => pair.foreground === 'steel')) failures.push('Steel không được dùng làm chữ trong allowedTextPairs.');
else passes.push('Steel chỉ dùng cho surface/border/graphics.');

if (indexSource.includes("import './fonts'")) passes.push('Font được tải tập trung tại entrypoint.');
else failures.push("src/index.ts phải import './fonts'.");
for (const face of ["@fontsource/montserrat/800.css", "@fontsource/montserrat/700.css"]) {
  if (fontSource.includes(face)) passes.push(`Có font face ${face}.`);
  else failures.push(`Thiếu font face ${face}.`);
}
if (fontSource.includes('@fontsource/be-vietnam-pro')) failures.push('Be Vietnam Pro không còn thuộc branding gốc.');
else passes.push('Không còn phụ thuộc Be Vietnam Pro.');
if (primitiveSource.includes('loadAlphaFonts()')) passes.push('FontGate dùng loader font thương hiệu.');
else failures.push('FontGate chưa dùng loadAlphaFonts().');
for (const token of ['new FontFace(', 'brandAssetPath', 'cyGroteskAvailable', 'Montserrat 800 fallback']) {
  if (fontSource.includes(token)) passes.push(`Font loader có ${token}.`);
  else failures.push(`Font loader thiếu ${token}.`);
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

for (const name of ['HeroText', 'BrandWordmark', 'BodyText', 'MutedText', 'DataLabel']) {
  const source = await readFile(join(src, 'typography.tsx'), 'utf8');
  if (source.includes(`export const ${name}`)) passes.push(`Có typography role ${name}.`);
  else failures.push(`Thiếu typography role ${name}.`);
}

passes.forEach((pass) => console.log(`PASS ${pass}`));
failures.forEach((failure) => console.error(`FAIL ${failure}`));
if (failures.length) process.exit(1);
