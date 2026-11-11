export const APPROACHES = ['direct', 'metaphorical', 'typography'];
export const ELEMENT_KINDS = ['text', 'card', 'shape', 'connector', 'token-field', 'mask', 'group', 'media'];
export const LAYOUTS = ['stack', 'split', 'grid', 'axis-flow', 'radial', 'stage', 'freeform'];
export const OPERATORS = ['enter', 'exit', 'assemble', 'disassemble', 'split', 'merge', 'morph', 'draw', 'scan', 'focus', 'freeze', 'verify', 'count', 'camera'];
export const RENDER_MODES = ['graph', 'custom', 'legacy'];
export const weightedScore = (scores) => scores.semanticClarity * 0.4 + scores.voiceAlignment * 0.2 + scores.brandFit * 0.15 + scores.novelty * 0.15 + scores.feasibility * 0.1;
export const conceptFingerprint = (concept, scene) => new Set([
  `layout:${concept.layoutFamily}`,
  ...(concept.motionVerbs ?? []).map((item) => `verb:${item}`),
  ...(concept.primitiveFamilies ?? []).map((item) => `primitive:${item}`),
  `camera:${scene?.motionGraph?.cameraPattern ?? 'custom'}`,
]);
export const similarity = (a, b) => {
  const intersection = [...a].filter((item) => b.has(item)).length;
  return intersection / Math.max(1, new Set([...a, ...b]).size);
};
export const findConcept = (concepts, sceneId, conceptId) => concepts.sceneConceptSets?.find((set) => set.sceneId === sceneId)?.candidates?.find((candidate) => candidate.id === conceptId);
export const conceptDraftPayload = (concepts) => { const clone = structuredClone(concepts); delete clone.referenceReviewedAt; return clone; };
export const hasNumericTimingKey = (value) => {
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, nested]) => (/^(?:time|start|end|frame|duration|delay)(?:Seconds|Frames)?$/i.test(key) && typeof nested === 'number') || hasNumericTimingKey(nested));
};
