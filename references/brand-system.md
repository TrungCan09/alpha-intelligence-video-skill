# Hệ nhận diện Alpha Intelligence

File thực thi duy nhất cho token là `assets/remotion-starter/src/brand.config.json`. Không sao chép palette, font, kích thước hoặc tagline sang một theme riêng. `theme.ts` chỉ chuyển token JSON thành API dùng trong Remotion.

## Bất biến thương hiệu

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode`.
- Tagline không thay đổi theo scene, chủ đề hoặc tiêu đề.

## Màu

| Token | Giá trị | Vai trò |
|---|---:|---|
| Ink | `#050D1D` | Nền sâu |
| Navy | `#081938` | Mesh, card |
| Hero green | `#20F669` | Trọng tâm chính |
| Cyan | `#00FCFE` | Dữ liệu, connector |
| Blue | `#263BE1` | Gradient phụ |
| Steel | `#4FA8D5` | Nhãn, đường viền |
| Text | `#F9F9F9` | Chữ chính |
| Muted | `#D7E3F4` | Chữ phụ |

Không thêm màu nổi bật mới nếu chưa có lý do nội dung. Mỗi frame tối đa một tiêu điểm glow.

### Vai trò ngữ nghĩa

| Vai trò | Token bắt buộc | Không dùng cho |
|---|---|---|
| Canvas | `ink` | Card hoặc chữ |
| Surface | `navy` | Chữ chính |
| Primary focus | `green` | Nhiều điểm nhấn cùng frame |
| Data/relationship | `cyan` | Trang trí không mang nghĩa |
| Secondary gradient | `blue` | Chữ body |
| Metadata/border | `steel` | Hero chính |
| Primary text | `text` | Chữ bị giảm nhấn |
| Secondary text | `muted` | Chữ quá nhỏ hoặc trên nền sáng |

Màu không được là tín hiệu duy nhất: lựa chọn, trạng thái và quan hệ phải có thêm nhãn, hình dạng hoặc vị trí. Chỉ các cặp chữ–nền khai báo trong `allowedTextPairs` mới được dùng. Chạy `node scripts/check-brand-contrast.mjs` sau khi đổi token; chữ thường phải đạt tối thiểu 4.5:1.

## Typography

- Hero Latin: Montserrat 800.
- Nội dung: Be Vietnam Pro 700.
- Hero tiếng Việt có dấu: ưu tiên Be Vietnam Pro 700 nếu Montserrat gây lỗi dấu hoặc spacing.
- Hero tối thiểu 80 px; nội dung 48 px; nhãn 32 px.
- Không ép chữ Việt bằng line-height quá thấp. Kiểm tra riêng dấu mũ, dấu ngã, dấu hỏi và chữ hoa.
- Không ngắt một cụm ý tự nhiên chỉ để lấp đầy chiều ngang. Dùng `white-space: nowrap` cho cụm khóa nếu vừa safe stage.

### Role và component

| Role | Component | Font | Cỡ tối thiểu | Line-height |
|---|---|---|---:|---:|
| Hero | `HeroText` | Montserrat 800; tự chuyển Be Vietnam Pro 700 khi có dấu Việt | 80 px | 1.10 |
| Nội dung | `BodyText` | Be Vietnam Pro 700 | 48 px | 1.50 |
| Nội dung giảm nhấn | `MutedText` | Be Vietnam Pro 700 | 48 px | 1.50 |
| Nhãn dữ liệu | `DataLabel` | Be Vietnam Pro 700 | 32 px | 1.25 |

- Font chỉ được tải một lần tại `src/fonts.ts`, do `src/index.ts` import. `FontGate` phải gọi rõ `document.fonts.load()` cho Montserrat 800 và Be Vietnam Pro 700; không chỉ chờ `document.fonts.ready`.
- Không dùng weight chưa được tải và không để trình duyệt tự tổng hợp weight.
- Hero ngắn dùng `text-wrap: balance`; đoạn nội dung dùng `text-wrap: pretty`.
- Tất cả composition phải đi qua `BrandFrame`, component này chờ font, dựng background, safe stage, header, grain và thứ tự layer chuẩn.
- `fontMode="montserrat"` chỉ dùng cho hero Latin không dấu. `fontMode="vietnamese"` dùng khi cần khóa Be Vietnam Pro.

## Khung hình

- 1080×1920, 30 fps.
- Safe zone: trái/phải 60 px, trên 150 px, dưới 270 px.
- Header nằm trong safe zone và có khoảng thở rõ với nội dung.
- Stack hình ảnh: background mesh → graphics/type → grade → grain → vignette.
- Grain và mesh chỉ tạo chiều sâu, không cạnh tranh với chữ.

## Gradient và glow

- Gradient chữ: trắng→green hoặc trắng→blue; không trộn cả hai vô cớ.
- Glow phải củng cố cấp bậc thị giác, không làm mờ biên chữ.
- Chỉ hero concept hoặc trạng thái đang được voice nhấn mới nhận glow.
- `HeroText` mặc định không glow. Chỉ đặt `focus` cho đúng một tiêu điểm đang được voice nhấn.
- `white-green` là gradient chính; `white-blue` là gradient phụ. Body và label không dùng gradient.

## Bắt buộc khi triển khai

1. Bọc composition bằng `BrandFrame`.
2. Dùng `HeroText`, `BodyText`, `MutedText` và `DataLabel`; không viết style chữ mới nếu role đã tồn tại.
3. Lấy màu từ `ALPHA_THEME.colors`; không dùng hex inline.
4. Giữ nguyên header và tagline từ `BRAND`.
5. Chạy `check-brand-usage.mjs`, `check-brand-contrast.mjs` và `check-alpha-video.mjs` trước render.
6. Render master với `--concurrency=1` để tránh lỗi glyph một-frame giữa các renderer; trích frame từ chính MP4 để xác nhận.
