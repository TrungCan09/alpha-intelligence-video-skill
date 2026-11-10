import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {SceneSpecV3} from './cue-types';
import {cueEnd, cueStart, useCueProgress} from './cue-timeline';
import {ALPHA_THEME} from './theme';
import {BodyText, DataLabel, HeroText} from './typography';

export type CustomSceneProps = {scene: SceneSpecV3; qaMode: 'full' | 'semantic'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ThinkingThreshold: React.FC<CustomSceneProps> = ({scene, qaMode}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const freeze = useCueProgress(scene.beats[0].cueId); const thinking = useCueProgress(scene.beats[1].cueId);
  const start = Math.round(cueStart(scene.startCueId) * fps); const end = Math.round(cueEnd(scene.endCueId) * fps);
  const enter = interpolate(frame, [start, start + 9], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const exit = interpolate(frame, [end - 8, end], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeIn});
  const thresholdWidth = interpolate(freeze, [0, 1], [0, 820], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const markerY = interpolate(thinking, [0, 1], [350, 500], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const camera = qaMode === 'semantic' ? thinking * 0.025 : thinking * 0.045;
  return <div data-v3-scene={scene.id} data-render-mode="custom" style={{position: 'absolute', left: 60, right: 60, top: 350, bottom: 270, opacity: enter * (1 - exit), transform: `scale(${1 + camera}) translateY(${(1 - enter) * 40 - exit * 30}px)`, transformOrigin: '50% 58%'}}>
    <div style={{position: 'absolute', inset: 0, opacity: 0.6 * (1 - thinking * 0.75), transform: `translateY(${-freeze * 40}px) scale(${1 - freeze * 0.06})`, filter: `blur(${freeze * 3}px)`}}>
      <DataLabel tone="cyan">ĐÁP ÁN DỪNG Ở ĐÂY</DataLabel><div style={{height: 42}}/><BodyText size={48}>CÂU TRẢ LỜI ĐÃ CÓ</BodyText>
    </div>
    <div style={{position: 'absolute', left: 70, top: 430, width: thresholdWidth, height: 10, borderRadius: 99, background: `linear-gradient(90deg, ${ALPHA_THEME.colors.cyan}, ${ALPHA_THEME.colors.green})`, boxShadow: `0 0 42px ${ALPHA_THEME.colors.green}55`}}/>
    <div style={{position: 'absolute', top: 360, left: 70, opacity: freeze, transform: `translateY(${(1 - freeze) * 36}px)`}}><DataLabel tone="green">TƯ DUY ĐI TIẾP</DataLabel></div>
    <div style={{position: 'absolute', left: 470, top: markerY, width: 38, height: 38, borderRadius: 99, opacity: freeze, background: ALPHA_THEME.colors.green, boxShadow: `0 0 36px ${ALPHA_THEME.colors.green}`, transform: `translate(-50%, -50%) scale(${0.8 + thinking * 0.2})`}}/>
    <div style={{position: 'absolute', left: 50, right: 30, top: 520, opacity: thinking, transform: `translateY(${(1 - thinking) * 180}px) scale(${0.9 + thinking * 0.1})`}}>
      <BodyText size={42}>HỌC THẬT SỰ BẮT ĐẦU</BodyText><div style={{height: 28}}/><HeroText size={92} gradient="intelligence" focus>KHI BẠN<br/>VẪN SUY NGHĨ</HeroText>
    </div>
  </div>;
};

const CUSTOM_SCENES: Record<string, React.FC<CustomSceneProps>> = {'thinking-threshold': ThinkingThreshold};
export const CustomSceneRegistry: React.FC<CustomSceneProps> = (props) => {
  const Component = props.scene.customComponentId ? CUSTOM_SCENES[props.scene.customComponentId] : undefined;
  if (!Component) throw new Error(`Custom scene chưa đăng ký: ${props.scene.customComponentId ?? '<missing>'}`);
  return <Component {...props}/>;
};
