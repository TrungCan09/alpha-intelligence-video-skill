import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  Body,
  Display,
  Enter,
  Glass,
  GradientWord,
  mix,
  SafeStage,
  SceneShell,
} from './components';
import {alpha, alphaTheme} from './theme';
import {CUE_SECONDS, frameAt} from './timeline';

type SceneProps = {durationInFrames: number};

const CheckMark: React.FC<{color?: string}> = ({color = alphaTheme.colors.green}) => (
  <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden>
    <circle cx="40" cy="40" r="35" fill={alpha(color, 0.12)} stroke={color} strokeWidth="3"/>
    <path d="M22 41 L34 53 L59 27" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProductGlyph: React.FC<{kind: 'article' | 'slide' | 'code'}> = ({kind}) => {
  if (kind === 'code') {
    return <Display size={46} color={alphaTheme.colors.green} style={{letterSpacing: -2}}>&lt;/&gt;</Display>;
  }
  return <div style={{
    width: 68,
    height: 58,
    border: `3px solid ${alphaTheme.colors.green}`,
    borderRadius: kind === 'article' ? 8 : 4,
    padding: 10,
    display: 'grid',
    gap: 7,
  }}>
    {Array.from({length: kind === 'article' ? 3 : 2}, (_, index) => <i key={index} style={{
      height: 4,
      borderRadius: 5,
      background: index === 0 ? alphaTheme.colors.green : alpha(alphaTheme.colors.green, 0.5),
    }}/>) }
  </div>;
};

export const HookScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lock = spring({frame, fps, config: alphaTheme.spring.smooth});
  const reveal = spring({frame: frame - frameAt(2.55, fps), fps, config: alphaTheme.spring.weighty});
  return <SceneShell durationInFrames={durationInFrames} label="HỌC CHỦ ĐỘNG CÙNG AI">
    <SafeStage style={{top: 350}}>
      <div style={{
        transform: `translateY(${(1 - lock) * 56}px) scale(${0.92 + lock * 0.08})`,
        opacity: lock,
      }}>
        <Body size={48} color={alphaTheme.colors.green} style={{letterSpacing: 3}}>THỰC RA THÌ...</Body>
        <Glass style={{
          marginTop: 42,
          padding: '50px 44px',
          borderColor: alpha(alphaTheme.colors.cyan, 0.62),
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <CheckMark/>
            <Display size={94}>XONG BÀI<br/>NHỜ AI</Display>
          </div>
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            background: `linear-gradient(90deg, ${alphaTheme.colors.cyan}, ${alphaTheme.colors.green})`,
            transform: `scaleX(${lock})`,
            transformOrigin: 'left',
          }}/>
        </Glass>
      </div>
      <div style={{
        marginTop: 78,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 42}px) scale(${0.94 + reveal * 0.06})`,
      }}>
        <Display size={52}>CHƯA CHẮC CÓ NGHĨA LÀ</Display>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 18}}>
          <Display size={90} color={alphaTheme.colors.cyan}>≠</Display>
          <GradientWord size={116}>ĐÃ HỌC.</GradientWord>
        </div>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const ProductScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const assemble = spring({frame: frame - frameAt(0.25, fps), fps, config: alphaTheme.spring.smooth});
  const reflection = spring({frame: frame - frameAt(2.55, fps), fps, config: alphaTheme.spring.weighty});
  const products = [
    {kind: 'article' as const, label: 'BÀI VIẾT'},
    {kind: 'slide' as const, label: 'SLIDE'},
    {kind: 'code' as const, label: 'CODE'},
  ];
  return <SceneShell durationInFrames={durationInFrames} label="SẢN PHẨM ≠ NĂNG LỰC">
    <SafeStage style={{top: 330}}>
      <Enter>
        <Display size={84}>MỘT SẢN PHẨM<br/><span style={{color: alphaTheme.colors.cyan}}>HOÀN CHỈNH</span></Display>
      </Enter>
      <div data-parallel="products" style={{display: 'flex', gap: 18, marginTop: 110}}>
        {products.map(({kind, label}) => <Glass key={label} style={{
          flex: 1,
          height: 260,
          padding: '34px 18px',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          borderColor: alpha(alphaTheme.colors.green, 0.5),
          opacity: assemble,
          transform: `translateY(${(1 - assemble) * 68}px) scale(${0.94 + assemble * 0.06})`,
        }}>
          <ProductGlyph kind={kind}/>
          <Display size={32} style={{letterSpacing: 1}}>{label}</Display>
          <Body size={32} color={alphaTheme.colors.green}>ĐÃ XONG</Body>
        </Glass>)}
      </div>
      <div style={{
        marginTop: 76,
        position: 'relative',
        opacity: reflection,
        transform: `translateY(${(1 - reflection) * 55}px) scale(${0.95 + reflection * 0.05})`,
      }}>
        <div style={{
          position: 'absolute',
          inset: -40,
          background: `radial-gradient(ellipse at center, ${alpha(alphaTheme.colors.blue, 0.32)}, transparent 68%)`,
          filter: 'blur(22px)',
        }}/>
        <Display size={48} style={{position: 'relative'}}>ĐÔI KHI CHỈ TẠO RA</Display>
        <GradientWord tone="blue" size={90} style={{marginTop: 10}}>CẢM GIÁC HIỂU GIẢ.</GradientWord>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const CapabilityScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = spring({frame: frame - frameAt(0.3, fps), fps, config: alphaTheme.spring.smooth});
  const scan = mix(frame, [frameAt(1.4, fps), frameAt(6.1, fps)], [-240, 1080], alphaTheme.ease.inOut);
  const items = [
    ['HIỂU KIẾN THỨC', alphaTheme.colors.cyan],
    ['TỰ TIN GIẢI THÍCH', alphaTheme.colors.steel],
    ['TỰ GIẢI BÀI TƯƠNG TỰ', alphaTheme.colors.green],
  ] as const;
  return <SceneShell durationInFrames={durationInFrames} label="NĂNG LỰC THẬT">
    <SafeStage style={{top: 320}}>
      <Enter>
        <Display size={82} style={{lineHeight: 1.18}}>THỰC SỰ<br/><span style={{color: alphaTheme.colors.green}}>NẮM VỮNG</span> LÀ...</Display>
      </Enter>
      <div style={{position: 'relative', marginTop: 78, height: 820}}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 270,
          height: 270,
          marginLeft: -135,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          background: `radial-gradient(circle, ${alpha(alphaTheme.colors.green, 0.18)}, ${alpha(alphaTheme.colors.surface, 0.96)} 67%)`,
          border: `2px solid ${alpha(alphaTheme.colors.green, 0.74)}`,
          boxShadow: `0 0 54px ${alpha(alphaTheme.colors.green, 0.23)}`,
          opacity: open,
          transform: `scale(${0.76 + open * 0.24})`,
        }}>
          <Display size={42} color={alphaTheme.colors.green}>NĂNG LỰC</Display>
        </div>
        <div data-parallel="capabilities" style={{position: 'absolute', left: 0, right: 0, top: 330}}>
          {items.map(([label, accent], index) => <Glass key={label} style={{
            position: 'relative',
            height: 150,
            marginBottom: 26,
            padding: '28px 34px',
            overflow: 'hidden',
            borderColor: alpha(accent, 0.56),
            opacity: open,
            transform: `translateX(${(1 - open) * (index === 1 ? 72 : -72)}px) scale(${0.96 + open * 0.04})`,
          }}>
            <div style={{
              position: 'absolute',
              left: scan,
              top: -60,
              width: 110,
              height: 250,
              transform: 'rotate(16deg)',
              background: `linear-gradient(90deg, transparent, ${alpha(alphaTheme.colors.white, 0.16)}, transparent)`,
              filter: 'blur(8px)',
            }}/>
            <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
              <div style={{width: 22, height: 22, borderRadius: '50%', background: accent, boxShadow: `0 0 20px ${accent}`}}/>
              <Body size={48} color={alphaTheme.colors.white}>{label}</Body>
            </div>
          </Glass>)}
        </div>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const ApproachScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const axis = spring({frame: frame - frameAt(0.12, fps), fps, config: alphaTheme.spring.weighty});
  const panels = spring({frame: frame - frameAt(0.65, fps), fps, config: alphaTheme.spring.smooth});
  return <SceneShell durationInFrames={durationInFrames} label="CỐT LÕI">
    <SafeStage style={{top: 420, textAlign: 'center'}}>
      <div style={{opacity: axis, transform: `scale(${0.86 + axis * 0.14}) rotate(${(1 - axis) * -4}deg)`}}>
        <Display size={48} color={alphaTheme.colors.cyan} style={{letterSpacing: 4}}>ĐIỂM KHÁC BIỆT</Display>
        <GradientWord size={102} style={{marginTop: 24}}>CÁCH TIẾP CẬN.</GradientWord>
      </div>
      <div style={{position: 'relative', marginTop: 112, height: 480}}>
        <div style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 220,
          height: 12,
          borderRadius: 20,
          background: `linear-gradient(90deg, ${alphaTheme.colors.steel}, ${alphaTheme.colors.white}, ${alphaTheme.colors.green})`,
          transform: `scaleX(${axis})`,
          boxShadow: `0 0 24px ${alpha(alphaTheme.colors.cyan, 0.35)}`,
        }}/>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 175,
          width: 100,
          height: 100,
          marginLeft: -50,
          borderRadius: '50%',
          background: alphaTheme.colors.surface,
          border: `3px solid ${alphaTheme.colors.white}`,
          boxShadow: `0 0 30px ${alpha(alphaTheme.colors.white, 0.32)}`,
          transform: `scale(${axis})`,
        }}/>
        <div data-parallel="approaches" style={{position: 'absolute', left: 0, right: 0, top: 20, display: 'flex', gap: 40}}>
          {[
            ['A', 'PHÓ MẶC', alphaTheme.colors.steel],
            ['B', 'SOI CHIẾU', alphaTheme.colors.green],
          ].map(([letter, label, accent], index) => <Glass key={label} style={{
            flex: 1,
            padding: '30px 24px',
            borderColor: alpha(accent, 0.7),
            opacity: panels,
            transform: `translateX(${(1 - panels) * (index === 0 ? -100 : 100)}px) scale(${0.95 + panels * 0.05})`,
          }}>
            <Display size={32} color={accent}>{letter}</Display>
            <Display size={48} style={{marginTop: 18}}>{label}</Display>
          </Glass>)}
        </div>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const ChoiceScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - frameAt(0.18, fps), fps, config: alphaTheme.spring.smooth});
  const focus = mix(frame, [frameAt(2.15, fps), frameAt(5.2, fps)], [0, 1], alphaTheme.ease.inOut);
  const panels = [
    {letter: 'A', title: 'PHÓ MẶC CHO AI', lines: ['AI LÀM TOÀN BỘ', 'ĐỌC RỒI NỘP'], accent: alphaTheme.colors.steel},
    {letter: 'B', title: 'TỰ NGHĨ TRƯỚC', lines: ['AI SOI CHIẾU', 'TỰ SỬA VÀ HIỂU'], accent: alphaTheme.colors.green},
  ];
  return <SceneShell durationInFrames={durationInFrames} label="BẠN CHỌN CÁCH NÀO?">
    <SafeStage style={{top: 340}}>
      <Display size={84}>PHÓ MẶC<br/><span style={{color: alphaTheme.colors.cyan}}>HAY SOI CHIẾU?</span></Display>
      <div data-parallel="choice-ab" style={{display: 'flex', gap: 24, marginTop: 96, perspective: 900}}>
        {panels.map((panel, index) => {
          const active = index === 0 ? 1 - focus : focus;
          return <Glass key={panel.letter} style={{
            width: '50%',
            minHeight: 560,
            padding: '34px 28px',
            borderColor: alpha(panel.accent, 0.62),
            opacity: enter * (0.68 + active * 0.32),
            transform: `translateX(${(1 - enter) * (index === 0 ? -170 : 170)}px) rotateY(${(1 - enter) * (index === 0 ? -16 : 16)}deg) scale(${0.98 + active * 0.02})`,
            boxShadow: active > 0.6 ? `0 24px 78px ${alpha(panel.accent, 0.22)}` : undefined,
          }}>
            <Display size={32} color={panel.accent}>{panel.letter}</Display>
            <Display size={48} style={{marginTop: 24, lineHeight: 1.16}}>{panel.title}</Display>
            <div style={{marginTop: 48, display: 'grid', gap: 28}}>
              {panel.lines.map((line) => <Body key={line} size={48} color={alphaTheme.colors.white}>{line}</Body>)}
            </div>
          </Glass>;
        })}
      </div>
      <div style={{
        position: 'absolute',
        left: focus * 478,
        top: 1270,
        width: 478,
        height: 5,
        background: `linear-gradient(90deg, transparent, ${alphaTheme.colors.green}, transparent)`,
        opacity: 0.35 + focus * 0.65,
        boxShadow: `0 0 18px ${alphaTheme.colors.green}`,
      }}/>
    </SafeStage>
  </SceneShell>;
};

export const PromptPauseScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const full = 'ĐANG GÕ CÂU LỆNH...';
  const typed = Math.floor(mix(frame, [frameAt(0.15, fps), frameAt(1.65, fps)], [0, full.length], alphaTheme.ease.inOut));
  const freeze = spring({frame: frame - frameAt(2.0, fps), fps, config: alphaTheme.spring.weighty});
  return <SceneShell durationInFrames={durationInFrames} label="TRƯỚC KHI GÕ CÂU LỆNH">
    <SafeStage style={{top: 350}}>
      <Display size={84}>TRƯỚC KHI<br/>GÕ CÂU LỆNH...</Display>
      <Glass style={{
        marginTop: 82,
        padding: '34px 38px',
        borderColor: alpha(alphaTheme.colors.steel, 0.48),
        transform: `scale(${1 - freeze * 0.025})`,
        filter: `saturate(${1 - freeze * 0.42}) brightness(${1 - freeze * 0.12})`,
      }}>
        <Body size={48} color={alphaTheme.colors.white}>
          {full.slice(0, typed)}
          <span style={{
            display: 'inline-block',
            width: 4,
            height: 54,
            marginLeft: 8,
            verticalAlign: 'middle',
            background: alphaTheme.colors.cyan,
            opacity: freeze > 0.85 ? 1 : 0.45 + Math.abs(Math.sin(frame / 7)) * 0.55,
            boxShadow: `0 0 16px ${alphaTheme.colors.cyan}`,
          }}/>
        </Body>
      </Glass>
      <div data-prompt-pulse="contained" style={{position: 'relative', height: 420, marginTop: 110, display: 'grid', placeItems: 'center'}}>
        {[0, 1, 2].map((index) => <div key={index} style={{
          position: 'absolute',
          width: 180 + index * 105,
          height: 180 + index * 105,
          borderRadius: '50%',
          border: `2px solid ${index === 0 ? alphaTheme.colors.cyan : alphaTheme.colors.green}`,
          opacity: freeze * (0.5 - index * 0.1),
          transform: `scale(${0.72 + freeze * (0.36 + index * 0.08)})`,
          boxShadow: `0 0 24px ${alpha(alphaTheme.colors.cyan, 0.18)}`,
        }}/>) }
        <div style={{
          position: 'relative',
          textAlign: 'center',
          opacity: freeze,
          transform: `translateY(${(1 - freeze) * 30}px) scale(${0.86 + freeze * 0.14})`,
        }}>
          <GradientWord size={94}>DỪNG MỘT NHỊP.</GradientWord>
          <Body size={48} color={alphaTheme.colors.white} style={{marginTop: 22}}>VÀ TỰ HỎI BA CÂU.</Body>
        </div>
      </div>
    </SafeStage>
  </SceneShell>;
};

export const QuestionsScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const offsets = [
    0,
    frameAt(CUE_SECONDS[7] - CUE_SECONDS[6], fps),
    frameAt(CUE_SECONDS[8] - CUE_SECONDS[6], fps),
  ];
  const questions = [
    ['01', 'AI đã làm giúp mình phần nào?', alphaTheme.colors.cyan],
    ['02', 'Đâu là quyết định của chính mình?', alphaTheme.colors.steel],
    ['03', 'Mình đã học thêm được gì sau bước đó?', alphaTheme.colors.green],
  ] as const;
  return <SceneShell durationInFrames={durationInFrames} label="BA CÂU TỰ HỎI">
    <div data-sequential="questions" style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 95, top: 520, width: 4, height: 680, borderRadius: 10, background: alpha(alphaTheme.colors.steel, 0.22)}}>
        <div style={{
          width: '100%',
          height: `${mix(frame, [0, offsets[2] + frameAt(0.5, fps)], [0, 100], alphaTheme.ease.inOut)}%`,
          borderRadius: 10,
          background: `linear-gradient(180deg, ${alphaTheme.colors.cyan}, ${alphaTheme.colors.green})`,
          boxShadow: `0 0 18px ${alpha(alphaTheme.colors.cyan, 0.55)}`,
        }}/>
      </div>
      {questions.map(([number, text, accent], index) => {
        const progress = spring({frame: frame - offsets[index], fps, config: alphaTheme.spring.smooth});
        const next = offsets[index + 1] ?? durationInFrames;
        const active = frame >= offsets[index] && frame < next;
        return <Glass key={number} style={{
          position: 'absolute',
          left: 124,
          right: alphaTheme.safe.x,
          top: 430 + index * 310,
          minHeight: 240,
          padding: '32px 34px',
          borderColor: alpha(accent, active ? 0.82 : 0.38),
          opacity: frame < offsets[index] ? 0 : active ? 1 : 0.6,
          transform: `translateX(${(1 - progress) * (index % 2 ? 90 : -90)}px) scale(${0.95 + progress * 0.05})`,
          boxShadow: active ? `0 24px 78px ${alpha(accent, 0.2)}` : undefined,
        }}>
          <div style={{display: 'flex', gap: 26, alignItems: 'flex-start'}}>
            <Display size={32} color={accent} style={{minWidth: 58}}>{number}</Display>
            <Body size={52} color={alphaTheme.colors.white}>{text}</Body>
          </div>
        </Glass>;
      })}
    </div>
  </SceneShell>;
};

export const LeverScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lift = spring({frame: frame - frameAt(0.55, fps), fps, config: alphaTheme.spring.weighty});
  return <SceneShell durationInFrames={durationInFrames} label="DÙNG AI ĐÚNG CÁCH">
    <SafeStage style={{top: 350, textAlign: 'center'}}>
      <Enter>
        <Display size={74}>DÙNG AI NHƯ</Display>
        <GradientWord size={104} style={{marginTop: 12}}>MỘT ĐÒN BẨY.</GradientWord>
      </Enter>
      <div data-geometry="lever" style={{position: 'relative', marginTop: 118, height: 600}}>
        <div style={{
          position: 'absolute',
          left: 75,
          right: 75,
          top: 360,
          height: 18,
          borderRadius: 20,
          background: `linear-gradient(90deg, ${alphaTheme.colors.steel}, ${alphaTheme.colors.white}, ${alphaTheme.colors.green})`,
          boxShadow: `0 0 24px ${alpha(alphaTheme.colors.cyan, 0.34)}`,
          transform: `rotate(${-7 * lift}deg)`,
          transformOrigin: 'center',
          zIndex: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: 410,
          top: 364,
          width: 0,
          height: 0,
          borderLeft: '70px solid transparent',
          borderRight: '70px solid transparent',
          borderBottom: `150px solid ${alphaTheme.colors.blue}`,
          filter: `drop-shadow(0 18px 25px ${alpha(alphaTheme.colors.shadow, 0.5)})`,
          zIndex: 3,
        }}/>
        <div data-lever-stem="left" style={{position: 'absolute', left: 155, top: 330 + lift * 20, width: 4, height: 62, background: alphaTheme.colors.steel, zIndex: 1}}/>
        <div data-lever-stem="right" style={{position: 'absolute', right: 195, top: 208 - lift * 4, width: 4, height: 118, background: alphaTheme.colors.green, zIndex: 1}}/>
        <Glass style={{
          position: 'absolute',
          left: 30,
          top: 184 + lift * 44,
          width: 250,
          padding: '24px 20px',
          textAlign: 'center',
          borderColor: alpha(alphaTheme.colors.steel, 0.58),
          background: alpha(alphaTheme.colors.surface, 0.97),
          zIndex: 4,
        }}>
          <Display size={58} color={alphaTheme.colors.steel}>AI</Display>
        </Glass>
        <Glass style={{
          position: 'absolute',
          right: 0,
          top: 62 - lift * 14,
          width: 390,
          padding: '24px 20px',
          textAlign: 'center',
          borderColor: alpha(alphaTheme.colors.green, 0.76),
          background: alpha(alphaTheme.colors.surface, 0.97),
          boxShadow: `0 24px 72px ${alpha(alphaTheme.colors.green, 0.24)}`,
          zIndex: 4,
        }}>
          <Display size={46} color={alphaTheme.colors.green}>BẢN THÂN</Display>
          <Body size={40} color={alphaTheme.colors.white} style={{marginTop: 12}}>ĐƯỢC NÂNG TẦM</Body>
        </Glass>
      </div>
      <Body size={48} style={{marginTop: 8}}>KHÔNG CHỈ ĐỂ HOÀN THÀNH<br/><span style={{color: alphaTheme.colors.white}}>MỤC TIÊU CHO XONG.</span></Body>
    </SafeStage>
  </SceneShell>;
};

export const OutroScene: React.FC<SceneProps> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tokens = [
    [-360, -220], [340, -180], [-410, 120], [390, 170], [-240, 360], [260, 340],
  ] as const;
  return <SceneShell durationInFrames={durationInFrames} label="CHẶNG 1">
    <SafeStage style={{top: 360, textAlign: 'center'}}>
      <div style={{position: 'relative', height: 930, display: 'grid', placeItems: 'center', overflow: 'hidden'}}>
        {tokens.map(([startX, startY], index) => {
          const progress = spring({frame: frame - index * 3, fps, config: alphaTheme.spring.smooth});
          return <div key={`${startX}-${startY}`} style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 92,
            height: 42,
            marginLeft: -46,
            marginTop: -21,
            borderRadius: 14,
            border: `2px solid ${index % 2 ? alphaTheme.colors.green : alphaTheme.colors.cyan}`,
            background: alpha(alphaTheme.colors.surfaceAlt, 0.82),
            opacity: 0.18 + progress * 0.42,
            transform: `translate(${startX * (1 - progress)}px, ${startY * (1 - progress)}px) scale(${0.72 + progress * 0.28}) rotate(${(1 - progress) * (index % 2 ? 18 : -18)}deg)`,
          }}/>
        })}
        <div style={{
          position: 'absolute',
          width: 690,
          height: 560,
          borderRadius: 52,
          border: `2px solid ${alpha(alphaTheme.colors.cyan, 0.34)}`,
          background: `radial-gradient(circle at center, ${alpha(alphaTheme.colors.blue, 0.2)}, ${alpha(alphaTheme.colors.surface, 0.78)} 70%)`,
          boxShadow: `0 0 64px ${alpha(alphaTheme.colors.cyan, 0.18)}`,
        }}/>
        <Enter delay={frameAt(0.25, fps)} style={{position: 'relative'}}>
          <Display size={48} color={alphaTheme.colors.cyan} style={{letterSpacing: 4}}>BÀI TIẾP THEO</Display>
          <Display size={82} style={{marginTop: 38}}>AI THỰC SỰ</Display>
          <GradientWord tone="blue" size={96} style={{marginTop: 16}}>TẠO CÂU TRẢ LỜI</GradientWord>
          <Display size={82} style={{marginTop: 28}}>NHƯ THẾ NÀO?</Display>
        </Enter>
      </div>
      <Body size={32} style={{letterSpacing: 3}}>ALPHA INTELLIGENCE • HỌC CHỦ ĐỘNG CÙNG AI</Body>
    </SafeStage>
  </SceneShell>;
};
