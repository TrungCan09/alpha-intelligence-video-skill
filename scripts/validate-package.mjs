#!/usr/bin/env node
import {access, readFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = resolve(process.argv[2] ?? '.');
const required = ['SKILL.md', 'agents/openai.yaml', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'requirements-asr.txt', 'references/brand-system.md', 'references/source-content-rules.md', 'references/script-elevenlabs.md', 'references/content-timing.md', 'references/motion-language.md', 'references/remotion-patterns-alpha.md', 'references/qa-delivery.md', 'references/pipeline-v2.md', 'references/scene-recipes.md', 'references/migration-v2.md', 'assets/reference/alpha-video-v2-reference.mp4', 'assets/reference/alpha-video-v2-contact-sheet.png', 'assets/remotion-starter/package.json', 'assets/remotion-starter/src/brand.config.json', 'assets/remotion-starter/src/fonts.ts', 'assets/remotion-starter/src/typography.tsx', 'assets/remotion-starter/src/motion.tsx', 'assets/remotion-starter/src/media.tsx', 'assets/remotion-starter/src/AlphaVideoV2.tsx', 'assets/remotion-starter/src/cue-timeline.ts', 'assets/remotion-starter/src/scene-recipes.tsx', 'assets/remotion-starter/src/scene-registry.tsx', 'assets/remotion-starter/src/transcript.lock.json', 'assets/remotion-starter/src/cue-sheet.lock.json', 'assets/remotion-starter/src/video-plan.json', 'scripts/transcribe-audio.py', 'scripts/lock-reviewed-transcript.mjs', 'scripts/build-cue-lock.mjs', 'scripts/check-cue-lock.mjs', 'scripts/check-timeline-binding.mjs', 'scripts/check-scene-diversity.mjs', 'scripts/build-qa-pack.mjs', 'scripts/check-qa-report.mjs', 'scripts/finalize-master.mjs', 'scripts/build-contact-sheet.mjs', 'scripts/test-v2-pipeline.mjs', 'scripts/analyze-audio.mjs', 'scripts/estimate-voiceover.mjs', 'scripts/check-storyboard.mjs', 'scripts/audit-motion-density.mjs', 'scripts/check-contrast.mjs', 'scripts/check-brand-contrast.mjs', 'scripts/check-brand-usage.mjs', 'scripts/check-brand-font.mjs', 'scripts/install-brand-font.mjs', 'scripts/generate-sfx.mjs', 'scripts/check-alpha-video.mjs', 'scripts/extract-qa-frames.mjs', 'scripts/quick_validate.py', 'tests/fixtures/canonical-hash.json', 'tests/fixtures/storyboard.valid.json', 'tests/fixtures/storyboard.invalid.json', 'tests/fixtures/storyboard.invalid-static.json', 'tests/fixtures/storyboard.invalid-sync.json', 'tests/fixtures/storyboard.invalid-connector.json', 'tests/fixtures/storyboard.invalid-ambiguous.json', 'tests/fixtures/storyboard.invalid-geometry.json', 'tests/fixtures/storyboard.invalid-voice-grounding.json', 'tests/fixtures/brand.invalid.json', 'tests/fixtures/brand.invalid-identity.json'];
const errors = [];
for (const file of required) { try { await access(resolve(root, file)); } catch { errors.push(`Thiếu ${file}`); } }
try { if ((await stat(resolve(root, 'assets/reference/alpha-video-v2-reference.mp4'))).size >= 8 * 1024 * 1024) errors.push('Reference MP4 phải nhỏ hơn 8 MB.'); } catch {}
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
const pipeline = await readFile(resolve(root, 'references/pipeline-v2.md'), 'utf8');
const recipes = await readFile(resolve(root, 'references/scene-recipes.md'), 'utf8');
for (const [condition, message] of [
  [brand.includes('Học sinh làm chủ AI và Vibecode'), 'Tagline cố định'],
  [brand.includes('brand.config.json') && brand.includes('BrandFrame') && brand.includes('HeroText'), 'Brand token và semantic components'],
  [brand.includes('allowedTextPairs') && brand.includes('4.5:1'), 'Ma trận contrast thương hiệu'],
  [brand.includes('Cy Grotesk V3 Wide') && brand.includes('Montserrat') && brand.includes('fallback'), 'Cy Grotesk ngoài repository và fallback'],
  [brand.includes('#1B2D57') && brand.includes('#365380') && brand.includes('#ACDDFA'), 'Palette branding gốc'],
  [brand.includes('alpha') && brand.includes('intelligence') && brand.includes('180°'), 'Gradient Alpha và Intelligence'],
  [brand.includes('robot–cube không thuộc phạm vi'), 'Hero visual ngoài phạm vi'],
  [sourceRules.includes('1 giây cho mỗi 6 từ') && sourceRules.includes('4.5:1'), 'Thời gian đọc và contrast'],
  [sourceRules.includes('A/B') && sourceRules.includes('01/02') && sourceRules.includes('số item'), 'Numbering và list integrity'],
  [sourceRules.includes('CTA') && sourceRules.includes('bài sau'), 'CTA và follow-up transition'],
  [elevenlabs.includes('Phiên bản 1') && elevenlabs.includes('Phiên bản 2'), 'Hai phiên bản ElevenLabs'],
  [elevenlabs.includes('dưới 2 phút') && elevenlabs.includes('[Độ dài: ~X chữ | Thời lượng ước tính: ~X phút Y giây]'), 'Duration và output contract ElevenLabs'],
  [elevenlabs.includes('AI → ây-ai') && elevenlabs.includes('On-screen text'), 'Phiên âm chỉ dành cho voice'],
  [elevenlabs.includes('Bạn có muốn tăng hay giảm thời lượng nói'), 'Câu hỏi tinh chỉnh cuối'],
  [timing.includes('Text không hiện trước semantic cue'), 'Sửa animation đi trước voice'],
  [timing.includes('Connector không đi trước nguồn'), 'Thứ tự connector theo nguồn'],
  [timing.includes('Voice-grounding gate') && timing.includes('spokenText') && timing.includes('Không suy lời thoại'), 'Voice-grounding trước storyboard'],
  [patterns.includes('OffthreadVideo') && patterns.includes('AlphaCaptions') && patterns.includes('KenBurnsImage'), 'Media và captions primitives'],
  [motion.includes('15 frame đầu') && motion.includes('90 frame'), 'Scene pacing'],
  [motion.includes('semantic beat') && motion.includes('ambient'), 'Semantic motion không bị thay bằng decoration'],
  [motion.includes('Semantic legibility gate') && motion.includes('visualMeaning'), 'Graphic phải truyền đạt ý rõ ràng'],
  [motion.includes('Hình học và cân bằng') && motion.includes('end gap') && motion.includes('Optical balance'), 'Connector geometry và cân bằng quang học'],
  [qa.includes('Dấu không clipping') && qa.includes('Không overlap'), 'QA tiếng Việt và overlap'],
  [skill.includes('Faster Whisper') && skill.includes('cue-sheet.lock.json') && skill.includes('qaMode="semantic"'), 'Pipeline v2 bắt buộc trong SKILL.md'],
  [pipeline.includes('Không chứa timestamp') || pipeline.includes('không chứa timestamp'), 'Video plan không nhập timestamp'],
  [pipeline.includes('finalize-master') && pipeline.includes('build-qa-pack'), 'QA gate và finalizer v2'],
  [recipes.includes('Chín recipe') && recipes.includes('không quá 3 giây'), 'Scene registry và pacing'],
]) if (!condition) errors.push(`Thiếu forward-test rule: ${message}`);

const storyboardCases = [
  ['tests/fixtures/storyboard.valid.json', true],
  ['tests/fixtures/storyboard.invalid-static.json', false],
  ['tests/fixtures/storyboard.invalid-sync.json', false],
  ['tests/fixtures/storyboard.invalid-connector.json', false],
  ['tests/fixtures/storyboard.invalid-ambiguous.json', false],
  ['tests/fixtures/storyboard.invalid-geometry.json', false],
  ['tests/fixtures/storyboard.invalid-voice-grounding.json', false],
];
for (const [fixture, shouldPass] of storyboardCases) {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/check-storyboard.mjs'), resolve(root, fixture)], {encoding: 'utf8'});
  if ((result.status === 0) !== shouldPass) errors.push(`Storyboard forward-test sai kỳ vọng: ${fixture}`);
}
const v2 = spawnSync(process.execPath, [resolve(root, 'scripts/test-v2-pipeline.mjs'), root], {encoding: 'utf8'});
if (v2.status !== 0) errors.push(`V2 regression suite thất bại: ${v2.stderr || v2.stdout}`);
if (errors.length) { errors.forEach((x) => console.error(`FAIL ${x}`)); process.exit(1); }
console.log(`PASS Package hợp lệ: ${required.length} file bắt buộc.`);
