# Failure catalog

Tra theo triệu chứng; sau đó mở đúng lesson trong `production-lessons.md`.

| Triệu chứng | Lesson | Gate chính | Hành động đầu tiên |
|---|---|---|---|
| Text/animation sớm hoặc muộn voice | `SYNC-001` | Regression | Đối chiếu ASR cue lock, không dịch frame bằng mắt |
| Graphic đẹp nhưng khó hiểu | `SEM-001` | Regression | Viết lại visualMeaning và source → target |
| Chuyển động không ăn nhập voice | `SEM-002` | Visual review | Xem semantic render không decoration |
| Mở cảnh yếu hoặc cảnh bị đơ | `RHY-001` | Regression | Kiểm tra 15 frame đầu và gap 90 frame |
| Video lặp cấu trúc | `RHY-002` | Validator | So motionConcept, layoutFamily và recipe |
| Mũi tên sớm/lệch/bị che | `LAY-001` | Regression | Kiểm tra sourceBeatId, anchor, axis và end gap |
| Card/text overlap khi overshoot | `LAY-002` | Visual review | Trích entrance, peak, hold và exit |
| Bố cục mất cân bằng | `LAY-003` | Visual review | Duyệt optical weight và khoảng âm |
| Dấu tiếng Việt bị cắt/nhảy | `TYP-001` | Visual review | Trích chuỗi frame và kiểm tra font preload |
| Xuống dòng vô duyên | `TYP-002` | Visual review | Khóa semantic spans và measure |
| Nhận diện sai | `BRD-001` | Validator | Chạy brand usage/contrast/font gate |
| SFX hoặc transition bị spam | `SND-001` | Visual review | Tắt các hit không gắn semantic cue |
| MP4 khác preview/source | `DEL-001` | Validator | QA lại từ candidate/master thật |

Không chuyển lỗi visual-review thành pass tự động chỉ vì một trường JSON đã được điền. Reviewer phải xem clip hoặc frame đúng trạng thái.
