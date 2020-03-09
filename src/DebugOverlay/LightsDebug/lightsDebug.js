import { addDirectionalLightDebug } from './subfolders/addDirectionalLightDebug.js';
import { addHemisphereLightDebug } from './subfolders/addHemisphereLightDebug.js';

function setupLightsDebug(gui, lights) {
  const folder = gui.addFolder('Lights and Shadows');

  Object.values(lights).forEach(light => {
    if (light.isDirectionalLight) {
      addDirectionalLightDebug(folder, light);
    } else if (light.isHemisphereLight) {
      addHemisphereLightDebug(folder, light);
    }
  });
}

export { setupLightsDebug };
