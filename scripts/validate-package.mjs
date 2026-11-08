#!/usr/bin/env node
import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const required = ['SKILL.md', 'agents/openai.yaml', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'references/brand-system.md', 'references/source-content-rules.md', 'references/script-elevenlabs.md', 'references/content-timing.md', 'references/motion-language.md', 'references/remotion-patterns-alpha.md', 'references/qa-delivery.md', 'assets/remotion-starter/package.json', 'assets/remotion-starter/src/brand.config.json', 'assets/remotion-starter/src/fonts.ts', 'assets/remotion-starter/src/typography.tsx', 'assets/remotion-starter/src/motion.tsx', 'assets/remotion-starter/src/media.tsx', 'scripts/analyze-audio.mjs', 'scripts/estimate-voiceover.mjs', 'scripts/check-storyboard.mjs', 'scripts/check-contrast.mjs', 'scripts/check-brand-contrast.mjs', 'scripts/check-brand-usage.mjs', 'scripts/generate-sfx.mjs', 'scripts/check-alpha-video.mjs', 'scripts/extract-qa-frames.mjs', 'scripts/quick_validate.py', 'tests/fixtures/storyboard.valid.json', 'tests/fixtures/storyboard.invalid.json', 'tests/fixtures/brand.invalid.json'];
const errors = [];
for (const file of required) { try { await access(resolve(root, file)); } catch { errors.push(`Thiếu ${file}`); } }
const skill = await readFile(resolve(root, 'SKILL.md'), 'utf8');
if (!skill.startsWith('---\nname: alpha-intelligence-video-skill\ndescription:')) errors.push('Frontmatter SKILL.md không hợp lệ.');
if ((skill.match(/^---$/gm) ?? []).length < 2) errors.push('SKILL.md thiếu frontmatter đóng.');
const yaml = await readFile(resolve(root, 'agents/openai.yaml'), 'utf8');
for (const token of ['display_name: "Alpha Intelligence Video"', 'brand_color: "#20F669"', 'allow_implicit_invocation: true', '$alpha-intelligence-video-skill']) if (!yaml.includes(token)) errors.push(`agents/openai.yaml thiếu ${token}`);
const brand = await readFile(resolve(root, 'references/brand-system.md'), 'utf8');
const sourceRules = await readFile(resolve(root, 'references/source-content-rules.md'), 'utf8');
const elevenlabs = await readFile(resolve(root, 'references/script-elevenlabs.md'), 'utf8');
const timing = await readFile(resolve(root, 'references/content-timing.md'), 'utf8');
const motion = await readFile(resolve(root, 'references/motion-language.md'), 'utf8');
const patterns = await readFile(resolve(root, 'references/remotion-patterns-alpha.md'), 'utf8');
const qa = await readFile(resolve(root, 'references/qa-delivery.md'), 'utf8');
for (const [condition, message] of [
  [brand.includes('Học sinh làm chủ AI và Vibecode'), 'Tagline cố định'],
  [brand.includes('brand.config.json') && brand.includes('BrandFrame') && brand.includes('HeroText'), 'Brand token và semantic components'],
  [brand.includes('allowedTextPairs') && brand.includes('4.5:1'), 'Ma trận contrast thương hiệu'],
  [sourceRules.includes('1 giây cho mỗi 6 từ') && sourceRules.includes('4.5:1'), 'Thời gian đọc và contrast'],
  [sourceRules.includes('A/B') && sourceRules.includes('01/02') && sourceRules.includes('số item'), 'Numbering và list integrity'],
  [sourceRules.includes('CTA') && sourceRules.includes('bài sau'), 'CTA và follow-up transition'],
  [elevenlabs.includes('Phiên bản 1') && elevenlabs.includes('Phiên bản 2'), 'Hai phiên bản ElevenLabs'],
  [elevenlabs.includes('dưới 2 phút') && elevenlabs.includes('[Độ dài: ~X chữ | Thời lượng ước tính: ~X phút Y giây]'), 'Duration và output contract ElevenLabs'],
  [elevenlabs.includes('AI → ây-ai') && elevenlabs.includes('On-screen text'), 'Phiên âm chỉ dành cho voice'],
  [elevenlabs.includes('Bạn có muốn tăng hay giảm thời lượng nói'), 'Câu hỏi tinh chỉnh cuối'],
  [timing.includes('Text không hiện trước semantic cue'), 'Sửa animation đi trước voice'],
  [timing.includes('Connector không đi trước nguồn'), 'Thứ tự connector theo nguồn'],
  [patterns.includes('OffthreadVideo') && patterns.includes('AlphaCaptions') && patterns.includes('KenBurnsImage'), 'Media và captions primitives'],
  [motion.includes('15 frame đầu') && motion.includes('90 frame'), 'Scene pacing'],
  [qa.includes('Dấu không clipping') && qa.includes('Không overlap'), 'QA tiếng Việt và overlap'],
]) if (!condition) errors.push(`Thiếu forward-test rule: ${message}`);
if (errors.length) { errors.forEach((x) => console.error(`FAIL ${x}`)); process.exit(1); }
console.log(`PASS Package hợp lệ: ${required.length} file bắt buộc.`);
