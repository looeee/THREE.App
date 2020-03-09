import { addDirectionalLightShadowDebug } from './subfolders/addDirectionalLightShadowDebug.js';

function setupShadowsDebug(gui, lights) {
  const folder = gui.addFolder('Shadows');
  for (const light of Object.values(lights)) {
    if (light.isDirectionalLight)
      addDirectionalLightShadowDebug(folder, light);
  }
}

export { setupShadowsDebug };
