# Pipeline v2: voice → cue lock → master

## 1. ASR bắt buộc

```bash
python scripts/transcribe-audio.py "voice.mp3" --model small --language vi --out transcript.lock.json
```

Faster Whisper chạy `word_timestamps=true`, VAD bật; CPU dùng `int8`, CUDA dùng `float16`. Model master tiếng Việt không nhỏ hơn `small`. Nếu dependency hoặc model không sẵn sàng, dừng trước storyboard.

`transcript.lock.json` khóa SHA-256 audio, duration, engine/model, segment, word và hash transcript. Có thể sửa chính tả text sau khi nghe lại, nhưng không sửa timestamp. Sau review:

```bash
node scripts/lock-reviewed-transcript.mjs transcript.lock.json --confirm-reviewed
```

## 2. Video plan không chứa timestamp

`video-plan.json` chỉ mô tả ý đồ:

```json
{
  "id": "scene-id",
  "recipe": "cause-effect",
  "startCueId": "cue-a",
  "endCueId": "cue-b",
  "motionConcept": "transform",
  "layoutFamily": "split-transform",
  "beats": [{
    "id": "beat-a",
    "cueId": "cue-a",
    "segmentIds": ["seg-001"],
    "action": "transform",
    "target": "answer-card",
    "onScreenText": "CÂU TRẢ LỜI",
    "visualMeaning": "Prompt chuyển thành câu trả lời hoàn chỉnh."
  }]
}
```

Mọi ASR segment phải thuộc một cue hoặc `voiceOnlySegments` có lý do cụ thể.

## 3. Khóa cue

```bash
node scripts/build-cue-lock.mjs transcript.lock.json video-plan.json --out cue-sheet.lock.json
node scripts/check-cue-lock.mjs transcript.lock.json cue-sheet.lock.json --audio voice.mp3
```

`build-cue-lock` lấy start/end trực tiếp từ segment ASR. Audio hash, transcript hash, segment hoặc duration thay đổi sẽ vô hiệu cue lock.

## 4. Binding Remotion

Composition production import cue lock và dùng `cueStart(id)`, `cueEnd(id)`, `cueFrame(id, fps)`, `useCueProgress(id)`. Không nhập lại giây/frame trong scene. Orchestrator chỉ map `video-plan.scenes` qua `SceneRegistry`.

```bash
node scripts/check-timeline-binding.mjs assets/remotion-starter
node scripts/check-scene-diversity.mjs video-plan.json
```

## 5. Render và gate

1. Render candidate H.264/AAC.
2. Render `qaMode="semantic"` để loại ambient mesh/particle/breathing.
3. Chạy motion-density trên semantic render.
4. `build-qa-pack` từ candidate MP4.
5. Người duyệt xác nhận report từng cue và playback 1×/0,5×.
6. `finalize-master` chạy lại tất cả gate rồi mới tạo master.

```bash
node scripts/build-qa-pack.mjs candidate.mp4 cue-sheet.lock.json --out qa/
node scripts/check-qa-report.mjs qa/report.json
node scripts/finalize-master.mjs --candidate candidate.mp4 --transcript transcript.lock.json --cue-lock cue-sheet.lock.json --plan video-plan.json --project assets/remotion-starter --report qa/report.json --out master.mp4
```

Với preview ngắn của một voice dài, thêm `--until 15` cho cả `build-qa-pack` và `check-qa-report`; master luôn duyệt toàn bộ duration.
