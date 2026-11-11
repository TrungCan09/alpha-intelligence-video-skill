# Visual Critic Loop v3.1

Đọc reference này sau khi đã render candidate MP4. Không tự chấm từ source TSX hoặc Remotion preview.

## Hai tầng kiểm định

1. Chạy `build-visual-review-pack.mjs`. Script giải mã toàn bộ frame ở FPS gốc, ghi luma, variance, frame delta và anomaly; sau đó trích cue, transition, midpoint và anomaly thành contact sheet theo scene.
2. Dùng khả năng nhìn ảnh của agent để xem mọi contact sheet ở độ phân giải gốc, các frame anomaly riêng lẻ và playback 1×. Điền report bằng bằng chứng frame ID cụ thể.

## Rubric

Chấm 0–10 theo bước 0,5 cho sáu chiều trong `visual-review.config.json`. Mỗi scene phải có:

- ít nhất hai frame evidence;
- một strength và một risk cụ thể;
- findings gắn dimension, frame IDs, lesson IDs, diagnosis và remediation;
- weighted score do validator tính lại.

Không dùng điểm cao để bù cho semantic clarity, voice alignment hoặc typography/readability dưới ngưỡng. Không chấm điểm styling khi visual thesis còn khó hiểu.

## Vòng sửa

- Semantic thấp: mở lại thesis hoặc state sequence.
- Sync thấp: sửa cue binding, không dịch timestamp thủ công.
- Composition thấp: sửa grouping, shared edges, occupancy và optical balance.
- Typography thấp: sửa face, line break, line-height và glyph clearance.
- Motion thấp: sửa operator/choreography; không thêm decoration ngẫu nhiên.
- Branding thấp: quay về token/theme và một focus glow.

Rerender làm invalid report cũ vì video hash đổi. Tối đa năm iteration. Nếu iteration 5 còn scene dưới ngưỡng, đặt `decision: "blocked"` và không bàn giao.

## Điều kiện pass

`check-visual-review.mjs` phải pass với `decision: "pass"`, mọi scene ≥8, ba chiều critical ≥8, playback 1×/0,5× được xác nhận và report khớp candidate hash cùng review pack.
