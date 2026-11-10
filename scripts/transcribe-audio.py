#!/usr/bin/env python3
"""Create a timestamped, content-addressed transcript lock from real audio."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")


ALLOWED_MODELS = ("small", "medium", "large-v2", "large-v3")


def canonicalize(value: object) -> str:
    """Match scripts/lib/lock-utils.mjs canonicalize(), including JS numbers."""
    if value is None:
        return "null"
    if value is True:
        return "true"
    if value is False:
        return "false"
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, list):
        return "[" + ",".join(canonicalize(item) for item in value) + "]"
    if isinstance(value, dict):
        return "{" + ",".join(
            json.dumps(str(key), ensure_ascii=False) + ":" + canonicalize(value[key])
            for key in sorted(value)
        ) + "}"
    raise TypeError(f"Unsupported canonical JSON type: {type(value)!r}")


def canonical_bytes(value: object) -> bytes:
    return canonicalize(value).encode("utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Transcribe audio with Faster Whisper and write transcript.lock.json")
    parser.add_argument("audio", type=Path)
    parser.add_argument("--model", default="small", choices=ALLOWED_MODELS)
    parser.add_argument("--language", default="vi")
    parser.add_argument("--out", type=Path, default=Path("transcript.lock.json"))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.audio.is_file():
        print(f"FAIL Không tìm thấy audio: {args.audio}", file=sys.stderr)
        return 2
    try:
        import ctranslate2
        import faster_whisper
        from faster_whisper import WhisperModel
    except ImportError:
        print("FAIL Thiếu Faster Whisper. Chạy: python -m pip install -r requirements-asr.txt", file=sys.stderr)
        return 2

    has_cuda = ctranslate2.get_cuda_device_count() > 0
    device = "cuda" if has_cuda else "cpu"
    compute_type = "float16" if has_cuda else "int8"
    try:
        model = WhisperModel(args.model, device=device, compute_type=compute_type)
        segment_iter, info = model.transcribe(
            str(args.audio),
            language=args.language,
            vad_filter=True,
            word_timestamps=True,
        )
        segments = []
        for index, segment in enumerate(segment_iter):
            words = [
                {"start": round(float(word.start), 3), "end": round(float(word.end), 3), "text": word.word.strip()}
                for word in (segment.words or [])
                if word.start is not None and word.end is not None and word.word.strip()
            ]
            text = segment.text.strip()
            if text:
                segments.append({
                    "id": f"seg-{index + 1:03d}",
                    "start": round(float(segment.start), 3),
                    "end": round(float(segment.end), 3),
                    "text": text,
                    "words": words,
                })
    except Exception as error:  # model download/device failures must block the workflow
        print(f"FAIL ASR không khả dụng; dừng trước storyboard. {error}", file=sys.stderr)
        return 2

    if not segments:
        print("FAIL ASR không tạo được segment; dừng trước storyboard.", file=sys.stderr)
        return 2

    payload = {
        "schemaVersion": 2,
        "sourceAudio": {"fileName": args.audio.name, "sha256": sha256_file(args.audio)},
        "durationSeconds": round(float(info.duration), 3),
        "engine": {
            "name": "faster-whisper",
            "version": faster_whisper.__version__,
            "model": args.model,
            "language": args.language,
            "device": device,
            "computeType": compute_type,
            "wordTimestamps": True,
            "vad": True,
        },
        "reviewed": False,
        "segments": segments,
    }
    payload["transcriptSha256"] = hashlib.sha256(canonical_bytes(payload)).hexdigest()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"PASS Đã ghi {args.out}: {len(segments)} segment, {payload['durationSeconds']:.3f}s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
