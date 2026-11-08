import React from 'react';
import type {CSSProperties, PropsWithChildren} from 'react';
import {ALPHA_THEME} from './theme';

export type HeroFace = 'brand-wide' | 'montserrat';
export type HeroGradient = 'alpha' | 'intelligence' | 'solid';
type LegacyFontMode = 'auto' | 'montserrat' | 'vietnamese';
type LegacyVariant = 'white-green' | 'white-blue' | 'solid';

const resolveFace = (face?: HeroFace, fontMode?: LegacyFontMode): HeroFace => {
  if (face) return face;
  if (fontMode === 'montserrat' || fontMode === 'auto' || fontMode === 'vietnamese') return 'montserrat';
  return 'montserrat';
};

const resolveGradient = (gradient?: HeroGradient, variant?: LegacyVariant): HeroGradient => {
  if (gradient) return gradient;
  if (variant === 'white-blue') return 'alpha';
  if (variant === 'solid') return 'solid';
  return 'intelligence';
};

const gradientCss = (role: Exclude<HeroGradient, 'solid'>) => {
  const token = ALPHA_THEME.gradients[role];
  const from = token.from as keyof typeof ALPHA_THEME.colors;
  const to = token.to as keyof typeof ALPHA_THEME.colors;
  return `linear-gradient(${token.angle}deg, ${ALPHA_THEME.colors[from]} 0%, ${ALPHA_THEME.colors[to]} 100%)`;
};

export const HeroText: React.FC<PropsWithChildren<{
  size?: number;
  face?: HeroFace;
  gradient?: HeroGradient;
  focus?: boolean;
  style?: CSSProperties;
  /** @deprecated Dùng face. Giữ lại trong v1.4 để composition cũ không vỡ. */
  fontMode?: LegacyFontMode;
  /** @deprecated Dùng gradient. Giữ lại trong v1.4 để composition cũ không vỡ. */
  variant?: LegacyVariant;
}>> = ({children, size = ALPHA_THEME.type.heroMin, face, gradient, focus = false, style, fontMode, variant}) => {
  const resolvedFace = resolveFace(face, fontMode);
  const resolvedGradient = resolveGradient(gradient, variant);
  const accent = resolvedGradient === 'alpha' ? ALPHA_THEME.colors.blueLavender : ALPHA_THEME.colors.green;
  const backgroundImage = resolvedGradient === 'solid' ? undefined : gradientCss(resolvedGradient);
  return <div style={{
    fontFamily: resolvedFace === 'brand-wide' ? ALPHA_THEME.type.brandWide : ALPHA_THEME.type.support,
    fontWeight: resolvedFace === 'brand-wide' ? ALPHA_THEME.type.brandWeight : ALPHA_THEME.type.heroWeight,
    fontSize: Math.max(size, ALPHA_THEME.type.heroMin),
    lineHeight: resolvedFace === 'brand-wide' ? 0.98 : 1.08,
    letterSpacing: '-0.02em',
    textWrap: 'balance',
    color: ALPHA_THEME.colors.text,
    backgroundImage,
    backgroundClip: backgroundImage ? 'text' : undefined,
    WebkitBackgroundClip: backgroundImage ? 'text' : undefined,
    WebkitTextFillColor: backgroundImage ? 'transparent' : undefined,
    filter: focus && resolvedGradient !== 'solid' ? `drop-shadow(0 0 22px ${accent}38)` : undefined,
    ...style,
  }}>{children}</div>;
};

export const BrandWordmark: React.FC<{
  size?: number;
  layout?: 'stacked' | 'inline';
  focus?: 'alpha' | 'intelligence' | 'none';
  style?: CSSProperties;
}> = ({size = 109, layout = 'stacked', focus = 'none', style}) => <div style={{
  display: 'flex',
  flexDirection: layout === 'stacked' ? 'column' : 'row',
  alignItems: layout === 'stacked' ? 'flex-start' : 'baseline',
  gap: layout === 'stacked' ? 0 : Math.round(size * 0.18),
  ...style,
}}>
  <HeroText size={size} face="brand-wide" gradient="alpha" focus={focus === 'alpha'}>Alpha</HeroText>
  <HeroText size={size} face="brand-wide" gradient="intelligence" focus={focus === 'intelligence'}>Intelligence</HeroText>
</div>;

export const BodyText: React.FC<PropsWithChildren<{size?: number; muted?: boolean; style?: CSSProperties}>> = ({children, size = ALPHA_THEME.type.bodyMin, muted = false, style}) => <div style={{
  fontFamily: ALPHA_THEME.type.support,
  fontWeight: ALPHA_THEME.type.bodyWeight,
  fontSize: Math.max(size, ALPHA_THEME.type.bodyMin),
  lineHeight: 1.5,
  letterSpacing: 0,
  textWrap: 'pretty',
  overflowWrap: 'break-word',
  color: muted ? ALPHA_THEME.colors.lightBlue : ALPHA_THEME.colors.text,
  ...style,
}}>{children}</div>;

export const MutedText: React.FC<PropsWithChildren<{size?: number; style?: CSSProperties}>> = ({children, size, style}) => <BodyText size={size} muted style={style}>{children}</BodyText>;

export const DataLabel: React.FC<PropsWithChildren<{tone?: 'lightBlue' | 'cyan' | 'green'; style?: CSSProperties}>> = ({children, tone = 'lightBlue', style}) => <div style={{
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 54,
  padding: '8px 16px',
  border: `2px solid ${ALPHA_THEME.colors[tone]}66`,
  borderRadius: 999,
  background: `${ALPHA_THEME.colors.surface}E8`,
  color: ALPHA_THEME.colors[tone],
  fontFamily: ALPHA_THEME.type.support,
  fontWeight: ALPHA_THEME.type.bodyWeight,
  fontSize: ALPHA_THEME.type.labelMin,
  lineHeight: 1.25,
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
  ...style,
}}>{children}</div>;
