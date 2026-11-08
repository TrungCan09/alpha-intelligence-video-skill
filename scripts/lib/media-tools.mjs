import {access} from 'node:fs/promises';
import {delimiter, join} from 'node:path';
import {spawnSync} from 'node:child_process';

const executableNames = (name) => process.platform === 'win32' ? [`${name}.exe`, name] : [name];

export async function resolveMediaTool(name, startDir = process.cwd()) {
  const envName = name === 'ffmpeg' ? 'FFMPEG_PATH' : 'FFPROBE_PATH';
  const explicit = process.env[envName];
  if (explicit) {
    try { await access(explicit); return explicit; } catch { throw new Error(`${envName} không tồn tại: ${explicit}`); }
  }
  const probe = spawnSync(name, ['-version'], {encoding: 'utf8'});
  if (!probe.error && probe.status === 0) return name;

  const roots = [startDir, process.cwd()];
  for (const root of roots) {
    for (const exe of executableNames(name)) {
      const candidates = [
        join(root, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', exe),
        join(root, 'node_modules', '@remotion', 'compositor-linux-x64-gnu', exe),
        join(root, 'node_modules', '@remotion', 'compositor-darwin-arm64', exe),
        join(root, 'assets', 'remotion-starter', 'node_modules', '@remotion', 'compositor-win32-x64-msvc', exe),
        join(root, 'assets', 'remotion-starter', 'node_modules', '@remotion', 'compositor-linux-x64-gnu', exe),
        join(root, 'assets', 'remotion-starter', 'node_modules', '@remotion', 'compositor-darwin-arm64', exe),
      ];
      for (const candidate of candidates) {
        try { await access(candidate); return candidate; } catch { /* tiếp tục */ }
      }
    }
  }
  throw new Error(`Không tìm thấy ${name}. Cài FFmpeg hoặc đặt ${envName} tới executable tương ứng.`);
}

export function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, {encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, ...options});
  if (result.error || result.status !== 0) {
    throw new Error(`${tool} thất bại (${result.status ?? 'không chạy được'}):\n${result.stderr || result.error?.message || ''}`);
  }
  return result;
}
