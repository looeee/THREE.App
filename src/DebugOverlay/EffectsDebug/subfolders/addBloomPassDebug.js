import { addEnabledParam } from './addEnabledParam.js';

function addBloomPassDebug(folder, pass) {
  const subfolder = folder.addFolder(pass.name || 'Bloom Pass');
  const params = {
    enabled: pass.enabled,
    radius: pass.radius,
    strength: pass.strength,
    threshold: pass.threshold,
  };

  addEnabledParam(subfolder, pass);

  subfolder
    .add(params, 'radius', 0.0, 1.0, 0.01)
    .name('Radius')
    .onChange(() => {
      pass.radius = params.radius;
    });
  subfolder
    .add(params, 'strength', 0.0, 2.0, 0.01)
    .name('Strength')
    .onChange(() => {
      pass.strength = params.strength;
    });
  subfolder
    .add(params, 'threshold', 0.0, 1, 0.001)
    .name('Threshold')
    .onChange(() => {
      pass.threshold = params.threshold;
    });
}

export { addBloomPassDebug };
