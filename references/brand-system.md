# Hệ nhận diện Alpha Intelligence

Nguồn thực thi duy nhất là `assets/remotion-starter/src/brand.config.json`. Không tạo palette, font stack hoặc gradient song song trong scene.

## Bất biến thương hiệu

- Header: `CỘNG ĐỒNG ALPHA INTELLIGENCE`.
- Tagline: `Học sinh làm chủ AI và Vibecode`.
- Tagline không thay đổi theo scene, chủ đề hoặc tiêu đề.

## Typography

| Role | Font | Weight | Cách dùng |
|---|---|---:|---|
| Brand display | Cy Grotesk V3 Wide | 800 | Hook/headline ngắn, rộng, tối đa khoảng ba dòng |
| Hero hỗ trợ | Montserrat | 800 | Headline dài, diagram, card hoặc nội dung cần độ đọc cao |
| Nội dung phụ | Montserrat | 700 | Tagline, caption, body và label |

- Mỗi scene chọn rõ `face="brand-wide"` hoặc `face="montserrat"`; không tự đổi font theo dấu tiếng Việt.
- `HeroText` mặc định Montserrat để fallback luôn ổn định. Code mới phải khai báo `face` có chủ đích.
- `BrandWordmark` luôn dùng brand-wide: `Alpha` mang gradient blue, `Intelligence` mang gradient green.
- Hero tối thiểu 80 px; body 48 px; label 32 px.
- Line-height brand-wide 0.98, Montserrat hero 1.08, body 1.5. Luôn kiểm tra dấu mũ, ngã, hỏi và chữ hoa trong frame cuối.
- Không ngắt cụm ý tự nhiên hoặc để một từ đơn rơi xuống dòng vô lý.

### Font Cy Grotesk ngoài repository

Repository công khai không phân phối Cy Grotesk. Người dùng có quyền sử dụng font tự cài file `.woff2` bằng:

```bash
node scripts/install-brand-font.mjs --file "D:/font/cy-grotesk-v3-wide.woff2"
```

File đích là `assets/remotion-starter/public/fonts/cy-grotesk-v3-wide.woff2` và đã bị Git bỏ qua. Khi file thiếu hoặc lỗi, `FontGate` cảnh báo một lần rồi dùng Montserrat 800. Dùng `node scripts/check-brand-font.mjs --require-cy` khi master bắt buộc phải dùng đúng Cy Grotesk.

## Màu và vai trò

| Token | Giá trị | Vai trò |
|---|---:|---|
| Canvas | `#081938` | Nền navy sâu chính |
| Surface | `#1B2D57` | Card, mesh, vùng nâng |
| Steel | `#365380` | Border, graphic, surface phụ |
| Text | `#F9F9F9` | Chữ chính |
| Light blue | `#ACDDFA` | Chữ phụ, metadata |
| Cyan | `#00FCFE` | Dữ liệu, connector |
| Green | `#20F669` | Trọng tâm Intelligence |
| Blue-lavender | `#263BE1` | Trọng tâm Alpha |

- Steel không dùng làm chữ trên canvas hoặc surface vì không đạt 4.5:1.
- Màu không là tín hiệu duy nhất; lựa chọn và trạng thái cần thêm nhãn, hình dạng hoặc vị trí.
- Mỗi frame tối đa một tiêu điểm glow. Body và label không dùng gradient.
- Chỉ dùng cặp chữ–nền trong `allowedTextPairs`; chạy `check-brand-contrast.mjs` sau khi đổi token.

## Gradient khóa cứng

- `alpha`: dọc 180°, `#F9F9F9` ở 0% → `#263BE1` ở 100%.
- `intelligence`: dọc 180°, `#F9F9F9` ở 0% → `#20F669` ở 100%.
- Không đổi stop thành 28%/122%, không đảo chiều và không trộn hai accent trong cùng một cụm chữ.

## Khung hình và component

- 1080×1920, 30 fps; safe zone 60/150/270 px.
- Mọi composition dùng `BrandFrame`; font được tải tại entrypoint và chờ trong `FontGate`.
- Dùng `HeroText`, `BrandWordmark`, `BodyText`, `MutedText`, `DataLabel`; không viết lại style chữ nếu role đã tồn tại.
- Layer stack: background mesh → asset → graphics/type → grade → grain/vignette.
- Hero visual robot–cube không thuộc phạm vi skill; chỉ dùng khi dự án cung cấp asset riêng.

## Bắt buộc trước bàn giao

1. Chạy `check-brand-usage.mjs`, `check-brand-contrast.mjs`, `check-brand-font.mjs` và `check-alpha-video.mjs`.
2. Nếu thiết kế yêu cầu Cy Grotesk thật, chạy thêm `check-brand-font.mjs --require-cy`.
3. Render `--concurrency=1`, trích frame từ MP4 và kiểm tra font, dấu tiếng Việt, gradient, glow và line break.
