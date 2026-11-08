#!/usr/bin/env node
import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const required = ['SKILL.md', 'agents/openai.yaml', 'README.md', 'LICENSE', 'references/brand-system.md', 'references/script-elevenlabs.md', 'references/content-timing.md', 'references/motion-language.md', 'references/qa-delivery.md', 'assets/remotion-starter/package.json', 'scripts/analyze-audio.mjs', 'scripts/estimate-voiceover.mjs', 'scripts/check-alpha-video.mjs', 'scripts/extract-qa-frames.mjs', 'scripts/quick_validate.py'];
const errors = [];
for (const file of required) { try { await access(resolve(root, file)); } catch { errors.push(`Thiếu ${file}`); } }
const skill = await readFile(resolve(root, 'SKILL.md'), 'utf8');
if (!skill.startsWith('---\nname: alpha-intelligence-video-skill\ndescription:')) errors.push('Frontmatter SKILL.md không hợp lệ.');
if ((skill.match(/^---$/gm) ?? []).length < 2) errors.push('SKILL.md thiếu frontmatter đóng.');
const yaml = await readFile(resolve(root, 'agents/openai.yaml'), 'utf8');
for (const token of ['display_name: "Alpha Intelligence Video"', 'brand_color: "#20F669"', 'allow_implicit_invocation: true', '$alpha-intelligence-video-skill']) if (!yaml.includes(token)) errors.push(`agents/openai.yaml thiếu ${token}`);
const brand = await readFile(resolve(root, 'references/brand-system.md'), 'utf8');
const elevenlabs = await readFile(resolve(root, 'references/script-elevenlabs.md'), 'utf8');
const timing = await readFile(resolve(root, 'references/content-timing.md'), 'utf8');
const motion = await readFile(resolve(root, 'references/motion-language.md'), 'utf8');
const qa = await readFile(resolve(root, 'references/qa-delivery.md'), 'utf8');
for (const [condition, message] of [
  [brand.includes('Học sinh làm chủ AI và Vibecode'), 'Tagline cố định'],
  [elevenlabs.includes('Phiên bản 1') && elevenlabs.includes('Phiên bản 2'), 'Hai phiên bản ElevenLabs'],
  [elevenlabs.includes('dưới 2 phút') && elevenlabs.includes('[Độ dài: ~X chữ | Thời lượng ước tính: ~X phút Y giây]'), 'Duration và output contract ElevenLabs'],
  [elevenlabs.includes('AI → ây-ai') && elevenlabs.includes('On-screen text'), 'Phiên âm chỉ dành cho voice'],
  [elevenlabs.includes('Bạn có muốn tăng hay giảm thời lượng nói'), 'Câu hỏi tinh chỉnh cuối'],
  [timing.includes('Text không hiện trước semantic cue'), 'Sửa animation đi trước voice'],
  [timing.includes('Connector không đi trước nguồn'), 'Thứ tự connector theo nguồn'],
  [qa.includes('Dấu không clipping') && qa.includes('Không overlap'), 'QA tiếng Việt và overlap'],
]) if (!condition) errors.push(`Thiếu forward-test rule: ${message}`);
if (errors.length) { errors.forEach((x) => console.error(`FAIL ${x}`)); process.exit(1); }
console.log(`PASS Package hợp lệ: ${required.length} file bắt buộc.`);
