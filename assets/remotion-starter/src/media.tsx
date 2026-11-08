import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import React, {useMemo} from 'react';
import {Img, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ALPHA_THEME} from './theme';

export const KenBurnsImage: React.FC<{src: string; zoomFrom?: number; zoomTo?: number; panX?: number; style?: React.CSSProperties}> = ({src, zoomFrom = 1, zoomTo = 1.08, panX = -24, style}) => {
  const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {easing: ALPHA_THEME.motion.easeInOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(frame, [0, durationInFrames], [0, panX], {easing: ALPHA_THEME.motion.easeInOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`, ...style}} />;
};

export const FootageLayer: React.FC<{src: string; muted?: boolean; style?: React.CSSProperties}> = ({src, muted = false, style}) => <OffthreadVideo src={src} muted={muted} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />;

export const AlphaCaptions: React.FC<{captions: Caption[]; combineWithinMs?: number}> = ({captions, combineWithinMs = 1100}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const now = frame / fps * 1000;
  const pages = useMemo(() => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: combineWithinMs, breakOnSilenceAfterMilliseconds: 650}).pages, [captions, combineWithinMs]);
  const page = pages.find((candidate) => now >= candidate.startMs && now < candidate.startMs + candidate.durationMs);
  if (!page) return null;
  return <div style={{position: 'absolute', left: ALPHA_THEME.safe.x, right: ALPHA_THEME.safe.x, top: '65%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, fontFamily: ALPHA_THEME.type.vietnamese, fontWeight: 700, fontSize: 52, lineHeight: 1.18, textAlign: 'center', textShadow: `0 4px 18px ${ALPHA_THEME.colors.ink}`}}>
    {page.tokens.map((token, index) => {
      const active = now >= token.fromMs && now < token.toMs;
      return <span key={`${token.fromMs}-${index}`} style={{color: active ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.text}}>{token.text.trim()}</span>;
    })}
  </div>;
};
