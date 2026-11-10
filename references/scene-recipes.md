# Scene registry v2

Xem `assets/reference/alpha-video-v2-reference.mp4` hoặc contact sheet trước khi chọn recipe. Reference thể hiện chất lượng nhịp và quan hệ hình học, không phải template để sao chép mọi scene.

## Chín recipe

| Recipe | Khi dùng | Quan hệ hình ảnh |
|---|---|---|
| `problem-resolve` | Nêu vấn đề rồi khóa trạng thái | phần tử rời → một vấn đề rõ |
| `prompt-response` | Người dùng gửi yêu cầu | nguồn → connector → đích |
| `focus-transfer-ab` | So sánh A/B | hai phía cùng tồn tại, focus đổi theo voice |
| `progressive-process` | Cơ chế tuần tự | bước sau chỉ hiện khi voice kể tới |
| `cause-effect` | Nguyên nhân tạo kết quả | cause → transformation → effect |
| `accumulating-checklist` | Danh sách được đọc tuần tự | item cũ giữ lại, item mới vào theo cue |
| `verification-mismatch` | Đối chiếu claim với kiểm chứng | bề mặt trôi chảy → lớp kiểm tra |
| `freeze-question` | Dừng và chuyển trọng tâm | UI lùi/freeze → câu hỏi chính |
| `next-lesson-outro` | Dẫn bài tiếp theo | token hội tụ → chủ đề mới |

## Luật chọn

- Không dùng cùng recipe ở hai scene liên tiếp hoặc quá hai lần/video.
- Hai scene liên tiếp không được trùng cả `motionConcept` và `layoutFamily`.
- Scene trên 4 giây cần ít nhất hai state change; khoảng giữa state change không quá 3 giây, trừ `holdReason` thật sự có chủ đích.
- Danh sách song song hiện đồng thời. Chỉ stagger chuỗi cơ chế hoặc nội dung được voice kể tuần tự.
- Connector xuất hiện cùng/sau nguồn, dùng chung anchor, có end gap và không bị card che.
- Mỗi beat cần `visualMeaning` một câu. Nếu người xem cần lời giải thích ngoài video mới hiểu graphic, đổi recipe hoặc hình ảnh.
- Background, glow, grain, particle và breathing không phải semantic change.

## Recipe không thay thế thiết kế

Agent vẫn phải chọn text hierarchy, tỷ lệ, khoảng trống và state change phù hợp nội dung. Recipe chỉ cưỡng chế quan hệ, timing, entrance/state/exit và SFX choreography; không được áp một cấu trúc cho toàn bộ video.
