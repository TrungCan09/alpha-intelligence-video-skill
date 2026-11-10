import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {LayoutSpec, MotionElement, MotionOperation, SceneSpecV3} from './cue-types';
import {cueEnd, cueStart, useCueProgress} from './cue-timeline';
import {ALPHA_THEME} from './theme';
import {BodyText, DataLabel, HeroText} from './typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const tone = (value: MotionElement['tone']) => ({text: ALPHA_THEME.colors.text, muted: ALPHA_THEME.colors.lightBlue, green: ALPHA_THEME.colors.green, cyan: ALPHA_THEME.colors.cyan, blue: ALPHA_THEME.colors.blueLavender}[value ?? 'text']);

const positionFor = (layout: LayoutSpec, index: number, total: number, element: MotionElement) => {
  if (layout.family === 'freeform') return {left: element.x ?? 0, top: element.y ?? 0, width: element.width ?? 420, height: element.height};
  if (layout.family === 'split') return {left: index % 2 ? 520 : 20, top: 240 + Math.floor(index / 2) * 260, width: 420};
  if (layout.family === 'grid') { const columns = layout.columns ?? 2; return {left: 20 + (index % columns) * (880 / columns), top: 220 + Math.floor(index / columns) * 240, width: 820 / columns}; }
  if (layout.family === 'axis-flow') return layout.axis === 'vertical' ? {left: 190, top: 180 + index * 250, width: 580} : {left: 20 + index * (900 / Math.max(1, total)), top: 420, width: Math.max(180, 820 / total)};
  if (layout.family === 'radial') { const angle = (Math.PI * 2 * index) / Math.max(1, total) - Math.PI / 2; const radius = element.role === 'hero' ? 0 : 270; return {left: 390 + Math.cos(angle) * radius, top: 430 + Math.sin(angle) * radius, width: element.role === 'hero' ? 760 : 180}; }
  if (layout.family === 'stack') return {left: 100 + index * 42, top: 250 + index * 56, width: 720};
  return {left: 70, top: 260 + index * 190, width: 820};
};

const ElementView: React.FC<{element: MotionElement}> = ({element}) => {
  const color = tone(element.tone);
  if (element.kind === 'text') return element.role === 'hero' ? <HeroText size={element.text?.length && element.text.length > 18 ? 86 : 112} gradient={element.tone === 'green' ? 'intelligence' : 'alpha'} focus>{element.text?.split('\n').map((line, index) => <React.Fragment key={line}>{index ? <br/> : null}{line}</React.Fragment>)}</HeroText> : <BodyText size={44}>{element.text}</BodyText>;
  if (element.kind === 'card') return <div style={{minHeight: element.role === 'hero' ? 230 : 132, padding: element.role === 'hero' ? '34px 38px' : '24px 28px', display: 'grid', alignContent: 'center', justifyItems: 'start', borderRadius: element.role === 'hero' ? 34 : 26, border: `2px solid ${color}${element.role === 'hero' ? 'AA' : '66'}`, background: `linear-gradient(145deg, ${ALPHA_THEME.colors.surface}F2, ${ALPHA_THEME.colors.navy}E8)`, boxShadow: element.role === 'hero' ? `0 28px 90px ${color}28, inset 0 1px 0 ${ALPHA_THEME.colors.text}12` : `0 18px 48px ${color}18`}}>{element.role === 'hero' ? <HeroText size={76} gradient={element.tone === 'green' ? 'intelligence' : 'alpha'}>{element.text}</HeroText> : <BodyText size={36} style={{color, lineHeight: 1.18}}>{element.text}</BodyText>}</div>;
  if (element.kind === 'shape' || element.kind === 'mask') return <div style={{height: element.height ?? 12, width: element.width ?? '100%', borderRadius: 999, background: color, boxShadow: `0 0 32px ${color}55`}}/>;
  if (element.kind === 'token-field') return <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>{String(element.text ?? 'AI TOKEN').split(/\s+/).map((token) => <DataLabel key={token} tone="cyan">{token}</DataLabel>)}</div>;
  if (element.kind === 'connector') return <svg viewBox="0 0 300 80" style={{width: '100%', overflow: 'visible'}}><line x1="12" y1="40" x2="250" y2="40" stroke={color} strokeWidth="9" strokeLinecap="round"/><path d="M232 18 L274 40 L232 62" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (element.kind === 'media') return <div style={{height: 180, border: `2px solid ${color}66`, borderRadius: 26, display: 'grid', placeItems: 'center'}}><DataLabel tone="cyan">MEDIA</DataLabel></div>;
  return <div style={{width: 90, height: 90, borderRadius: 28, background: color}}/>;
};

const OperationLayer: React.FC<{scene: SceneSpecV3; operation: MotionOperation}> = ({scene, operation}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const cueProgress = useCueProgress(operation.cueId);
  const springProgress = spring({frame: frame - Math.round(cueStart(operation.cueId) * fps), fps, config: ALPHA_THEME.motion.spring.smooth});
  const progress = ['assemble', 'merge', 'morph', 'focus'].includes(operation.operator) ? springProgress : cueProgress;
  const targets = scene.motionGraph!.elements.filter((element) => operation.targetIds.includes(element.id));
  return <>{targets.map((element) => {
    const index = scene.motionGraph!.elements.findIndex((candidate) => candidate.id === element.id);
    const position = positionFor(scene.layout, index, scene.motionGraph!.elements.length, element);
    const direction = operation.direction ?? 'up';
    const dx = direction === 'left' ? 120 : direction === 'right' ? -120 : operation.operator === 'assemble' ? (index - targets.length / 2) * 150 : 0;
    const dy = direction === 'down' ? -100 : direction === 'up' ? 100 : operation.operator === 'assemble' ? 180 : 0;
    const scale = operation.operator === 'morph' ? 0.72 + progress * 0.28 : 0.9 + progress * 0.1;
    const scanClip = operation.operator === 'scan' ? `inset(0 ${100 - progress * 100}% 0 0)` : undefined;
    const verify = operation.operator === 'verify' ? interpolate(progress, [0, 1], [0.55, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut}) : 1;
    return <div key={`${operation.id}-${element.id}`} data-operator={operation.operator} style={{position: 'absolute', ...position, opacity: progress * verify, clipPath: scanClip, transform: `translate(${dx * (1 - progress)}px, ${dy * (1 - progress)}px) scale(${scale}) rotate(${operation.operator === 'assemble' ? (index - 1) * (1 - progress) * 8 : 0}deg)`, transformOrigin: '50% 50%'}}><ElementView element={element}/></div>;
  })}</>;
};

const CameraStage: React.FC<React.PropsWithChildren<{scene: SceneSpecV3}>> = ({scene, children}) => {
  const operation = scene.motionGraph?.operations.find((item) => item.operator === 'camera');
  const progress = useCueProgress(operation?.cueId ?? scene.startCueId);
  const amount = operation?.amount ?? 0;
  const direction = operation?.direction === 'out' ? -1 : 1;
  return <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + progress * amount * direction}) translateX(${scene.motionGraph?.cameraPattern === 'track' ? progress * -24 : 0}px)`, transformOrigin: '50% 48%'}}>{children}</div>;
};

export const MotionGraphRenderer: React.FC<{scene: SceneSpecV3; qaMode?: 'full' | 'semantic'}> = ({scene}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const start = Math.round(cueStart(scene.startCueId) * fps); const end = Math.round(cueEnd(scene.endCueId) * fps);
  const entrance = interpolate(frame, [start, start + 9], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const exit = interpolate(frame, [end - 8, end], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeIn});
  const operations = scene.motionGraph?.operations.filter((operation) => operation.operator !== 'camera') ?? [];
  return <div data-v3-scene={scene.id} data-render-mode="graph" style={{position: 'absolute', left: 60, right: 60, top: 330, bottom: 270, opacity: entrance * (1 - exit), transform: `translateY(${(1 - entrance) * 34 - exit * 26}px)`}}>
    <CameraStage scene={scene}>{operations.map((operation) => <OperationLayer key={operation.id} scene={scene} operation={operation}/>)}</CameraStage>
  </div>;
};
