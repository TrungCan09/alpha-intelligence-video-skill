---
name: alpha-intelligence-video-skill
description: Tạo, chỉnh sửa và kiểm định video ngắn cho Cộng đồng Alpha Intelligence bằng pipeline voice-grounded: Faster Whisper, cue lock, scene registry Remotion, semantic QA và master gate. Tự động dùng khi yêu cầu nhắc đến video Alpha Intelligence, nhận diện cộng đồng, đồng bộ animation với voice, sửa timing, tiếng Việt, overlap hoặc xuất video series.
---

# Alpha Intelligence Video Skill

Voice và nội dung đã duyệt là nguồn sự thật. Không dùng lịch sử chat làm dependency ẩn.

## Định tuyến bắt buộc

1. Luôn đọc [pipeline v2](references/pipeline-v2.md), [hệ nhận diện](references/brand-system.md) và xem `assets/reference/alpha-video-v2-contact-sheet.png` hoặc MP4 reference trước khi chọn recipe.
2. Viết script: đọc [bảo toàn nguồn](references/source-content-rules.md) và [ElevenLabs](references/script-elevenlabs.md).
3. Phân tích voice/cue: đọc [content timing](references/content-timing.md).
4. Dựng motion: đọc [scene recipes](references/scene-recipes.md), [motion language](references/motion-language.md) và [Remotion patterns](references/remotion-patterns-alpha.md).
5. Render/bàn giao: đọc [QA](references/qa-delivery.md) và [migration v2](references/migration-v2.md) nếu dự án bắt đầu từ v1.

## Bộ nhớ sản xuất v2.1

Không đọc toàn bộ lịch sử chat hoặc toàn bộ knowledge pack. Chỉ nạp phần liên quan tới việc đang làm:

- Dựng storyboard: đọc các mục `semantic-motion`, `scene-rhythm`, `layout` trong [production lessons](references/production-lessons.md) và tra [failure catalog](references/failure-catalog.md) khi gặp triệu chứng tương ứng.
- Sửa timing: chỉ đọc `voice-sync` trong production lessons cùng [content timing](references/content-timing.md).
- Sửa hình ảnh: đọc `layout`, `typography` và [Alpha taste profile](references/alpha-taste-profile.md).
- QA master: lấy lesson ID liên quan từ `knowledge/lessons.json`, recipe đã dùng và lỗi validator; không nạp lesson không liên quan.

`knowledge/lessons.json` là registry truy vết, không phải prompt phải đọc hết. Chat archive, screenshot gốc, voice và đường dẫn máy không bao giờ là dependency production.

## Pipeline production bắt buộc

1. Chạy `transcribe-audio.py` bằng Faster Whisper `small` trở lên. Nếu ASR/model không hoạt động, **dừng trước storyboard**; không ước lượng cue bằng số chữ hoặc khoảng lặng.
2. Rà chính tả transcript nhưng không sửa timestamp; chạy `lock-reviewed-transcript.mjs --confirm-reviewed` để đặt `reviewed: true` và tính lại hash.
3. Viết `video-plan.json` chỉ bằng segment/cue reference, recipe, action, target, text và `visualMeaning`; không nhập timestamp số.
4. Chạy `build-cue-lock.mjs`; transcript, plan, composition và QA dùng cùng `cue-sheet.lock.json`.
5. Dựng qua scene registry. Production scene lấy thời gian bằng `cueStart`, `cueEnd`, `useCueProgress`; không dùng magic frame/timestamp.
6. Render candidate và `qaMode="semantic"`; chạy cue-lock, timeline-binding, diversity và motion-density gate.
7. Tạo QA pack từ MP4 candidate; duyệt từng cue và playback 1×/0,5×.
8. Chỉ `finalize-master.mjs` mới được chép candidate thành master sau khi mọi gate đạt.

## Điều kiện dừng

- Không có ASR hoặc transcript chưa review.
- Audio/transcript hash làm cue lock mất hiệu lực.
- Segment chưa map cue hoặc `voiceOnly` không có lý do.
- Scene dài trên 4 giây thiếu state change, lặp recipe/layout hoặc graphic không giải thích được ý.
- Text sớm hơn voice hoặc muộn quá 0,2 giây; connector đi trước nguồn.
- QA report chưa xác nhận readable, no clipping/overlap và đúng `visualMeaning` cho từng cue.
- Master chưa được kiểm tra từ MP4 thật.

## Bất biến thương hiệu

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode`.
- Dùng `brand.config.json`, `BrandFrame`, typography roles và safe zone của starter; không tạo theme song song.
- Không phát hành voice người dùng, video regression riêng tư hoặc Cy Grotesk có bản quyền.
