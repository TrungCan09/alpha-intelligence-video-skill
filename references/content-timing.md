# Viết nội dung, phân tích voice và semantic cue

## Nguồn sự thật

Thứ tự ưu tiên: yêu cầu người dùng → script đã chốt → voice đã chốt → bài viết nguồn → storyboard. Không tự viết lại script hoặc đảo thứ tự voice khi đã khóa.

## Viết script

- Giữ luận điểm và độ chính xác của bài viết; chuyển thành ngôn ngữ nói tự nhiên.
- Mở bằng tình huống, mâu thuẫn hoặc câu hỏi cụ thể; tránh dẫn nhập dài.
- Một câu nói nên mang một ý chính. Dùng khoảng nghỉ có chủ đích cho chuyển scene.
- On-screen text là bản cô đọng, không chép toàn bộ voice.
- Kết thúc bằng hành động hoặc câu hỏi mở sang bài sau; không suy đoán số bài.

## Đo voice và khóa transcript

1. Chạy Faster Whisper `small` trở lên với word timestamps và VAD.
2. Đo duration/audio hash từ file thật; không dựa vào tên file hoặc script.
3. Nghe lại và sửa chính tả transcript, nhưng không tự sửa timestamp.
4. Silence detection chỉ dùng chẩn đoán; không được thay ASR hoặc chia cue theo khoảng lặng.

## Voice-grounding gate

- Không suy lời thoại hoặc cue của đoạn tiếp theo từ frame, caption cũ, tên scene hay chủ đề chung.
- Khi có voice nhưng chưa có transcript đã duyệt, phải tạo transcript từ chính audio, rà lại lỗi ASR theo ngữ cảnh, rồi mới lập storyboard.
- Storyboard có voice khai báo `hasVoice: true`, `voiceGrounding.verified: true`, `voiceGrounding.visualInference: false`; mỗi beat phải lưu `spokenText` tương ứng.
- Nếu chưa xác minh được lời nói, dừng ở cue draft; không tự tạo motion chỉ vì hình ảnh có vẻ phù hợp chủ đề.

## Video plan và semantic beats

```json
{
  "schemaVersion": 2,
  "scenes": [
    {
      "id": "hook",
      "startCueId": "problem-lock",
      "endCueId": "problem-lock",
      "recipe": "problem-resolve",
      "motionConcept": "lock-and-split",
      "layoutFamily": "centered-mechanism",
      "beats": [
        {
          "id": "problem-lock",
          "cueId": "problem-lock",
          "segmentIds": ["seg-001"],
          "action": "lock",
          "target": "problem-card",
          "onScreenText": "Ý cô đọng",
          "visualMeaning": "Các phần tử rời khóa thành một vấn đề rõ ràng."
        }
      ]
    }
  ]
}
```

Video plan tuyệt đối không chứa timestamp số. `build-cue-lock.mjs` lấy `start`, `end`, `visualHit` và `readableBy` từ segment ASR. Particle, grain, mesh drift và breathing trang trí không được khai báo như beat.

## Quy tắc đồng bộ

- Text không hiện trước semantic cue.
- Trạng thái đọc được hoàn chỉnh chậm nhất 0,2 giây sau cue, trừ khi chính quá trình tạo chữ là nội dung đang được giải thích.
- Visual hit có thể đi sau âm vị đầu 0–3 frame để khớp cảm nhận, nhưng không được trễ 1–2 giây.
- SFX nhẹ có thể bắt đầu trước visual hit 2–3 frame, không che voice.
- Khi người dùng báo timestamp, kiểm tra tối thiểu ±1 giây và sửa mapping segment/cue nguồn rồi build lại lock, không vá offset cục bộ rải rác.
- Nếu một câu được đọc thành các cụm tách nhịp, không cho toàn bộ on-screen phrase xuất hiện từ cụm đầu; tạo sub-cue cho từng phần mang nghĩa.
- Giữa các ngắt câu, dành đủ thời gian cho exit/transition; không ép chữ chạy nhanh hơn voice.
- Mỗi scene phải có semantic beat trong 15 frame đầu. Scene dài hơn 4 giây phải có ít nhất hai beat, trừ khi có `holdReason` phục vụ đọc hoặc nhấn.
- Khoảng cách visual hit lớn hơn 90 frame cần `holdReason`; không dùng ambient motion để hợp thức hóa đoạn đơ.

## Song song và tuần tự

- Các lựa chọn A/B, nguồn dữ liệu song song và danh sách đồng cấp phải cùng hiện diện.
- Chỉ token, quy trình, câu hỏi được đọc lần lượt hoặc chuỗi nhân-quả mới stagger.
- Với chuỗi: phần tử nguồn → connector → phần tử đích. Connector không đi trước nguồn.
