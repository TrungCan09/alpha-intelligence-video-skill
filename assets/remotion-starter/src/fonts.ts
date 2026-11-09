import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/700.css';
import {staticFile} from 'remotion';
import {BRAND_CONFIG} from './theme';

export type AlphaFontStatus = {cyGroteskAvailable: boolean};

let loadPromise: Promise<AlphaFontStatus> | undefined;
let warned = false;
const vietnameseFontProbe = 'CỘNG ĐỒNG ALPHA INTELLIGENCE Học sinh làm chủ AI và Vibecode Ă Â Ê Ô Ơ Ư Đ ă â ê ô ơ ư đ Ả Ẫ Ễ Ự ạ ả ấ ề ộ ớ ự CÂU TRẢ LỜI BẾ TẮC SUY NGHĨ';

const warnFallback = () => {
  if (warned) return;
  warned = true;
  console.warn(`Không tìm thấy ${BRAND_CONFIG.fonts.brandWide}; dùng Montserrat 800 fallback.`);
};

const withTimeout = async <T,>(promise: Promise<T>, milliseconds: number, label: string): Promise<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`${label} quá ${milliseconds}ms`)), milliseconds);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

export const loadAlphaFonts = (): Promise<AlphaFontStatus> => {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    await Promise.all([
      document.fonts.load('800 80px "Montserrat"', vietnameseFontProbe),
      document.fonts.load('700 48px "Montserrat"', vietnameseFontProbe),
    ]);
    let cyGroteskAvailable = false;
    try {
      const response = await withTimeout(fetch(staticFile(BRAND_CONFIG.fonts.brandAssetPath)), 2000, 'Tải Cy Grotesk');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      const signature = new TextDecoder('ascii').decode(buffer.slice(0, 4));
      if (signature !== 'wOF2') throw new Error('chữ ký WOFF2 không hợp lệ');
      const font = new FontFace(
        BRAND_CONFIG.fonts.brandWide,
        buffer,
        {style: 'normal', weight: String(BRAND_CONFIG.fonts.brandWeight)},
      );
      await withTimeout(font.load(), 3000, 'Giải mã Cy Grotesk');
      (document.fonts as unknown as {add: (face: FontFace) => void}).add(font);
      cyGroteskAvailable = true;
    } catch {
      warnFallback();
    }
    await document.fonts.ready;
    return {cyGroteskAvailable};
  })();
  return loadPromise;
};

export {};
