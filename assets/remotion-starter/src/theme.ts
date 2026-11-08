import {Easing} from 'remotion';

export const ALPHA_THEME = {
  colors: {
    ink: '#050D1D',
    navy: '#081938',
    green: '#20F669',
    cyan: '#00FCFE',
    blue: '#263BE1',
    steel: '#4FA8D5',
    text: '#F9F9F9',
    muted: '#D7E3F4',
  },
  type: {
    hero: 'Montserrat, Be Vietnam Pro, sans-serif',
    vietnamese: 'Be Vietnam Pro, sans-serif',
    heroWeight: 800,
    bodyWeight: 700,
    heroMin: 80,
    bodyMin: 48,
    labelMin: 32,
  },
  safe: {x: 60, top: 150, bottom: 270},
  timing: {readableAfterCueSeconds: 0.2},
  motion: {
    easeOut: Easing.bezier(0.16, 1, 0.3, 1),
    easeInOut: Easing.bezier(0.83, 0, 0.17, 1),
    easeIn: Easing.bezier(0.7, 0, 0.84, 0),
    spring: {
      snappy: {damping: 14, stiffness: 160, mass: 0.6},
      smooth: {damping: 20, stiffness: 90, mass: 1},
      bouncy: {damping: 11, stiffness: 170, mass: 0.7},
    },
  },
} as const;

export const VIDEO = {width: 1080, height: 1920, fps: 30} as const;

export const BRAND = {
  header: 'CỘNG ĐỒNG ALPHA INTELLIGENCE',
  communityPrefix: 'CỘNG ĐỒNG',
  communityName: 'ALPHA INTELLIGENCE',
  tagline: 'Học sinh làm chủ AI và Vibecode',
} as const;
