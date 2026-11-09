# Pattern Remotion dành cho Alpha Intelligence

Đây là bản triển khai tự chứa, đã điều chỉnh từ kinh nghiệm sản xuất Alpha và các ý tưởng motion phổ biến. Dùng component trong `assets/remotion-starter/src/motion.tsx` và `media.tsx` thay vì viết lại.

## Motion primitives

- `Entrance`: spring kết hợp opacity, translate và scale.
- `SceneExit`: exit nhanh, có clamp.
- `MechanismWordReveal`: chỉ dùng khi voice đang giải thích chuỗi từ/token; không dùng cho danh sách đồng cấp.
- `CountUp`: số dùng `tabular-nums`, tránh layout jitter.
- `RadialSpark`: chi tiết trang trí/hero hit; một frame chỉ có một glow chính.
- `ParallaxLayer`: depth nhẹ cho graphics, không dùng để làm card/text trôi liên tục.
- `MotionTrail`: chỉ cho vật thể chạy nhanh, không dùng quanh chữ tĩnh.
- `MaskWipe`: transition nội bộ ngắn; tránh full-screen flash/whip lặp lại.

Mọi scene phải có chuyển động có ý nghĩa trong 15 frame đầu. Nếu scene dài hơn 90 frame mà không có thay đổi thị giác hoặc focus shift, kiểm tra lại khoảng hold; không thêm chuyển động vô nghĩa chỉ để đạt quota.

## Scene recipes có chủ đích

- **Split/lock:** một trạng thái được khóa rồi tách để lộ mâu thuẫn; dùng cho “xong bài ≠ đã học”.
- **Progressive assembly:** đối tượng được xây qua nhiều semantic beat; dùng cho quy trình, không dùng để stagger danh sách đồng cấp.
- **Focus transfer:** A/B cùng hiện diện, ánh sáng và độ tương phản chuyển theo lời đọc.
- **Source → connector → target:** connector chỉ draw sau nguồn và kết thúc khi target bắt đầu nhận trạng thái.
- **Verification mismatch:** câu trả lời mượt xuất hiện trước, sau đó lớp kiểm chứng bóc ra phần sai hoặc thiếu nguồn.
- **Freeze/depth shift:** giao diện đang chạy đóng băng và lùi chiều sâu khi voice yêu cầu dừng lại hoặc suy nghĩ.

Không dùng recipe như template cứng. Mỗi scene vẫn phải khai báo motion concept, target thay đổi và lý do phù hợp với nội dung.

Với ý “phản hồi xuất hiện ngay”, ưu tiên prompt → mũi tên/xung thẳng → response card được xây nhanh. Không thay bằng đường sóng và các chấm trôi nếu chúng không đại diện cho dữ liệu đã được định nghĩa.

## Ảnh và footage

- `KenBurnsImage` dành cho still image: pan/zoom chậm, có easing và clamp. Đổi hướng giữa các ảnh liên tiếp.
- `FootageLayer` dùng `<OffthreadVideo>`, không dùng `<Video>` cho footage sản xuất.
- Đo duration/fps bằng ffprobe trước khi đặt composition duration.
- Asset nằm trong `public/` và được gọi qua `staticFile()` ở composition sử dụng thực tế.
- Grade/texture đặt phía trên asset nhưng không làm giảm contrast chữ dưới 4.5:1.

## Captions

`AlphaCaptions` nhận mảng `Caption` có timestamp và dùng `@remotion/captions` để gom trang. Caption nằm khoảng 65% chiều cao, trong safe zone; mỗi trang ngắn, active token nhận green, các token còn lại màu text. Voice-over giải thích code-native không bắt buộc caption; dùng khi footage có lời nói hoặc người dùng yêu cầu.

## Sound

- Voice là lớp chính. SFX chỉ ở semantic hit, thường 5–8 hit/phút.
- SFX có thể bắt đầu trước visual hit 2–3 frame.
- Không thêm music bed nếu chưa được yêu cầu.
- Khi thiếu asset, chạy `node scripts/generate-sfx.mjs --out public/sfx` để tạo WAV tối giản. Không đặt SFX vào từng chữ/card.

## Browser fallback

Remotion thường tự tải Chrome Headless Shell. Nếu thất bại, tìm Chromium/Chrome/headless shell hiện có và truyền:

```bash
npx remotion render src/index.ts <CompId> out/video.mp4 --browser-executable=<path>
```

Ưu tiên `headless_shell` khi full Chrome báo old headless mode không còn hỗ trợ. Không hard-code đường dẫn máy cá nhân vào repository.

Trên Windows, thêm `--disable-shared-memory-capture --gop=30` vào preview và master. Nếu không, Chrome capture hoặc chuỗi frame tham chiếu quá dài có thể tạo frame bị mất dải glyph dù still hoặc frame liền kề vẫn đúng. Luôn xác minh bằng một chuỗi PNG liên tiếp và frame trích từ MP4, không chỉ một ảnh duy nhất.

## Quy tắc xung đột đã khóa

- Không “stagger mọi thứ”: list và lựa chọn song song phải đồng thời.
- Không cho mọi phần tử breathing: chỉ decoration nền được drift nhẹ.
- Không bắt buộc SFX ở mọi entrance và không mặc định có music.
- Không bắt buộc Ken Burns với screenshot cần đọc chính xác hoặc diagram; chỉ dùng khi pan/zoom không làm sai nội dung.
- Hard cut có chủ đích được ưu tiên hơn transition phô diễn.

## Kiểm tra

Render preview, xem chậm motion đáng ngờ, trích frame từ MP4 cuối và kiểm tra layer order, spacing px, safe zone, contrast, glyph tiếng Việt và frame trước/sau cue. Với frame chính xác từ source, có thể dùng `npx remotion still`; với master, dùng `scripts/extract-qa-frames.mjs`.
