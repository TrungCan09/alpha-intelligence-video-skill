# Migration từ v1 sang v2

## Bổ sung v2.1

V2.1 không thay đổi cue-lock hoặc scene schema production. Bản này thêm knowledge registry, định tuyến lesson chọn lọc, privacy scan và `lessonIds` trong QA report. Report cũ vẫn được đọc; chỉ các cue được đánh dấu `false` mới bắt buộc khai lesson ID.

Không chuyển chat archive, screenshot, voice hoặc đường dẫn máy vào repository. Bằng chứng gốc nếu cần chỉ lưu trong `private/chat-research/`, thư mục này không được production và CI đọc.

## Từ v1 sang v2

V2 là breaking change. Storyboard production dùng timestamp thủ công không còn hợp lệ.

1. Giữ script, voice và asset đã duyệt.
2. Chạy Faster Whisper trên voice gốc để tạo `transcript.lock.json`.
3. Chuyển storyboard cũ thành `video-plan.json`: xóa mọi giây/frame, map beat sang segment/cue id.
4. Chọn một trong chín recipe cho mỗi scene và ghi `visualMeaning`.
5. Tạo `cue-sheet.lock.json`; thay helper timeline cũ bằng cue helpers.
6. Chuyển orchestrator sang JSON-driven registry.
7. Render lại semantic mode và QA pack; không tái sử dụng report/frame cũ.

`analyze-audio.mjs` và cue template v1 chỉ dùng để chẩn đoán audio, không được dùng làm nguồn timing production khi đã có voice.
