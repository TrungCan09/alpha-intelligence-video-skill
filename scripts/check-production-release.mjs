#!/usr/bin/env node
import {access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root=resolve(process.argv[2]??'.'); const required=['knowledge/reference-library.json',...['lesson-1','lesson-2','lesson-3'].flatMap((id)=>['video.mp4','manifest.json','transcript.lock.json','shot-index.json','contact-sheet.png'].map((file)=>`assets/reference/production/${id}/${file}`))]; const missing=[];
for (const file of required) try { await access(resolve(root,file)); } catch { missing.push(file); }
if (missing.length) { missing.forEach((file)=>console.error(`BLOCKED Thiếu production asset: ${file}`)); process.exit(1); }
const result=spawnSync(process.execPath,[resolve(root,'scripts/check-reference-library.mjs'),resolve(root,'knowledge/reference-library.json')],{stdio:'inherit'}); if(result.status!==0) process.exit(result.status??1); console.log('PASS Production release gate: đủ ba bài và reference library hợp lệ.');
