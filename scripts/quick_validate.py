#!/usr/bin/env python3
"""Validator tối thiểu cho cấu trúc Agent Skill, dùng trong CI."""
from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
skill = root / "SKILL.md"
errors = []
if not skill.exists():
    errors.append("Thiếu SKILL.md")
else:
    text = skill.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.S)
    if not match:
        errors.append("Frontmatter không hợp lệ")
    else:
        header = match.group(1)
        name = re.search(r"^name:\s*(.+)$", header, flags=re.M)
        description = re.search(r"^description:\s*(.+)$", header, flags=re.M)
        if not name or name.group(1).strip() != "alpha-intelligence-video-skill":
            errors.append("Tên skill không đúng")
        if not description or len(description.group(1).strip()) < 40:
            errors.append("Description quá ngắn")
        if name and not re.fullmatch(r"[a-z0-9-]{1,64}", name.group(1).strip()):
            errors.append("Tên skill phải là kebab-case, tối đa 64 ký tự")

if errors:
    for error in errors:
        print(f"FAIL {error}", file=sys.stderr)
    raise SystemExit(1)
print("PASS SKILL.md hợp lệ")
