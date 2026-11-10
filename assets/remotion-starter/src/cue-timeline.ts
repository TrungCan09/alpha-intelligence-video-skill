import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import cueSheetJson from './cue-sheet.lock.json';
import type {Cue, CueSheetLock} from './cue-types';
import {ALPHA_THEME} from './theme';

export const CUE_SHEET = cueSheetJson as CueSheetLock;
const cueMap = new Map(CUE_SHEET.cues.map((cue) => [cue.id, cue]));

export const cue = (id: string): Cue => {
  const found = cueMap.get(id);
  if (!found) throw new Error(`Cue không tồn tại: ${id}`);
  return found;
};
export const cueStart = (id: string) => cue(id).start;
export const cueEnd = (id: string) => cue(id).end;
export const cueFrame = (id: string, fps: number) => Math.round(cueStart(id) * fps);

export const useCueProgress = (id: string, durationFrames = 14) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: frame - cueFrame(id, fps), fps, config: ALPHA_THEME.motion.spring.snappy, durationInFrames: durationFrames});
};

export const useCueExit = (id: string, durationFrames = 10) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const end = Math.round(cueEnd(id) * fps);
  return interpolate(frame, [end - durationFrames, end], [0, 1], {easing: ALPHA_THEME.motion.easeIn, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};
