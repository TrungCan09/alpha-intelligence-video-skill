import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {BrandFrame} from './primitives';
import {ALPHA_THEME} from './theme';
import {AlphaCaptions, KenBurnsImage} from './media';
import {CountUp, Entrance, MotionTrail, ParallaxLayer, RadialSpark} from './motion';
import {HeroText} from './typography';

const captions: Caption[] = [
  {text: ' Motion', startMs: 400, endMs: 900, timestampMs: 400, confidence: 1},
  {text: ' giải thích', startMs: 900, endMs: 1550, timestampMs: 900, confidence: 1},
  {text: ' ý tưởng', startMs: 1550, endMs: 2250, timestampMs: 1550, confidence: 1},
];
const image = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${ALPHA_THEME.colors.navy}"/><stop offset="1" stop-color="${ALPHA_THEME.colors.blue}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#g)"/><circle cx="780" cy="560" r="300" fill="${ALPHA_THEME.colors.green}" opacity=".12"/></svg>`)}`;

const MovingOrb: React.FC = () => {
  const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  const x = frame / durationInFrames * 720;
  return <div style={{width: 34, height: 34, borderRadius: 99, background: ALPHA_THEME.colors.cyan, transform: `translateX(${x}px)`}} />;
};

export const AlphaPrimitivesDemo: React.FC = () => {
  return <BrandFrame assetLayer={<div style={{position: 'absolute', inset: 0, opacity: 0.28}}><KenBurnsImage src={image} /></div>} overlay={<AlphaCaptions captions={captions} />}>
      <div style={{marginTop: 280}}>
        <Entrance startSeconds={0.1}><HeroText size={82}>BỘ PATTERN<br/>TỰ CHỨA.</HeroText></Entrance>
        <div style={{display: 'flex', alignItems: 'center', gap: 50, marginTop: 110}}>
          <ParallaxLayer factor={0.35}><RadialSpark size={150} startSeconds={0.45} color="cyan" /></ParallaxLayer>
          <div style={{fontFamily: ALPHA_THEME.type.vietnamese, fontWeight: 700, fontSize: 96, color: ALPHA_THEME.colors.text}}><CountUp target={100} startSeconds={0.5} suffix="%" /></div>
        </div>
      </div>
    <div style={{position: 'absolute', left: 110, top: 1050, width: 760, height: 60, overflow: 'hidden'}}><MotionTrail><MovingOrb /></MotionTrail></div>
  </BrandFrame>;
};
