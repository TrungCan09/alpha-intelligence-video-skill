# Viết nội dung, phân tích voice và semantic cue

## Nguồn sự thật

Thứ tự ưu tiên: yêu cầu người dùng → script đã chốt → voice đã chốt → bài viết nguồn → storyboard. Không tự viết lại script hoặc đảo thứ tự voice khi đã khóa.

## Viết script

- Giữ luận điểm và độ chính xác của bài viết; chuyển thành ngôn ngữ nói tự nhiên.
- Mở bằng tình huống, mâu thuẫn hoặc câu hỏi cụ thể; tránh dẫn nhập dài.
- Một câu nói nên mang một ý chính. Dùng khoảng nghỉ có chủ đích cho chuyển scene.
- On-screen text là bản cô đọng, không chép toàn bộ voice.
- Kết thúc bằng hành động hoặc câu hỏi mở sang bài sau; không suy đoán số bài.

## Đo voice

1. Đo duration bằng ffprobe, không dựa vào tên file hoặc script.
2. Dùng silence detection để tìm ứng viên ranh giới.
3. Nghe/đọc waveform và đánh dấu thời điểm **ý nghĩa bắt đầu được nói**.
4. Khoảng lặng máy phát hiện chỉ là gợi ý; không phải semantic cue.

## Cue sheet tối thiểu

```json
{
  "fps": 30,
  "durationSeconds": 12.34,
  "cues": [
    {
      "id": "hook",
      "start": 0.0,
      "end": 3.2,
      "spoken": "Câu đang được nói",
      "semanticCue": "ý cốt lõi bắt đầu",
      "visualHit": 0.08,
      "onScreenText": "Ý cô đọng",
      "sfx": "hit-soft",
      "reason": "Nhấn mâu thuẫn"
    }
  ]
}
```

## Quy tắc đồng bộ

- Text không hiện trước semantic cue.
- Trạng thái đọc được hoàn chỉnh chậm nhất 0,2 giây sau cue, trừ khi chính quá trình tạo chữ là nội dung đang được giải thích.
- Visual hit có thể đi sau âm vị đầu 0–3 frame để khớp cảm nhận, nhưng không được trễ 1–2 giây.
- SFX nhẹ có thể bắt đầu trước visual hit 2–3 frame, không che voice.
- Khi người dùng báo timestamp, kiểm tra tối thiểu ±1 giây và sửa cue nguồn, không vá offset cục bộ rải rác.
- Giữa các ngắt câu, dành đủ thời gian cho exit/transition; không ép chữ chạy nhanh hơn voice.

## Song song và tuần tự

- Các lựa chọn A/B, nguồn dữ liệu song song và danh sách đồng cấp phải cùng hiện diện.
- Chỉ token, quy trình, câu hỏi được đọc lần lượt hoặc chuỗi nhân-quả mới stagger.
- Với chuỗi: phần tử nguồn → connector → phần tử đích. Connector không đi trước nguồn.
