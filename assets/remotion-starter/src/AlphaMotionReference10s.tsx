import React from 'react';
import {Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandFrame, GlassCard} from './primitives';
import {ALPHA_THEME} from './theme';
import {HeroText, DataLabel, BodyText} from './typography';
import {REFERENCE_TIMELINE} from './reference-timeline';

export type AlphaMotionReference10sProps = {voiceSrc?: string};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ProblemStack: React.FC<{progress: number; blocked: number}> = ({progress, blocked}) => {
  const cards = [0, 1, 2];
  return <div style={{position: 'relative', width: 420, height: 300, margin: '0 auto', transform: `scale(${1 - blocked * 0.12})`}}>
    {cards.map((index) => <div key={index} style={{
      position: 'absolute', left: index * 54, top: index * 46, width: 310, height: 180,
      borderRadius: 28, border: `2px solid ${index === 2 ? ALPHA_THEME.colors.cyan : ALPHA_THEME.colors.steel}88`,
      background: `${ALPHA_THEME.colors.surface}F2`, boxShadow: `0 24px 70px ${ALPHA_THEME.colors.cyan}16`,
      opacity: progress, transform: `translate(${(1 - progress) * (index % 2 ? 80 : -70)}px, ${(1 - progress) * 80}px) rotate(${(1 - progress) * (index - 1) * 7}deg)`,
      display: 'grid', placeItems: 'center',
    }}><div style={{fontFamily: ALPHA_THEME.type.support, fontWeight: 800, fontSize: 78, lineHeight: 1, paddingTop: 8, overflow: 'visible', color: index === 2 ? ALPHA_THEME.colors.cyan : ALPHA_THEME.colors.lightBlue}}>?</div></div>)}
  </div>;
};

const PromptToAnswer: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const at = (seconds: number) => Math.round(seconds * fps);
  const prompt = spring({frame: frame - at(REFERENCE_TIMELINE.beats.promptShell), fps, config: ALPHA_THEME.motion.spring.smooth});
  const text = spring({frame: frame - at(REFERENCE_TIMELINE.beats.promptText), fps, config: ALPHA_THEME.motion.spring.snappy});
  const send = interpolate(frame, [at(REFERENCE_TIMELINE.beats.send), at(REFERENCE_TIMELINE.beats.send) + 18], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const responseShell = spring({frame: frame - at(REFERENCE_TIMELINE.beats.send), fps, config: ALPHA_THEME.motion.spring.smooth});
  const answer = spring({frame: frame - at(REFERENCE_TIMELINE.beats.answer), fps, config: ALPHA_THEME.motion.spring.snappy});
  const resolve = spring({frame: frame - at(REFERENCE_TIMELINE.beats.resolve), fps, config: ALPHA_THEME.motion.spring.snappy});
  const promptShift = interpolate(send, [0, 1], [0, -220], clamp);
  const connectorEnd = 8 + send * 200;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 520, height: 720}}>
    <div style={{position: 'absolute', left: 40, right: 40, top: 0, opacity: prompt, transform: `translateY(${(1 - prompt) * 100 + promptShift}px) scale(${0.94 + prompt * 0.06 - send * 0.06})`}}>
      <GlassCard accent="cyan">
        <DataLabel tone="cyan">PROMPT</DataLabel>
        <div style={{height: 34}} />
        <div style={{overflow: 'hidden'}}><BodyText size={52} style={{lineHeight: 1.2, opacity: text, transform: `translateY(${(1 - text) * 54}px)`}}>HÃY LÀM BÀI NÀY<br/>GIÚP TÔI</BodyText></div>
        <div style={{position: 'absolute', right: 34, bottom: 30, width: 72, height: 72, borderRadius: 22, background: ALPHA_THEME.colors.cyan, display: 'grid', placeItems: 'center', transform: `scale(${0.78 + send * 0.22}) rotate(${(1 - send) * -12}deg)`, boxShadow: `0 0 ${28 * send}px ${ALPHA_THEME.colors.cyan}77`}}>
          <svg width="36" height="36" viewBox="0 0 36 36"><path d="M5 18H27M20 9L29 18L20 27" fill="none" stroke={ALPHA_THEME.colors.canvas} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </GlassCard>
    </div>
    <svg viewBox="0 0 80 230" style={{position: 'absolute', left: '50%', top: 120, width: 80, height: 230, marginLeft: -40, overflow: 'visible', opacity: send * (1 - answer * 0.75), zIndex: 1}}>
      <line x1="40" y1="8" x2="40" y2={connectorEnd} stroke={ALPHA_THEME.colors.cyan} strokeWidth="8" strokeLinecap="round" style={{filter: `drop-shadow(0 0 12px ${ALPHA_THEME.colors.cyan}66)`}} />
      <path d={`M22 ${connectorEnd - 18} L40 ${connectorEnd} L58 ${connectorEnd - 18}`} fill="none" stroke={ALPHA_THEME.colors.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={send > 0.08 ? 1 : 0} />
      {[0, 1, 2].map((index) => {
        const packet = interpolate(send, [index * 0.16, Math.min(1, 0.58 + index * 0.16)], [0, 1], clamp);
        return <rect key={index} x="29" y={12 + packet * 170} width="22" height="14" rx="5" fill={index === 2 ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.cyan} opacity={packet < 0.08 || packet > 0.94 ? 0 : 1} style={{filter: `drop-shadow(0 0 8px ${ALPHA_THEME.colors.cyan}77)`}} />;
      })}
    </svg>
    <div style={{position: 'absolute', left: 40, right: 40, top: 350, opacity: responseShell, zIndex: 2, transform: `translateY(${(1 - responseShell) * 52}px) scale(${0.94 + responseShell * 0.06})`}}>
      <GlassCard accent="green">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <DataLabel tone="green">PHẢN HỒI</DataLabel>
          <div style={{width: 54, height: 54, borderRadius: 99, border: `3px solid ${ALPHA_THEME.colors.green}`, display: 'grid', placeItems: 'center', transform: `scale(${resolve})`, background: `${ALPHA_THEME.colors.green}22`}}>
            <svg width="30" height="30" viewBox="0 0 30 30"><path d="M6 15L12 21L24 8" fill="none" stroke={ALPHA_THEME.colors.green} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div style={{opacity: answer, transform: `translateY(${(1 - answer) * 34}px)`}}>
          <div style={{height: 28}} />
          <HeroText size={72} gradient="intelligence" focus>CÂU TRẢ LỜI<br/>ĐẾN NHANH.</HeroText>
          <div style={{display: 'grid', gap: 14, marginTop: 30}}>{[1, .78, .9].map((width, index) => <div key={index} style={{height: 12, width: `${width * 100}%`, borderRadius: 99, background: index === 0 ? `${ALPHA_THEME.colors.green}99` : `${ALPHA_THEME.colors.lightBlue}55`, transformOrigin: 'left', transform: `scaleX(${Math.max(0, Math.min(1, answer * 1.3 - index * 0.16))})`}} />)}</div>
        </div>
      </GlassCard>
    </div>
  </div>;
};

const VoiceGroundedContinuation: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const at = (seconds: number) => Math.round(seconds * fps);
  const enterAt = (seconds: number) => spring({frame: frame - at(seconds), fps, config: ALPHA_THEME.motion.spring.snappy});
  const lesson = enterAt(REFERENCE_TIMELINE.continuation.lessonStart);
  const reveal = enterAt(REFERENCE_TIMELINE.continuation.lessonReveal);
  const action = enterAt(REFERENCE_TIMELINE.continuation.lessonAction);
  const lessonExit = interpolate(frame, [at(13.32), at(13.58)], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeIn});
  const question = enterAt(REFERENCE_TIMELINE.continuation.questionStart);
  const study = enterAt(REFERENCE_TIMELINE.continuation.studyFocus);
  const avoid = enterAt(REFERENCE_TIMELINE.continuation.avoidFocus);
  const questionExit = interpolate(frame, [at(17.62), at(17.88)], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeIn});
  const thinking = enterAt(REFERENCE_TIMELINE.continuation.thinkingStart);
  const meaning = enterAt(REFERENCE_TIMELINE.continuation.thinkingMeaning);
  const subject = enterAt(REFERENCE_TIMELINE.continuation.thinkingSubject);
  const focus = enterAt(REFERENCE_TIMELINE.continuation.thinkingFocus);

  return <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', inset: 0, padding: `350px ${ALPHA_THEME.safe.x}px ${ALPHA_THEME.safe.bottom}px`, opacity: lesson * (1 - lessonExit), transform: `translateY(${(1 - lesson) * 70 - lessonExit * 40}px) scale(${1 - lessonExit * 0.025})`}}>
      <DataLabel tone="cyan">NHƯNG ĐÔI KHI...</DataLabel>
      <div style={{height: 58}} />
      <div style={{position: 'relative', height: 630}}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 0, opacity: lesson * Math.max(0, 1 - reveal * 1.6), transform: `translateX(${600 * reveal}px) translateY(${-80 * reveal}px) rotate(${reveal * 5}deg) scale(${1 - reveal * 0.06})`, zIndex: 2}}>
          <GlassCard accent="cyan"><DataLabel tone="cyan">ĐÁP ÁN CÓ SẴN</DataLabel><div style={{height: 28}}/><BodyText size={54}>BẾ TẮC<br/>BIẾN MẤT.</BodyText></GlassCard>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, opacity: reveal, transform: `translateY(${(1 - reveal) * 90}px) scale(${0.93 + reveal * 0.07})`, zIndex: 1}}>
          <GlassCard accent="green">
            <DataLabel tone="green">PHẦN BÀI TẬP MUỐN BẠN HỌC</DataLabel>
            <div style={{height: 36}} />
            <HeroText size={76} gradient="intelligence" focus style={{lineHeight: 1.16}}>HỌC CÁCH<br/>XỬ LÝ.</HeroText>
            <div style={{height: 24}} />
            <div style={{height: 6, borderRadius: 99, background: ALPHA_THEME.colors.green, transformOrigin: 'left', transform: `scaleX(${action})`, boxShadow: `0 0 22px ${ALPHA_THEME.colors.green}55`}} />
          </GlassCard>
        </div>
      </div>
    </div>

    <div style={{position: 'absolute', inset: 0, padding: `350px ${ALPHA_THEME.safe.x}px ${ALPHA_THEME.safe.bottom}px`, opacity: question * (1 - questionExit), transform: `translateY(${(1 - question) * 70 - questionExit * 36}px)`}}>
      <DataLabel tone="cyan">VẬY...</DataLabel>
      <div style={{height: 38}} />
      <BodyText size={50} muted>BẠN ĐANG DÙNG AI ĐỂ...</BodyText>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 68}}>
        <div style={{minHeight: 360, borderRadius: 30, border: `3px solid ${ALPHA_THEME.colors.green}`, background: `${ALPHA_THEME.colors.surface}EE`, padding: '34px 30px', opacity: 0.54 + study * 0.46, transform: `translateX(${(1 - question) * -70}px) scale(${1 + study * 0.035})`, boxShadow: study > 0.2 ? `0 20px 64px ${ALPHA_THEME.colors.green}25` : 'none'}}>
          <DataLabel tone="green">A</DataLabel><div style={{height: 48}}/><HeroText size={72} gradient="intelligence" focus={study > 0.2}>ĐỂ<br/>HỌC.</HeroText>
        </div>
        <div style={{minHeight: 360, borderRadius: 30, border: `3px solid ${ALPHA_THEME.colors.cyan}`, background: `${ALPHA_THEME.colors.surface}EE`, padding: '34px 30px', opacity: 0.5 + avoid * 0.5, transform: `translateX(${(1 - question) * 70}px) scale(${1 + avoid * 0.035})`, boxShadow: avoid > 0.2 ? `0 20px 64px ${ALPHA_THEME.colors.cyan}25` : 'none'}}>
          <DataLabel tone="cyan">B</DataLabel><div style={{height: 48}}/><HeroText size={64} gradient="alpha" focus={avoid > 0.2}>NÉ VIỆC<br/>HỌC?</HeroText>
        </div>
      </div>
      <div style={{marginTop: 46, opacity: avoid, transform: `translateY(${(1 - avoid) * 26}px)`}}><BodyText size={44} muted>HAI MỤC ĐÍCH KHÁC NHAU.</BodyText></div>
    </div>

    <div style={{position: 'absolute', inset: 0, padding: `390px ${ALPHA_THEME.safe.x}px ${ALPHA_THEME.safe.bottom}px`, opacity: thinking, transform: `translateY(${(1 - thinking) * 72}px)`}}>
      <DataLabel tone="green">DÙNG AI ĐỂ HỌC</DataLabel>
      <div style={{height: 46}} />
      <div style={{opacity: meaning, transform: `translateY(${(1 - meaning) * 34}px)`}}><BodyText size={52} muted>NGHĨA LÀ...</BodyText></div>
      <div style={{height: 30}} />
      <div style={{opacity: subject, transform: `translateY(${(1 - subject) * 46}px) scale(${0.96 + subject * 0.04})`, transformOrigin: 'left top'}}>
        <HeroText size={100} gradient="intelligence" style={{lineHeight: 1.16}}>BẠN VẪN</HeroText>
      </div>
      <div style={{opacity: focus, transform: `translateY(${(1 - focus) * 34}px) scale(${0.96 + focus * 0.04})`, transformOrigin: 'left top'}}>
        <HeroText size={100} gradient="intelligence" focus style={{lineHeight: 1.16}}>SUY NGHĨ.</HeroText>
      </div>
      <div style={{marginTop: 48, display: 'flex', alignItems: 'center', gap: 20, opacity: focus}}>
        {[0, 1, 2].map((index) => <div key={index} style={{height: 12, flex: index === 2 ? 1.6 : 1, borderRadius: 99, background: index === 2 ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.cyan, transform: `scaleX(${Math.max(0, Math.min(1, focus * 1.4 - index * 0.14))})`, transformOrigin: 'left', boxShadow: index === 2 ? `0 0 20px ${ALPHA_THEME.colors.green}55` : undefined}} />)}
      </div>
    </div>
  </div>;
};

export const AlphaMotionReference10s: React.FC<AlphaMotionReference10sProps> = ({voiceSrc}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const at = (seconds: number) => Math.round(seconds * fps);
  const problem = spring({frame: frame - at(REFERENCE_TIMELINE.beats.problem), fps, config: ALPHA_THEME.motion.spring.snappy});
  const blocked = spring({frame: frame - at(REFERENCE_TIMELINE.beats.blocked), fps, config: ALPHA_THEME.motion.spring.snappy});
  const promptStarted = interpolate(frame, [at(REFERENCE_TIMELINE.beats.promptShell), at(REFERENCE_TIMELINE.beats.promptShell) + 12], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const sceneOneExit = interpolate(frame, [at(9.48), at(9.82)], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeInOut});
  return <BrandFrame>
    {voiceSrc ? <Audio src={staticFile(voiceSrc)} volume={1} /> : null}
    <Sequence from={Math.max(0, at(REFERENCE_TIMELINE.beats.blocked) - 2)} layout="none"><Audio src={staticFile('sfx/soft-hit.wav')} volume={0.08} /></Sequence>
    <Sequence from={Math.max(0, at(REFERENCE_TIMELINE.beats.send) - 3)} layout="none"><Audio src={staticFile('sfx/whoosh.wav')} volume={0.06} /></Sequence>
    <Sequence from={Math.max(0, at(REFERENCE_TIMELINE.continuation.lessonStart) - 2)} layout="none"><Audio src={staticFile('sfx/soft-hit.wav')} volume={0.055} /></Sequence>
    <Sequence from={Math.max(0, at(REFERENCE_TIMELINE.continuation.questionStart) - 2)} layout="none"><Audio src={staticFile('sfx/whoosh.wav')} volume={0.045} /></Sequence>
    <div style={{position: 'relative', marginTop: 210, height: 1280, opacity: 1 - sceneOneExit, transform: `translateY(${-52 * sceneOneExit}px) scale(${1 - sceneOneExit * 0.025})`}}>
      <div style={{opacity: 1 - promptStarted, transform: `translateY(${-70 * promptStarted}px) scale(${1 - promptStarted * 0.05})`}}>
        <DataLabel tone="lightBlue">MỘT BÀI TẬP KHÓ</DataLabel>
        <div style={{height: 36}} />
        <HeroText size={102} gradient="alpha">KHI BẠN<br/>BỊ BẾ TẮC...</HeroText>
        <div style={{height: 100}} />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48}}>
          <ProblemStack progress={problem} blocked={blocked} />
          <div style={{opacity: blocked, textAlign: 'center', transform: `translateY(${(1 - blocked) * 32}px) scale(${0.88 + blocked * 0.12})`}}>
            <div style={{fontFamily: ALPHA_THEME.type.support, fontWeight: 800, fontSize: 62, lineHeight: 1.12, color: ALPHA_THEME.colors.green, filter: `drop-shadow(0 0 22px ${ALPHA_THEME.colors.green}44)`}}>BẾ TẮC</div>
            <div style={{width: 260, height: 5, borderRadius: 99, margin: '22px auto 0', background: ALPHA_THEME.colors.green, transform: `scaleX(${blocked})`}} />
          </div>
        </div>
      </div>
      <PromptToAnswer />
    </div>
    <VoiceGroundedContinuation />
  </BrandFrame>;
};
