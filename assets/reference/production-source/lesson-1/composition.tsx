import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {BackgroundMesh, Grade, Grain, Vignette} from './alpha-short/components';
import {
  ApproachScene,
  CapabilityScene,
  ChoiceScene,
  HookScene,
  LeverScene,
  OutroScene,
  ProductScene,
  PromptPauseScene,
  QuestionsScene,
} from './alpha-short/scenes';
import {cueFrames, VISUAL_RANGES} from './alpha-short/timeline';

const scenes = [
  HookScene,
  ProductScene,
  CapabilityScene,
  ApproachScene,
  ChoiceScene,
  PromptPauseScene,
  QuestionsScene,
  LeverScene,
  OutroScene,
] as const;

export const AlphaLearningShort: React.FC = () => {
  const {fps} = useVideoConfig();
  const cues = cueFrames(fps);

  return <AbsoluteFill>
    <BackgroundMesh/>
    {VISUAL_RANGES.map(([startIndex, endIndex], index) => {
      const from = cues[startIndex];
      const durationInFrames = cues[endIndex] - from;
      const Scene = scenes[index];
      return <Sequence key={index} from={from} durationInFrames={durationInFrames} premountFor={fps}>
        <Scene durationInFrames={durationInFrames}/>
      </Sequence>;
    })}
    <Grade/>
    <Grain/>
    <Vignette/>
  </AbsoluteFill>;
};
