import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

export const canonicalize = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};

export const sha256Value = (value) => createHash('sha256').update(canonicalize(value)).digest('hex');
export const sha256File = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
export const normalizeText = (value = '') => value.normalize('NFC').toLocaleLowerCase('vi').replace(/[\p{P}\p{S}]/gu, ' ').replace(/\s+/g, ' ').trim();

export const transcriptPayload = (transcript) => {
  const clone = structuredClone(transcript);
  delete clone.transcriptSha256;
  return clone;
};

export const transcriptHash = (transcript) => sha256Value(transcriptPayload(transcript));

export const cuePayload = (cueLock) => {
  const clone = structuredClone(cueLock);
  delete clone.cueSheetSha256;
  return clone;
};

export const cueHash = (cueLock) => sha256Value(cuePayload(cueLock));

export const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
