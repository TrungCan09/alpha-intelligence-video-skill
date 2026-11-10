# Pipeline v3: voice → ideation → motion grammar → master

1. Chạy Faster Whisper và review transcript như v2.
2. Map semantic cue, nhưng chưa xem reference.
3. Tạo `concept-candidates.json` với ba concept/scene; chạy concept gate.
4. Khóa `draftLockedAt`, sau đó mới xem micro-reference và ghi `referenceReviewedAt`.
5. Tạo `video-plan.v3.json` bằng graph, custom hoặc legacy fallback.
6. Chạy plan, graph, novelty, custom và reference-order gates.
7. Build cue lock từ plan v3; cue sheet vẫn schema v2.
8. Render full + semantic, phản biện và rerender ít nhất một vòng.
9. Build QA pack từ MP4 và finalize master với `--concepts`.

Các lệnh chính:

```bash
node scripts/check-concept-exploration.mjs concept-candidates.json
node scripts/check-reference-order.mjs concept-candidates.json video-plan.v3.json
node scripts/check-v3-plan.mjs video-plan.v3.json concept-candidates.json cue-sheet.lock.json
node scripts/check-motion-graph.mjs video-plan.v3.json cue-sheet.lock.json
node scripts/check-motion-novelty.mjs video-plan.v3.json concept-candidates.json
node scripts/check-custom-scene.mjs video-plan.v3.json assets/remotion-starter
```

Không mở master gate nếu concept draft chưa khóa hoặc reference order không hợp lệ.
