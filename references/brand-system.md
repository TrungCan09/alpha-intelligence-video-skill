# Hệ nhận diện Alpha Intelligence

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

## Typography

- Hero Latin: Montserrat 800.
- Nội dung: Be Vietnam Pro 700.
- Hero tiếng Việt có dấu: ưu tiên Be Vietnam Pro 700 nếu Montserrat gây lỗi dấu hoặc spacing.
- Hero tối thiểu 80 px; nội dung 48 px; nhãn 32 px.
- Không ép chữ Việt bằng line-height quá thấp. Kiểm tra riêng dấu mũ, dấu ngã, dấu hỏi và chữ hoa.
- Không ngắt một cụm ý tự nhiên chỉ để lấp đầy chiều ngang. Dùng `white-space: nowrap` cho cụm khóa nếu vừa safe stage.

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
