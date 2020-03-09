import { addEnabledParam } from './addEnabledParam.js';

function addOutlinePassDebug(folder, pass) {
  const subfolder = folder.addFolder(pass.name || 'Outline Pass');
  const params = {
    edgeGlow: pass.edgeGlow,
    // usePatternTexture: pass.usePatternTexture,
    edgeThickness: pass.edgeThickness,
    edgeStrength: pass.edgeStrength,
    pulsePeriod: pass.pulsePeriod,
  };

  addEnabledParam(subfolder, pass);

  subfolder
    .add(params, 'edgeGlow', 0.0, 10.0, 0.01)
    .name('Edge Glow')
    .onChange(() => {
      pass.edgeGlow = params.edgeGlow;
    });
  subfolder
    .add(params, 'edgeThickness', 0.0, 10.0, 0.01)
    .name('Edge Thickness')
    .onChange(() => {
      pass.edgeThickness = params.edgeThickness;
    });
  subfolder
    .add(params, 'edgeStrength', 0.0, 10.0, 0.01)
    .name('Edge Strength')
    .onChange(() => {
      pass.edgeStrength = params.edgeStrength;
    });
  subfolder
    .add(params, 'pulsePeriod', 0.0, 10.0, 0.01)
    .name('Pulse Period')
    .onChange(() => {
      pass.pulsePeriod = params.pulsePeriod;
    });
}

export { addOutlinePassDebug };
