import React, {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, cancelRender, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ALPHA_THEME, BRAND} from './theme';
import {frameAt} from './timeline';
import {HeroText} from './typography';
import {loadAlphaFonts} from './fonts';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const FontGate: React.FC<React.PropsWithChildren> = ({children}) => {
  const [handle] = useState(() => delayRender('Đợi font Alpha Intelligence'));
  useEffect(() => {
    loadAlphaFonts()
      .then(() => continueRender(handle))
      .catch((error) => cancelRender(error instanceof Error ? error : new Error(String(error))));
  }, [handle]);
  return <>{children}</>;
};

export const enter = (frame: number, cueSeconds: number, fps: number, duration = 12) =>
  interpolate(frame, [frameAt(cueSeconds, fps), frameAt(cueSeconds, fps) + duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut,
  });

export const BackgroundStack: React.FC<{qaMode?: 'full' | 'semantic'}> = ({qaMode = 'full'}) => {
  const frame = useCurrentFrame();
  const drift = qaMode === 'semantic' ? 0 : Math.sin(frame / 70) * 18;
  return <AbsoluteFill style={{background: ALPHA_THEME.colors.canvas, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(circle at ${25 + drift / 12}% 18%, ${ALPHA_THEME.colors.surface} 0%, transparent 46%), radial-gradient(circle at 86% 78%, ${ALPHA_THEME.colors.blueLavender}44 0%, transparent 42%)`}} />
    <AbsoluteFill style={{opacity: 0.16, backgroundImage: `linear-gradient(${ALPHA_THEME.colors.steel}22 1px, transparent 1px), linear-gradient(90deg, ${ALPHA_THEME.colors.steel}22 1px, transparent 1px)`, backgroundSize: '90px 90px', transform: `perspective(700px) rotateX(62deg) translateY(${580 + drift}px) scale(1.7)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at center, transparent 45%, rgba(0,0,0,.48) 100%)'}} />
  </AbsoluteFill>;
};

export const GradeGrain: React.FC<{qaMode?: 'full' | 'semantic'}> = ({qaMode = 'full'}) => qaMode === 'semantic' ? null : <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.035, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.6\'/%3E%3C/svg%3E")'}} />;

export const SafeStage: React.FC<React.PropsWithChildren> = ({children}) => <AbsoluteFill style={{padding: `${ALPHA_THEME.safe.top}px ${ALPHA_THEME.safe.x}px ${ALPHA_THEME.safe.bottom}px`}}>{children}</AbsoluteFill>;

export const BrandHeader: React.FC = () => <div style={{fontFamily: ALPHA_THEME.type.support, color: ALPHA_THEME.colors.lightBlue, fontSize: 32, fontWeight: 700, lineHeight: 1.22, letterSpacing: 1.1}}>
  <div aria-label={BRAND.header} style={{color: ALPHA_THEME.colors.text}}>{BRAND.communityPrefix} <span style={{color: ALPHA_THEME.colors.lightBlue}}>{BRAND.communityName}</span></div>
  <div style={{fontSize: 32, marginTop: 8, color: ALPHA_THEME.colors.lightBlue}}>{BRAND.tagline}</div>
</div>;

export const BrandFrame: React.FC<React.PropsWithChildren<{assetLayer?: ReactNode; overlay?: ReactNode; qaMode?: 'full' | 'semantic'}>> = ({children, assetLayer, overlay, qaMode = 'full'}) => <FontGate>
  <AbsoluteFill lang="vi" style={{background: ALPHA_THEME.colors.canvas, color: ALPHA_THEME.colors.text, fontFamily: ALPHA_THEME.type.support, overflow: 'hidden', WebkitFontSmoothing: 'antialiased'}}>
    <BackgroundStack qaMode={qaMode} />
    {assetLayer}
    <SafeStage><BrandHeader />{children}</SafeStage>
    {overlay}
    <GradeGrain qaMode={qaMode} />
  </AbsoluteFill>
</FontGate>;

export const GlassCard: React.FC<React.PropsWithChildren<{accent?: 'green' | 'cyan'}>> = ({children, accent = 'cyan'}) => <div style={{background: `${ALPHA_THEME.colors.surface}E8`, border: `2px solid ${ALPHA_THEME.colors[accent]}66`, borderRadius: 28, boxShadow: `0 18px 60px ${ALPHA_THEME.colors[accent]}18`, padding: '32px 36px'}}>{children}</div>;

export const GradientText: React.FC<React.PropsWithChildren<{size?: number; focus?: boolean}>> = ({children, size = 96, focus = false}) => <HeroText size={size} face="montserrat" gradient="intelligence" focus={focus}>{children}</HeroText>;
