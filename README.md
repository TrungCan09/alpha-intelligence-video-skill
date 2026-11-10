# Alpha Intelligence Video Skill

Skill tiếng Việt để sản xuất video ngắn cho **Cộng đồng Alpha Intelligence** bằng pipeline tái lập: bài viết → script → voice → Faster Whisper → cue lock → ba concept/scene → motion graph hoặc custom TSX → semantic QA → master.

Repository này tổng hợp độc lập hệ thống nhận diện, kinh nghiệm timing và các lỗi motion đã được kiểm chứng trong quá trình sản xuất. Không chứa voice, bài viết hay tài sản riêng tư; không sao chép nguyên văn skill bên thứ ba.

Từ v3.0, skill không chọn template làm điểm xuất phát. Mỗi scene phải khám phá ba luận đề thị giác độc lập, chấm điểm semantic clarity trước khi xem reference, rồi mới biên dịch thành motion graph hoặc custom TSX. Kinh nghiệm sản xuất vẫn được truy xuất chọn lọc qua lesson ID; không đọc lại toàn bộ lịch sử chat.

## Điểm cốt lõi

- Voice và nội dung đã duyệt là nguồn sự thật.
- Khi chưa có script, tạo hai bản voice-over ElevenLabs dưới 2 phút: kể chuyện và siêu cô đọng.
- Audio là nguồn timing duy nhất. Faster Whisper `small` trở lên là gate bắt buộc khi đã có voice.
- `video-plan.v3.json` không chứa timestamp; composition, storyboard và QA dùng chung `cue-sheet.lock.json`.
- Storyboard dùng semantic beats; ambient motion không được tính thay cho diễn tiến nội dung.
- Graphic quan hệ phải có `visualMeaning`; đường chuyển động đẹp nhưng không tự giải thích được sẽ bị validator từ chối.
- Connector phải khai báo trục, anchors, end gap và layer order; scene phải xác nhận safe bounds, optical balance và dấu/glyph không clipping.
- Branding, typography, safe zone và tagline được khóa bằng token, component ngữ nghĩa và validator.
- Mỗi scene có đúng ba concept direct/metaphorical/typography; concept được chọn phải đạt semantic clarity tối thiểu 4/5.
- Motion graph là đường mặc định; custom TSX là escape hatch có manifest; chín recipe v2 chỉ còn dùng cho migration/fallback có lý do.
- Có motion/media primitives tự chứa: entrance/exit, Ken Burns, counter, spark, parallax, motion trail, footage và captions.
- Knowledge pack truy vết `lỗi → nguyên nhân → quy tắc → enforcement → cách sửa`, kèm privacy scan và visual-review gate trung thực.

## Cài skill

### Codex

```bash
git clone https://github.com/TrungCan09/alpha-intelligence-video-skill.git "$CODEX_HOME/skills/alpha-intelligence-video-skill"
```

### Agent hỗ trợ thư mục `.agents/skills`

```bash
git clone https://github.com/TrungCan09/alpha-intelligence-video-skill.git .agents/skills/alpha-intelligence-video-skill
```

Sau đó gọi:

```text
Dùng $alpha-intelligence-video-skill để dựng video từ bài viết và voice này.
```

Skill cho phép implicit invocation khi tác vụ liên quan tới video Alpha Intelligence.

## Dùng starter

```bash
cd assets/remotion-starter
npm install
npm run typecheck
npm run compositions
npm run render:preview
```

Starter có composition `AlphaVideoV3`, 1080×1920, 30 fps, `brand.config.json`, `BrandFrame`, Cy Grotesk ngoài repository với Montserrat fallback, motion graph renderer và custom scene registry.

Không xem reference trước vòng ideation đầu tiên. Sau khi khóa draft concept, dùng micro-reference để cải thiện execution mà không thay visual thesis.

- `assets/reference/alpha-video-v2-reference.mp4` — 12 giây, không voice/tài sản riêng tư, dưới 8 MB.
- `assets/reference/alpha-video-v2-contact-sheet.png` — trích trực tiếp từ MP4.
- `assets/reference/alpha-lessons-contact-sheet.png` — cặp ví dụ tổng hợp đạt/không đạt, không dùng dữ liệu người dùng.

`AlphaMotionReference10s` là composition tham chiếu 10 giây cho nhịp `problem → prompt → answer`. Có thể truyền voice cục bộ bằng prop `voiceSrc`; thư mục `public/private/` được Git bỏ qua để không phát hành audio riêng tư.

Nếu có quyền sử dụng Cy Grotesk V3 Wide, cài file `.woff2` cục bộ:

```bash
node scripts/install-brand-font.mjs --file "path/to/cy-grotesk-v3-wide.woff2"
node scripts/check-brand-font.mjs --require-cy
```

File font được Git bỏ qua và không nằm trong release công khai. Khi thiếu font, starter tự dùng Montserrat 800.

Composition `AlphaPrimitivesDemo` kiểm tra các pattern bổ sung:

```bash
npm run render:primitives-preview
```

## Pipeline v3

```bash
python -m pip install -r requirements-asr.txt
python scripts/transcribe-audio.py "voice.mp3" --model small --language vi --out transcript.lock.json
# nghe lại, sửa chính tả nhưng không sửa timestamp
node scripts/lock-reviewed-transcript.mjs transcript.lock.json --confirm-reviewed
node scripts/check-concept-exploration.mjs concept-candidates.json
node scripts/check-reference-order.mjs concept-candidates.json video-plan.v3.json
node scripts/build-cue-lock.mjs transcript.lock.json video-plan.v3.json --out cue-sheet.lock.json
node scripts/check-cue-lock.mjs transcript.lock.json cue-sheet.lock.json --audio voice.mp3
node scripts/check-timeline-binding.mjs assets/remotion-starter
node scripts/check-v3-plan.mjs video-plan.v3.json concept-candidates.json cue-sheet.lock.json
```

Nếu ASR/model không chạy, pipeline dừng trước storyboard. Không có fallback chia cue theo số chữ hoặc khoảng lặng.

Render candidate và semantic-only QA:

```bash
cd assets/remotion-starter
npm run render:v3:candidate
npm run render:v3:semantic
cd ../..
node scripts/audit-motion-density.mjs outputs/alpha-video-v3-semantic.mp4 --storyboard assets/remotion-starter/src/video-plan.v3.json
node scripts/build-qa-pack.mjs outputs/alpha-video-v3-candidate.mp4 assets/remotion-starter/src/cue-sheet.lock.json --out outputs/qa
node scripts/check-qa-report.mjs outputs/qa/report.json
```

`report.json` phải được người duyệt xác nhận cho từng cue và playback 1×/0,5×. Sau đó chạy `npm run render:master`; finalizer sẽ chạy lại toàn bộ gate trước khi tạo master.

## Công cụ v1 chỉ dùng chẩn đoán/migration

Phân tích audio và tạo cue template:

```bash
node scripts/analyze-audio.mjs "path/with spaces/voice.mp3" --fps 30 --out cues.json
```

Khoảng lặng chỉ là thông tin chẩn đoán. Với production v2, timing luôn đến từ ASR lock.

Đếm từ và ước lượng thời lượng voice-over:

```bash
node scripts/estimate-voiceover.mjs --file script.txt --strict
```

Ước lượng đã cộng nhịp nghỉ từ dấu câu; sau khi generate vẫn phải đo duration của file ElevenLabs thật.

Kiểm tra storyboard và contrast:

```bash
node scripts/check-storyboard.mjs tests/fixtures/storyboard.valid.json
node scripts/audit-motion-density.mjs outputs/master.mp4 --storyboard assets/remotion-starter/src/reference-storyboard.json
node scripts/check-contrast.mjs '#F9F9F9' '#081938'
node scripts/check-brand-contrast.mjs
node scripts/check-brand-usage.mjs
node scripts/check-brand-font.mjs
```

Tạo bộ SFX WAV tối giản khi dự án chưa có sound asset:

```bash
node scripts/generate-sfx.mjs --out assets/remotion-starter/public/sfx
```

Kiểm tra source và master:

```bash
node scripts/check-alpha-video.mjs --project assets/remotion-starter
node scripts/check-alpha-video.mjs --project assets/remotion-starter --video outputs/master.mp4 --expect-audio
```

Trích frame tại timestamp hoặc quanh cue:

```bash
node scripts/extract-qa-frames.mjs outputs/master.mp4 --times 0,5.63,10.79 --out qa-frames
node scripts/extract-qa-frames.mjs outputs/master.mp4 --cues cues.json --fps 30 --out qa-frames
```

Các script tìm FFmpeg/ffprobe theo thứ tự: biến môi trường `FFMPEG_PATH`/`FFPROBE_PATH`, hệ thống, rồi binary compositor của Remotion trong `node_modules`.

Starter tổng hợp không có voice nên master mẫu không có audio. Với video sản xuất thật, luôn dùng `--expect-audio` để bắt buộc AAC.

## Kiểm thử

```bash
node scripts/test-v2-pipeline.mjs .
node scripts/check-knowledge-pack.mjs .
node scripts/test-knowledge-pack.mjs .
node scripts/validate-package.mjs
python scripts/quick_validate.py .
```

Regression suite bắt audio hash sai, transcript thay đổi, segment mất, drift, spoken text lệch, magic timestamp, recipe lặp, semantic hold dài, typography thiếu kiểm chứng và knowledge/privacy lỗi.

## Cấu trúc

- `SKILL.md`: entrypoint và workflow.
- `references/`: branding, biên kịch ElevenLabs, content/timing, motion/sound và QA.
- `knowledge/lessons.json`: registry bài học ẩn danh và liên kết enforcement.
- `assets/remotion-starter/`: starter kit code-native và source composition reference.
- `assets/reference/`: MP4/contact sheet công khai tổng hợp.
- `scripts/`: ASR, cue locking, validators, QA pack và finalizer.
- `THIRD_PARTY_NOTICES.md`: nguồn tham khảo và attribution MIT.
- `.github/workflows/validate.yml`: kiểm tra package, TypeScript và composition.

Evidence gốc có thể được lưu cục bộ tại `private/chat-research/`; thư mục này bị Git ignore và không được production hoặc CI đọc.

## Đóng góp

Pull request phải giữ các invariant thương hiệu, không đưa tài sản riêng tư vào repository và kèm lý do cho motion rule mới. Quy tắc mới nên xuất phát từ một lỗi có thể tái hiện, không phải sở thích nhất thời.

## Giấy phép

[MIT](LICENSE)
