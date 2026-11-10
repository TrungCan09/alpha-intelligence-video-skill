import React from 'react';
import type {SceneSpec} from './cue-types';
import {AccumulatingChecklistScene, CauseEffectScene, FocusTransferScene, FreezeQuestionScene, NextLessonOutroScene, ProblemResolveScene, ProgressiveProcessScene, PromptResponseScene, VerificationMismatchScene} from './scene-recipes';

export const SceneRegistry: React.FC<{scene: SceneSpec; qaMode?: 'full' | 'semantic'}> = ({scene, qaMode = 'full'}) => {
  const props = {scene, qaMode};
  switch (scene.recipe) {
    case 'problem-resolve': return <ProblemResolveScene {...props}/>;
    case 'prompt-response': return <PromptResponseScene {...props}/>;
    case 'focus-transfer-ab': return <FocusTransferScene {...props}/>;
    case 'progressive-process': return <ProgressiveProcessScene {...props}/>;
    case 'cause-effect': return <CauseEffectScene {...props}/>;
    case 'accumulating-checklist': return <AccumulatingChecklistScene {...props}/>;
    case 'verification-mismatch': return <VerificationMismatchScene {...props}/>;
    case 'freeze-question': return <FreezeQuestionScene {...props}/>;
    case 'next-lesson-outro': return <NextLessonOutroScene {...props}/>;
  }
};
