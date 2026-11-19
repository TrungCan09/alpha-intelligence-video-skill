import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {BackgroundMesh, Grade, Grain, Vignette} from './alpha-short/components';
import {
  BookDossierScene,
  ChecklistScene,
  ConfidenceScene,
  HallucinationScene,
  NextLessonScene,
  NonexistentScene,
  PredictionPurposeScene,
  RiskGridScene,
  VerifyGateScene,
} from './alpha-ai-wrong/scenes';
import {wrongSceneFrames} from './alpha-ai-wrong/timeline';

const scenes = [
  BookDossierScene,
  NonexistentScene,
  PredictionPurposeScene,
  HallucinationScene,
  RiskGridScene,
  ConfidenceScene,
  ChecklistScene,
  VerifyGateScene,
  NextLessonScene,
] as const;

export const AlphaWhyAiCanBeWrong: React.FC = () => {
  const {fps} = useVideoConfig();
  const boundaries = wrongSceneFrames(fps);
  return <AbsoluteFill>
    <BackgroundMesh/>
    {scenes.map((Scene, index) => {
      const from = boundaries[index];
      const durationInFrames = boundaries[index + 1] - from;
      return <Sequence key={index} from={from} durationInFrames={durationInFrames} premountFor={fps}><Scene durationInFrames={durationInFrames}/></Sequence>;
    })}
    <Grade/>
    <Grain/>
    <Vignette/>
  </AbsoluteFill>;
};
