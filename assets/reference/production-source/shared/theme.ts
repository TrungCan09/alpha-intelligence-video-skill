import {Easing} from 'remotion';

export const alphaBrand = {
  community: 'ALPHA INTELLIGENCE',
  tagline: 'Học sinh làm chủ AI và Vibecode',
} as const;

export const alphaTheme = {
  colors: {
    ink: '#050D1D',
    navy: '#081938',
    surface: '#0D1B37',
    surfaceAlt: '#102748',
    green: '#20F669',
    cyan: '#00FCFE',
    blue: '#263BE1',
    steel: '#4FA8D5',
    white: '#F9F9F9',
    muted: '#D7E3F4',
    shadow: '#000000',
  },
  fonts: {
    display: 'Montserrat',
    body: 'Be Vietnam Pro',
  },
  safe: {
    top: 150,
    bottom: 270,
    x: 60,
  },
  type: {
    hero: 96,
    title: 80,
    support: 48,
    label: 32,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    weighty: {damping: 15, stiffness: 75, mass: 1.25},
  },
} as const;

export const alpha = (hex: string, opacity: number) => {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
