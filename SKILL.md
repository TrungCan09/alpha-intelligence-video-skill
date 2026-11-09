---
name: alpha-intelligence-video-skill
description: Tạo, chỉnh sửa và kiểm định video ngắn cho Cộng đồng Alpha Intelligence bằng Remotion, từ bài viết, script, voice, cue sheet, storyboard, motion, sound design đến master. Tự động dùng khi yêu cầu nhắc đến video Alpha Intelligence, nhận diện cộng đồng, đồng bộ animation với voice, sửa tiếng Việt, timing, overlap hoặc xuất video series.
---

# Alpha Intelligence Video Skill

Tạo video theo nguyên tắc: **voice và nội dung đã duyệt là nguồn sự thật; mọi chuyển động phải giải thích một ý cụ thể**.

## Định tuyến bắt buộc

1. Đọc [hệ nhận diện](references/brand-system.md) cho mọi tác vụ. Khi viết hoặc sửa Remotion, dùng `brand.config.json`, `BrandFrame` và typography role trong starter; không tạo theme song song.
2. Nếu chuyển bài viết thành script, storyboard hoặc on-screen text, đọc [bảo toàn nội dung nguồn](references/source-content-rules.md).
3. Nếu viết voice-over từ bài đăng hoặc văn bản thô, đọc [biên kịch ElevenLabs](references/script-elevenlabs.md), rồi đọc phần nguồn sự thật trong [nội dung và timing](references/content-timing.md).
4. Nếu đã có script/voice và cần phân tích audio hoặc lập cue, đọc [nội dung và timing](references/content-timing.md).
5. Nếu thiết kế/dựng/sửa animation hoặc sound, đọc [motion language](references/motion-language.md) và [pattern Remotion cho Alpha](references/remotion-patterns-alpha.md).
6. Nếu dùng ảnh, footage hoặc captions, đọc phần media trong [pattern Remotion cho Alpha](references/remotion-patterns-alpha.md).
7. Trước khi render hoặc bàn giao, đọc và thực hiện [QA và bàn giao](references/qa-delivery.md).

## Workflow chuẩn

1. Xác định rõ bài viết, script, voice và tài sản nào đã được duyệt. Không tự sửa nguồn đã khóa.
2. Nếu chưa có script, tạo hai phương án voice-over theo output contract ElevenLabs; tách lời đọc khỏi on-screen text. Nếu script đã chốt, không tự tạo lại hai bản.
3. Đo audio thật, phân tích khoảng lặng, rồi lập cue sheet theo **ý nghĩa được nói**, không chia thời gian theo số chữ.
4. Với mỗi cue, ghi thành một semantic beat: câu nói, thời điểm bắt đầu, visual hit, readable-by, action, target, text, SFX và lý do.
5. Thiết kế storyboard: mỗi scene khai báo `motionConcept`, `layoutFamily` và chuỗi `beats`. Scene trên 4 giây phải có diễn tiến nội bộ; ambient motion không được tính thay semantic beat.
6. Tạo composition mới từ `assets/remotion-starter`; không phá composition hiện có.
7. Chạy `check-storyboard.mjs`, render preview 540×960; xem đầu/giữa/cuối scene và ±3 frame quanh mọi cue.
8. Sửa timing, line-height tiếng Việt, xuống dòng, clipping, overlap, layer order, glow và SFX.
9. Render master H.264/AAC 1080×1920, 30 fps, CRF 16; chạy kiểm tra, `audit-motion-density.mjs` và trích frame từ chính master.
10. Chỉ bàn giao khi checklist đạt; ghi rõ mọi ngoại lệ có chủ đích.

## Bất biến

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode` — giữ nguyên ở mọi scene.
- Text không được xuất hiện trước semantic cue; phải đọc được chậm nhất 0,2 giây sau cue.
- Cue khai báo bằng giây và đổi sang frame qua `fps`; không rải magic frame.
- Với video có voice, transcript/cue từ chính audio là điều kiện bắt buộc trước storyboard. Không suy đoạn thoại từ frame hoặc cảnh cũ; mỗi semantic beat phải lưu `spokenText` và voice-grounding đã xác minh.
- Danh sách và lựa chọn song song xuất hiện đồng thời. Chỉ stagger khi voice thực sự kể một chuỗi cơ chế hoặc các bước tuần tự.
- Connector chỉ xuất hiện cùng hoặc sau phần tử nguồn và phải có ý nghĩa quan hệ.
- Graphic quan hệ hoặc phép ẩn dụ phải có `visualMeaning` một câu, nêu rõ người xem cần hiểu gì. Nếu phải giải thích bằng lời ngoài video mới hiểu, thay bằng trạng thái trực tiếp hơn.
- Flow dọc/ngang phải dùng anchor chung thay vì tọa độ ước lượng. Connector phải khai báo axis, source/target anchor, end gap và layer order; không được bị card che đầu mũi tên.
- Các cụm có quan hệ trực tiếp (stack + nhãn, icon + caption, card + chú thích) phải nằm trong cùng flow layout với `gap` rõ ràng; không đặt nhãn bằng `top/left` tuyệt đối. Khai báo `layoutChecks.minGapPx >= 16` và kiểm tra cả frame spring overshoot.
- Trước render, scene phải xác nhận safe bounds, optical balance và dấu tiếng Việt/glyph không clipping.
- Scene phải có semantic change trong 15 frame đầu. Khoảng quá 90 frame không có semantic beat cần `holdReason` rõ ràng.
- Hai scene liên tiếp không được trùng cả `motionConcept` lẫn `layoutFamily`.
- Particle, grain, mesh drift và breathing trang trí không được tính là semantic beat.
- Không suy đoán số bài, nguồn, nghiên cứu, con số hay claim.
- Không bàn giao khi chưa render, trích frame từ MP4 cuối và kiểm tra lại.

## Công cụ đi kèm

- `scripts/analyze-audio.mjs`: duration, khoảng lặng và cue template.
- `scripts/estimate-voiceover.mjs`: đếm từ và ước lượng duration có cộng nhịp nghỉ.
- `scripts/check-storyboard.mjs`: kiểm tra title/support, thời gian đọc, danh sách, numbering và episode label.
- `scripts/audit-motion-density.mjs`: đối chiếu semantic beats với khoảng low-motion trong MP4 final.
- `scripts/check-contrast.mjs`: kiểm tra contrast WCAG của cặp màu.
- `scripts/check-brand-contrast.mjs`: kiểm tra toàn bộ ma trận chữ–nền được phép trong token thương hiệu.
- `scripts/check-brand-usage.mjs`: bắt buộc BrandFrame, font entrypoint, typography role và ngăn hex inline.
- `scripts/install-brand-font.mjs`: cài Cy Grotesk `.woff2` cục bộ mà không đưa font vào Git.
- `scripts/check-brand-font.mjs`: kiểm tra Cy Grotesk; dùng `--require-cy` khi master bắt buộc đúng font gốc.
- `scripts/generate-sfx.mjs`: tạo bộ SFX WAV tối giản, không cần tải asset.
- `scripts/check-alpha-video.mjs`: kiểm tra source và master.
- `scripts/extract-qa-frames.mjs`: trích frame tại cue và ±3 frame quanh transition.
- `scripts/validate-package.mjs`: kiểm tra cấu trúc package.
