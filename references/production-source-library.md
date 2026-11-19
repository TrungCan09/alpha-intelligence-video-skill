# Production Source Reference Library

Đây là thư viện code đã lọc từ ba video Alpha Intelligence được duyệt. Nó dùng để học **cách hiện thực hóa** motion trong Remotion, không phải để sao chép visual thesis, cue, copy hay scene order.

## Khi dùng

Chỉ mở source sau khi `concept-candidates.json` đã được khóa. Chọn tối đa hai `sourceUnit` cho mỗi scene qua `production-source-review.lock.json`.

- Đọc `source-map.json` trước; chỉ mở các file TSX/TS được map trỏ tới.
- Học technique, relation giữa element và cách exit/entrance được tổ chức.
- Không copy literal on-screen text, `staticFile('voice/...')`, cue second, SFX time, layout fingerprint hoặc whole scene.
- Nếu source dùng timing số lịch sử, thay toàn bộ bằng cue helper của production hiện tại.

## Cấu trúc

- `shared/`: primitive nền, safe stage, typography, grade và theme lịch sử.
- `lesson-1/`: contrast, lựa chọn song song, câu hỏi tích lũy, đòn bẩy.
- `lesson-2/`: giải thích cơ chế, token process, context comparison, system boundary.
- `lesson-3/`: hook mâu thuẫn, term reveal, risk grid, checklist xác minh.

`source-map.json` là index có thẩm quyền. `knowledge/production-source-library.json` khóa hash của từng file; nếu source đổi, build lại library và review lock.

## Gate

```text
node scripts/build-production-source-library.mjs assets/reference/production-source --out knowledge/production-source-library.json
node scripts/build-production-source-review-lock.mjs concept-candidates.json knowledge/production-source-library.json --out production-source-review.lock.json
# Điền sourceUnitIds, techniquesToLearn và elementsNotToCopy theo từng scene.
node scripts/check-production-source-review.mjs production-source-review.lock.json --concepts concept-candidates.json --library knowledge/production-source-library.json
```

Không có source review lock hợp lệ thì video production có `sourceReferenceMode: "production-source-library"` không được finalize.
