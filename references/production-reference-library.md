# Production Reference Library v3.2

Đọc tài liệu này **sau khi concept draft đã được khóa**. Ba video bài 1–3 là micro-reference kỹ thuật và quality bar, không phải template.

## Nhập video

Chỉ nhập master cuối đã duyệt. Chạy `ingest-production-reference.mjs` với `--publish-consent`, sau đó rà transcript và `shot-index.json`. Script tạo candidate shot; agent phải bổ sung semantic function, motion fingerprint và quality notes trước khi đặt `reviewed: true`.

Mỗi video công khai phải là H.264/AAC, 1080×1920, 30 fps, có audio, tối đa 20 MiB. Tổng ba video tối đa 60 MiB. Không commit master nguồn hoặc file pass-log.

## Truy xuất

1. Khóa `concept-candidates.json` và tính SHA-256 canonical.
2. Chạy `build-reference-library.mjs` sau khi cả ba package đã được review.
3. Chọn tối đa ba shot/scene theo semantic function và motion verbs.
4. Ghi kỹ thuật cần học, phần không được sao chép và xác nhận `thesisUnchanged: true`.
5. Chạy `check-reference-review.mjs` trước khi tạo plan.

Không dùng similarity hình ảnh làm điểm thưởng. Similarity fingerprint trên 0,85 bị chặn; vùng 0,70–0,85 cần `transformationRationale` và `transformedGroups` chứa ít nhất hai nhóm layout/operator/element/camera.

## Final review

Visual review phải ghi `referenceComparison`: shot IDs, qualities matched, intentional differences, copy risk và execution verdict. `copyRisk: high` hoặc `executionVerdict: below` luôn buộc sửa dù điểm scene đạt 8.
