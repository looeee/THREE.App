import { addBloomPassDebug } from './subfolders/addBloomPassDebug.js';
import { addColorCorrectionPassDebug } from './subfolders/addColorCorrectionPassDebug.js';
import { addEnabledParam } from './subfolders/addEnabledParam.js';

function setupEffectsDebug(gui, effects) {
  const folder = gui.addFolder('Effects');

  for (const effect of effects) {
    if (effect.name) {
      if (effect.name.toLowerCase().includes('bloom')) {
        addBloomPassDebug(folder, effect);
      }
      if (effect.name.toLowerCase().includes('color correction')) {
        addColorCorrectionPassDebug(folder, effect);
      } else {
        const subfolder = folder.addFolder(
          effect.name || 'Unnamed Pass',
        );
        addEnabledParam(subfolder, effect);
      }
    }
  }
}

export { setupEffectsDebug };
