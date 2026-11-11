---
name: alpha-intelligence-video-skill
description: "Tạo, chỉnh sửa và tự kiểm định video ngắn cho Cộng đồng Alpha Intelligence bằng pipeline voice-grounded, motion ideation, production reference và visual critic. Dùng khi làm video Alpha Intelligence, đồng bộ animation với voice, sửa timing, tiếng Việt, overlap hoặc làm motion bớt template."
---

# Alpha Intelligence Video Skill

Script đã duyệt là nguồn chữ; voice final là nguồn thời gian. Không dùng lịch sử chat làm dependency ẩn.

## Định tuyến bắt buộc v3

1. Luôn đọc [pipeline v3](references/pipeline-v3.md) và [hệ nhận diện](references/brand-system.md).
2. Viết script: đọc [bảo toàn nguồn](references/source-content-rules.md) và [ElevenLabs](references/script-elevenlabs.md).
3. Phân tích voice/cue: đọc [content timing](references/content-timing.md).
4. Trước khi xem reference, đọc [motion ideation](references/motion-ideation.md) cùng [Alpha taste profile](references/alpha-taste-profile.md), tạo ba concept/scene và khóa draft.
5. Sau khi khóa draft mới đọc đúng nhóm trong `knowledge/motion-vocabulary.json`, [motion grammar](references/motion-grammar-v3.md), [motion language](references/motion-language.md) và [production reference library](references/production-reference-library.md). Nếu library production chưa được nhập, giữ workflow v3.1 và không giả lập reference.
6. Render/bàn giao: đọc [QA](references/qa-delivery.md) và [Visual Critic Loop](references/visual-review-loop.md). Dự án cũ đọc [migration v3](references/migration-v3.md).

## Bộ nhớ sản xuất v3

Không đọc toàn bộ lịch sử chat hoặc toàn bộ knowledge pack. Chỉ nạp phần liên quan tới việc đang làm:

- Dựng storyboard: đọc các mục `semantic-motion`, `scene-rhythm`, `layout` trong [production lessons](references/production-lessons.md) và tra [failure catalog](references/failure-catalog.md) khi gặp triệu chứng tương ứng.
- Sửa timing: chỉ đọc `voice-sync` trong production lessons cùng [content timing](references/content-timing.md).
- Sửa hình ảnh: đọc `layout`, `typography` và [Alpha taste profile](references/alpha-taste-profile.md).
- QA master: lấy lesson ID liên quan từ `knowledge/lessons.json`, recipe đã dùng và lỗi validator; không nạp lesson không liên quan.

`knowledge/lessons.json` là registry truy vết, không phải prompt phải đọc hết. Chat archive, screenshot gốc, voice và đường dẫn máy không bao giờ là dependency production.

## Pipeline production bắt buộc

1. Production bắt buộc nhận `approved-script.md|txt` và `final-voice.mp3|wav`; chạy `check-input-contract.mjs` trước mọi storyboard.
2. Khóa script bằng `lock-approved-script.mjs`. Chạy `transcribe-audio.py` bằng Faster Whisper `small` trở lên chỉ để lấy ASR word timestamp; raw ASR không được thay script.
3. Chạy `align-script-to-audio.mjs`, rà mapping và `lock-reviewed-alignment.mjs --confirm-reviewed`. Nếu câu thiếu/thừa/đổi nghĩa, **dừng trước storyboard**; không tự đổi script hoặc đoán timestamp.
4. Tạo đúng ba concept cho mỗi scene: direct, metaphorical, typography. Chạy concept gate trước khi xem reference.
5. Khóa concept draft, hash file, rồi mới truy xuất tối đa ba micro-reference/scene và ghi `reference-review.lock.json`; không xem reference trước ideation.
6. Dựng bằng motion graph hoặc custom TSX có manifest. Legacy recipe chỉ dùng migration/fallback có lý do.
7. Chạy `build-cue-lock.mjs` từ script lock + alignment lock; plan production chỉ dùng `scriptSegmentIds` và mọi cue/QA dùng cùng `cue-sheet.lock.json`.
8. Render candidate và `qaMode="semantic"`; chạy toàn bộ v3 gates và motion-density.
9. Tạo QA pack và visual-review pack từ MP4; máy audit toàn bộ frame, agent xem contact sheet/anomaly rồi chấm từng scene.
10. Sửa và rerender cho tới khi mọi scene cùng semantic/sync/readability đạt tối thiểu 8/10; tối đa năm vòng, không đạt thì chặn bàn giao.
11. Khi dùng production reference, chạy reference-order, reference-novelty và reference-aware visual review; chỉ `finalize-master.mjs` mới được tạo master sau khi mọi lock/report cùng khớp hash.

## Điều kiện dừng

- Không có script đã khóa, final voice, raw ASR, alignment đã review hoặc hash không khớp.
- Production plan dùng ASR transcript/`segmentIds` làm nguồn chữ thay vì `scriptSegmentIds`.
- Script, voice, raw-ASR hoặc alignment hash thay đổi làm cue lock mất hiệu lực.
- Segment chưa map cue hoặc `voiceOnly` không có lý do.
- Scene dài trên 4 giây thiếu state change, lặp recipe/layout hoặc graphic không giải thích được ý.
- Chưa có ba concept, reference được xem trước draft lock hoặc concept được chọn có semantic clarity dưới 4/5.
- Graph có timestamp số; custom scene thiếu manifest; scene legacy thiếu fallbackReason.
- Text sớm hơn voice hoặc muộn quá 0,2 giây; connector đi trước nguồn.
- QA report chưa xác nhận readable, no clipping/overlap và đúng `visualMeaning` cho từng cue.
- Master chưa được kiểm tra từ MP4 thật.
- Visual review còn scene dưới 8/10, thiếu frame evidence hoặc đã hết năm vòng mà chưa đạt.
- Reference review không khớp concept/library hash, copy risk cao hoặc execution thấp hơn quality bar.

## Bất biến thương hiệu

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode`.
- Dùng `brand.config.json`, `BrandFrame`, typography roles và safe zone của starter; không tạo theme song song.
- Không phát hành voice người dùng, video regression riêng tư hoặc Cy Grotesk có bản quyền.
