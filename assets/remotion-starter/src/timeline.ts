export const TIMELINE = {
  durationSeconds: 6,
  scenes: {
    hook: {start: 0, end: 2.5},
    mechanism: {start: 2.5, end: 6},
  },
  cues: {
    result: 0.2,
    relation: 2.75,
    source: 3.05,
    connector: 3.35,
    target: 3.55,
  },
} as const;

export const frameAt = (seconds: number, fps: number) => Math.round(seconds * fps);
