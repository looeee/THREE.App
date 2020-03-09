import { addEnabledParam } from './addEnabledParam.js';

function addColorCorrectionPassDebug(folder, pass) {
  const subfolder = folder.addFolder(pass.name || 'Color Correction');
  const params = {
    exposure: pass.uniforms.exposure.value,
    brightness: pass.uniforms.brightness.value,
    contrast: pass.uniforms.contrast.value,
  };

  addEnabledParam(subfolder, pass);

  subfolder
    .add(params, 'exposure', 0.0, 2.0, 0.01)
    .name('Exposure')
    .onChange(() => {
      pass.uniforms.exposure.value = params.exposure;
    });
  subfolder
    .add(params, 'brightness', -0.5, 0.5, 0.01)
    .name('Brightness')
    .onChange(() => {
      pass.uniforms.brightness.value = params.brightness;
    });
  subfolder
    .add(params, 'contrast', -0.5, 0.5, 0.01)
    .name('Contrast')
    .onChange(() => {
      pass.uniforms.contrast.value = params.contrast;
    });
}

export { addColorCorrectionPassDebug };
