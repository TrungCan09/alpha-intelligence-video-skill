#!/usr/bin/env node
import {access, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {sha256File, sha256Value} from './lib/lock-utils.mjs';

const args = process.argv.slice(2); const libraryArg = args[0]; const value = (flag, fallback) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : fallback; }; const sourceRoot = resolve(value('--root', 'assets/reference/production-source'));
if (!libraryArg) { console.error('Dùng: node scripts/check-production-source-library.mjs knowledge/production-source-library.json [--root assets/reference/production-source]'); process.exit(2); }
const library = JSON.parse(await readFile(resolve(libraryArg), 'utf8')); const errors = []; const lessonIds = ['lesson-1', 'lesson-2', 'lesson-3']; const banned = /(^|\/)(node_modules|outputs)(\/|$)|\.(mp3|wav|aac|m4a|mp4|mov)$/iu;
if (library.schemaVersion !== 1 || library.kind !== 'production-source-library') errors.push('Source library schema/kind không hợp lệ.');
if (library.librarySha256 !== sha256Value(Object.fromEntries(Object.entries(library).filter(([key]) => key !== 'librarySha256')))) errors.push('Source library hash không khớp.');
for (const lessonId of lessonIds) {
  const lesson = (library.lessons ?? []).find((item) => item.lessonId === lessonId); if (!lesson) { errors.push(`Thiếu ${lessonId}.`); continue; }
  const mapPath = join(sourceRoot, lessonId, 'source-map.json'); try { await access(mapPath); } catch { errors.push(`${lessonId}: thiếu source map.`); continue; }
  if (lesson.sourceMapSha256 !== await sha256File(mapPath)) errors.push(`${lessonId}: source map đã thay đổi; build lại library.`);
  if (!lesson.composition || !(lesson.files?.length >= 3) || !(lesson.sourceUnits?.length >= 3) || !lesson.doNotCopy?.length || !lesson.qualityNotes?.length) errors.push(`${lessonId}: source map thiếu composition/files/sourceUnits/guardrails.`);
  const unitIds = new Set(); for (const unit of lesson.sourceUnits ?? []) { if (!unit.id || unitIds.has(unit.id) || !unit.files?.length || !unit.semanticFunctions?.length || !unit.techniques?.length || !unit.avoid?.length) errors.push(`${lessonId}: sourceUnit không đủ metadata.`); unitIds.add(unit.id); }
  for (const file of lesson.files ?? []) {
    if (!file.path || banned.test(file.path)) { errors.push(`${lessonId}: file bị cấm hoặc không hợp lệ: ${file.path}`); continue; }
    const path = join(sourceRoot, lessonId, file.path); try { if (file.sha256 !== await sha256File(path)) errors.push(`${lessonId}/${file.path}: hash khác library.`); } catch { errors.push(`${lessonId}/${file.path}: file source không tồn tại.`); }
  }
}
if ((library.lessons ?? []).length !== lessonIds.length) errors.push('Source library phải có đúng ba lesson đã duyệt.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log(`PASS Production source library: ${(library.lessons ?? []).length} lesson, code hash và guardrail hợp lệ.`);
