import React from 'react';
import {Composition} from 'remotion';
import {AlphaIntelligenceStarter} from './AlphaIntelligenceStarter';
import {AlphaPrimitivesDemo} from './AlphaPrimitivesDemo';
import {VIDEO} from './theme';
import {TIMELINE} from './timeline';

export const Root: React.FC = () => <>
  <Composition id="AlphaIntelligenceStarter" component={AlphaIntelligenceStarter} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={Math.ceil(TIMELINE.durationSeconds * VIDEO.fps)} />
  <Composition id="AlphaPrimitivesDemo" component={AlphaPrimitivesDemo} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={120} />
</>;
