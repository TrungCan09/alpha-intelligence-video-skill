import React from 'react';
import {Composition} from 'remotion';
import {AlphaIntelligenceStarter} from './AlphaIntelligenceStarter';
import {AlphaPrimitivesDemo} from './AlphaPrimitivesDemo';
import {VIDEO} from './theme';
import {TIMELINE} from './timeline';
import {AlphaMotionReference10s} from './AlphaMotionReference10s';
import {REFERENCE_TIMELINE} from './reference-timeline';
import {AlphaVideoV2, V2_CUE_SHEET} from './AlphaVideoV2';

export const Root: React.FC = () => <>
  <Composition id="AlphaIntelligenceStarter" component={AlphaIntelligenceStarter} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={Math.ceil(TIMELINE.durationSeconds * VIDEO.fps)} />
  <Composition id="AlphaPrimitivesDemo" component={AlphaPrimitivesDemo} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={120} />
  <Composition id="AlphaMotionReference10s" component={AlphaMotionReference10s} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={Math.ceil(REFERENCE_TIMELINE.previewSeconds * VIDEO.fps)} defaultProps={{voiceSrc: undefined}} />
  <Composition id="AlphaMotionReference20s" component={AlphaMotionReference10s} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={Math.ceil(REFERENCE_TIMELINE.durationSeconds * VIDEO.fps)} defaultProps={{voiceSrc: undefined}} />
  <Composition id="AlphaVideoV2" component={AlphaVideoV2} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={Math.ceil(V2_CUE_SHEET.durationSeconds * VIDEO.fps)} defaultProps={{voiceSrc: undefined, qaMode: 'full'}} />
  <Composition id="AlphaVideoV2Semantic" component={AlphaVideoV2} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={Math.ceil(V2_CUE_SHEET.durationSeconds * VIDEO.fps)} defaultProps={{voiceSrc: undefined, qaMode: 'semantic'}} />
</>;
