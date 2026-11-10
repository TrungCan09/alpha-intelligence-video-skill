# QA, render và bàn giao

## Static QA

- Header và tagline đúng nguyên văn.
- Chỉ dùng palette và typography đã khóa.
- Cue lấy từ `cue-sheet.lock.json`; production scene đổi cue sang frame bằng `fps`.
- Không có magic frame rải trong scene.
- Không episode number, nguồn hoặc claim suy đoán.
- Một voice chính; không music bed nếu chưa yêu cầu.
- Parallel choice cùng hiện diện; stagger có lý do được ghi lại.
- Main title hoàn tất trước supporting content; text đủ tối thiểu 1 giây/6 từ.
- Numbering chỉ dùng khi nguồn có thứ tự; lựa chọn song song dùng A/B hoặc không nhãn.
- List được biểu diễn giữ đúng số item nguồn.
- Contrast text/background đạt tối thiểu 4.5:1; layout không dồn vào 40% phía trên.
- Mọi composition trong `Root.tsx` dùng `BrandFrame`; font được tải tại entrypoint và không có hex inline ngoài `brand.config.json`.
- Chạy `check-brand-contrast.mjs` và `check-brand-usage.mjs`; không bỏ qua cặp màu hoặc composition lỗi.
- Ghi rõ master dùng Cy Grotesk thật hay Montserrat fallback; nếu bắt buộc đúng Cy, chạy `check-brand-font.mjs --require-cy`.

## Motion QA

Render preview 540×960, rồi xem:

- đầu/giữa/cuối mỗi scene;
- ±3 frame quanh cue và transition;
- các chuỗi source → connector → target;
- focus shift, freeze, split-screen và diagram;
- cảnh có khoảng hold dài để phát hiện trạng thái “đơ”.
- frame đầu 15 của scene và mọi khoảng 90 frame không có thay đổi thị giác.
- mọi semantic beat phải làm thay đổi đúng target nội dung; mesh/particle/grain không được dùng để che long hold.
- graphic quan hệ vượt semantic legibility gate: source, hướng, target và kết quả có thể hiểu từ clip ngắn mà không cần lời giải thích ngoài video.
- connector đồng trục với source/target, còn end gap nhìn thấy được và không bị card che ở bất kỳ frame overshoot nào.
- kiểm tra safe bounds và optical balance tại entrance, peak overshoot, hold và exit; không có card/glyph bị cắt mép.
- exit của card/graphic không được đi xuyên qua brand header, tagline hoặc nhãn scene dù chỉ ở frame trung gian.
- xem toàn bộ preview ở 1× và các đoạn nghi ngờ ở 0,5×, không chỉ kiểm tra still frame.

Tại mỗi điểm, kiểm tra text không đi trước voice quá 0 giây và đọc được không trễ quá 0,2 giây.

## Typography QA tiếng Việt

- Dấu không clipping hoặc nhảy khỏi dòng.
- Scene dùng `brand-wide` hoặc `montserrat` có chủ đích; không tự đổi face theo dấu tiếng Việt.
- Line-height đủ cho chữ hoa có dấu.
- Không ngắt cụm như `TỰ TIN`, `DỰ ĐOÁN TỪ TIẾP THEO` hoặc từ đơn vô lý.
- Không overlap giữa card, connector, beam, vòng tròn và chữ.
- Khoảng cách giữa các cụm liên quan không nhỏ hơn `layoutChecks.minGapPx` tại entrance, spring overshoot, hold và exit; nhãn trạng thái không được dính vào minh họa phía trên.
- Không có chi tiết nền xuyên qua vùng đọc.
- Hero gradient tiếng Việt phải chừa vùng glyph bằng `padding-block` tối thiểu `0.1em`; không đặt chính node chữ trong container `overflow: hidden`. Kiểm tra riêng các chữ `Ả`, `Ẫ`, `Ễ`, `Ự` tại entrance, hold và exit.
- Trước `continueRender`, gọi `document.fonts.load()` với probe chứa glyph tiếng Việt cho từng weight thực dùng; probe mặc định không đủ để tải đúng unicode subset. Trích một chuỗi frame liên tiếp để phát hiện font-loading race, không chỉ một still.

## Audio QA

- Voice rõ, không bị peak/cắt đuôi.
- SFX đi trước visual hit tối đa 2–3 frame và ở mức nền.
- Không có SFX cho từng dòng chữ.
- Footage dùng `OffthreadVideo`; captions nằm trong safe zone và active word đúng timestamp.
- Duration composition đủ chứa toàn bộ voice và tail hợp lý.

## Master

1. Render H.264/AAC, 1080×1920, 30 fps, CRF 16.
   Dùng `--concurrency=1 --disable-shared-memory-capture --gop=30` cho master. Trên Windows, shared-memory capture hoặc GOP quá dài có thể làm mất các dải chữ/dấu ở một số frame khi phát hoặc seek dù layout nguồn đúng. GOP 30 tạo keyframe mỗi giây ở 30 fps mà không làm file phình như all-intra.
2. Chạy `check-alpha-video.mjs` với master.
3. Render `qaMode="semantic"`; chạy `audit-motion-density.mjs` với `video-plan.json`.
4. Chạy `check-cue-lock`, `check-timeline-binding`, `check-scene-diversity`; tạo QA pack và duyệt từng cue.
5. Trích frame từ chính MP4 cuối tại cue −0,1s, cue, cue +0,2s, giữa câu và transition.
   Dùng output seek (`-i video -ss <time>`) thay vì filter `trim=start_frame`; `trim` có thể tạo frame lỗi giả với H.264 B-frames.
   Trích thêm ít nhất 5 frame liên tiếp quanh một hero tiếng Việt có dấu. Nếu các dải glyph mất luân phiên, render lại với `--disable-shared-memory-capture --gop=30`; không chữa bằng đổi font hoặc nới layout khi PNG nguồn đã chứng minh lỗi capture/codec.
6. Xem lại frame đã trích và playback 1×/0,5×, không dựa vào ảnh preview cũ.
7. Chỉ `finalize-master.mjs` được tạo master sau khi report hợp lệ. Ghi rõ ngoại lệ; nếu không đạt, chưa bàn giao.
