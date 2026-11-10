# Migration v2.1 → v3

Cue sheet và transcript lock giữ schema v2. Chỉ video plan chuyển schema.

```bash
node scripts/migrate-plan-v2-to-v3.mjs video-plan.json --out video-plan.v3.json --locked-at 2026-01-01T00:00:00.000Z
```

Script map mọi scene sang `renderMode: legacy`, giữ cue, beat và recipe. Đây là compatibility state, không phải v3 ideation hoàn chỉnh. Muốn chuyển scene sang graph/custom:

1. Tạo ba concept và chọn một concept hợp lệ.
2. Thay legacy payload bằng motion graph hoặc custom component ID.
3. Chạy toàn bộ v3 gates.
4. So sánh render trước/sau tại cùng cue.

Tag `v2.1.0` vẫn là bản ổn định cho dự án chỉ dùng recipe.
