import React from 'react';
import type {CSSProperties, PropsWithChildren} from 'react';
import {ALPHA_THEME} from './theme';

type FontMode = 'auto' | 'montserrat' | 'vietnamese';
type HeroVariant = 'white-green' | 'white-blue' | 'solid';

const vietnamesePattern = /[À-ỹĐđ]/u;
const textFromChildren = (children: React.ReactNode) => React.Children.toArray(children).join('');
const usesVietnameseFace = (children: React.ReactNode, mode: FontMode) => mode === 'vietnamese' || (mode === 'auto' && vietnamesePattern.test(textFromChildren(children)));

export const HeroText: React.FC<PropsWithChildren<{
  size?: number;
  variant?: HeroVariant;
  fontMode?: FontMode;
  focus?: boolean;
  style?: CSSProperties;
}>> = ({children, size = ALPHA_THEME.type.heroMin, variant = 'white-green', fontMode = 'auto', focus = false, style}) => {
  const accent = variant === 'white-blue' ? ALPHA_THEME.colors.blue : ALPHA_THEME.colors.green;
  const gradient = variant === 'solid' ? undefined : `linear-gradient(180deg, ${ALPHA_THEME.colors.text} 28%, ${accent} 122%)`;
  const vietnameseFace = usesVietnameseFace(children, fontMode);
  return <div style={{
    fontFamily: vietnameseFace ? ALPHA_THEME.type.vietnamese : ALPHA_THEME.type.hero,
    fontWeight: vietnameseFace ? ALPHA_THEME.type.bodyWeight : ALPHA_THEME.type.heroWeight,
    fontSize: Math.max(size, ALPHA_THEME.type.heroMin),
    lineHeight: 1.1,
    letterSpacing: '-0.018em',
    textWrap: 'balance',
    color: ALPHA_THEME.colors.text,
    backgroundImage: gradient,
    backgroundClip: gradient ? 'text' : undefined,
    WebkitBackgroundClip: gradient ? 'text' : undefined,
    WebkitTextFillColor: gradient ? 'transparent' : undefined,
    filter: focus ? `drop-shadow(0 0 22px ${accent}38)` : undefined,
    ...style,
  }}>{children}</div>;
};

export const BodyText: React.FC<PropsWithChildren<{size?: number; muted?: boolean; style?: CSSProperties}>> = ({children, size = ALPHA_THEME.type.bodyMin, muted = false, style}) => <div style={{
  fontFamily: ALPHA_THEME.type.vietnamese,
  fontWeight: ALPHA_THEME.type.bodyWeight,
  fontSize: Math.max(size, ALPHA_THEME.type.bodyMin),
  lineHeight: 1.5,
  letterSpacing: 0,
  textWrap: 'pretty',
  overflowWrap: 'break-word',
  color: muted ? ALPHA_THEME.colors.muted : ALPHA_THEME.colors.text,
  ...style,
}}>{children}</div>;

export const MutedText: React.FC<PropsWithChildren<{size?: number; style?: CSSProperties}>> = ({children, size, style}) => <BodyText size={size} muted style={style}>{children}</BodyText>;

export const DataLabel: React.FC<PropsWithChildren<{tone?: 'steel' | 'cyan' | 'green'; style?: CSSProperties}>> = ({children, tone = 'steel', style}) => <div style={{
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 54,
  padding: '8px 16px',
  border: `2px solid ${ALPHA_THEME.colors[tone]}66`,
  borderRadius: 999,
  background: `${ALPHA_THEME.colors.navy}E8`,
  color: ALPHA_THEME.colors[tone],
  fontFamily: ALPHA_THEME.type.vietnamese,
  fontWeight: ALPHA_THEME.type.bodyWeight,
  fontSize: ALPHA_THEME.type.labelMin,
  lineHeight: 1.25,
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
  ...style,
}}>{children}</div>;
