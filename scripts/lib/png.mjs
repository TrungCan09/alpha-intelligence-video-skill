import {inflateSync} from 'node:zlib';

const paeth = (a, b, c) => { const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };

export const decodePng = (png) => {
  let cursor = 8; let width = 0; let height = 0; let colorType = 0; const idat = [];
  while (cursor + 12 <= png.length) { const length = png.readUInt32BE(cursor); const type = png.toString('ascii', cursor + 4, cursor + 8); const data = png.subarray(cursor + 8, cursor + 8 + length); if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9]; } if (type === 'IDAT') idat.push(data); cursor += length + 12; }
  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : 0; if (!channels) throw new Error(`PNG color type ${colorType} chưa được hỗ trợ.`);
  const packed = inflateSync(Buffer.concat(idat)); const stride = width * channels; const pixels = Buffer.alloc(stride * height); let source = 0;
  for (let y = 0; y < height; y++) { const filter = packed[source++]; const row = y * stride; for (let x = 0; x < stride; x++) { const raw = packed[source++]; const left = x >= channels ? pixels[row + x - channels] : 0; const up = y ? pixels[row - stride + x] : 0; const upperLeft = y && x >= channels ? pixels[row - stride + x - channels] : 0; pixels[row + x] = (filter === 0 ? raw : filter === 1 ? raw + left : filter === 2 ? raw + up : filter === 3 ? raw + Math.floor((left + up) / 2) : raw + paeth(left, up, upperLeft)) & 255; } }
  const rgba = Buffer.alloc(width * height * 4); for (let i = 0; i < width * height; i++) { rgba[i * 4] = pixels[i * channels]; rgba[i * 4 + 1] = pixels[i * channels + 1]; rgba[i * 4 + 2] = pixels[i * channels + 2]; rgba[i * 4 + 3] = channels === 4 ? pixels[i * 4 + 3] : 255; }
  return {width, height, rgba};
};
