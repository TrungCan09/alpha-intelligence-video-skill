# Motion ideation v3

Không xem video reference trước khi khóa concept draft đầu tiên.

## Ba concept bắt buộc

Với mỗi scene, tạo đúng ba hướng:

1. `direct`: biểu diễn quan hệ trực tiếp, ưu tiên tốc độ hiểu.
2. `metaphorical`: dùng một quan hệ vật lý hoặc không gian có thể tự giải thích.
3. `typography`: chữ, hierarchy và mask tự mang chuyển động.

Concept phải khác visual thesis và motion fingerprint; đổi easing, hướng slide hoặc màu không tạo thành concept mới.

## Chọn concept

Chấm thang 1–5: semantic clarity 40%, voice alignment 20%, brand fit 15%, novelty 15%, feasibility 10%. Loại concept có semantic clarity dưới 4. Chọn concept đủ điều kiện có weighted score cao nhất và ghi rejection reason cho hai concept còn lại.

Chạy `check-concept-exploration.mjs`, sau đó mới ghi `referenceReviewedAt` và xem micro-reference theo primitive. Reference chỉ cải thiện execution; không thay visual thesis đã khóa bằng bản sao mẫu.

## Khi nào graph, custom hoặc legacy

- `graph`: quan hệ có thể diễn đạt bằng element + layout + cue-bound operator.
- `custom`: payoff phụ thuộc choreography phối hợp, depth hoặc geometry mà graph không diễn đạt đủ.
- `legacy`: chỉ migration/fallback, bắt buộc `fallbackReason`.

Nếu semantic render khó hiểu, sửa thesis/state sequence trước. Nếu dễ hiểu nhưng nhàm, đổi primitive/operator hoặc dùng custom scene; không thêm decoration ngẫu nhiên.
