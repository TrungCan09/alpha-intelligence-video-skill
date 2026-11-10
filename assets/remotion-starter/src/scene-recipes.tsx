import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {SceneSpec} from './cue-types';
import {cue, cueEnd, cueStart, useCueProgress} from './cue-timeline';
import {GlassCard} from './primitives';
import {ALPHA_THEME} from './theme';
import {BodyText, DataLabel, HeroText} from './typography';

type RecipeProps = {scene: SceneSpec; qaMode?: 'full' | 'semantic'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useSceneGate = (scene: SceneSpec) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const start = Math.round(cueStart(scene.startCueId) * fps); const end = Math.round(cueEnd(scene.endCueId) * fps);
  const enter = interpolate(frame, [start, start + 10], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeOut});
  const exit = interpolate(frame, [end - 9, end], [0, 1], {...clamp, easing: ALPHA_THEME.motion.easeIn});
  return {opacity: enter * (1 - exit), transform: `translateY(${(1 - enter) * 48 - exit * 34}px) scale(${0.97 + enter * 0.03 - exit * 0.02})`};
};

const SceneCanvas: React.FC<React.PropsWithChildren<RecipeProps>> = ({scene, children}) => {
  const gate = useSceneGate(scene);
  return <div data-scene={scene.id} data-recipe={scene.recipe} style={{position: 'absolute', left: 60, right: 60, top: 350, bottom: 270, opacity: gate.opacity, transform: gate.transform, transformOrigin: '50% 45%'}}>{children}</div>;
};

const BeatPill: React.FC<{cueId: string; text: string; tone?: 'cyan' | 'green'}> = ({cueId, text, tone = 'cyan'}) => {
  const progress = useCueProgress(cueId);
  return <div style={{opacity: progress, transform: `translateY(${(1 - progress) * 28}px) scale(${0.94 + progress * 0.06})`, border: `2px solid ${ALPHA_THEME.colors[tone]}88`, borderRadius: 22, padding: '20px 24px', background: `${ALPHA_THEME.colors.surface}EE`}}><BodyText size={38}>{text}</BodyText></div>;
};

export const ProblemResolveScene: React.FC<RecipeProps> = ({scene}) => {
  const progress = useCueProgress(scene.beats[0].cueId);
  return <SceneCanvas scene={scene}><DataLabel tone="cyan">TÌNH HUỐNG</DataLabel><div style={{height: 44}}/><HeroText size={92} gradient="alpha">{scene.beats[0].onScreenText}</HeroText><div style={{height: 84}}/><div style={{position: 'relative', height: 390}}>{[0, 1, 2].map((index) => <div key={index} style={{position: 'absolute', left: 180 + index * 62, top: 30 + index * 48, width: 390, height: 210, borderRadius: 30, border: `2px solid ${index === 2 ? ALPHA_THEME.colors.cyan : ALPHA_THEME.colors.steel}88`, background: `${ALPHA_THEME.colors.surface}F2`, display: 'grid', placeItems: 'center', opacity: progress, transform: `translate(${(1 - progress) * (index - 1) * 100}px, ${(1 - progress) * 90}px) rotate(${(1 - progress) * (index - 1) * 9}deg)`, boxShadow: index === 2 ? `0 24px 80px ${ALPHA_THEME.colors.cyan}24` : 'none'}}><HeroText size={82} gradient={index === 2 ? 'intelligence' : 'alpha'}>?</HeroText></div>)}</div></SceneCanvas>;
};

export const PromptResponseScene: React.FC<RecipeProps> = ({scene}) => {
  const progress = useCueProgress(scene.beats[0].cueId); const line = interpolate(progress, [0, 1], [0, 260], clamp);
  return <SceneCanvas scene={scene}><DataLabel tone="cyan">LUỒNG HÀNH ĐỘNG</DataLabel><div style={{height: 48}}/><div style={{display: 'grid', gridTemplateRows: '1fr 260px auto', alignItems: 'center', height: 1040}}><GlassCard accent="cyan"><BodyText size={48}>NGƯỜI HỌC<br/><span style={{color: ALPHA_THEME.colors.cyan}}>GỬI YÊU CẦU</span></BodyText></GlassCard><svg viewBox="0 0 100 280" style={{width: 100, height: 280, margin: '0 auto', overflow: 'visible'}}><line x1="50" y1="8" x2="50" y2={line} stroke={ALPHA_THEME.colors.cyan} strokeWidth="8" strokeLinecap="round"/><path d={`M28 ${Math.max(26, line - 20)} L50 ${line} L72 ${Math.max(26, line - 20)}`} fill="none" stroke={ALPHA_THEME.colors.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={progress}/></svg><div style={{display: 'grid', gap: 18}}>{scene.beats.map((beat, index) => <BeatPill key={beat.id} cueId={beat.cueId} text={beat.onScreenText ?? cue(beat.cueId).onScreenText} tone={index === scene.beats.length - 1 ? 'green' : 'cyan'}/>)}</div></div></SceneCanvas>;
};

export const FocusTransferScene: React.FC<RecipeProps> = ({scene}) => {
  const first = useCueProgress(scene.beats[0].cueId); const second = useCueProgress(scene.beats.at(1)?.cueId ?? scene.beats[0].cueId);
  return <SceneCanvas scene={scene}><DataLabel tone="cyan">SO SÁNH</DataLabel><div style={{height: 54}}/><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>{scene.beats.slice(0, 2).map((beat, index) => { const focus = index === 0 ? first * (1 - second * 0.45) : second; return <div key={beat.id} style={{minHeight: 470, borderRadius: 32, padding: 34, border: `3px solid ${index ? ALPHA_THEME.colors.cyan : ALPHA_THEME.colors.green}`, background: `${ALPHA_THEME.colors.surface}EE`, opacity: 0.48 + focus * 0.52, transform: `scale(${0.96 + focus * 0.04})`, boxShadow: focus > 0.5 ? `0 20px 70px ${index ? ALPHA_THEME.colors.cyan : ALPHA_THEME.colors.green}22` : 'none'}}><DataLabel tone={index ? 'cyan' : 'green'}>{index ? 'B' : 'A'}</DataLabel><div style={{height: 58}}/><HeroText size={62} gradient={index ? 'alpha' : 'intelligence'}>{beat.onScreenText}</HeroText></div>;})}</div>{scene.beats.slice(2).map((beat) => <div key={beat.id} style={{marginTop: 28}}><BeatPill cueId={beat.cueId} text={beat.onScreenText ?? cue(beat.cueId).onScreenText} tone="green"/></div>)}</SceneCanvas>;
};

export const ProgressiveProcessScene: React.FC<RecipeProps> = ({scene}) => <SceneCanvas scene={scene}><DataLabel tone="cyan">QUY TRÌNH</DataLabel><div style={{height: 54}}/><HeroText size={76} gradient="alpha">TỪNG BƯỚC RÕ RÀNG</HeroText><div style={{height: 90}}/><div style={{display: 'grid', gap: 26}}>{scene.beats.map((beat, index) => <div key={beat.id} style={{display: 'grid', gridTemplateColumns: '90px 1fr', gap: 24, alignItems: 'center'}}><div style={{fontSize: 44, fontWeight: 800, color: ALPHA_THEME.colors.cyan}}>{String(index + 1).padStart(2, '0')}</div><BeatPill cueId={beat.cueId} text={beat.onScreenText ?? cue(beat.cueId).onScreenText} tone={index === scene.beats.length - 1 ? 'green' : 'cyan'}/></div>)}</div></SceneCanvas>;

export const CauseEffectScene: React.FC<RecipeProps> = ({scene}) => {
  const progress = useCueProgress(scene.beats[0].cueId);
  return <SceneCanvas scene={scene}><DataLabel tone="cyan">NGUYÊN NHÂN → KẾT QUẢ</DataLabel><div style={{height: 70}}/><div style={{display: 'grid', gridTemplateColumns: '1fr 150px 1fr', gap: 20, alignItems: 'center'}}><GlassCard accent="cyan"><BodyText size={44}>PROMPT</BodyText></GlassCard><svg viewBox="0 0 150 80" style={{width: 150}}><line x1="8" y1="40" x2={8 + 105 * progress} y2="40" stroke={ALPHA_THEME.colors.cyan} strokeWidth="8" strokeLinecap="round"/><path d="M105 18L137 40L105 62" fill="none" stroke={ALPHA_THEME.colors.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={progress}/></svg><div style={{opacity: progress, transform: `translateX(${(1 - progress) * 60}px) scale(${0.92 + progress * 0.08})`}}><GlassCard accent="green"><BodyText size={44}>ĐÁP ÁN</BodyText></GlassCard></div></div><div style={{height: 70}}/><div style={{display: 'grid', gap: 18}}>{scene.beats.map((beat, index) => index === 0 ? <div key={beat.id} style={{opacity: progress, textAlign: 'center'}}><HeroText size={76} gradient="intelligence" focus>{beat.onScreenText}</HeroText></div> : <BeatPill key={beat.id} cueId={beat.cueId} text={beat.onScreenText ?? cue(beat.cueId).onScreenText} tone={index === scene.beats.length - 1 ? 'green' : 'cyan'}/>)}</div></SceneCanvas>;
};

const ChecklistRow: React.FC<{cueId: string; text?: string}> = ({cueId, text}) => {
  const progress = useCueProgress(cueId);
  return <div style={{display: 'grid', gridTemplateColumns: '68px 1fr', gap: 24, alignItems: 'center', opacity: progress, transform: `translateX(${(1 - progress) * -50}px)`}}><div style={{width: 58, height: 58, borderRadius: 18, display: 'grid', placeItems: 'center', background: ALPHA_THEME.colors.green, color: ALPHA_THEME.colors.canvas, fontSize: 36, fontWeight: 900}}>✓</div><GlassCard accent="green"><BodyText size={38}>{text}</BodyText></GlassCard></div>;
};

export const AccumulatingChecklistScene: React.FC<RecipeProps> = ({scene}) => <SceneCanvas scene={scene}><DataLabel tone="green">TỰ KIỂM TRA</DataLabel><div style={{height: 52}}/><HeroText size={78} gradient="intelligence">CHECKLIST</HeroText><div style={{height: 72}}/><div style={{display: 'grid', gap: 24}}>{scene.beats.map((beat) => <ChecklistRow key={beat.id} cueId={beat.cueId} text={beat.onScreenText}/>)}</div></SceneCanvas>;

export const VerificationMismatchScene: React.FC<RecipeProps> = ({scene}) => {
  const progress = useCueProgress(scene.beats[0].cueId); const reveal = useCueProgress(scene.beats.at(1)?.cueId ?? scene.beats[0].cueId);
  return <SceneCanvas scene={scene}><DataLabel tone="cyan">KIỂM CHỨNG</DataLabel><div style={{height: 60}}/><div style={{position: 'relative'}}><GlassCard accent="cyan"><BodyText size={44}>CÂU TRẢ LỜI TRÔI CHẢY</BodyText><div style={{height: 30}}/>{[1, .82, .92].map((width, index) => <div key={index} style={{height: 12, width: `${width * 100}%`, borderRadius: 99, marginTop: 16, background: `${ALPHA_THEME.colors.lightBlue}55`, transform: `scaleX(${progress})`, transformOrigin: 'left'}} />)}</GlassCard><div style={{position: 'absolute', inset: 0, opacity: reveal, transform: `translateY(${(1 - reveal) * 70}px) rotate(${(1 - reveal) * 3}deg)`}}><GlassCard accent="green"><DataLabel tone="green">LỚP KIỂM TRA</DataLabel><div style={{height: 38}}/><HeroText size={74} gradient="intelligence">{scene.beats.at(1)?.onScreenText ?? scene.beats[0].onScreenText}</HeroText></GlassCard></div></div>{scene.beats.slice(2).map((beat) => <div key={beat.id} style={{marginTop: 28}}><BeatPill cueId={beat.cueId} text={beat.onScreenText ?? cue(beat.cueId).onScreenText} tone="green"/></div>)}</SceneCanvas>;
};

export const FreezeQuestionScene: React.FC<RecipeProps> = ({scene}) => {
  const freeze = useCueProgress(scene.beats[0].cueId); const focus = useCueProgress(scene.beats.at(1)?.cueId ?? scene.beats[0].cueId);
  return <SceneCanvas scene={scene}><div style={{opacity: 0.34, transform: `scale(${1 - freeze * 0.08})`, filter: `blur(${freeze * 4}px)`}}><GlassCard accent="cyan"><BodyText size={40}>GIAO DIỆN ĐANG CHẠY...</BodyText><div style={{height: 28}}/>{[.9, .72, .82].map((width, index) => <div key={index} style={{height: 12, width: `${width * 100}%`, marginTop: 16, borderRadius: 99, background: `${ALPHA_THEME.colors.lightBlue}55`}} />)}</GlassCard></div><div style={{marginTop: -80, opacity: freeze, transform: `translateY(${(1 - freeze) * 70 - focus * 36}px) scale(${0.9 + freeze * 0.1})`}}><DataLabel tone="green">DỪNG LẠI</DataLabel><div style={{height: 34}}/><BodyText size={42}>{scene.beats[0].onScreenText}</BodyText><div style={{height: 28}}/><div style={{opacity: focus, transform: `translateY(${(1 - focus) * 42}px) scale(${0.94 + focus * 0.06})`}}><HeroText size={96} gradient="intelligence" focus>{scene.beats.at(1)?.onScreenText ?? scene.beats[0].onScreenText}</HeroText></div></div></SceneCanvas>;
};

export const NextLessonOutroScene: React.FC<RecipeProps> = ({scene}) => {
  const progress = useCueProgress(scene.beats[0].cueId);
  return <SceneCanvas scene={scene}><DataLabel tone="cyan">BÀI TIẾP THEO</DataLabel><div style={{height: 64}}/><div style={{display: 'flex', gap: 18, justifyContent: 'center', height: 180, alignItems: 'center'}}>{Array.from({length: 7}, (_, index) => <div key={index} style={{width: 54, height: 54, borderRadius: 16, background: index === 3 ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.cyan, opacity: progress, transform: `translate(${(index - 3) * (1 - progress) * 80}px, ${Math.abs(index - 3) * (1 - progress) * 44}px) rotate(${(index - 3) * (1 - progress) * 12}deg)`, boxShadow: `0 0 24px ${index === 3 ? ALPHA_THEME.colors.green : ALPHA_THEME.colors.cyan}44`}} />)}</div><div style={{height: 42}}/><HeroText size={70} gradient="alpha">{scene.beats[0].onScreenText}</HeroText>{scene.beats.slice(1).map((beat) => <div key={beat.id} style={{marginTop: 22}}><BeatPill cueId={beat.cueId} text={beat.onScreenText ?? cue(beat.cueId).onScreenText} tone="green"/></div>)}</SceneCanvas>;
};
