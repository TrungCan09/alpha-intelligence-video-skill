#!/usr/bin/env node
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const args = process.argv.slice(2);
const at = args.indexOf('--out');
const output = resolve(at >= 0 ? args[at + 1] : 'assets/remotion-starter/public/sfx');
const sampleRate = 44100;
let randomState = 0x41fa2026;
const random = () => {
  randomState = (1664525 * randomState + 1013904223) >>> 0;
  return randomState / 0xffffffff * 2 - 1;
};
const envelope = (time, duration, attack = 0.02, release = 0.25) => Math.min(1, time / attack) * Math.min(1, (duration - time) / release);
const synth = (duration, sample) => {
  const values = new Float32Array(Math.ceil(duration * sampleRate));
  for (let index = 0; index < values.length; index++) values[index] = Math.max(-1, Math.min(1, sample(index / sampleRate, duration)));
  return values;
};
const wav = (samples) => {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + samples.length * 2, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(samples.length * 2, 40);
  for (let index = 0; index < samples.length; index++) buffer.writeInt16LE(Math.round(samples[index] * 32767), 44 + index * 2);
  return buffer;
};

const sounds = {
  'soft-hit.wav': synth(0.34, (time, duration) => {
    const frequency = 130 - time * 150;
    return (Math.sin(2 * Math.PI * frequency * time) * 0.72 + random() * 0.08) * envelope(time, duration, 0.008, 0.3);
  }),
  'whoosh.wav': synth(0.48, (time, duration) => {
    const sweep = Math.sin(2 * Math.PI * (180 + time * 1050) * time) * 0.22;
    return (random() * 0.38 + sweep) * envelope(time, duration, 0.06, 0.2);
  }),
  'tick.wav': synth(0.09, (time, duration) => Math.sin(2 * Math.PI * 1650 * time) * 0.42 * envelope(time, duration, 0.002, 0.07)),
  'shimmer.wav': synth(0.72, (time, duration) => {
    const tone = Math.sin(2 * Math.PI * 660 * time) + 0.55 * Math.sin(2 * Math.PI * 990 * time) + 0.25 * Math.sin(2 * Math.PI * 1320 * time);
    return tone * 0.16 * envelope(time, duration, 0.03, 0.42);
  }),
};

await mkdir(output, {recursive: true});
for (const [name, samples] of Object.entries(sounds)) {
  const target = resolve(output, name);
  await writeFile(target, wav(samples));
  console.log(target);
}
