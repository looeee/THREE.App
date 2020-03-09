import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { setupLightsDebug } from './LightsDebug/lightsDebug.js';
import { setupCameraDebug } from './CameraDebug/cameraDebug.js';
import { setupMaterialsDebug } from './MaterialsDebug/materialsDebug.js';
import { setupEffectsDebug } from './EffectsDebug/effectsDebug.js';
import { setupModelsDebug } from './ModelsDebug/modelsDebug.js';
import { setupRendererDebug } from './RendererDebug/rendererDebug.js';
import { setupWorldDebug } from './WorldDebug/worldDebug.js';

class DebugOverlay {
  constructor(spec) {
    this.gui = new GUI();

    if (spec.world) {
      setupWorldDebug(this.gui, spec.world);
    }

    if (spec.camera) {
      setupCameraDebug(this.gui, spec.camera);
    }

    if (spec.effects) {
      setupEffectsDebug(this.gui, spec.effects);
    }

    if (spec.lights) {
      setupLightsDebug(this.gui, spec.lights);
    }

    if (spec.materials) {
      setupMaterialsDebug(this.gui, spec.materials);
    }

    if (spec.renderer) {
      setupRendererDebug(this.gui, spec.renderer);
    }

    if (spec.models) {
      // setupModelsDebug(this.gui, assets.models);
    }
  }
}

export { DebugOverlay };
