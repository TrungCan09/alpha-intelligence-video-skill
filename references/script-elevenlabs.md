# Biên kịch voice-over tiếng Việt cho ElevenLabs

Đọc reference này khi người dùng gửi bài đăng hoặc văn bản thô và yêu cầu viết script video Alpha Intelligence.

## Mục tiêu

Chuyển văn viết thành lời thoại giáo dục gần gũi, truyền cảm, nghe một lần là hiểu. Giữ đầy đủ thông điệp cốt lõi và mạch logic, nhưng chủ động bỏ câu rườm rà, gộp ý trùng và chỉ giữ ví dụ đắt giá nhất.

## Giới hạn thời lượng

- Mỗi phiên bản phải có duration ước tính **dưới 2 phút**, đã cộng nhịp nghỉ.
- Không vượt 300 từ; ưu tiên tối đa khoảng 280 từ. Nếu nhiều dấu nghỉ, giảm số từ cho tới khi ước tính dưới 120 giây.
- Bản 1 hướng tới 1 phút 15 giây–1 phút 45 giây; thường khoảng 190–245 từ tùy mật độ dấu nghỉ.
- Bản 2 hướng tới 1 phút–1 phút 20 giây; thường khoảng 140–185 từ.
- Đây là dải mục tiêu, không được kéo dài câu vô ích chỉ để chạm thời lượng.

Dùng `node scripts/estimate-voiceover.mjs --file <script.txt>` để kiểm tra. Công cụ lấy 155 từ/phút làm mốc và cộng thời gian cho dấu câu, dấu ba chấm, gạch ngang và xuống đoạn. Duration thực tế còn phụ thuộc voice và preset, nên phải đo lại file audio sau khi generate.

## Chuyển thành lời thoại tự nhiên

- Dùng văn nói như một người hướng dẫn đang trò chuyện; mỗi câu mang một ý chính.
- Không dùng thẻ cảm xúc trong ngoặc vuông như `[cười]`, `[thở dài]` hoặc chỉ dẫn diễn xuất tương tự.
- Có thể dùng từ đệm có chủ đích ở đầu câu/chuyển ý: `Thực ra thì...`, `Bạn biết đấy,`, `Ừm...`, `Chà...`, `Thế nhưng...`. Không lạm dụng hoặc lặp một từ đệm.
- Dùng gạch ngang dài `—` trước ý cần nhấn hoặc đổi tông; dùng `...` cho nhịp chùng/suy ngẫm; dùng dấu phẩy để chia cụm dài và tạo điểm lấy hơi.
- Dấu câu phải phục vụ ý nghĩa, không thêm hàng loạt chỉ để “làm giọng cảm xúc”.

## Phiên âm cho voice

- Phiên âm thuật ngữ tiếng Anh dễ bị ElevenLabs đọc sai bằng dạng tiếng Việt có gạch nối: `AI → ây-ai`, `token → tô-kần`, `checklist → chếch-lít`.
- Chỉ phiên âm trong **voice script**. On-screen text, tiêu đề, caption và metadata vẫn dùng chính tả chuẩn như `AI`, `token`, `checklist`.
- Với thuật ngữ mới, ưu tiên cách đọc dễ hiểu và nhất quán; nếu có nhiều cách đọc hợp lý, ghi chú để người dùng duyệt thay vì tự coi một cách là tuyệt đối.

## Danh sách trong lời đọc

- Chuyển bullet thành câu có thứ tự: `Một là,`, `Hai là,`, `Ba là,` hoặc `Thứ nhất —`.
- Giữ cấu trúc ngữ pháp song song giữa các mục.
- Đặt `...` hoặc ngắt đoạn sau từng mục khi cần tránh giọng đọc tăng tốc dần.
- Không biến danh sách dài thành một câu quá nhiều mệnh đề; có thể generate từng phần nếu voice đọc lướt.

## Hai phiên bản bắt buộc

Trừ khi người dùng yêu cầu rõ chỉ một bản, trả về:

1. **Phiên bản 1 — Tối ưu kể chuyện & súc tích (khuyên dùng):** có hook, chuyển ý tự nhiên, từ đệm tiết chế và nhịp cảm xúc rõ.
2. **Phiên bản 2 — Siêu cô đọng, đi thẳng trọng tâm:** giữ cùng thông điệp, giảm tối đa từ đệm và ví dụ phụ, nhịp nhanh nhưng vẫn có điểm nghỉ.

Hai bản phải được biên tập độc lập; không chỉ xóa vài từ khỏi bản 1.

## Output contract

Với mỗi phiên bản:

```text
### Phiên bản N — Tên phiên bản

[Độ dài: ~X chữ | Thời lượng ước tính: ~X phút Y giây]

<voice script>
```

Trong dòng độ dài, `chữ` được đếm theo đơn vị từ tách theo ngôn ngữ tự nhiên; từ ghép có gạch nối như `ây-ai` được tính là một đơn vị. Nêu rõ đây là ước lượng nếu cần độ chính xác cao.

Sau hai script, thêm mục ngắn:

```text
💡 Tips tạo giọng tự nhiên trên ElevenLabs cho bài này:
```

Chỉ đưa 2–4 mẹo liên quan trực tiếp đến bài, ví dụ:

- Xuống đoạn bằng Enter tại chỗ đổi ý để voice lấy hơi và đổi tông.
- Generate riêng đoạn liệt kê hoặc đoạn dài để tránh đọc nhanh dần.
- Thử Stability khoảng 35–45% để tăng sắc thái; Style Exaggeration khoảng 15–25% nếu voice/model hỗ trợ. Đây là điểm khởi đầu, không phải preset bắt buộc.
- Nghe lại tên riêng và thuật ngữ phiên âm trước khi generate toàn bài.

Kết thúc nguyên văn bằng câu:

> Bạn có muốn tăng hay giảm thời lượng nói của kịch bản này xuống bao nhiêu phút/giây không? Hãy cho tôi biết con số mong muốn để tôi tinh chỉnh lại độ dài script nhé!

## Trường hợp chưa có nội dung

Nếu người dùng chỉ thiết lập vai trò nhưng chưa gửi bài viết, trả lời ngắn gọn:

> Sẵn sàng! Hãy gửi nội dung bài đăng của bạn vào đây.

Nếu nội dung đã có trong cùng yêu cầu hoặc ngữ cảnh, bắt đầu biên tập ngay; không trả lời câu chờ này.
