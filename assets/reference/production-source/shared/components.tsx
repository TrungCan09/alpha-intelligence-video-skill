import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/700.css';
import {alpha, alphaBrand, alphaTheme} from './theme';

export const mix = (
  value: number,
  input: readonly [number, number],
  output: readonly [number, number],
  easing = alphaTheme.ease.out,
) => interpolate(value, input, output, {
  easing,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, size = alphaTheme.type.title, color = alphaTheme.colors.white, style}) => (
  <div style={{
    fontFamily: alphaTheme.fonts.display,
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1.1,
    letterSpacing: -3,
    color,
    ...style,
  }}>{children}</div>
);

export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, size = alphaTheme.type.support, color = alphaTheme.colors.muted, style}) => (
  <div style={{
    fontFamily: alphaTheme.fonts.body,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1.34,
    color,
    ...style,
  }}>{children}</div>
);

export const GradientWord: React.FC<{
  children: React.ReactNode;
  tone?: 'green' | 'blue';
  size?: number;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}> = ({children, tone = 'green', size = 108, style, textStyle}) => {
  const end = tone === 'green' ? alphaTheme.colors.green : alphaTheme.colors.blue;
  const gradient = `linear-gradient(180deg, ${alphaTheme.colors.white} 0%, ${alphaTheme.colors.white} 44%, ${end} 100%)`;
  const type: React.CSSProperties = {
    fontFamily: alphaTheme.fonts.display,
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1.16,
    letterSpacing: -6,
    padding: '0.08em 0.04em 0.13em',
    margin: '-0.08em -0.04em -0.13em',
    ...textStyle,
  };
  return <div style={{position: 'relative', ...style}}>
    <div aria-hidden style={{
      ...type,
      position: 'absolute',
      inset: 0,
      backgroundImage: gradient,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      filter: 'blur(14px)',
      opacity: 0.34,
    }}>{children}</div>
    <div style={{
      ...type,
      position: 'relative',
      backgroundImage: gradient,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      filter: `drop-shadow(0 8px 14px ${alpha(alphaTheme.colors.shadow, 0.42)})`,
    }}>{children}</div>
  </div>;
};

export const Glass: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => <div style={{
  background: `linear-gradient(135deg, ${alpha(alphaTheme.colors.white, 0.08)}, ${alpha(alphaTheme.colors.cyan, 0.025)})`,
  border: `1.5px solid ${alpha(alphaTheme.colors.steel, 0.36)}`,
  borderRadius: 26,
  boxShadow: `0 22px 58px ${alpha(alphaTheme.colors.shadow, 0.52)}, inset 0 1px ${alpha(alphaTheme.colors.white, 0.1)}`,
  ...style,
}}>{children}</div>;

export const Enter: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, distance = 38, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: frame - delay, fps, config: alphaTheme.spring.smooth});
  return <div style={{
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px) scale(${0.95 + progress * 0.05})`,
    ...style,
  }}>{children}</div>;
};

export const SceneShell: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  label: string;
}> = ({children, durationInFrames}) => {
  const frame = useCurrentFrame();
  const exit = mix(frame, [Math.max(0, durationInFrames - 10), Math.max(1, durationInFrames - 1)], [0, 1], alphaTheme.ease.in);
  return <AbsoluteFill style={{
    opacity: 1 - exit,
    transform: `translateY(${-28 * exit}px) scale(${1 - exit * 0.012})`,
  }}>
    <BrandHeader/>
    {children}
  </AbsoluteFill>;
};

export const BrandHeader: React.FC = () => (
  <div style={{
    position: 'absolute',
    left: alphaTheme.safe.x + 4,
    right: alphaTheme.safe.x + 4,
    top: alphaTheme.safe.top + 4,
    zIndex: 20,
  }}>
    <Display size={alphaTheme.type.label} style={{letterSpacing: 2.2}}>
      CỘNG ĐỒNG <span style={{color: alphaTheme.colors.cyan}}>{alphaBrand.community}</span>
    </Display>
    <Body size={alphaTheme.type.label} style={{marginTop: 12, letterSpacing: 0.6}}>{alphaBrand.tagline}</Body>
  </div>
);

export const BackgroundMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 55) * 42;
  const driftY = Math.cos(frame / 70) * 34;
  return <AbsoluteFill style={{overflow: 'hidden', background: alphaTheme.colors.ink}}>
    <AbsoluteFill style={{
      background: `linear-gradient(145deg, ${alphaTheme.colors.ink}, ${alphaTheme.colors.navy})`,
    }}/>
    <div style={{
      position: 'absolute',
      width: 1120,
      height: 1120,
      borderRadius: '50%',
      top: -430,
      left: -260 + driftX,
      filter: 'blur(62px)',
      background: `radial-gradient(circle, ${alpha(alphaTheme.colors.cyan, 0.24)}, transparent 64%)`,
    }}/>
    <div style={{
      position: 'absolute',
      width: 980,
      height: 980,
      borderRadius: '50%',
      bottom: -390,
      right: -260 - driftY,
      filter: 'blur(74px)',
      background: `radial-gradient(circle, ${alpha(alphaTheme.colors.green, 0.2)}, transparent 66%)`,
    }}/>
    <div style={{
      position: 'absolute',
      inset: -300,
      opacity: 0.14,
      backgroundImage: `linear-gradient(${alpha(alphaTheme.colors.steel, 0.14)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(alphaTheme.colors.steel, 0.14)} 1px, transparent 1px)`,
      backgroundSize: '72px 72px',
      transform: `perspective(760px) rotateX(60deg) translateY(${730 + (frame % 160) * 0.42}px)`,
    }}/>
    {Array.from({length: 32}, (_, index) => <i key={index} style={{
      position: 'absolute',
      left: `${(index * 83 + 11) % 100}%`,
      top: `${(index * 47 + 9) % 100}%`,
      width: index % 7 === 0 ? 6 : 3,
      height: index % 7 === 0 ? 6 : 3,
      borderRadius: 20,
      background: index % 3 ? alphaTheme.colors.cyan : alphaTheme.colors.green,
      opacity: 0.1 + (Math.sin(frame / 14 + index) + 1) * 0.07,
      boxShadow: `0 0 12px ${index % 3 ? alphaTheme.colors.cyan : alphaTheme.colors.green}`,
      transform: `translate(${Math.sin(frame / 24 + index) * 8}px, ${Math.cos(frame / 29 + index) * 10}px)`,
    }}/>) }
  </AbsoluteFill>;
};

export const Grade: React.FC = () => <AbsoluteFill style={{pointerEvents: 'none', zIndex: 70}}>
  <AbsoluteFill style={{backgroundColor: alphaTheme.colors.blue, mixBlendMode: 'soft-light', opacity: 0.12}}/>
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${alpha(alphaTheme.colors.shadow, 0.08)}, transparent 28%, transparent 72%, ${alpha(alphaTheme.colors.shadow, 0.22)})`}}/>
</AbsoluteFill>;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{
    pointerEvents: 'none',
    zIndex: 80,
    backgroundImage: noise,
    backgroundSize: '220px',
    backgroundPosition: `${(frame * 5) % 220}px ${(frame * 9) % 220}px`,
    opacity: 0.028,
    mixBlendMode: 'overlay',
  }}/>;
};

export const Vignette: React.FC = () => <AbsoluteFill style={{
  pointerEvents: 'none',
  zIndex: 90,
  background: `radial-gradient(ellipse at center, transparent 58%, ${alpha(alphaTheme.colors.shadow, 0.28)} 100%)`,
}}/>;

export const SafeStage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{
    position: 'absolute',
    left: alphaTheme.safe.x,
    right: alphaTheme.safe.x,
    top: 300,
    bottom: alphaTheme.safe.bottom,
    ...style,
  }}>{children}</div>
);
