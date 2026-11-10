---
name: alpha-intelligence-video-skill
description: Tạo, chỉnh sửa và kiểm định video ngắn cho Cộng đồng Alpha Intelligence bằng pipeline voice-grounded và motion ideation v3: Faster Whisper, ba concept mỗi scene, motion graph/custom TSX, semantic QA và master gate. Tự động dùng khi yêu cầu nhắc đến video Alpha Intelligence, đồng bộ animation với voice, sửa timing, tiếng Việt, overlap hoặc làm motion bớt template.
---

# Alpha Intelligence Video Skill

Voice và nội dung đã duyệt là nguồn sự thật. Không dùng lịch sử chat làm dependency ẩn.

## Định tuyến bắt buộc v3

1. Luôn đọc [pipeline v3](references/pipeline-v3.md) và [hệ nhận diện](references/brand-system.md).
2. Viết script: đọc [bảo toàn nguồn](references/source-content-rules.md) và [ElevenLabs](references/script-elevenlabs.md).
3. Phân tích voice/cue: đọc [content timing](references/content-timing.md).
4. Trước khi xem reference, đọc [motion ideation](references/motion-ideation.md), tạo ba concept/scene và khóa draft.
5. Sau khi khóa draft mới đọc đúng nhóm trong `knowledge/motion-vocabulary.json`, [motion grammar](references/motion-grammar-v3.md), [motion language](references/motion-language.md) và micro-reference liên quan.
6. Render/bàn giao: đọc [QA](references/qa-delivery.md). Dự án cũ đọc [migration v3](references/migration-v3.md).

## Bộ nhớ sản xuất v3

Không đọc toàn bộ lịch sử chat hoặc toàn bộ knowledge pack. Chỉ nạp phần liên quan tới việc đang làm:

- Dựng storyboard: đọc các mục `semantic-motion`, `scene-rhythm`, `layout` trong [production lessons](references/production-lessons.md) và tra [failure catalog](references/failure-catalog.md) khi gặp triệu chứng tương ứng.
- Sửa timing: chỉ đọc `voice-sync` trong production lessons cùng [content timing](references/content-timing.md).
- Sửa hình ảnh: đọc `layout`, `typography` và [Alpha taste profile](references/alpha-taste-profile.md).
- QA master: lấy lesson ID liên quan từ `knowledge/lessons.json`, recipe đã dùng và lỗi validator; không nạp lesson không liên quan.

`knowledge/lessons.json` là registry truy vết, không phải prompt phải đọc hết. Chat archive, screenshot gốc, voice và đường dẫn máy không bao giờ là dependency production.

## Pipeline production bắt buộc

1. Chạy `transcribe-audio.py` bằng Faster Whisper `small` trở lên. Nếu ASR/model không hoạt động, **dừng trước storyboard**; không ước lượng cue bằng số chữ hoặc khoảng lặng.
2. Rà chính tả transcript nhưng không sửa timestamp; chạy `lock-reviewed-transcript.mjs --confirm-reviewed` để đặt `reviewed: true` và tính lại hash.
3. Tạo đúng ba concept cho mỗi scene: direct, metaphorical, typography. Chạy concept gate trước khi xem reference.
4. Khóa concept draft, review micro-reference, rồi tạo `video-plan.v3.json`; không nhập timestamp số.
5. Dựng bằng motion graph hoặc custom TSX có manifest. Legacy recipe chỉ dùng migration/fallback có lý do.
6. Chạy `build-cue-lock.mjs`; transcript, plan, composition và QA dùng cùng `cue-sheet.lock.json`.
7. Render candidate và `qaMode="semantic"`; chạy toàn bộ v3 gates và motion-density.
8. Tạo QA pack từ MP4, phản biện, sửa và rerender ít nhất một vòng.
9. Chỉ `finalize-master.mjs --concepts ...` mới được tạo master sau khi mọi gate đạt.

## Điều kiện dừng

- Không có ASR hoặc transcript chưa review.
- Audio/transcript hash làm cue lock mất hiệu lực.
- Segment chưa map cue hoặc `voiceOnly` không có lý do.
- Scene dài trên 4 giây thiếu state change, lặp recipe/layout hoặc graphic không giải thích được ý.
- Chưa có ba concept, reference được xem trước draft lock hoặc concept được chọn có semantic clarity dưới 4/5.
- Graph có timestamp số; custom scene thiếu manifest; scene legacy thiếu fallbackReason.
- Text sớm hơn voice hoặc muộn quá 0,2 giây; connector đi trước nguồn.
- QA report chưa xác nhận readable, no clipping/overlap và đúng `visualMeaning` cho từng cue.
- Master chưa được kiểm tra từ MP4 thật.

## Bất biến thương hiệu

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode`.
- Dùng `brand.config.json`, `BrandFrame`, typography roles và safe zone của starter; không tạo theme song song.
- Không phát hành voice người dùng, video regression riêng tư hoặc Cy Grotesk có bản quyền.
