import { addLightParams } from './addLightParams.js';
import { addDirectionalLightShadowDebug } from './addDirectionalLightShadowDebug.js';

function addDirectionalLightDebug(folder, light) {
  const subfolder = folder.addFolder(
    light.name || 'Directional Light',
  );

  addLightParams(subfolder, light);
  addDirectionalLightShadowDebug(subfolder, light);
}

export { addDirectionalLightDebug };
