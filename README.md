# Alpha Intelligence Video Skill

Skill tiếng Việt để sản xuất video ngắn cho **Cộng đồng Alpha Intelligence**: bài viết → script → voice → semantic cue → storyboard → Remotion → sound → QA → master.

Repository này tổng hợp độc lập hệ thống nhận diện, kinh nghiệm timing và các lỗi motion đã được kiểm chứng trong quá trình sản xuất. Không chứa voice, bài viết hay tài sản riêng tư; không sao chép nguyên văn skill bên thứ ba.

## Điểm cốt lõi

- Voice và nội dung đã duyệt là nguồn sự thật.
- Khi chưa có script, tạo hai bản voice-over ElevenLabs dưới 2 phút: kể chuyện và siêu cô đọng.
- Animation bám semantic cue, không chia timeline theo số chữ.
- Branding, typography, safe zone và tagline được khóa bằng token, component ngữ nghĩa và validator.
- Mỗi scene có một motion concept giải thích nội dung.
- Có starter Remotion và công cụ phân tích audio, kiểm tra invariant, trích frame QA.
- Có motion/media primitives tự chứa: entrance/exit, Ken Burns, counter, spark, parallax, motion trail, footage và captions.

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

Starter có composition `AlphaIntelligenceStarter`, 1080×1920, 30 fps, `brand.config.json`, `BrandFrame`, Cy Grotesk ngoài repository với Montserrat fallback, typography role, background stack và timeline theo giây.

Nếu có quyền sử dụng Cy Grotesk V3 Wide, cài file `.woff2` cục bộ:

```bash
node scripts/install-brand-font.mjs --file "D:/font/cy-grotesk-v3-wide.woff2"
node scripts/check-brand-font.mjs --require-cy
```

File font được Git bỏ qua và không nằm trong release công khai. Khi thiếu font, starter tự dùng Montserrat 800.

Composition `AlphaPrimitivesDemo` kiểm tra các pattern bổ sung:

```bash
npm run render:primitives-preview
```

## Công cụ QA

Phân tích audio và tạo cue template:

```bash
node scripts/analyze-audio.mjs "D:/duong dan co khoang trang/voice.mp3" --fps 30 --out cues.json
```

Khoảng lặng chỉ là ứng viên. Luôn nghe voice và xác nhận thời điểm semantic cue.

Đếm từ và ước lượng thời lượng voice-over:

```bash
node scripts/estimate-voiceover.mjs --file script.txt --strict
```

Ước lượng đã cộng nhịp nghỉ từ dấu câu; sau khi generate vẫn phải đo duration của file ElevenLabs thật.

Kiểm tra storyboard và contrast:

```bash
node scripts/check-storyboard.mjs tests/fixtures/storyboard.valid.json
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

## Cấu trúc

- `SKILL.md`: entrypoint và workflow.
- `references/`: branding, biên kịch ElevenLabs, content/timing, motion/sound và QA.
- `assets/remotion-starter/`: starter kit code-native, không dữ liệu riêng tư.
- `scripts/`: phân tích audio, invariant check và frame extraction.
- `THIRD_PARTY_NOTICES.md`: nguồn tham khảo và attribution MIT.
- `.github/workflows/validate.yml`: kiểm tra package, TypeScript và composition.

## Đóng góp

Pull request phải giữ các invariant thương hiệu, không đưa tài sản riêng tư vào repository và kèm lý do cho motion rule mới. Quy tắc mới nên xuất phát từ một lỗi có thể tái hiện, không phải sở thích nhất thời.

## Giấy phép

[MIT](LICENSE)
