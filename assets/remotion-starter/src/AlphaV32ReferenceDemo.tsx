import React from 'react';
import {Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandFrame} from './primitives';
import {ALPHA_THEME} from './theme';
import {BodyText, DataLabel, HeroText} from './typography';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CUES = {
  prompt: 0,
  response: 1.3,
  comparison: 4.6,
  capability: 6.2,
  verification: 9.5,
  payoff: 12.3,
  end: 15,
} as const;

const cueFrame = (seconds: number, fps: number) => Math.round(seconds * fps);
const ease = (frame: number, seconds: number, fps: number, duration = 14) => interpolate(
  frame,
  [cueFrame(seconds, fps), cueFrame(seconds, fps) + duration],
  [0, 1],
  {...clamp, easing: ALPHA_THEME.motion.easeOut},
);
const leave = (frame: number, seconds: number, fps: number, duration = 10) => interpolate(
  frame,
  [cueFrame(seconds, fps) - duration, cueFrame(seconds, fps)],
  [0, 1],
  {...clamp, easing: ALPHA_THEME.motion.easeIn},
);

const SceneStage: React.FC<React.PropsWithChildren<{opacity: number; y?: number}>> = ({opacity, y = 0, children}) => <div style={{
  position: 'absolute', left: 60, right: 60, top: 350, bottom: 270,
  opacity, transform: `translateY(${y}px)`,
}}>{children}</div>;

const PromptToAnswer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - cueFrame(CUES.prompt, fps), fps, config: ALPHA_THEME.motion.spring.smooth});
  const answer = spring({frame: frame - cueFrame(CUES.response, fps), fps, config: ALPHA_THEME.motion.spring.snappy});
  const out = leave(frame, CUES.comparison, fps);
  const connector = interpolate(frame, [cueFrame(0.72, fps), cueFrame(1.18, fps)], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeInOut});
  return <SceneStage opacity={(1 - out)} y={-out * 30}>
    <div style={{opacity: enter, transform: `translateY(${(1 - enter) * 46}px) scale(${0.96 + enter * 0.04})`}}>
      <DataLabel tone="cyan">YÊU CẦU CỦA BẠN</DataLabel>
      <div style={{height: 22}}/>
      <div style={{padding: '32px 36px', borderRadius: 30, border: `2px solid ${ALPHA_THEME.colors.cyan}66`, background: `${ALPHA_THEME.colors.surface}F2`, boxShadow: `0 20px 70px ${ALPHA_THEME.colors.cyan}18`}}>
        <BodyText size={48}>“Hãy giải bài này giúp tôi.”</BodyText>
      </div>
    </div>

    <div style={{position: 'relative', height: 210}}>
      <svg viewBox="0 0 960 210" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
        <path d="M480 18 L480 142" fill="none" stroke={ALPHA_THEME.colors.cyan} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - connector}/>
        <path d="M452 122 L480 154 L508 122" fill="none" stroke={ALPHA_THEME.colors.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={connector}/>
      </svg>
      <div style={{position: 'absolute', right: 70, top: 70, opacity: connector, transform: `translateX(${(1 - connector) * 24}px)`}}><DataLabel tone="green">0,8 GIÂY</DataLabel></div>
    </div>

    <div style={{opacity: answer, transform: `translateY(${(1 - answer) * 58}px) scale(${0.94 + answer * 0.06})`, minHeight: 340, padding: '42px 42px', borderRadius: 34, border: `2px solid ${ALPHA_THEME.colors.green}88`, background: `linear-gradient(145deg, ${ALPHA_THEME.colors.surface}F5, ${ALPHA_THEME.colors.canvas}F0)`, boxShadow: `0 28px 90px ${ALPHA_THEME.colors.green}28`}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <DataLabel tone="green">ĐÁP ÁN ĐÃ CÓ</DataLabel>
        <div style={{width: 52, height: 52, borderRadius: 18, display: 'grid', placeItems: 'center', background: ALPHA_THEME.colors.green, color: ALPHA_THEME.colors.canvas, fontFamily: ALPHA_THEME.type.support, fontWeight: 800, fontSize: 34}}>✓</div>
      </div>
      <div style={{height: 34}}/>
      <HeroText size={94} gradient="intelligence" focus>CÂU TRẢ LỜI<br/>XUẤT HIỆN NGAY</HeroText>
    </div>
  </SceneStage>;
};

const ProductVsCapability: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - cueFrame(CUES.comparison, fps), fps, config: ALPHA_THEME.motion.spring.smooth});
  const capability = spring({frame: frame - cueFrame(CUES.capability, fps), fps, config: ALPHA_THEME.motion.spring.snappy});
  const out = leave(frame, CUES.verification, fps);
  const divider = interpolate(frame, [cueFrame(5.25, fps), cueFrame(5.8, fps)], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeInOut});
  return <SceneStage opacity={enter * (1 - out)} y={(1 - enter) * 38 - out * 34}>
    <DataLabel tone="lightBlue">HAI KẾT QUẢ KHÁC NHAU</DataLabel>
    <div style={{height: 30}}/>
    <HeroText size={104} gradient="intelligence" focus>NHANH <span style={{WebkitTextFillColor: ALPHA_THEME.colors.text}}>≠</span> ĐÃ HIỂU</HeroText>
    <div style={{height: 58}}/>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, position: 'relative'}}>
      <div style={{padding: '32px 30px', minHeight: 420, borderRadius: 32, border: `2px solid ${ALPHA_THEME.colors.cyan}66`, background: `${ALPHA_THEME.colors.surface}E8`, transform: `translateX(${(1 - enter) * -80}px)`}}>
        <DataLabel tone="cyan">SẢN PHẨM</DataLabel>
        <div style={{height: 42}}/>
        <BodyText size={42}>Bài đã có lời giải</BodyText>
        <div style={{height: 44}}/>
        <div style={{width: 92, height: 92, borderRadius: 30, display: 'grid', placeItems: 'center', background: `${ALPHA_THEME.colors.cyan}22`, border: `2px solid ${ALPHA_THEME.colors.cyan}`, color: ALPHA_THEME.colors.cyan, fontSize: 58}}>✓</div>
      </div>
      <div style={{padding: '32px 30px', minHeight: 420, borderRadius: 32, border: `2px solid ${ALPHA_THEME.colors.green}${capability > 0.7 ? 'AA' : '44'}`, background: `${ALPHA_THEME.colors.surface}E8`, transform: `translateX(${(1 - enter) * 80}px) scale(${0.98 + capability * 0.02})`, boxShadow: capability > 0.7 ? `0 26px 80px ${ALPHA_THEME.colors.green}24` : undefined}}>
        <DataLabel tone="green">NĂNG LỰC</DataLabel>
        <div style={{height: 42}}/>
        <BodyText size={42}>Bạn có tự giải thích lại?</BodyText>
        <div style={{height: 44}}/>
        <div style={{display: 'flex', gap: 14}}>{[0, 1, 2].map((index) => <div key={index} style={{height: 18, flex: 1, borderRadius: 99, background: index < Math.floor(capability * 3) ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.steel, transition: 'none'}}/>)}</div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 36, bottom: 36, width: 2, background: ALPHA_THEME.colors.lightBlue, opacity: divider * 0.34, transform: `scaleY(${divider})`, transformOrigin: 'top'}}/>
    </div>
  </SceneStage>;
};

const VerifyLearning: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - cueFrame(CUES.verification, fps), fps, config: ALPHA_THEME.motion.spring.smooth});
  const payoff = spring({frame: frame - cueFrame(CUES.payoff, fps), fps, config: ALPHA_THEME.motion.spring.snappy});
  const exit = leave(frame, CUES.end, fps, 12);
  const checks = ['TỰ GIẢI THÍCH', 'TỰ TÌM ĐIỂM SAI', 'TỰ LÀM BÀI TƯƠNG TỰ'];
  return <SceneStage opacity={enter * (1 - exit)} y={(1 - enter) * 44 - exit * 26}>
    <DataLabel tone="green">KIỂM CHỨNG VIỆC HỌC</DataLabel>
    <div style={{height: 30}}/>
    <HeroText size={88} gradient="alpha">ĐÁP ÁN CHỈ LÀ<br/>ĐIỂM BẮT ĐẦU</HeroText>
    <div style={{height: 58}}/>
    <div style={{display: 'grid', gap: 22}}>{checks.map((label, index) => {
      const p = spring({frame: frame - cueFrame(CUES.verification, fps) - index * 5, fps, config: ALPHA_THEME.motion.spring.snappy});
      const checked = interpolate(payoff, [index * 0.18, Math.min(1, index * 0.18 + 0.58)], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut});
      return <div key={label} style={{display: 'grid', gridTemplateColumns: '78px 1fr', alignItems: 'center', gap: 24, padding: '24px 28px', borderRadius: 26, border: `2px solid ${checked > 0.76 ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.steel}88`, background: `${ALPHA_THEME.colors.surface}E8`, opacity: p, transform: `translateX(${(1 - p) * 70}px) scale(${0.97 + p * 0.03})`}}>
        <div style={{width: 62, height: 62, borderRadius: 20, display: 'grid', placeItems: 'center', border: `3px solid ${checked > 0.76 ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.lightBlue}`, background: checked > 0.76 ? ALPHA_THEME.colors.green : 'transparent', color: ALPHA_THEME.colors.canvas, fontFamily: ALPHA_THEME.type.support, fontWeight: 800, fontSize: 38, transform: `scale(${0.9 + checked * 0.1})`}}>{checked > 0.76 ? '✓' : ''}</div>
        <BodyText size={42} style={{color: checked > 0.76 ? ALPHA_THEME.colors.text : ALPHA_THEME.colors.lightBlue}}>{label}</BodyText>
      </div>;
    })}</div>
    <div style={{height: 54}}/>
    <div style={{opacity: payoff, transform: `translateY(${(1 - payoff) * 46}px) scale(${0.94 + payoff * 0.06})`}}>
      <HeroText size={98} gradient="intelligence" focus>ĐÓ MỚI LÀ HỌC.</HeroText>
    </div>
  </SceneStage>;
};

export const AlphaV32ReferenceDemo: React.FC<{qaMode?: 'full' | 'semantic'}> = ({qaMode = 'full'}) => {
  const {fps} = useVideoConfig();
  return <BrandFrame qaMode={qaMode}>
    <Sequence from={cueFrame(0.08, fps)}><Audio src={staticFile('sfx/soft-hit.wav')} volume={0.12}/></Sequence>
    <Sequence from={cueFrame(CUES.response, fps) - 2}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.08}/></Sequence>
    <Sequence from={cueFrame(CUES.comparison, fps) - 2}><Audio src={staticFile('sfx/soft-hit.wav')} volume={0.1}/></Sequence>
    <Sequence from={cueFrame(CUES.verification, fps) - 2}><Audio src={staticFile('sfx/tick.wav')} volume={0.09}/></Sequence>
    <Sequence from={cueFrame(CUES.payoff, fps) - 2}><Audio src={staticFile('sfx/shimmer.wav')} volume={0.08}/></Sequence>
    <PromptToAnswer/>
    <ProductVsCapability/>
    <VerifyLearning/>
  </BrandFrame>;
};
