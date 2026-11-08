import {Easing} from 'remotion';
import brandConfig from './brand.config.json';

export const ALPHA_THEME = {
  colors: brandConfig.colors,
  type: {
    hero: `${brandConfig.fonts.hero}, ${brandConfig.fonts.vietnamese}, ${brandConfig.fonts.fallback}`,
    vietnamese: `${brandConfig.fonts.vietnamese}, ${brandConfig.fonts.fallback}`,
    heroWeight: brandConfig.fonts.heroWeight,
    bodyWeight: brandConfig.fonts.bodyWeight,
    heroMin: brandConfig.sizes.heroMin,
    bodyMin: brandConfig.sizes.bodyMin,
    labelMin: brandConfig.sizes.labelMin,
  },
  safe: brandConfig.safe,
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

export const BRAND = brandConfig.brand;
export const BRAND_CONFIG = brandConfig;
