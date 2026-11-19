import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Body, Display, Glass, GradientWord, mix, SafeStage, SceneShell} from '../alpha-short/components';
import {alpha, alphaTheme} from '../alpha-short/theme';
import {wrongFrameAt} from './timeline';

type SceneProps = {durationInFrames: number};

const sceneIn = (frame: number, fps: number, delay = 0, preset: keyof typeof alphaTheme.spring = 'snappy') => spring({
  frame: frame - wrongFrameAt(delay, fps),
  fps,
  config: alphaTheme.spring[preset],
});

const enter = (p: number, y = 48): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * y}px) scale(${0.93 + p * 0.07})`,
});

const AccentCard: React.FC<React.PropsWithChildren<{accent?: string; style?: React.CSSProperties}>> = ({children, accent = alphaTheme.colors.cyan, style}) => <Glass style={{
  borderColor: alpha(accent, 0.6),
  background: `linear-gradient(145deg, ${alpha(alphaTheme.colors.surfaceAlt, 0.98)}, ${alpha(accent, 0.07)})`,
  ...style,
}}>{children}</Glass>;

export const BookDossierScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = sceneIn(frame, fps);
  const sheet = sceneIn(frame, fps, 1.55, 'weighty');
  const fill = mix(frame, [wrongFrameAt(3.65, fps), wrongFrameAt(10.7, fps)], [0, 1], alphaTheme.ease.inOut);
  const fields = ['TÊN TÁC GIẢ', 'NĂM XUẤT BẢN', 'NỘI DUNG CHÍNH', '“TRÍCH DẪN”'];
  return <SceneShell durationInFrames={durationInFrames} label="TÌNH HUỐNG MỞ ĐẦU">
    <SafeStage style={{top: 350}}>
      <div style={enter(title)}><Display size={58} color={alphaTheme.colors.cyan}>HÃY THỬ TƯỞNG TƯỢNG...</Display><GradientWord size={96}>HỎI AI VỀ MỘT CUỐN SÁCH</GradientWord></div>
      <AccentCard style={{marginTop: 76, padding: 38, minHeight: 780, position: 'relative', overflow: 'hidden', ...enter(sheet, 72)}}>
        <div style={{display: 'flex', gap: 32, alignItems: 'center'}}>
          <div style={{width: 178, height: 232, borderRadius: 16, border: `3px solid ${alphaTheme.colors.cyan}`, display: 'grid', placeItems: 'center', boxShadow: `0 0 34px ${alpha(alphaTheme.colors.cyan, 0.24)}`}}><Display size={78}>?</Display></div>
          <div><Body size={32}>HỒ SƠ CUỐN SÁCH</Body><Display size={54}>CÂU TRẢ LỜI<br/>ĐẦY ĐỦ</Display></div>
        </div>
        <div style={{marginTop: 50, display: 'grid', gap: 24}}>
          {fields.map((field, index) => {
            const local = mix(fill, [index * 0.2, index * 0.2 + 0.34], [0, 1], alphaTheme.ease.out);
            return <div key={field} style={{display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'center', opacity: 0.28 + local * 0.72}}>
              <Body size={32} color={index === 3 ? alphaTheme.colors.green : alphaTheme.colors.muted}>{field}</Body>
              <div style={{height: 20, borderRadius: 12, background: alpha(alphaTheme.colors.steel, 0.18), overflow: 'hidden'}}><div style={{height: '100%', width: `${local * (75 + index * 5)}%`, background: index === 3 ? alphaTheme.colors.green : alphaTheme.colors.cyan, boxShadow: `0 0 18px ${alpha(index === 3 ? alphaTheme.colors.green : alphaTheme.colors.cyan, 0.35)}`}}/></div>
            </div>;
          })}
        </div>
        <div style={{position: 'absolute', left: `${fill * 112 - 8}%`, top: 0, bottom: 0, width: '7%', background: `linear-gradient(90deg, transparent, ${alpha(alphaTheme.colors.white, 0.12)}, transparent)`, transform: 'skewX(-12deg)'}}/>
      </AccentCard>
    </SafeStage>
  </SceneShell>;
};
export const NonexistentScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const issue = sceneIn(frame, fps);
  const scan = mix(frame, [wrongFrameAt(1.7, fps), wrongFrameAt(3.9, fps)], [0, 1], alphaTheme.ease.inOut);
  const fail = sceneIn(frame, fps, 2.62, 'weighty');
  const question = sceneIn(frame, fps, 5.18, 'smooth');
  return <SceneShell durationInFrames={durationInFrames} label="KIỂM TRA SỰ TỒN TẠI">
    <SafeStage style={{top: 370, textAlign: 'center'}}>
      <div style={enter(issue)}><Body size={40}>CHỈ CÓ MỘT VẤN ĐỀ NHỎ...</Body></div>
      <AccentCard style={{marginTop: 70, height: 360, padding: 38, position: 'relative', overflow: 'hidden', display: 'grid', placeItems: 'center', ...enter(issue, 34)}}>
        <div style={{opacity: 1 - fail}}><Body size={36}>ĐANG ĐỐI CHIẾU CƠ SỞ DỮ LIỆU</Body><div style={{height: 8, width: 600, marginTop: 38, borderRadius: 10, background: alpha(alphaTheme.colors.steel, 0.2)}}><div style={{height: '100%', width: `${scan * 100}%`, background: alphaTheme.colors.cyan, boxShadow: `0 0 22px ${alphaTheme.colors.cyan}`}}/></div></div>
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: fail, background: alpha(alphaTheme.colors.ink, 0.82), transform: `scale(${0.82 + fail * 0.18})`}}><GradientWord size={104}>KHÔNG TỒN TẠI</GradientWord></div>
      </AccentCard>
      <div style={{marginTop: 88, ...enter(question)}}><Display size={54}>TẠI SAO AI CÓ THỂ</Display><GradientWord size={92} style={{whiteSpace: 'nowrap'}} textStyle={{fontFamily: alphaTheme.fonts.body, fontWeight: 700, lineHeight: 1.24, letterSpacing: -4, paddingTop: 18, paddingBottom: 18}}>SAI — VẪN TỰ TIN?</GradientWord></div>
    </SafeStage>
  </SceneShell>;
};
export const PredictionPurposeScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const recap = sceneIn(frame, fps);
  const title = sceneIn(frame, fps, 1.086, 'weighty');
  const contrast = sceneIn(frame, fps, 5.923, 'weighty');
  const steps = [
    {label: 'NGỮ CẢNH', at: 4.301},
    {label: 'DỰ ĐOÁN', at: 4.72},
    {label: 'TỪ MỚI', at: 5.14},
    {label: 'CÂU TRẢ LỜI', at: 5.56},
  ] as const;
  return <SceneShell durationInFrames={durationInFrames} label="CƠ CHẾ CỐT LÕI">
    <SafeStage style={{top: 360}}>
      <div style={enter(recap)}><Body size={38} color={alphaTheme.colors.cyan}>NHƯ Ở BÀI TRƯỚC...</Body></div>
      <div style={{marginTop: 18, ...enter(title)}}><Display size={78}>AI DỰ ĐOÁN</Display><GradientWord size={88} style={{whiteSpace: 'nowrap'}}>TỪ TIẾP THEO</GradientWord></div>
      <div style={{marginTop: 90, display: 'flex', gap: 18, alignItems: 'center'}}>
        {steps.map(({label, at}, index) => {
          const box = sceneIn(frame, fps, at);
          const arrow = index < steps.length - 1 ? sceneIn(frame, fps, at + 0.24) : 0;
          return <React.Fragment key={label}><AccentCard style={{flex: 1, height: 170, display: 'grid', placeItems: 'center', textAlign: 'center', opacity: box, transform: `translateY(${(1 - box) * 34}px) scale(${0.9 + box * 0.1})`}}><Display size={30} color={index === 3 ? alphaTheme.colors.green : alphaTheme.colors.white}>{label}</Display></AccentCard>{index < steps.length - 1 && <Display size={38} color={alphaTheme.colors.cyan} style={{opacity: arrow, transform: `translateX(${(1 - arrow) * -18}px) scale(${0.75 + arrow * 0.25})`}}>→</Display>}</React.Fragment>;
        })}
      </div>
      <div data-parallel="purpose-vs-verification" style={{display: 'flex', gap: 26, marginTop: 120, opacity: contrast, transform: `translateY(${(1 - contrast) * 58}px)`}}>
        <AccentCard accent={alphaTheme.colors.green} style={{flex: 1, minHeight: 310, padding: 36}}><Body size={34}>MỤC TIÊU</Body><Display size={58} color={alphaTheme.colors.green} style={{marginTop: 38}}>MẠCH LẠC</Display><div style={{marginTop: 42, height: 10, borderRadius: 8, background: alphaTheme.colors.green}}/></AccentCard>
        <AccentCard accent={alphaTheme.colors.steel} style={{flex: 1, minHeight: 310, padding: 36, opacity: 0.6}}><Body size={34}>KHÔNG TỰ ĐỘNG</Body><Display size={50} style={{marginTop: 38}}>KIỂM CHỨNG</Display><div style={{marginTop: 42, height: 10, borderRadius: 8, background: `repeating-linear-gradient(90deg, ${alphaTheme.colors.steel} 0 18px, transparent 18px 34px)`}}/></AccentCard>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const HallucinationScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const specialCase = sceneIn(frame, fps, 1.905, 'smooth');
  const assemble = sceneIn(frame, fps, 3.704, 'weighty');
  const evidence = sceneIn(frame, fps, 10.859, 'smooth');
  const reveal = sceneIn(frame, fps, 10.859, 'snappy');
  const blocks = [
    {label: 'TÊN NGƯỜI', at: 6.797},
    {label: 'CON SỐ', at: 7.756},
    {label: 'TRÍCH DẪN', at: 8.518},
  ] as const;
  return <SceneShell durationInFrames={durationInFrames} label="KHI THIẾU DỮ LIỆU">
    <SafeStage style={{top: 350}}>
      <div style={enter(intro)}><Display size={64}>THIẾU DỮ LIỆU?</Display></div>
      <div style={{marginTop: 12, opacity: specialCase, transform: `translateY(${(1 - specialCase) * 24}px)`}}><Body size={38}>HOẶC CÂU HỎI QUÁ ĐẶC THÙ...</Body></div>
      <div style={{marginTop: 20, ...enter(assemble, 38)}}><GradientWord size={92}>AI VẪN GHÉP<br/>MỘT ĐÁP ÁN</GradientWord></div>
      <div style={{marginTop: 85, display: 'grid', gap: 24}}>
        {blocks.map(({label, at}, index) => {
          const p = sceneIn(frame, fps, at);
          return <AccentCard key={label} style={{height: 175, padding: '30px 36px', display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * (index % 2 ? 100 : -100)}px) scale(${0.94 + p * 0.06})`}}><div style={{width: 54, height: 54, borderRadius: 12, background: alpha(alphaTheme.colors.cyan, 0.15), border: `2px solid ${alphaTheme.colors.cyan}`, display: 'grid', placeItems: 'center'}}><Body size={30}>+</Body></div><Display size={44}>{label}</Display><Body size={32} color={alphaTheme.colors.green} style={{marginLeft: 'auto'}}>NGHE HỢP LÝ</Body></AccentCard>;
        })}
      </div>
      <div style={{marginTop: 80, textAlign: 'center'}}><Body size={38} style={{opacity: evidence, transform: `translateY(${(1 - evidence) * 24}px)`}}>NHƯNG KHÔNG CÓ BẰNG CHỨNG</Body><div style={{opacity: reveal, transform: `scale(${0.72 + reveal * 0.28}) rotate(${(1 - reveal) * -3}deg)`}}><GradientWord size={118}>“ẢO GIÁC AI”</GradientWord></div></div>
    </SafeStage>
  </SceneShell>;
};

export const RiskGridScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const grid = sceneIn(frame, fps, 2.45, 'weighty');
  const focusTimes = [2.862, 4.679, 6.287, 9.348];
  const labels = ['CÂU HỎI\nMƠ HỒ', 'THÔNG TIN\nĐÃ CŨ', 'NGUỒN / SỐ LIỆU\nQUÁ CHI TIẾT', 'GIẢ ĐỊNH\nSAI'];
  return <SceneShell durationInFrames={durationInFrames} label="BỐN TÌNH HUỐNG RỦI RO">
    <SafeStage style={{top: 345}}>
      <div style={enter(intro)}><Display size={54}>AI DỄ TRẢ LỜI SAI TRONG</Display><GradientWord size={108}>4 TÌNH HUỐNG</GradientWord></div>
      <div data-parallel="four-risk-situations" style={{marginTop: 90, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, opacity: grid, transform: `translateY(${(1 - grid) * 54}px) scale(${0.94 + grid * 0.06})`}}>
        {labels.map((label, index) => {
          const active = mix(frame, [wrongFrameAt(focusTimes[index], fps), wrongFrameAt(focusTimes[index] + 0.45, fps)], [0, 1], alphaTheme.ease.out) * (1 - mix(frame, [wrongFrameAt((focusTimes[index + 1] ?? 13), fps), wrongFrameAt((focusTimes[index + 1] ?? 13) + 0.35, fps)], [0, 1], alphaTheme.ease.in));
          return <AccentCard key={label} accent={active > 0.1 ? alphaTheme.colors.green : alphaTheme.colors.steel} style={{height: 360, padding: 32, display: 'grid', alignContent: 'space-between', transform: `scale(${1 + active * 0.035})`, boxShadow: active > 0.1 ? `0 0 48px ${alpha(alphaTheme.colors.green, 0.22)}` : undefined}}><Display size={46} color={active > 0.1 ? alphaTheme.colors.green : alphaTheme.colors.white}>{String(index + 1).padStart(2, '0')}</Display><Display size={42} style={{whiteSpace: 'pre-line'}}>{label}</Display></AccentCard>;
        })}
      </div>
    </SafeStage>
  </SceneShell>;
};

export const ConfidenceScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const pair = sceneIn(frame, fps, 1.55, 'weighty');
  const verdict = sceneIn(frame, fps, 7.1, 'smooth');
  return <SceneShell durationInFrames={durationInFrames} label="GIỌNG VĂN KHÔNG PHẢI BẰNG CHỨNG">
    <SafeStage style={{top: 345, textAlign: 'center'}}>
      <div style={enter(intro)}><Display size={53}>CÙNG MỘT GIỌNG VĂN</Display><GradientWord size={103}>CHUYÊN NGHIỆP & TỰ TIN</GradientWord></div>
      <div data-parallel="true-false-same-tone" style={{marginTop: 92, display: 'flex', gap: 26, opacity: pair, transform: `translateY(${(1 - pair) * 58}px)`}}>
        {['THÔNG TIN ĐÚNG', 'THÔNG TIN SAI'].map((label, index) => <AccentCard key={label} accent={index ? alphaTheme.colors.steel : alphaTheme.colors.green} style={{flex: 1, minHeight: 470, padding: 34, textAlign: 'left'}}><Display size={38} color={index ? alphaTheme.colors.steel : alphaTheme.colors.green}>{label}</Display>{Array.from({length: 6}, (_, line) => <div key={line} style={{height: line === 0 ? 18 : 13, width: `${92 - line * 6}%`, borderRadius: 9, marginTop: line === 0 ? 62 : 24, background: line === 0 ? alphaTheme.colors.white : alpha(alphaTheme.colors.muted, 0.52)}}/>)}<Body size={32} style={{marginTop: 48}}>RÕ RÀNG · CÓ CẤU TRÚC · CHẮC CHẮN</Body></AccentCard>)}
      </div>
      <div style={{marginTop: 72, opacity: verdict, transform: `scale(${0.82 + verdict * 0.18})`}}><GradientWord size={80} style={{whiteSpace: 'nowrap'}}>TỰ TIN ≠ ĐÁNG TIN</GradientWord></div>
    </SafeStage>
  </SceneShell>;
};

export const ChecklistScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const list = sceneIn(frame, fps, 5.7, 'weighty');
  const focusTimes = [6.269, 9.345, 12.189];
  const labels = ['THÔNG TIN ĐÃ\nTHAY ĐỔI CHƯA?', 'NGUỒN TRÍCH DẪN\nCÓ THẬT KHÔNG?', 'GIẢ ĐỊNH TRONG CÂU HỎI\nĐÃ CHUẨN CHƯA?'];
  return <SceneShell durationInFrames={durationInFrames} label="DỪNG LẠI KIỂM TRA">
    <SafeStage style={{top: 345}}>
      <div style={enter(intro)}><Display size={62}>TRƯỚC KHI ĐƯA VÀO BÀI TẬP</Display><GradientWord size={112}>KIỂM TRA 3 ĐIỀU</GradientWord></div>
      <div data-parallel="three-checks" style={{marginTop: 85, display: 'grid', gap: 26, opacity: list, transform: `translateY(${(1 - list) * 62}px)`}}>
        {labels.map((label, index) => {
          const start = focusTimes[index];
          const end = focusTimes[index + 1] ?? 16.4;
          const active = mix(frame, [wrongFrameAt(start, fps), wrongFrameAt(start + 0.35, fps)], [0, 1], alphaTheme.ease.out) * (1 - mix(frame, [wrongFrameAt(end, fps), wrongFrameAt(end + 0.3, fps)], [0, 1], alphaTheme.ease.in));
          return <AccentCard key={label} accent={active > 0.1 ? alphaTheme.colors.green : alphaTheme.colors.steel} style={{minHeight: 240, padding: 34, display: 'grid', gridTemplateColumns: '94px 1fr 56px', alignItems: 'center', gap: 24, transform: `translateX(${active * 16}px)`, boxShadow: active > 0.1 ? `0 0 44px ${alpha(alphaTheme.colors.green, 0.2)}` : undefined}}><Display size={48} color={active > 0.1 ? alphaTheme.colors.green : alphaTheme.colors.steel}>{index + 1}</Display><Display size={42} style={{whiteSpace: 'pre-line'}}>{label}</Display><div style={{width: 40, height: 40, borderRadius: 40, border: `3px solid ${active > 0.1 ? alphaTheme.colors.green : alphaTheme.colors.steel}`, transform: `scale(${0.85 + active * 0.15})`}}/></AccentCard>;
        })}
      </div>
    </SafeStage>
  </SceneShell>;
};

export const VerifyGateScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const gate = sceneIn(frame, fps, 3.2, 'weighty');
  const move = mix(frame, [wrongFrameAt(3.3, fps), wrongFrameAt(6.8, fps)], [0, 1], alphaTheme.ease.inOut);
  return <SceneShell durationInFrames={durationInFrames} label="DÙNG ĐÚNG MỨC ĐỘ TIN CẬY">
    <SafeStage style={{top: 355, textAlign: 'center'}}>
      <div style={enter(intro)}><Display size={56}>KHÔNG PHẢI NGHI NGỜ TẤT CẢ</Display><GradientWord size={104}>BIẾT KHI NÀO CẦN KIỂM TRA</GradientWord></div>
      <div style={{marginTop: 110, position: 'relative', height: 570, opacity: gate}}>
        <div style={{position: 'absolute', left: 110, right: 110, top: 240, height: 12, borderRadius: 12, background: `linear-gradient(90deg, ${alphaTheme.colors.steel}, ${alphaTheme.colors.green})`}}/>
        <div style={{position: 'absolute', left: 68, top: 80}}><Body size={34}>DÙNG ĐỂ</Body><Display size={52}>THAM KHẢO</Display></div>
        <div style={{position: 'absolute', right: 68, top: 80, textAlign: 'right'}}><Body size={34}>DỪNG LẠI</Body><Display size={52} color={alphaTheme.colors.green}>TỰ XÁC MINH</Display></div>
        <div style={{position: 'absolute', left: 80 + move * 700, top: 188, width: 116, height: 116, borderRadius: 70, background: alphaTheme.colors.white, border: `12px solid ${move > 0.64 ? alphaTheme.colors.green : alphaTheme.colors.steel}`, boxShadow: `0 0 46px ${alpha(move > 0.64 ? alphaTheme.colors.green : alphaTheme.colors.cyan, 0.42)}`, transform: `scale(${1 + Math.sin(frame / 8) * 0.025})`}}/>
        <Body size={36} style={{position: 'absolute', left: 130, right: 130, top: 390}}>MỨC ĐỘ RỦI RO QUYẾT ĐỊNH<br/>BƯỚC TIẾP THEO</Body>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const NextLessonScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = sceneIn(frame, fps);
  const choice = sceneIn(frame, fps, 2.65, 'weighty');
  const sweep = mix(frame, [wrongFrameAt(3.4, fps), wrongFrameAt(6.7, fps)], [0, 1], alphaTheme.ease.inOut);
  return <SceneShell durationInFrames={durationInFrames} label="BÀI TIẾP THEO">
    <SafeStage style={{top: 395, textAlign: 'center'}}>
      <div style={enter(intro)}><Body size={40} color={alphaTheme.colors.cyan}>BÀI TIẾP THEO</Body><Display size={54} style={{marginTop: 22}}>BẠN ĐANG THỰC SỰ</Display></div>
      <div data-parallel="learn-or-avoid" style={{marginTop: 100, display: 'grid', gap: 30, opacity: choice, transform: `translateY(${(1 - choice) * 62}px) scale(${0.94 + choice * 0.06})`}}>
        <AccentCard accent={alphaTheme.colors.green} style={{height: 300, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden'}}><GradientWord size={96}>DÙNG AI ĐỂ HỌC</GradientWord><div style={{position: 'absolute', left: `${sweep * 115 - 12}%`, top: 0, bottom: 0, width: '9%', background: `linear-gradient(90deg, transparent, ${alpha(alphaTheme.colors.green, 0.18)}, transparent)`, transform: 'skewX(-12deg)'}}/></AccentCard>
        <Display size={54} color={alphaTheme.colors.muted}>HAY</Display>
        <AccentCard accent={alphaTheme.colors.steel} style={{height: 300, display: 'grid', placeItems: 'center'}}><Display size={74}>NÉ PHẦN KHÓ?</Display></AccentCard>
      </div>
    </SafeStage>
  </SceneShell>;
};

