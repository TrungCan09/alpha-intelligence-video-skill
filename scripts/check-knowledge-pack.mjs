#!/usr/bin/env node
import {access, readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {extname, resolve} from 'node:path';

const args = process.argv.slice(2);
const rootArg = args[0] && !args[0].startsWith('--') ? args[0] : '.';
const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const root = resolve(rootArg);
const knowledgePath = resolve(value('--knowledge') ?? resolve(root, 'knowledge/lessons.json'));
const errors = [];
const categories = new Set(['voice-sync', 'semantic-motion', 'layout', 'typography', 'branding', 'sound', 'scene-rhythm', 'delivery']);
const enforcement = new Set(['validator', 'regression', 'visual-review']);
const requiredFields = ['id', 'category', 'symptom', 'rootCause', 'rule', 'remediation', 'enforcement', 'relatedScripts', 'relatedFixtures', 'referenceSection'];
const exists = async (path) => { try { await access(resolve(root, path)); return true; } catch { return false; } };

const data = JSON.parse(await readFile(knowledgePath, 'utf8'));
if (data.schemaVersion !== 1) errors.push('knowledge/lessons.json phải dùng schemaVersion 1.');
if (data.skillVersion !== '3.3.0') errors.push('Knowledge pack phải khai skillVersion 3.3.0.');

const vocabulary = JSON.parse(await readFile(resolve(root, 'knowledge/motion-vocabulary.json'), 'utf8'));
if (vocabulary.schemaVersion !== 1 || !Array.isArray(vocabulary.groups) || vocabulary.groups.length < 8) errors.push('Motion vocabulary v3 phải có ít nhất 8 nhóm hợp lệ.');
for (const group of vocabulary.groups ?? []) {
  for (const field of ['id', 'meaning', 'useWhen', 'avoidWhen', 'operators', 'parameters', 'qaRisks']) if (group[field] == null) errors.push(`Vocabulary ${group.id ?? '<missing>'}: thiếu ${field}.`);
}
if (!Array.isArray(data.lessons) || !data.lessons.length) errors.push('Knowledge pack không có lesson.');

const ids = new Set();
for (const lesson of data.lessons ?? []) {
  const label = lesson.id ?? '<missing-id>';
  for (const field of requiredFields) if (lesson[field] == null) errors.push(`${label}: thiếu ${field}.`);
  if (!/^[A-Z]{3,4}-\d{3}$/.test(label)) errors.push(`${label}: lesson ID không đúng định dạng AAA-000.`);
  if (ids.has(label)) errors.push(`${label}: lesson ID bị trùng.`); else ids.add(label);
  if (!categories.has(lesson.category)) errors.push(`${label}: category không hợp lệ.`);
  if (!enforcement.has(lesson.enforcement)) errors.push(`${label}: enforcement không hợp lệ.`);
  if (!Array.isArray(lesson.relatedScripts) || !lesson.relatedScripts.length) errors.push(`${label}: phải liên kết ít nhất một script/gate.`);
  if (!Array.isArray(lesson.relatedFixtures) || !lesson.relatedFixtures.length) errors.push(`${label}: phải liên kết ít nhất một fixture/reference.`);
  for (const file of [...(lesson.relatedScripts ?? []), ...(lesson.relatedFixtures ?? [])]) if (!await exists(file)) errors.push(`${label}: file liên kết không tồn tại: ${file}`);
  if (['validator', 'regression'].includes(lesson.enforcement) && (!(lesson.relatedScripts?.length) || !(lesson.relatedFixtures?.length))) errors.push(`${label}: enforcement tự động phải có script và fixture.`);
  const [referenceFile] = String(lesson.referenceSection ?? '').split('#');
  if (!referenceFile || !await exists(referenceFile)) errors.push(`${label}: referenceSection không tồn tại.`);
  else if (!(await readFile(resolve(root, referenceFile), 'utf8')).includes(label)) errors.push(`${label}: reference không nhắc lesson ID.`);
}

for (const file of ['references/production-lessons.md', 'references/failure-catalog.md']) {
  const content = await readFile(resolve(root, file), 'utf8');
  for (const id of content.match(/\b[A-Z]{3,4}-\d{3}\b/g) ?? []) if (!ids.has(id)) errors.push(`${file}: nhắc lesson ID không tồn tại ${id}.`);
}

let tracked = [];
try { tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean); }
catch { errors.push('Không thể chạy git ls-files để privacy scan.'); }
const privatePath = /(^|\/)(private|tests\/private|chat-research)(\/|$)/i;
const privateMedia = new Set(['.mp3', '.m4a', '.aac', '.wav', '.flac']);
const allowedVideo = /^(?:assets\/reference\/alpha-video-v[23]-reference\.mp4|assets\/reference\/production\/lesson-[123]\/video\.mp4)$/i;
const publicSyntheticAudio = /^assets\/remotion-starter\/public\/sfx\/(?:shimmer|soft-hit|tick|whoosh)\.wav$/i;
const textExtensions = new Set(['.md', '.json', '.mjs', '.js', '.ts', '.tsx', '.yml', '.yaml', '.txt', '.py', '.gitignore']);
const secretPatterns = [
  {name: 'đường dẫn Windows riêng tư', regex: /\b[A-Z]:[\\/](?:Users|OneDrive|Documents|Downloads|Desktop)[\\/]/i},
  {name: 'tên file ElevenLabs riêng tư', regex: /ElevenLabs_\d{4}[-_]\d{2}[-_]\d{2}/i},
  {name: 'ảnh clipboard riêng tư', regex: /codex-clipboard-[a-f0-9-]+/i},
  {name: 'chat export riêng tư', regex: /(?:chat|conversation)[-_ ]export\.(?:json|html|txt)/i},
];
for (const file of tracked) {
  const normalized = file.replaceAll('\\', '/');
  if (privatePath.test(normalized)) errors.push(`File private bị track: ${file}`);
  if (privateMedia.has(extname(file).toLowerCase()) && !publicSyntheticAudio.test(normalized)) errors.push(`Audio riêng tư không được track: ${file}`);
  if (extname(file).toLowerCase() === '.mp4' && !allowedVideo.test(normalized)) errors.push(`MP4 không nằm trong whitelist công khai: ${file}`);
  if (!textExtensions.has(extname(file).toLowerCase()) && !file.endsWith('.gitignore')) continue;
  const content = await readFile(resolve(root, file), 'utf8');
  for (const pattern of secretPatterns) if (pattern.regex.test(content)) errors.push(`${file}: phát hiện ${pattern.name}.`);
}

if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Knowledge pack: ${ids.size} lesson, references hợp lệ và privacy scan sạch.`);
