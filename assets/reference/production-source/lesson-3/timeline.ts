export const WRONG_FPS = 30;
export const WRONG_DURATION_SECONDS = 103.079125;
export const WRONG_DURATION_FRAMES = Math.ceil(WRONG_DURATION_SECONDS * WRONG_FPS);

// Measured from the supplied narration. Seconds are the sole timing source.
export const WRONG_SENTENCE_CUES = [
  {at: 0, text: 'Hãy thử tưởng tượng nhé'},
  {at: 1.631, text: 'Bạn hỏi AI về một cuốn sách'},
  {at: 3.677, text: 'Và chỉ vài giây sau'},
  {at: 5.099, text: 'Tên tác giả, năm xuất bản, nội dung chính và trích dẫn'},
  {at: 11.763, text: 'Chà... chỉ có một vấn đề nhỏ thôi'},
  {at: 14.387, text: 'Cuốn sách ấy hoàn toàn không tồn tại'},
  {at: 17.123, text: 'Tại sao AI trả lời sai mà vẫn tự tin?'},
  {at: 21.453, text: 'AI dự đoán từ tiếp theo dựa trên ngữ cảnh'},
  {at: 27.376, text: 'Mục tiêu là mạch lạc, không phải tự kiểm chứng'},
  {at: 32.411, text: 'Khi thiếu dữ liệu hoặc câu hỏi quá đặc thù'},
  {at: 36.115, text: 'AI vẫn ghép một đáp án nghe hợp lý'},
  {at: 39.208, text: 'Tên người, con số, trích dẫn'},
  {at: 43.27, text: 'Không hề có thật'},
  {at: 46.05, text: 'Ảo giác AI'},
  {at: 46.813, text: 'AI dễ sai trong bốn tình huống'},
  {at: 49.675, text: 'Câu hỏi quá mơ hồ'},
  {at: 51.492, text: 'Thông tin đã cũ'},
  {at: 53.1, text: 'Nguồn và số liệu quá chi tiết'},
  {at: 56.161, text: 'Câu hỏi chứa giả định sai'},
  {at: 59.74, text: 'Thông tin đúng và sai có cùng giọng văn tự tin'},
  {at: 66.964, text: 'Dài hơn, nhiều số liệu hơn chưa chắc đáng tin hơn'},
  {at: 71.647, text: 'Dừng lại kiểm tra ba điều'},
  {at: 77.916, text: 'Thông tin đã thay đổi chưa?'},
  {at: 80.992, text: 'Nguồn trích dẫn có thật không?'},
  {at: 83.836, text: 'Giả định trong câu hỏi đã chuẩn chưa?'},
  {at: 88.009, text: 'Biết AI có thể sai không phải để nghi ngờ tất cả'},
  {at: 91.374, text: 'Khi nào tham khảo, khi nào tự xác minh'},
  {at: 95.782, text: 'Ở bài tiếp theo'},
  {at: 98.726, text: 'Dùng AI để học hay né phần khó?'},
  {at: WRONG_DURATION_SECONDS, text: 'Kết thúc'},
] as const;

export const WRONG_SCENE_SECONDS = [
  0,
  11.763,
  21.453,
  32.411,
  46.813,
  59.74,
  71.647,
  88.009,
  95.782,
  WRONG_DURATION_SECONDS,
] as const;

export const wrongFrameAt = (seconds: number, fps: number) => Math.round(seconds * fps);
export const wrongSceneFrames = (fps: number) => WRONG_SCENE_SECONDS.map((seconds) => wrongFrameAt(seconds, fps));
