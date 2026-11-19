import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {BackgroundMesh, Grade, Grain, Vignette} from './alpha-short/components';
import {
  AnswerQuestionScene,
  ContextExampleScene,
  DataPatternsScene,
  IllusionScene,
  KeyboardAnalogyScene,
  MindReadingScene,
  NextLessonScene,
  PredictionLoopScene,
  RecapScene,
  TokenizeScene,
} from './alpha-ai-answers/scenes';
import {answerCueFrames, ANSWER_VISUAL_RANGES} from './alpha-ai-answers/timeline';

const answerScenes = [
  RecapScene,
  AnswerQuestionScene,
  IllusionScene,
  DataPatternsScene,
  TokenizeScene,
  PredictionLoopScene,
  KeyboardAnalogyScene,
  ContextExampleScene,
  MindReadingScene,
  NextLessonScene,
] as const;

export const AlphaHowAiAnswers: React.FC = () => {
  const {fps} = useVideoConfig();
  const cues = answerCueFrames(fps);
  return <AbsoluteFill>
    <BackgroundMesh/>
    {ANSWER_VISUAL_RANGES.map(([startIndex, endIndex], index) => {
      const from = cues[startIndex];
      const durationInFrames = cues[endIndex] - from;
      const Scene = answerScenes[index];
      return <Sequence key={index} from={from} durationInFrames={durationInFrames} premountFor={fps}>
        <Scene durationInFrames={durationInFrames}/>
      </Sequence>;
    })}
    <Grade/>
    <Grain/>
    <Vignette/>
  </AbsoluteFill>;
};
