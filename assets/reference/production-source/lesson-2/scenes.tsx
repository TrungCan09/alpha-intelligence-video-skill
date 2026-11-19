import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Body, Display, Glass, GradientWord, mix, SafeStage, SceneShell} from '../alpha-short/components';
import {alpha, alphaTheme} from '../alpha-short/theme';
import {answerFrameAt, ANSWER_CUE_SECONDS} from './timeline';

type SceneProps = {durationInFrames: number};

const sceneIn = (frame: number, fps: number, delay = 0) => spring({
  frame: frame - answerFrameAt(delay, fps),
  fps,
  config: alphaTheme.spring.snappy,
});

const enterStyle = (progress: number, distance = 44): React.CSSProperties => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px) scale(${0.94 + progress * 0.06})`,
});

const Pill: React.FC<{children: React.ReactNode; accent?: string; style?: React.CSSProperties}> = ({children, accent = alphaTheme.colors.cyan, style}) => (
  <div style={{
    border: `2px solid ${alpha(accent, 0.58)}`,
    background: alpha(alphaTheme.colors.surfaceAlt, 0.96),
    borderRadius: 22,
    padding: '20px 26px',
    boxShadow: `0 16px 42px ${alpha(alphaTheme.colors.shadow, 0.38)}`,
    ...style,
  }}>{children}</div>
);

const DataGlyph: React.FC<{kind: 'text' | 'image' | 'code'}> = ({kind}) => {
  if (kind === 'code') return <Display size={48} color={alphaTheme.colors.green}>&lt;/&gt;</Display>;
  return <div style={{width: 78, height: 64, border: `3px solid ${alphaTheme.colors.cyan}`, borderRadius: 10, padding: 11, display: 'grid', gap: 7}}>
    {Array.from({length: kind === 'text' ? 4 : 2}, (_, index) => <i key={index} style={{height: 5, borderRadius: 5, background: index === 0 ? alphaTheme.colors.cyan : alpha(alphaTheme.colors.cyan, 0.45)}}/>)}
  </div>;
};

export const RecapScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = sceneIn(frame, fps);
  const lock = spring({frame: frame - answerFrameAt(3.6, fps), fps, config: alphaTheme.spring.weighty});
  return <SceneShell durationInFrames={durationInFrames} label="TỪ BÀI TRƯỚC">
    <SafeStage style={{top: 365}}>
      <div data-motion-entry="recap" style={enterStyle(enter)}><Display size={84}>KẾT QUẢ VÀ<br/><span style={{color: alphaTheme.colors.cyan}}>NĂNG LỰC THỰC TẾ</span></Display></div>
      <div data-parallel="recap-pair" style={{display: 'flex', gap: 28, marginTop: 120}}>
        {[
          ['KẾT QUẢ', 'DO AI TẠO RA', alphaTheme.colors.steel],
          ['NĂNG LỰC', 'CỦA CHÍNH MÌNH', alphaTheme.colors.green],
        ].map(([title, support, accent], index) => <Glass key={title} style={{
          flex: 1,
          minHeight: 390,
          padding: '42px 30px',
          borderColor: alpha(accent, 0.64),
          opacity: enter,
          transform: `translateX(${(1 - enter) * (index ? 120 : -120)}px) scale(${0.94 + enter * 0.06})`,
        }}>
          <Display size={48} color={accent}>{title}</Display>
          <Body size={48} color={alphaTheme.colors.white} style={{marginTop: 48}}>{support}</Body>
        </Glass>)}
      </div>
      <div style={{marginTop: 85, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, opacity: lock, transform: `scale(${0.8 + lock * 0.2})`}}>
        <div style={{height: 4, width: 180, background: alphaTheme.colors.steel}}/>
        <Display size={70} color={alphaTheme.colors.white}>≠</Display>
        <div style={{height: 4, width: 180, background: alphaTheme.colors.green}}/>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const AnswerQuestionScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const converge = spring({frame: frame - answerFrameAt(0.1, fps), fps, config: alphaTheme.spring.weighty});
  const intro = sceneIn(frame, fps, 0.24);
  const lines = [-330, -205, -80, 80, 205, 330];
  return <SceneShell durationInFrames={durationInFrames} label="CÂU HỎI LỚN HƠN">
    <SafeStage style={{top: 380, textAlign: 'center'}}>
      <div data-motion-entry="question" style={{position: 'relative', height: 410, ...enterStyle(converge, 54)}}>
        {lines.map((x, index) => <div key={x} style={{
          position: 'absolute', left: '50%', top: 110 + index % 2 * 90, width: 250, height: 18, borderRadius: 20,
          background: index % 2 ? alphaTheme.colors.green : alphaTheme.colors.cyan,
          opacity: 0.16 + converge * 0.34,
          transform: `translateX(${x * (1 - converge) - 125}px) scaleX(${0.5 + converge * 0.5})`,
          boxShadow: `0 0 22px ${alpha(index % 2 ? alphaTheme.colors.green : alphaTheme.colors.cyan, 0.28)}`,
        }}/>) }
        <Display size={220} color={alphaTheme.colors.cyan} style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: converge, transform: `scale(${0.6 + converge * 0.4})`}}>?</Display>
      </div>
      <div style={enterStyle(intro, 36)}><Display size={62}>AI TẠO RA CÂU TRẢ LỜI</Display>
      <GradientWord size={108} style={{marginTop: 18}}>BẰNG CÁCH NÀO?</GradientWord></div>
    </SafeStage>
  </SceneShell>;
};

export const IllusionScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const assumptions = sceneIn(frame, fps, 2.1);
  const responseScan = mix(frame, [answerFrameAt(4.75, fps), answerFrameAt(6.15, fps)], [0, 1], alphaTheme.ease.inOut);
  const bridge = mix(frame, [answerFrameAt(5.25, fps), answerFrameAt(6.9, fps)], [0, 1], alphaTheme.ease.inOut);
  const typed = Math.floor(mix(frame, [answerFrameAt(0.4, fps), answerFrameAt(4.5, fps)], [0, 74], alphaTheme.ease.inOut));
  const splitAt = answerFrameAt(21.8 - ANSWER_CUE_SECONDS[2], fps);
  const split = spring({frame: frame - splitAt, fps, config: alphaTheme.spring.weighty});
  const sentence = 'Câu trả lời được trình bày tự nhiên, rõ ràng và rất thuyết phục...';
  return <SceneShell durationInFrames={durationInFrames} label="CẢM GIÁC AI ĐANG HIỂU">
    <SafeStage style={{top: 340}}>
      <Glass data-motion-entry="illusion" style={{position: 'relative', overflow: 'hidden', padding: '38px 40px', minHeight: 260, borderColor: alpha(alphaTheme.colors.cyan, 0.52), opacity: intro * (1 - split * 0.72), transform: `translateY(${(1 - intro) * 52 - 90 * split}px) scale(${0.94 + intro * 0.06 - split * 0.03})`}}>
        <Body size={48} color={alphaTheme.colors.white}>{sentence.slice(0, Math.min(sentence.length, typed))}<span style={{color: alphaTheme.colors.cyan}}>|</span></Body>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${responseScan * 108 - 8}%`, width: '8%', opacity: responseScan < 1 ? 0.7 : 0, background: `linear-gradient(90deg, transparent, ${alpha(alphaTheme.colors.cyan, 0.24)}, transparent)`, transform: 'skewX(-12deg)'}}/>
      </Glass>
      <div style={{height: 76, display: 'grid', placeItems: 'center', opacity: 1 - split}}><div style={{width: 4, height: 76 * bridge, borderRadius: 6, background: `linear-gradient(180deg, ${alphaTheme.colors.cyan}, ${alpha(alphaTheme.colors.green, 0.55)})`, boxShadow: `0 0 24px ${alpha(alphaTheme.colors.cyan, 0.38)}`}}/></div>
      <div data-parallel="human-assumptions" style={{display: 'flex', gap: 24, transform: `translateY(${(1 - assumptions) * 42 - 70 * split}px) scale(${0.95 + assumptions * 0.05})`, opacity: assumptions * (1 - split * 0.76)}}>
        {['ĐANG SUY NGHĨ?', 'THỰC SỰ THẤU HIỂU?'].map((text, index) => <Pill key={text} accent={index ? alphaTheme.colors.green : alphaTheme.colors.steel} style={{flex: 1, minHeight: 190, display: 'grid', placeItems: 'center', textAlign: 'center'}}>
          <Display size={46}>{text}</Display>
        </Pill>)}
      </div>
      <div style={{marginTop: 85, opacity: split, transform: `translateY(${(1 - split) * 50}px) scale(${0.92 + split * 0.08})`, textAlign: 'center'}}>
        <Display size={48} color={alphaTheme.colors.cyan}>NHƯNG THỰC TẾ THÌ SAO?</Display>
        <div style={{marginTop: 50, display: 'flex', justifyContent: 'center', gap: 18}}>
          {['AI', 'TẠO', 'CÂU', 'TRẢ', 'LỜI'].map((token) => <Pill key={token} style={{padding: '16px 20px'}}><Body size={34} color={alphaTheme.colors.white}>{token}</Body></Pill>)}
        </div>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const DataPatternsScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const p = sceneIn(frame, fps, 0.12);
  const link = mix(frame, [answerFrameAt(1.2, fps), answerFrameAt(4.6, fps)], [0, 1], alphaTheme.ease.inOut);
  const node = sceneIn(frame, fps, 3.75);
  const items = [['VĂN BẢN', 'text'], ['HÌNH ẢNH', 'image'], ['MÃ NGUỒN', 'code']] as const;
  return <SceneShell durationInFrames={durationInFrames} label="HỌC TỪ DỮ LIỆU">
    <SafeStage style={{top: 330}}>
      <div data-motion-entry="data" style={enterStyle(intro)}><Display size={82}>DỮ LIỆU<br/><span style={{color: alphaTheme.colors.cyan}}>KHỔNG LỒ</span></Display></div>
      <div data-parallel="data-types" style={{display: 'flex', gap: 20, marginTop: 90}}>
        {items.map(([label, kind]) => <Glass key={label} style={{flex: 1, height: 260, display: 'grid', placeItems: 'center', textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 55}px) scale(${0.95 + p * 0.05})`}}>
          <DataGlyph kind={kind}/><Display size={32}>{label}</Display>
        </Glass>)}
      </div>
      <svg width="960" height="470" viewBox="0 0 960 470" style={{marginTop: 40}}>
        {[170, 480, 790].map((x) => <path key={x} d={`M${x} 10 C${x} 170 480 150 480 280`} fill="none" stroke={alphaTheme.colors.cyan} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - link}/>) }
        <g opacity={node} transform={`translate(480 300) scale(${0.82 + node * 0.18}) translate(-480 -300)`}>
          <circle cx="480" cy="300" r={105} fill={alpha(alphaTheme.colors.green, 0.12)} stroke={alphaTheme.colors.green} strokeWidth="4"/>
          <text x="480" y="286" fill={alphaTheme.colors.white} fontFamily={alphaTheme.fonts.display} fontWeight="800" fontSize="42" textAnchor="middle">QUY LUẬT</text>
          <text x="480" y="342" fill={alphaTheme.colors.green} fontFamily={alphaTheme.fonts.display} fontWeight="800" fontSize="35" textAnchor="middle">MỐI LIÊN HỆ</text>
        </g>
      </svg>
    </SafeStage>
  </SceneShell>;
};

export const TokenizeScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const promptIn = sceneIn(frame, fps, 0.25);
  const scan = mix(frame, [answerFrameAt(0.65, fps), answerFrameAt(1.9, fps)], [0, 1], alphaTheme.ease.inOut);
  const split = spring({frame: frame - answerFrameAt(2.15, fps), fps, config: alphaTheme.spring.weighty});
  const tokens = ['HÃY', 'GIẢI', 'THÍCH', 'VỀ', 'TẾ', 'BÀO'];
  return <SceneShell durationInFrames={durationInFrames} label="CHIA NHỎ NỘI DUNG">
    <SafeStage style={{top: 350}}>
      <div data-motion-entry="tokenize" style={enterStyle(intro)}><Display size={84}>CÂU HỎI</Display>
      <GradientWord size={114} style={{marginTop: 8}}>→ TOKEN</GradientWord></div>
      <Glass style={{position: 'relative', overflow: 'hidden', marginTop: 100, padding: '40px 34px', opacity: promptIn * (1 - split), transform: `translateY(${(1 - promptIn) * 42}px) scale(${0.95 + promptIn * 0.05 - split * 0.06})`}}><Body size={48} color={alphaTheme.colors.white}>HÃY GIẢI THÍCH VỀ TẾ BÀO</Body><div style={{position: 'absolute', top: 0, bottom: 0, width: 6, left: `${scan * 100}%`, background: alphaTheme.colors.cyan, boxShadow: `0 0 32px ${alphaTheme.colors.cyan}`, opacity: split ? 0 : 0.75}}/></Glass>
      <div data-sequential="token-split" style={{position: 'relative', height: 650, marginTop: -130}}>
        {tokens.map((token, index) => {
          const col = index % 3; const row = Math.floor(index / 3);
          return <Pill key={token} accent={index % 2 ? alphaTheme.colors.green : alphaTheme.colors.cyan} style={{
            position: 'absolute', width: 250, left: 35 + col * 310, top: 260 + row * 160, textAlign: 'center',
            opacity: split, transform: `translate(${(1 - split) * (310 - col * 310)}px, ${(1 - split) * (-180 - row * 120)}px) scale(${0.78 + split * 0.22})`,
          }}><Display size={42}>{token}</Display></Pill>;
        })}
      </div>
    </SafeStage>
  </SceneShell>;
};

export const PredictionLoopScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const candidatesIn = sceneIn(frame, fps, 0.25);
  const measure = mix(frame, [answerFrameAt(0.7, fps), answerFrameAt(2.3, fps)], [0, 1], alphaTheme.ease.inOut);
  const candidates = [['TẾ', 0.72], ['MỘT', 0.18], ['NHÂN', 0.1]] as const;
  const choose = spring({frame: frame - answerFrameAt(4.2, fps), fps, config: alphaTheme.spring.weighty});
  const completeAt = answerFrameAt(49 - ANSWER_CUE_SECONDS[6], fps);
  const complete = spring({frame: frame - completeAt, fps, config: alphaTheme.spring.smooth});
  return <SceneShell durationInFrames={durationInFrames} label="DỰ ĐOÁN PHẦN TIẾP THEO">
    <SafeStage style={{top: 330}}>
      <div data-motion-entry="prediction" style={enterStyle(intro)}><Display size={78}>TOKEN NÀO<br/><span style={{color: alphaTheme.colors.cyan}}>HỢP LÝ NHẤT?</span></Display></div>
      <div data-parallel="token-candidates" style={{marginTop: 80, display: 'grid', gap: 26, opacity: candidatesIn * (1 - complete), transform: `translateY(${(1 - candidatesIn) * 46 - 35 * complete}px) scale(${0.96 + candidatesIn * 0.04})`}}>
        {candidates.map(([word, probability], index) => <Glass key={word} style={{height: 145, padding: '26px 32px', borderColor: alpha(index === 0 ? alphaTheme.colors.green : alphaTheme.colors.steel, 0.62)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}><Display size={45} color={index === 0 ? alphaTheme.colors.green : alphaTheme.colors.white}>{word}</Display><div style={{flex: 1, height: 18, borderRadius: 20, background: alpha(alphaTheme.colors.steel, 0.18), overflow: 'hidden'}}><div style={{height: '100%', width: `${probability * 100 * measure}%`, background: index === 0 ? alphaTheme.colors.green : alphaTheme.colors.steel, boxShadow: index === 0 && choose > 0 ? `0 0 ${26 * choose}px ${alphaTheme.colors.green}` : undefined}}/></div><Body size={32}>{Math.round(probability * 100)}%</Body></div>
        </Glass>)}
      </div>
      <div style={{marginTop: 76, textAlign: 'center', opacity: choose * (1 - complete), transform: `scale(${0.88 + choose * 0.12})`}}><Body size={48}>CHỌN → GẮN VÀO CHUỖI → LẶP LẠI</Body></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, opacity: complete, transform: `translateY(${(1 - complete) * 60}px) scale(${0.9 + complete * 0.1})`, textAlign: 'center'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center'}}>{['MỘT', 'CÂU', 'TRẢ', 'LỜI', 'HOÀN', 'CHỈNH'].map((word) => <Pill key={word} style={{padding: '17px 22px'}}><Display size={34}>{word}</Display></Pill>)}</div>
        <GradientWord size={94} style={{marginTop: 80}}>CÂU TRẢ LỜI HOÀN CHỈNH</GradientWord>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const KeyboardAnalogyScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const keyboardIn = sceneIn(frame, fps, 0.25);
  const sweep = mix(frame, [answerFrameAt(1.2, fps), answerFrameAt(3.2, fps)], [0, 23], alphaTheme.ease.inOut);
  const contextIn = sceneIn(frame, fps, 3.5);
  const contextFlow = mix(frame, [answerFrameAt(4.1, fps), answerFrameAt(7.2, fps)], [0, 1], alphaTheme.ease.inOut);
  const suggestions = ['TẾ BÀO', 'TẾ BÀO CHẤT', 'TẾ BÀO ĐỘNG VẬT'];
  return <SceneShell durationInFrames={durationInFrames} label="MỘT CÁCH HÌNH DUNG">
    <SafeStage style={{top: 330, textAlign: 'center'}}>
      <div data-motion-entry="keyboard" style={enterStyle(intro)}><Display size={75}>GỢI Ý TỪ</Display><GradientWord size={100}>NHƯNG MẠNH HƠN</GradientWord></div>
      <div data-semantic="context-influence" style={{position: 'relative', marginTop: 70, opacity: keyboardIn, transform: `translateY(${(1 - keyboardIn) * 48}px) scale(${0.95 + keyboardIn * 0.05})`, transformOrigin: 'center top'}}>
        <Glass style={{position: 'relative', zIndex: 2, padding: '28px 24px', borderRadius: 42}}>
          <div data-parallel="suggestions" style={{display: 'flex', gap: 14}}>{suggestions.map((word, index) => <Pill key={word} accent={index === 0 ? alphaTheme.colors.green : alphaTheme.colors.steel} style={{flex: 1, padding: '16px 10px', boxShadow: contextFlow > 0 ? `0 0 ${20 + contextFlow * 22}px ${alpha(index === 0 ? alphaTheme.colors.green : alphaTheme.colors.cyan, 0.14 + contextFlow * 0.12)}` : undefined, transform: `translateY(${-4 * contextFlow}px)`}}><Body size={32} color={alphaTheme.colors.white}>{word}</Body></Pill>)}</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 26}}>{Array.from({length: 24}, (_, index) => <div key={index} style={{height: 78, borderRadius: 14, border: `1px solid ${alpha(alphaTheme.colors.steel, 0.38)}`, background: Math.abs(index - sweep) < 1.2 ? alpha(alphaTheme.colors.cyan, 0.2) : alpha(alphaTheme.colors.white, 0.055), boxShadow: Math.abs(index - sweep) < 1.2 ? `0 0 24px ${alpha(alphaTheme.colors.cyan, 0.25)}` : undefined}}/>)}</div>
        </Glass>
        <svg viewBox="0 0 960 170" style={{display: 'block', width: '100%', height: 170, marginTop: -28, overflow: 'visible', opacity: contextIn}}>
          {[180, 480, 780].map((x) => <path key={x} d={`M480 160 C480 92 ${x} 106 ${x} 12`} fill="none" stroke={alphaTheme.colors.cyan} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - contextFlow} opacity={0.35 + contextFlow * 0.45}/>) }
        </svg>
        <Pill accent={alphaTheme.colors.cyan} style={{position: 'relative', zIndex: 3, margin: '-20px auto 0', width: 680, opacity: contextIn, transform: `translateY(${(1 - contextIn) * 38}px) scale(${0.94 + contextIn * 0.06})`, boxShadow: `0 0 ${36 * contextFlow}px ${alpha(alphaTheme.colors.cyan, 0.22)}`}}><Body size={48} color={alphaTheme.colors.white}>TOÀN BỘ NGỮ CẢNH</Body></Pill>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const ContextExampleScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const panelsIn = sceneIn(frame, fps, 0.25);
  const scan = mix(frame, [answerFrameAt(1.4, fps), answerFrameAt(4.5, fps)], [0, 1], alphaTheme.ease.inOut);
  const switchAt = answerFrameAt(ANSWER_CUE_SECONDS[10] - ANSWER_CUE_SECONDS[9], fps);
  const focus = spring({frame: frame - switchAt, fps, config: alphaTheme.spring.smooth});
  return <SceneShell durationInFrames={durationInFrames} label="VÌ SAO NGỮ CẢNH QUAN TRỌNG?">
    <SafeStage style={{top: 325}}>
      <div data-motion-entry="context" style={enterStyle(intro)}><Display size={82}>CÙNG MỘT CHỦ ĐỀ.<br/><span style={{color: alphaTheme.colors.cyan}}>HAI CÁCH HỎI.</span></Display></div>
      <div data-parallel="context-ab" style={{display: 'flex', gap: 24, marginTop: 76, opacity: panelsIn, transform: `translateY(${(1 - panelsIn) * 50}px) scale(${0.96 + panelsIn * 0.04})`}}>
        <Glass style={{width: '50%', minHeight: 830, padding: '34px 28px', opacity: 1 - focus * 0.28, borderColor: alpha(alphaTheme.colors.steel, 0.56), transform: `scale(${1 - focus * 0.025})`}}>
          <Display size={32} color={alphaTheme.colors.steel}>A</Display><Body size={48} color={alphaTheme.colors.white} style={{marginTop: 34}}>HÃY GIẢI THÍCH<br/>VỀ TẾ BÀO</Body>
          <div style={{marginTop: 80, display: 'grid', gap: 20}}>{Array.from({length: 5}, (_, index) => <div key={index} style={{height: 18, width: `${(94 - index * 8) * scan}%`, borderRadius: 12, background: alpha(alphaTheme.colors.steel, 0.34)}}/>)}</div>
          <Body size={40} style={{marginTop: 70}}>CÂU TRẢ LỜI<br/>KHÁ CHUNG CHUNG</Body>
        </Glass>
        <Glass style={{width: '50%', minHeight: 830, padding: '34px 28px', borderColor: alpha(alphaTheme.colors.green, 0.7), transform: `scale(${0.98 + focus * 0.02})`, boxShadow: focus > 0.5 ? `0 24px 78px ${alpha(alphaTheme.colors.green, 0.2)}` : undefined}}>
          <Display size={32} color={alphaTheme.colors.green}>B</Display>
          <div data-parallel="context-details" style={{marginTop: 34, display: 'grid', gap: 22}}>{['HỌC SINH LỚP 8', 'ĐÃ HỌC QUA', 'ĐANG VƯỚNG MẮC'].map((text) => <Pill key={text} accent={alphaTheme.colors.green} style={{padding: '20px 16px'}}><Body size={38} color={alphaTheme.colors.white}>{text}</Body></Pill>)}</div>
          <Body size={40} color={alphaTheme.colors.white} style={{marginTop: 64}}>CHÍNH XÁC VÀ<br/><span style={{color: alphaTheme.colors.green}}>GẦN GŨI HƠN</span></Body>
        </Glass>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const MindReadingScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const diagram = sceneIn(frame, fps, 0.35);
  const blocked = mix(frame, [answerFrameAt(1.5, fps), answerFrameAt(2.4, fps)], [0, 1], alphaTheme.ease.inOut);
  const feed = spring({frame: frame - answerFrameAt(3.2, fps), fps, config: alphaTheme.spring.weighty});
  return <SceneShell durationInFrames={durationInFrames} label="GIỚI HẠN CỦA AI">
    <SafeStage style={{top: 340, textAlign: 'center'}}>
      <div data-motion-entry="mind" style={enterStyle(intro)}><Display size={78}>AI KHÔNG ĐỌC ĐƯỢC</Display><GradientWord size={104}>SUY NGHĨ CỦA BẠN</GradientWord></div>
      <div style={{position: 'relative', height: 770, marginTop: 60, opacity: diagram, transform: `translateY(${(1 - diagram) * 52}px) scale(${0.94 + diagram * 0.06})`}}>
        <div style={{position: 'absolute', left: 25, top: 80, width: 390, height: 360, borderRadius: '50%', border: `3px dashed ${alpha(alphaTheme.colors.steel, 0.7)}`, display: 'grid', placeItems: 'center'}}><Body size={48}>SUY NGHĨ</Body></div>
        <Glass style={{position: 'absolute', right: 20, top: 120, width: 360, height: 290, display: 'grid', placeItems: 'center', borderColor: alpha(alphaTheme.colors.cyan, 0.62)}}><Display size={90} color={alphaTheme.colors.cyan}>AI</Display></Glass>
        <div data-semantic="access-lock" style={{position: 'absolute', left: 419, top: 188, width: 150, height: 150, display: 'grid', placeItems: 'center', opacity: blocked, transform: `scale(${0.76 + blocked * 0.24})`}}>
          <div style={{position: 'absolute', left: -34, top: 73, width: 42, height: 3, borderRadius: 4, background: alpha(alphaTheme.colors.steel, 0.42)}}/>
          <div style={{position: 'absolute', right: -34, top: 73, width: 42, height: 3, borderRadius: 4, background: alpha(alphaTheme.colors.steel, 0.42)}}/>
          <div style={{width: 116, height: 116, borderRadius: '50%', border: `3px solid ${alpha(alphaTheme.colors.cyan, 0.7)}`, background: alpha(alphaTheme.colors.surfaceAlt, 0.98), boxShadow: `0 0 30px ${alpha(alphaTheme.colors.cyan, 0.18)}`, display: 'grid', placeItems: 'center'}}>
            <svg width="54" height="64" viewBox="0 0 54 64" aria-hidden="true"><path d="M13 27V18C13 8 19 3 27 3s14 5 14 15v9" fill="none" stroke={alphaTheme.colors.cyan} strokeWidth="6" strokeLinecap="round"/><rect x="5" y="25" width="44" height="34" rx="10" fill={alpha(alphaTheme.colors.cyan, 0.18)} stroke={alphaTheme.colors.cyan} strokeWidth="4"/><circle cx="27" cy="42" r="4" fill={alphaTheme.colors.white}/></svg>
          </div>
        </div>
        <div style={{position: 'absolute', left: 70, right: 70, top: 520, display: 'flex', gap: 18, justifyContent: 'center'}}>{['TRÌNH ĐỘ', 'ĐÃ BIẾT', 'CHƯA HIỂU'].map((text, index) => <Pill key={text} accent={alphaTheme.colors.green} style={{flex: 1, opacity: feed, transform: `translate(${(1 - feed) * (-210 + index * 210)}px, ${(1 - feed) * 80}px) scale(${0.85 + feed * 0.15})`}}><Body size={34} color={alphaTheme.colors.white}>{text}</Body></Pill>)}</div>
      </div>
      <Body size={48} color={alphaTheme.colors.white}>CHẤT LƯỢNG PHỤ THUỘC VÀO<br/><span style={{color: alphaTheme.colors.green}}>BỐI CẢNH BẠN CUNG CẤP</span></Body>
    </SafeStage>
  </SceneShell>;
};

export const NextLessonScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const verify = mix(frame, [answerFrameAt(0.8, fps), answerFrameAt(2.5, fps)], [0, 1], alphaTheme.ease.inOut);
  const nextAt = answerFrameAt(ANSWER_CUE_SECONDS[13] - ANSWER_CUE_SECONDS[12], fps);
  const next = spring({frame: frame - nextAt, fps, config: alphaTheme.spring.smooth});
  return <SceneShell durationInFrames={durationInFrames} label="CÂU HỎI CÒN LẠI">
    <SafeStage style={{top: 340, textAlign: 'center'}}>
      <div data-motion-entry="next" style={{opacity: intro * (1 - next), transform: `translateY(${(1 - intro) * 52 - 70 * next}px) scale(${0.94 + intro * 0.06 - next * 0.04})`}}>
        <Glass style={{position: 'relative', overflow: 'hidden', padding: '44px 38px', minHeight: 310, display: 'grid', placeItems: 'center'}}><Body size={48} color={alphaTheme.colors.white}>MỘT CÂU TRẢ LỜI RẤT TRÔI CHẢY VÀ TỰ TIN...</Body><div style={{position: 'absolute', left: 0, bottom: 0, height: 5, width: `${verify * 100}%`, background: alphaTheme.colors.cyan, boxShadow: `0 0 26px ${alphaTheme.colors.cyan}`}}/></Glass>
        <div style={{marginTop: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}><Display size={72}>TRÔI CHẢY</Display><Display size={92} color={alphaTheme.colors.cyan}>≠</Display><GradientWord size={100}>LUÔN ĐÚNG</GradientWord></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, opacity: next, transform: `translateY(${(1 - next) * 65}px) scale(${0.92 + next * 0.08})`}}>
        <Display size={46} color={alphaTheme.colors.cyan} style={{letterSpacing: 4}}>BÀI 3</Display>
        <Glass style={{marginTop: 62, padding: '58px 38px', borderColor: alpha(alphaTheme.colors.cyan, 0.5)}}>
          <Display size={77}>VÌ SAO AI TRẢ LỜI</Display>
          <GradientWord tone="blue" size={88} style={{marginTop: 20}}>RẤT TỰ TIN</GradientWord>
          <Display size={72} style={{marginTop: 24}}>NHƯNG VẪN CÓ THỂ SAI?</Display>
        </Glass>
        <Body size={32} style={{marginTop: 90, letterSpacing: 3}}>ALPHA INTELLIGENCE • HỌC CHỦ ĐỘNG CÙNG AI</Body>
      </div>
    </SafeStage>
  </SceneShell>;
};
