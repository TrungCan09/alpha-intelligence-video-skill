import React from 'react';
import {Audio, staticFile} from 'remotion';
import {BrandFrame} from './primitives';
import {SceneRegistryV3} from './scene-registry-v3';
import cueSheetJson from './cue-sheet.lock.json';
import videoPlanJson from './video-plan.v3.json';
import conceptJson from './concept-candidates.json';
import type {ConceptCandidatesFile, CueSheetLock, VideoPlanV3} from './cue-types';

export type AlphaVideoV3Props = {voiceSrc?: string; qaMode?: 'full' | 'semantic'};
export const V3_CUE_SHEET = cueSheetJson as CueSheetLock;
export const V3_VIDEO_PLAN = videoPlanJson as unknown as VideoPlanV3;
export const V3_CONCEPTS = conceptJson as unknown as ConceptCandidatesFile;

export const AlphaVideoV3: React.FC<AlphaVideoV3Props> = ({voiceSrc, qaMode = 'full'}) => <BrandFrame qaMode={qaMode}>
  {voiceSrc ? <Audio src={staticFile(voiceSrc)} volume={1}/> : null}
  {V3_VIDEO_PLAN.scenes.map((scene) => <SceneRegistryV3 key={scene.id} scene={scene} qaMode={qaMode}/>)}
</BrandFrame>;
