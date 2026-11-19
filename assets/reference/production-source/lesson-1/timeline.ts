export const ALPHA_FPS = 30;
export const ALPHA_DURATION_SECONDS = 53.39425;
export const ALPHA_DURATION_FRAMES = Math.round(ALPHA_DURATION_SECONDS * ALPHA_FPS);

export const CUE_SECONDS = [
  0,
  5.63,
  10.79,
  18.23,
  21.59,
  28.79,
  33.95,
  36.07,
  38.11,
  41.87,
  48.27,
  ALPHA_DURATION_SECONDS,
] as const;

export const frameAt = (seconds: number, fps: number) => Math.round(seconds * fps);
export const cueFrames = (fps: number) => CUE_SECONDS.map((seconds) => frameAt(seconds, fps));

export const VISUAL_RANGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 9],
  [9, 10],
  [10, 11],
] as const;
