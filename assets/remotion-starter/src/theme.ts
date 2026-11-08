import {Easing} from 'remotion';
import brandConfig from './brand.config.json';

export const ALPHA_THEME = {
  colors: {
    ...brandConfig.colors,
    // Alias tương thích trong v1.4; code mới dùng canvas/surface/blueLavender/lightBlue.
    ink: brandConfig.colors.canvas,
    navy: brandConfig.colors.surface,
    blue: brandConfig.colors.blueLavender,
    muted: brandConfig.colors.lightBlue,
  },
  type: {
    brandWide: `"${brandConfig.fonts.brandWide}", ${brandConfig.fonts.support}, ${brandConfig.fonts.fallback}`,
    support: `${brandConfig.fonts.support}, ${brandConfig.fonts.fallback}`,
    hero: `${brandConfig.fonts.support}, ${brandConfig.fonts.fallback}`,
    vietnamese: `${brandConfig.fonts.support}, ${brandConfig.fonts.fallback}`,
    brandWeight: brandConfig.fonts.brandWeight,
    heroWeight: brandConfig.fonts.heroWeight,
    bodyWeight: brandConfig.fonts.bodyWeight,
    heroMin: brandConfig.sizes.heroMin,
    bodyMin: brandConfig.sizes.bodyMin,
    labelMin: brandConfig.sizes.labelMin,
  },
  gradients: brandConfig.gradients,
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
