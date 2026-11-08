import {Trail} from '@remotion/motion-blur';
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ALPHA_THEME} from './theme';
import {frameAt} from './timeline';

export const Entrance: React.FC<React.PropsWithChildren<{startSeconds?: number}>> = ({children, startSeconds = 0}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = spring({frame: frame - frameAt(startSeconds, fps), fps, config: ALPHA_THEME.motion.spring.smooth});
  return <div style={{opacity: progress, transform: `translateY(${interpolate(progress, [0, 1], [44, 0])}px) scale(${interpolate(progress, [0, 1], [0.94, 1])})`}}>{children}</div>;
};

export const SceneExit: React.FC<React.PropsWithChildren<{endSeconds: number; durationFrames?: number}>> = ({children, endSeconds, durationFrames = 10}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const end = frameAt(endSeconds, fps);
  const progress = interpolate(frame, [end - durationFrames, end], [0, 1], {easing: ALPHA_THEME.motion.easeIn, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{opacity: 1 - progress, transform: `translateY(${-36 * progress}px) scale(${1 - progress * 0.025})`}}>{children}</div>;
};

export const MechanismWordReveal: React.FC<{text: string; startSeconds: number; framesPerWord?: number; style?: React.CSSProperties}> = ({text, startSeconds, framesPerWord = 3, style}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const start = frameAt(startSeconds, fps);
  return <div style={{display: 'flex', flexWrap: 'wrap', gap: 18, ...style}}>{text.split(/\s+/).map((word, index) => {
    const progress = spring({frame: frame - start - index * framesPerWord, fps, config: ALPHA_THEME.motion.spring.snappy});
    return <span key={`${word}-${index}`} style={{display: 'inline-block', opacity: progress, transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px)`}}>{word}</span>;
  })}</div>;
};

export const CountUp: React.FC<{target: number; startSeconds: number; decimals?: number; suffix?: string}> = ({target, startSeconds, decimals = 0, suffix = ''}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = spring({frame: frame - frameAt(startSeconds, fps), fps, config: ALPHA_THEME.motion.spring.smooth});
  const value = interpolate(progress, [0, 1], [0, target]);
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{value.toFixed(decimals)}{suffix}</span>;
};

export const RadialSpark: React.FC<{size?: number; startSeconds?: number; color?: 'green' | 'cyan'}> = ({size = 180, startSeconds = 0, color = 'green'}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const start = frameAt(startSeconds, fps);
  const accent = ALPHA_THEME.colors[color];
  return <div style={{position: 'relative', width: size, height: size, filter: `drop-shadow(0 0 ${size * 0.18}px ${accent}55)`}}>
    {Array.from({length: 10}, (_, index) => {
      const progress = spring({frame: frame - start - index, fps, config: ALPHA_THEME.motion.spring.snappy});
      return <div key={index} style={{position: 'absolute', left: '50%', top: '50%', width: size * 0.065, height: size * 0.34 * progress, borderRadius: size, background: accent, transformOrigin: '50% 0', transform: `translateX(-50%) rotate(${index * 36}deg) translateY(${size * 0.09}px)`}} />;
    })}
  </div>;
};

export const ParallaxLayer: React.FC<React.PropsWithChildren<{factor: number; travel?: number; durationSeconds?: number}>> = ({children, factor, travel = -100, durationSeconds = 3}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const offset = interpolate(frame, [0, frameAt(durationSeconds, fps)], [0, travel * factor], {easing: ALPHA_THEME.motion.easeInOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{transform: `translateX(${offset}px)`}}>{children}</div>;
};

export const MotionTrail: React.FC<React.PropsWithChildren<{layers?: number; lagInFrames?: number}>> = ({children, layers = 4, lagInFrames = 0.4}) => <Trail layers={layers} lagInFrames={lagInFrames} trailOpacity={0.16}>{children}</Trail>;

export const MaskWipe: React.FC<{startSeconds: number; durationFrames?: number}> = ({startSeconds, durationFrames = 12}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const start = frameAt(startSeconds, fps);
  const progress = interpolate(frame, [start, start + durationFrames], [0, 1], {easing: ALPHA_THEME.motion.easeInOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: ALPHA_THEME.colors.green, clipPath: `polygon(0 0, ${progress * 130}% 0, ${Math.max(0, progress * 130 - 30)}% 100%, 0 100%)`, opacity: progress === 0 || progress === 1 ? 0 : 0.9}} />;
};
