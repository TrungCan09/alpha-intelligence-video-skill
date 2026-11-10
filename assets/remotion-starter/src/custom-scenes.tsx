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
  const markerY = interpolate(thinking, [0, 1], [500, 690], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const camera = qaMode === 'semantic' ? thinking * 0.015 : thinking * 0.03;
  return <div data-v3-scene={scene.id} data-render-mode="custom" style={{position: 'absolute', left: 60, right: 60, top: 330, bottom: 270, opacity: enter * (1 - exit), transform: `scale(${1 + camera}) translateY(${(1 - enter) * 34 - exit * 26}px)`, transformOrigin: '50% 56%'}}>
    <div style={{position: 'absolute', left: 40, right: 40, top: 120, minHeight: 250, padding: '34px 38px', borderRadius: 34, border: `2px solid ${ALPHA_THEME.colors.cyan}66`, background: `linear-gradient(145deg, ${ALPHA_THEME.colors.surface}F2, ${ALPHA_THEME.colors.navy}E8)`, boxShadow: `0 24px 80px ${ALPHA_THEME.colors.cyan}18`, opacity: 1 - thinking * 0.55, transform: `translateY(${-freeze * 24}px) scale(${1 - freeze * 0.025})`}}>
      <DataLabel tone="cyan">ĐÁP ÁN ĐÃ CÓ</DataLabel><div style={{height: 28}}/><BodyText size={44}>AI hoàn thành phần trả lời rất nhanh.</BodyText>
    </div>
    <div style={{position: 'absolute', left: 70, top: 500, width: thresholdWidth, height: 8, borderRadius: 99, background: `linear-gradient(90deg, ${ALPHA_THEME.colors.cyan}, ${ALPHA_THEME.colors.green})`, boxShadow: `0 0 34px ${ALPHA_THEME.colors.green}44`}}/>
    <div style={{position: 'absolute', top: 428, left: 70, opacity: freeze, transform: `translateY(${(1 - freeze) * 24}px)`}}><DataLabel tone="green">NHƯNG BẠN CÓ ĐI TIẾP?</DataLabel></div>
    <div style={{position: 'absolute', left: 470, top: markerY, width: 34, height: 34, borderRadius: 99, opacity: freeze, background: ALPHA_THEME.colors.green, boxShadow: `0 0 32px ${ALPHA_THEME.colors.green}`, transform: `translate(-50%, -50%) scale(${0.82 + thinking * 0.18})`}}/>
    <div style={{position: 'absolute', left: 40, right: 30, top: 650, opacity: thinking, transform: `translateY(${(1 - thinking) * 110}px) scale(${0.94 + thinking * 0.06})`}}>
      <BodyText size={40} muted>HỌC THẬT SỰ BẮT ĐẦU</BodyText><div style={{height: 20}}/><HeroText size={84} gradient="intelligence" focus>KHI BẠN<br/>VẪN SUY NGHĨ</HeroText>
    </div>
  </div>;
};

const CUSTOM_SCENES: Record<string, React.FC<CustomSceneProps>> = {'thinking-threshold': ThinkingThreshold};
export const CustomSceneRegistry: React.FC<CustomSceneProps> = (props) => {
  const Component = props.scene.customComponentId ? CUSTOM_SCENES[props.scene.customComponentId] : undefined;
  if (!Component) throw new Error(`Custom scene chưa đăng ký: ${props.scene.customComponentId ?? '<missing>'}`);
  return <Component {...props}/>;
};
