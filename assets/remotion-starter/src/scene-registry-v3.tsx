import React from 'react';
import type {SceneSpec, SceneSpecV3} from './cue-types';
import {CustomSceneRegistry} from './custom-scenes';
import {MotionGraphRenderer} from './motion-graph-renderer';
import {SceneRegistry} from './scene-registry';

export const SceneRegistryV3: React.FC<{scene: SceneSpecV3; qaMode?: 'full' | 'semantic'}> = ({scene, qaMode = 'full'}) => {
  if (scene.renderMode === 'graph') return <MotionGraphRenderer scene={scene} qaMode={qaMode}/>;
  if (scene.renderMode === 'custom') return <CustomSceneRegistry scene={scene} qaMode={qaMode}/>;
  if (!scene.legacyRecipe) throw new Error(`Legacy scene thiếu legacyRecipe: ${scene.id}`);
  const legacy: SceneSpec = {id: scene.id, recipe: scene.legacyRecipe, startCueId: scene.startCueId, endCueId: scene.endCueId, motionConcept: scene.conceptId, layoutFamily: scene.layout.family, holdReason: scene.fallbackReason, beats: scene.beats};
  return <SceneRegistry scene={legacy} qaMode={qaMode}/>;
};
