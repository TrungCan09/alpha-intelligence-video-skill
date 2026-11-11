export type SceneRecipe = 'problem-resolve' | 'prompt-response' | 'focus-transfer-ab' | 'progressive-process' | 'cause-effect' | 'accumulating-checklist' | 'verification-mismatch' | 'freeze-question' | 'next-lesson-outro';
export type SceneRecipeV2 = SceneRecipe;

export type Cue = {
  id: string;
  sceneId: string;
  beatId: string;
  segmentIds: string[];
  scriptSegmentIds?: string[];
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
  schemaVersion: 2 | 3;
  fps: number;
  audioSha256: string;
  transcriptSha256: string;
  scriptSha256?: string;
  alignmentSha256?: string;
  durationSeconds: number;
  maxCueLagSeconds: number;
  maxCumulativeDriftSeconds: number;
  cues: Cue[];
  voiceOnlySegments: Array<{segmentId: string; reason: string}>;
  cueSheetSha256: string;
};

export type SceneBeat = {id: string; cueId: string; segmentIds?: string[]; scriptSegmentIds?: string[]; action: string; target: string; onScreenText?: string; visualMeaning: string};
export type SceneSpec = {id: string; recipe: SceneRecipe; startCueId: string; endCueId: string; motionConcept: string; layoutFamily: string; holdReason?: string; beats: SceneBeat[]};
export type VideoPlan = {schemaVersion: 2; fps: number; scenes: SceneSpec[]; voiceOnlySegments: Array<{segmentId: string; reason: string}>};

export type ConceptApproach = 'direct' | 'metaphorical' | 'typography';
export type ConceptScores = {semanticClarity: number; voiceAlignment: number; brandFit: number; novelty: number; feasibility: number};
export type MotionConcept = {
  id: string;
  approach: ConceptApproach;
  visualThesis: string;
  motionVerbs: string[];
  stateSequence: string[];
  layoutFamily: string;
  primitiveFamilies: string[];
  visualMeaning: string;
  risks: string[];
  scores: ConceptScores;
  rejectionReason?: string;
};
export type SceneConceptSet = {sceneId: string; semanticGoal: string; spokenMeaning: string; candidates: [MotionConcept, MotionConcept, MotionConcept]; selectedConceptId: string; selectionRationale: string};
export type ConceptCandidatesFile = {schemaVersion: 3; draftLockedAt: string; referenceReviewedAt?: string; sceneConceptSets: SceneConceptSet[]};

export type MotionElementKind = 'text' | 'card' | 'shape' | 'connector' | 'token-field' | 'mask' | 'group' | 'media';
export type LayoutFamilyV3 = 'stack' | 'split' | 'grid' | 'axis-flow' | 'radial' | 'stage' | 'freeform';
export type MotionOperatorName = 'enter' | 'exit' | 'assemble' | 'disassemble' | 'split' | 'merge' | 'morph' | 'draw' | 'scan' | 'focus' | 'freeze' | 'verify' | 'count' | 'camera';
export type MotionElement = {
  id: string;
  kind: MotionElementKind;
  text?: string;
  tone?: 'text' | 'muted' | 'green' | 'cyan' | 'blue';
  role?: 'hero' | 'support' | 'label' | 'decoration';
  sourceId?: string;
  targetId?: string;
  sourceAnchor?: string;
  targetAnchor?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
export type MotionOperation = {id: string; cueId: string; operator: MotionOperatorName; targetIds: string[]; visualMeaning: string; direction?: 'up' | 'down' | 'left' | 'right' | 'in' | 'out'; amount?: number};
export type MotionGraph = {elements: MotionElement[]; operations: MotionOperation[]; cameraPattern: 'static' | 'push' | 'pull' | 'track' | 'orbit-none'};
export type LayoutSpec = {family: LayoutFamilyV3; columns?: number; gap?: number; axis?: 'horizontal' | 'vertical'; opticalBalance: string};
export type SceneBeatV3 = SceneBeat;
export type SceneSpecV3 = {
  id: string;
  startCueId: string;
  endCueId: string;
  conceptId: string;
  renderMode: 'graph' | 'custom' | 'legacy';
  layout: LayoutSpec;
  beats: SceneBeatV3[];
  motionGraph?: MotionGraph;
  customComponentId?: string;
  legacyRecipe?: SceneRecipeV2;
  fallbackReason?: string;
  similarityReason?: string;
};
export type VideoPlanV3 = {schemaVersion: 3; fps: number; conceptDraftLockedAt: string; referenceReviewedAt?: string; scenes: SceneSpecV3[]; voiceOnlySegments: Array<{segmentId: string; reason: string}>};

export type ProductionLessonId = 'lesson-1' | 'lesson-2' | 'lesson-3';
export type ProductionReferenceShot = {
  id: string;
  lessonId: ProductionLessonId;
  start: number;
  end: number;
  spokenMeaning: string;
  semanticFunction: string;
  motionVerbs: string[];
  layoutFamily: string;
  elementKinds: string[];
  cameraPattern: string;
  motionFingerprint: string;
  usefulFor: string[];
  avoidWhen: string[];
  qualityNotes: string[];
  sourceCueIds: string[];
};
export type ProductionReferenceLibrary = {schemaVersion: 1; generatedAt: string; lessons: Array<{lessonId: ProductionLessonId; videoFile: string; videoSha256: string; durationSeconds: number; shots: ProductionReferenceShot[]}>; librarySha256: string};
export type ReferenceReviewLock = {schemaVersion: 1; conceptDraftSha256: string; referenceLibrarySha256: string; reviewedAt: string; distributionOverrideReason?: string; scenes: Array<{sceneId: string; referenceShotIds: string[]; techniquesToLearn: string[]; elementsNotToCopy: string[]; thesisUnchanged: boolean; transformationRationale?: string; transformedGroups?: Array<'layout'|'operator'|'element'|'camera'>}>};
