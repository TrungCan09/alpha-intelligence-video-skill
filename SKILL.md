---
name: alpha-intelligence-video-skill
description: Tạo, chỉnh sửa và kiểm định video ngắn cho Cộng đồng Alpha Intelligence bằng Remotion, từ bài viết, script, voice, cue sheet, storyboard, motion, sound design đến master. Tự động dùng khi yêu cầu nhắc đến video Alpha Intelligence, nhận diện cộng đồng, đồng bộ animation với voice, sửa tiếng Việt, timing, overlap hoặc xuất video series.
---

# Alpha Intelligence Video Skill

Tạo video theo nguyên tắc: **voice và nội dung đã duyệt là nguồn sự thật; mọi chuyển động phải giải thích một ý cụ thể**.

## Định tuyến bắt buộc

1. Đọc [hệ nhận diện](references/brand-system.md) cho mọi tác vụ.
2. Nếu viết script, phân tích voice hoặc lập cue, đọc [nội dung và timing](references/content-timing.md).
3. Nếu thiết kế/dựng/sửa animation hoặc sound, đọc [motion language](references/motion-language.md).
4. Trước khi render hoặc bàn giao, đọc và thực hiện [QA và bàn giao](references/qa-delivery.md).

## Workflow chuẩn

1. Xác định rõ bài viết, script, voice và tài sản nào đã được duyệt. Không tự sửa nguồn đã khóa.
2. Nếu chưa có script, viết voice-over cô đọng; tách riêng lời đọc và on-screen text.
3. Đo audio thật, phân tích khoảng lặng, rồi lập cue sheet theo **ý nghĩa được nói**, không chia thời gian theo số chữ.
4. Với mỗi cue, ghi: câu nói, thời điểm bắt đầu, semantic cue, visual hit, text, chuyển động, SFX và lý do.
5. Thiết kế storyboard: mỗi scene có một motion concept; nối scene bằng hard cut có chủ đích hoặc exit nội bộ.
6. Tạo composition mới từ `assets/remotion-starter`; không phá composition hiện có.
7. Render preview 540×960; xem đầu/giữa/cuối scene và ±3 frame quanh mọi cue.
8. Sửa timing, line-height tiếng Việt, xuống dòng, clipping, overlap, layer order, glow và SFX.
9. Render master H.264/AAC 1080×1920, 30 fps, CRF 16; chạy kiểm tra và trích frame từ chính master.
10. Chỉ bàn giao khi checklist đạt; ghi rõ mọi ngoại lệ có chủ đích.

## Bất biến

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode` — giữ nguyên ở mọi scene.
- Text không được xuất hiện trước semantic cue; phải đọc được chậm nhất 0,2 giây sau cue.
- Cue khai báo bằng giây và đổi sang frame qua `fps`; không rải magic frame.
- Danh sách và lựa chọn song song xuất hiện đồng thời. Chỉ stagger khi voice thực sự kể một chuỗi cơ chế hoặc các bước tuần tự.
- Connector chỉ xuất hiện cùng hoặc sau phần tử nguồn và phải có ý nghĩa quan hệ.
- Không suy đoán số bài, nguồn, nghiên cứu, con số hay claim.
- Không bàn giao khi chưa render, trích frame từ MP4 cuối và kiểm tra lại.

## Công cụ đi kèm

- `scripts/analyze-audio.mjs`: duration, khoảng lặng và cue template.
- `scripts/check-alpha-video.mjs`: kiểm tra source và master.
- `scripts/extract-qa-frames.mjs`: trích frame tại cue và ±3 frame quanh transition.
- `scripts/validate-package.mjs`: kiểm tra cấu trúc package.
