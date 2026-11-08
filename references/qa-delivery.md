# QA, render và bàn giao

## Static QA

- Header và tagline đúng nguyên văn.
- Chỉ dùng palette và typography đã khóa.
- Cue theo giây, đổi frame bằng `fps`.
- Không có magic frame rải trong scene.
- Không episode number, nguồn hoặc claim suy đoán.
- Một voice chính; không music bed nếu chưa yêu cầu.
- Parallel choice cùng hiện diện; stagger có lý do được ghi lại.

## Motion QA

Render preview 540×960, rồi xem:

- đầu/giữa/cuối mỗi scene;
- ±3 frame quanh cue và transition;
- các chuỗi source → connector → target;
- focus shift, freeze, split-screen và diagram;
- cảnh có khoảng hold dài để phát hiện trạng thái “đơ”.

Tại mỗi điểm, kiểm tra text không đi trước voice quá 0 giây và đọc được không trễ quá 0,2 giây.

## Typography QA tiếng Việt

- Dấu không clipping hoặc nhảy khỏi dòng.
- Line-height đủ cho chữ hoa có dấu.
- Không ngắt cụm như `TỰ TIN`, `DỰ ĐOÁN TỪ TIẾP THEO` hoặc từ đơn vô lý.
- Không overlap giữa card, connector, beam, vòng tròn và chữ.
- Không có chi tiết nền xuyên qua vùng đọc.

## Audio QA

- Voice rõ, không bị peak/cắt đuôi.
- SFX đi trước visual hit tối đa 2–3 frame và ở mức nền.
- Không có SFX cho từng dòng chữ.
- Duration composition đủ chứa toàn bộ voice và tail hợp lý.

## Master

1. Render H.264/AAC, 1080×1920, 30 fps, CRF 16.
2. Chạy `check-alpha-video.mjs` với master.
3. Trích frame từ chính MP4 cuối tại cue và transition.
4. Xem lại frame đã trích, không dựa vào ảnh preview cũ.
5. Ghi rõ ngoại lệ nếu có; nếu không đạt, chưa bàn giao.
