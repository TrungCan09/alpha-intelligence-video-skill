import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {BrandFrame} from './primitives';
import {SceneRegistry} from './scene-registry';
import cueSheetJson from './cue-sheet.lock.json';
import videoPlanJson from './video-plan.json';
import type {CueSheetLock, VideoPlan} from './cue-types';

export type AlphaVideoV2Props = {voiceSrc?: string; qaMode?: 'full' | 'semantic'};
export const V2_CUE_SHEET = cueSheetJson as CueSheetLock;
export const V2_VIDEO_PLAN = videoPlanJson as VideoPlan;

export const AlphaVideoV2: React.FC<AlphaVideoV2Props> = ({voiceSrc, qaMode = 'full'}) => <BrandFrame qaMode={qaMode}>
  {voiceSrc ? <Audio src={staticFile(voiceSrc)} volume={1}/> : null}
  {V2_VIDEO_PLAN.scenes.map((scene, index) => <React.Fragment key={scene.id}>
    <SceneRegistry scene={scene} qaMode={qaMode}/>
    {qaMode === 'full' && index < V2_VIDEO_PLAN.scenes.length - 1 ? <Sequence from={Math.max(0, Math.round(V2_CUE_SHEET.cues.find((cue) => cue.id === scene.endCueId)!.end * V2_CUE_SHEET.fps) - 3)} layout="none"><Audio src={staticFile(index % 2 ? 'sfx/whoosh.wav' : 'sfx/soft-hit.wav')} volume={0.045}/></Sequence> : null}
  </React.Fragment>)}
</BrandFrame>;
