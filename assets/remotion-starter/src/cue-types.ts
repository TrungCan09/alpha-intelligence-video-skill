export type SceneRecipe = 'problem-resolve' | 'prompt-response' | 'focus-transfer-ab' | 'progressive-process' | 'cause-effect' | 'accumulating-checklist' | 'verification-mismatch' | 'freeze-question' | 'next-lesson-outro';

export type Cue = {
  id: string;
  sceneId: string;
  beatId: string;
  segmentIds: string[];
  start: number;
  end: number;
  visualHit: number;
  readableBy: number;
  spokenText: string;
  onScreenText: string;
  action: string;
  target: string;
  visualMeaning: string;
};

export type CueSheetLock = {
  schemaVersion: 2;
  fps: number;
  audioSha256: string;
  transcriptSha256: string;
  durationSeconds: number;
  maxCueLagSeconds: number;
  maxCumulativeDriftSeconds: number;
  cues: Cue[];
  voiceOnlySegments: Array<{segmentId: string; reason: string}>;
  cueSheetSha256: string;
};

export type SceneBeat = {id: string; cueId: string; segmentIds: string[]; action: string; target: string; onScreenText?: string; visualMeaning: string};
export type SceneSpec = {id: string; recipe: SceneRecipe; startCueId: string; endCueId: string; motionConcept: string; layoutFamily: string; holdReason?: string; beats: SceneBeat[]};
export type VideoPlan = {schemaVersion: 2; fps: number; scenes: SceneSpec[]; voiceOnlySegments: Array<{segmentId: string; reason: string}>};
