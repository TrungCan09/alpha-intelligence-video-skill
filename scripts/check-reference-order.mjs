#!/usr/bin/env node
import {resolve} from 'node:path';
import {readJson} from './lib/lock-utils.mjs';

const input = process.argv[2];
if (!input) { console.error('Dùng: node scripts/check-reference-order.mjs concept-candidates.json [video-plan.v3.json]'); process.exit(2); }
const concepts = await readJson(resolve(input)); const plan = process.argv[3] ? await readJson(resolve(process.argv[3])) : null; const errors = [];
const draft = Date.parse(concepts.draftLockedAt); const reviewed = Date.parse(concepts.referenceReviewedAt);
if (!Number.isFinite(draft)) errors.push('draftLockedAt không hợp lệ.');
if (!Number.isFinite(reviewed)) errors.push('referenceReviewedAt không hợp lệ; phải ghi sau khi khóa concept draft.');
if (Number.isFinite(draft) && Number.isFinite(reviewed) && reviewed <= draft) errors.push('Reference phải được xem sau khi khóa concept draft.');
if (plan && (plan.conceptDraftLockedAt !== concepts.draftLockedAt || plan.referenceReviewedAt !== concepts.referenceReviewedAt)) errors.push('Video plan không giữ đúng concept/reference order đã khóa.');
if (errors.length) { errors.forEach((error) => console.error(`FAIL ${error}`)); process.exit(1); }
console.log('PASS Reference review diễn ra sau concept draft.');
