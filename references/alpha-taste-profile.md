# Alpha Intelligence taste profile

## Cảm giác tổng thể

- Công nghệ, rõ ràng, có chiều sâu nhưng không phô diễn hiệu ứng.
- Motion dứt khoát và có ý nghĩa; mỗi scene dùng một động từ hình ảnh phù hợp nội dung.
- Nhịp đủ sống động để không thành poster, nhưng vẫn dành hold cho ý quan trọng và khả năng đọc.

## Ưu tiên thị giác

- Một tiêu điểm glow mỗi frame; gradient trắng → green/blue chỉ dùng cho hierarchy chính.
- Typography là nhân vật chính. Graphic hỗ trợ quan hệ, không tranh chấp với chữ.
- Bố cục cân bằng theo optical weight, có khoảng âm rõ và không dồn toàn bộ lên trên.
- Danh sách song song hiện đồng thời; chuỗi chỉ stagger khi voice đang giải thích đúng trình tự đó.
- Connector phải thẳng hàng, có nguồn/đích và không biến thành decoration.

## Đa dạng có kiểm soát

- Đa dạng bằng phép biến đổi: khóa, tách, hội tụ, so sánh, dự đoán, kiểm chứng, đóng băng, soi chiếu.
- Không coi đổi easing, đổi hướng slide hoặc thêm flash là một concept mới.
- Không sao chép cấu trúc một scene được khen sang toàn bộ video.

## Red flags

- Graphic cần lời giải thích ngoài video mới hiểu.
- Text/card breathing liên tục.
- Mũi tên, progress line, thanh sáng hoặc vòng tròn tồn tại mà không mang thông tin.
- Chữ xuất hiện trước voice để “chuẩn bị cảnh”.
- Scene có pixel chuyển động nhưng semantic state không thay đổi.

## Taste gate bắt buộc sau render

Schema, timing và novelty pass không có nghĩa là thiết kế đã đạt. Duyệt contact sheet từ MP4 thật theo bốn nhóm sau; nếu một nhóm là `major issue`, phải sửa layout hoặc visual thesis rồi rerender:

- **Balance:** cụm chính đủ trọng lượng thị giác; không dồn lên trên hoặc để nửa dưới trống vô cớ.
- **Whitespace:** khoảng trống phải gom nhóm và dẫn mắt; không có icon, dấu hỏi, dot hoặc card đứng cô lập.
- **Hierarchy:** mỗi frame có đúng một entry point; graphic phụ không nặng hơn headline hoặc semantic payoff.
- **Gestalt:** nguồn, connector và đích tạo thành một cụm đọc được; phần tử cùng chức năng chia sẻ treatment và shared edges.

Mặc định, nội dung chính nên sử dụng khoảng 45–65% safe stage theo chiều cao ở trạng thái hoàn tất. Đây là ngưỡng review, không phải luật tuyệt đối: được phép thấp hơn khi `visualMeaning` cần khoảng âm, nhưng phải ghi lý do. Khoảng cách giữa hai nhóm phải ít nhất gấp đôi khoảng cách nội bộ của một nhóm.

Không chấp nhận các dấu hiệu “placeholder đã animate”:

- Dấu hỏi hoặc hình học chung chung thay cho một trạng thái cụ thể có thể viết thành chữ.
- Một từ như `PROMPT`, `AI`, `TOKEN` đứng một mình với thanh sáng để lấp khung hình.
- Card rỗng, progress line hoặc dot không có source, target hoặc state rõ ràng.
- Blur hoặc opacity làm ý cũ giống lỗi render thay vì trạng thái giảm nhấn có chủ đích.

Trong vòng critique đầu tiên, luôn hỏi: “Nếu tắt motion và nhìn frame payoff, đây đã là một key visual hoàn chỉnh chưa?” Nếu chưa, không được chữa bằng thêm particle, glow hoặc camera.

Contact sheet tổng hợp tại `assets/reference/alpha-lessons-contact-sheet.svg` minh họa các cặp đạt/không đạt mà không dùng dữ liệu người dùng.
