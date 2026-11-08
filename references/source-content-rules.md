# Bảo toàn nội dung nguồn và cấu trúc scene

Đọc reference này khi biến bài viết thành script, storyboard, on-screen text hoặc khi review nội dung trước render.

## Nguồn sự thật

Lập bản đồ nguồn trước khi rút gọn: luận điểm, ví dụ thiết yếu, so sánh hai phía, quan hệ nhân-quả, qualifier, câu hỏi suy ngẫm, lời kêu gọi hành động và phần dẫn sang bài tiếp theo. Không làm mạnh kết luận, đổi ý định hoặc thêm diễn giải không có trong nguồn.

Voice-over và on-screen text là hai lớp khác nhau:

- Voice-over được diễn đạt tự nhiên nhưng giữ ý và thuật ngữ.
- On-screen text chỉ lấy từ nội dung đã duyệt, cô đọng thành từ khóa hoặc cụm ý; không chép nguyên voice và không chế thêm quote.
- Câu hỏi, trích dẫn hoặc wording được yêu cầu giữ nguyên phải giữ đúng nguyên văn.

Khi video rút ngắn, ưu tiên bỏ câu rườm rà và ví dụ phụ; vẫn giữ qualifier ngăn hiểu sai, CTA, câu hỏi khán giả và toàn bộ cầu nối tới bài sau nếu nguồn có.

## Thứ tự hiển thị và thời gian đọc

- Trong scene: main title phải hoàn tất trước supporting content.
- Supporting card, prompt, subtitle hoặc diagram không được xuất hiện trước title hay tồn tại mồ côi.
- Text bắt đầu cùng semantic cue hoặc chậm tối đa 0,2 giây; không xuất hiện sớm.
- Thời gian hiển thị tối thiểu: **1 giây cho mỗi 6 từ**. Giữ text tới khi voice chuyển sang ý mới.
- Khi title và supporting cùng liên quan một cue, title được đọc rõ trước rồi supporting mới vào; không dùng điều này để tạo chuỗi reveal dài vô nghĩa.

## Danh sách, numbering và nội dung song song

- Chỉ dùng danh sách số khi nguồn có thứ tự hoặc logic bắt buộc tuần tự.
- Danh sách thông thường dùng bullet/icon đơn sắc; không thêm số để trang trí.
- Hai lựa chọn dùng `A/B` hoặc không nhãn; không dùng `01/02`.
- Một số chỉ xuất hiện một lần trong cùng khối nội dung, không lặp ở chip góc.
- Khi biểu diễn một danh sách từ nguồn, giữ nguyên số item; không gộp, bỏ hoặc phát minh item nếu chưa được người dùng duyệt.
- Item đồng cấp xuất hiện cùng frame, cùng animation và nằm trên dòng riêng.
- Hai lựa chọn song song cùng hiện diện, cùng kích thước và trọng lượng; chỉ ưu tiên một bên nếu nguồn tạo ra thứ bậc.
- Ngoại lệ tuần tự chỉ áp dụng khi voice đang kể một quy trình, cơ chế hoặc từng câu hỏi theo thứ tự.

## Bố cục và khả năng đọc

- 1080×1920, safe zone trái/phải 60 px, trên 150 px, dưới 270 px.
- Không dồn toàn bộ nội dung vào 40% phía trên; sử dụng hợp lý cả nửa trên và nửa dưới.
- Mỗi scene có một tiêu điểm, negative space rõ và không có nhóm hình cạnh tranh.
- Không tách một câu thành các mảnh xa nhau làm đứt mạch đọc.
- Contrast text/background tối thiểu 4.5:1. Không dùng blue tối trên navy.
- Hero tối thiểu 80 px, supporting 48 px, nhãn 32 px. Bỏ nhãn nếu không đủ chỗ cho cỡ tối thiểu.

Kiểm tra contrast bằng:

```bash
node scripts/check-contrast.mjs '#F9F9F9' '#081938'
```

## Episode và nhãn nhận diện

- Chỉ hiển thị số bài/phần khi được cung cấp chính thức.
- Không suy đoán và không dùng placeholder như `Episode XX`, `Part XX`, `Bài ?`.
- Nếu có episode label, giữ vị trí, kiểu chữ và kích thước nhất quán.

## Storyboard contract

Mỗi scene nên ghi: thời gian, voice-over, main title, thời điểm title đọc được, supporting content, danh sách/parallel content, motion concept và SFX. Có thể dùng `scripts/check-storyboard.mjs` với JSON để kiểm tra các invariant có thể tự động hóa; xem fixture trong `tests/fixtures/storyboard.valid.json`.
