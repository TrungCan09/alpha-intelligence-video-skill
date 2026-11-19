export const ANSWERS_FPS = 30;
export const ANSWERS_DURATION_SECONDS = 97.149375;
export const ANSWERS_DURATION_FRAMES = Math.ceil(ANSWERS_DURATION_SECONDS * ANSWERS_FPS);

export const ANSWER_CUE_SECONDS = [
  0,
  8.25,
  13.998,
  24.582,
  26.049,
  31.839,
  38.237,
  46.13,
  51.356,
  61.024,
  68.284,
  78.395,
  87.618,
  94.831,
  ANSWERS_DURATION_SECONDS,
] as const;

export const answerFrameAt = (seconds: number, fps: number) => Math.round(seconds * fps);
export const answerCueFrames = (fps: number) => ANSWER_CUE_SECONDS.map((seconds) => answerFrameAt(seconds, fps));

export const ANSWER_VISUAL_RANGES = [
  [0, 1],
  [1, 2],
  [2, 4],
  [4, 5],
  [5, 6],
  [6, 8],
  [8, 9],
  [9, 11],
  [11, 12],
  [12, 14],
] as const;
