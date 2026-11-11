#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {readJson, sha256Value} from './lib/lock-utils.mjs';
import {conceptDraftPayload} from './lib/v3-utils.mjs';

const args=process.argv.slice(2); const conceptsArg=args[0]; const libraryArg=args[1]; const index=args.indexOf('--out'); const out=index>=0?args[index+1]:undefined;
if(!conceptsArg||!libraryArg||!out){console.error('Dùng: node scripts/build-reference-review-lock.mjs concept-candidates.json reference-library.json --out reference-review.lock.json');process.exit(2);}
const concepts=await readJson(resolve(conceptsArg)); const library=await readJson(resolve(libraryArg)); const lock={schemaVersion:1,conceptDraftSha256:sha256Value(conceptDraftPayload(concepts)),referenceLibrarySha256:library.librarySha256,reviewedAt:new Date().toISOString(),scenes:(concepts.sceneConceptSets??[]).map((scene)=>({sceneId:scene.sceneId,referenceShotIds:[],techniquesToLearn:[],elementsNotToCopy:[],thesisUnchanged:true}))}; await writeFile(resolve(out),`${JSON.stringify(lock,null,2)}\n`); console.log(`PASS Đã tạo reference review template cho ${lock.scenes.length} scene. Điền micro-reference rồi chạy validator.`);
