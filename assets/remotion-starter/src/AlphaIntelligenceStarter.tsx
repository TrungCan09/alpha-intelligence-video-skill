import React from 'react';
import {Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {ALPHA_THEME} from './theme';
import {TIMELINE, frameAt} from './timeline';
import {BrandFrame, GlassCard, enter} from './primitives';
import {DataLabel, HeroText} from './typography';

const Hook: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = enter(frame, TIMELINE.cues.result, fps);
  return <div style={{marginTop: 340, opacity: p, transform: `translateY(${(1-p)*54}px) scale(${0.94+p*0.06})`}}>
    <HeroText face="brand-wide" gradient="intelligence" focus>KẾT QUẢ<br/>KHÔNG PHẢI<br/>NĂNG LỰC.</HeroText>
  </div>;
};

const Mechanism: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const sceneStart = TIMELINE.scenes.mechanism.start;
  const source = enter(frame, TIMELINE.cues.source - sceneStart, fps);
  const line = enter(frame, TIMELINE.cues.connector - sceneStart, fps, 9);
  const target = enter(frame, TIMELINE.cues.target - sceneStart, fps);
  return <div style={{marginTop: 310}}>
    <HeroText size={84} face="montserrat" gradient="intelligence">MOTION PHẢI<br/>GIẢI THÍCH Ý.</HeroText>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 110px 1fr', alignItems: 'center', marginTop: 150}}>
      <div style={{opacity: source, transform: `translateX(${(1-source)*-36}px)`}}><GlassCard accent="cyan"><DataLabel tone="cyan">NGUỒN</DataLabel></GlassCard></div>
      <svg width="110" height="70" viewBox="0 0 110 70" style={{overflow: 'visible', opacity: line}}><path d="M4 35 H88" stroke={ALPHA_THEME.colors.cyan} strokeWidth="5" strokeDasharray="84" strokeDashoffset={84*(1-line)} /><path d="M82 20 L104 35 L82 50" fill="none" stroke={ALPHA_THEME.colors.cyan} strokeWidth="5" /></svg>
      <div style={{opacity: target, transform: `translateX(${(1-target)*36}px)`}}><GlassCard accent="green"><DataLabel tone="green">KẾT QUẢ</DataLabel></GlassCard></div>
    </div>
  </div>;
};

export const AlphaIntelligenceStarter: React.FC = () => {
  const {fps} = useVideoConfig();
  return <BrandFrame>
      <Sequence layout="none" durationInFrames={frameAt(TIMELINE.scenes.hook.end, fps)}><Hook /></Sequence>
      <Sequence layout="none" from={frameAt(TIMELINE.scenes.mechanism.start, fps)} durationInFrames={frameAt(TIMELINE.scenes.mechanism.end-TIMELINE.scenes.mechanism.start, fps)}><Mechanism /></Sequence>
  </BrandFrame>;
};
