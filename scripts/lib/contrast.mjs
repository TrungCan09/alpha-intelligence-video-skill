export const parseHex = (hex) => {
  const value = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`Màu không hợp lệ: ${hex}`);
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
};

export const luminance = (hex) => parseHex(hex)
  .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);

export const contrastRatio = (foreground, background) => {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};
