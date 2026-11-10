# Motion grammar v3

## Data flow

`concept-candidates.json` → `video-plan.v3.json` → `MotionGraphRenderer` hoặc custom registry → semantic render → QA.

Plan không chứa timestamp số. Boundary và operation đều tham chiếu cue ID từ `cue-sheet.lock.json`.

## Graph vocabulary

- Elements: text, card, shape, connector, token-field, mask, group, media.
- Layouts: stack, split, grid, axis-flow, radial, stage, freeform.
- Operators: enter, exit, assemble, disassemble, split, merge, morph, draw, scan, focus, freeze, verify, count, camera.

Đọc đúng group trong `knowledge/motion-vocabulary.json` theo motion verbs đã chọn; không tải toàn bộ vocabulary nếu scene chỉ cần một nhóm.

Connector phải tham chiếu source/target element và named anchors. Freeform cần geometry review ở entrance, overshoot, hold và exit.

## Custom TSX contract

Custom component nhận `{scene, qaMode}` và đăng ký bằng ID. Timing chỉ dùng cue helpers; styling chỉ dùng Alpha theme. Manifest bắt buộc có fingerprint, element relationships, lý do graph không đủ và xác nhận semantic mode giữ ý nghĩa.

Custom scene không phải cách bỏ qua graph validation. Nó là escape hatch cho choreography thật sự không thể mô tả bằng graph.
