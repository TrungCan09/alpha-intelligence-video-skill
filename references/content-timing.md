# Viết nội dung, phân tích voice và semantic cue

## Nguồn sự thật

Script đã chốt là nguồn sự thật duy nhất của lời thoại và `spokenText`; voice đã chốt là nguồn sự thật duy nhất của timing. Faster-Whisper chỉ nhận dạng để căn vị trí của script vào audio, không được thay script.

## Viết script

- Giữ luận điểm và độ chính xác của bài viết; chuyển thành ngôn ngữ nói tự nhiên.
- Mở bằng tình huống, mâu thuẫn hoặc câu hỏi cụ thể; tránh dẫn nhập dài.
- Một câu nói nên mang một ý chính. Dùng khoảng nghỉ có chủ đích cho chuyển scene.
- On-screen text là bản cô đọng, không chép toàn bộ voice.
- Kết thúc bằng hành động hoặc câu hỏi mở sang bài sau; không suy đoán số bài.

## Script-locked voice alignment

1. Người dùng cung cấp `approved-script.md|txt` và `final-voice.mp3|wav`; mỗi paragraph script là một đơn vị lời đọc.
2. Khóa script rồi chạy Faster Whisper `small` trở lên với word timestamps và VAD. CPU dùng int8, CUDA dùng float16.
3. Giữ raw ASR transcript nguyên trạng. Map script sang word timestamp bằng `align-script-to-audio.mjs`; `spokenText` luôn lấy từ script.
4. Chỉ khác biệt phát âm trong pronunciation dictionary được tự chấp nhận. Thiếu/thừa câu, khác nghĩa hoặc không map được phải chặn để review; manual override chỉ tham chiếu một khoảng word ASR liên tiếp, có reviewer và lý do.
5. Không nhập timestamp tự do, không sửa ASR timestamp, không dùng silence detection để thay alignment.

## Voice-grounding gate

- Không suy lời thoại hoặc cue của đoạn tiếp theo từ frame, caption cũ, tên scene hay chủ đề chung.
- Khi có voice nhưng thiếu script lock hoặc alignment lock đã review, phải dừng trước storyboard.
- Storyboard production có `timingSource: "script-audio-alignment"`; mỗi beat dùng `scriptSegmentIds`, không dùng `segmentIds` ASR.
- Nếu chưa xác minh được lời nói, dừng ở cue draft; không tự tạo motion chỉ vì hình ảnh có vẻ phù hợp chủ đề.

## Video plan và semantic beats

```json
{
  "schemaVersion": 3,
  "timingSource": "script-audio-alignment",
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
          "scriptSegmentIds": ["script-001"],
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

Video plan tuyệt đối không chứa timestamp số. `build-cue-lock.mjs` lấy `start`, `end`, `visualHit` và `readableBy` từ mapping script–ASR đã khóa. Particle, grain, mesh drift và breathing trang trí không được khai báo như beat.

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
