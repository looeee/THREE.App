import { addLightParams } from './addLightParams.js';

function addHemisphereLightDebug(folder, light) {
  const subfolder = folder.addFolder(
    light.name || 'Hemisphere Light',
  );

  const params = {
    groundColor: light.groundColor.getHex(),
  };

  subfolder
    .addColor(params, 'groundColor')
    .name('Ground Color')
    .onChange(() => {
      light.groundColor.set(params.groundColor);
      light.groundColor.convertSRGBToLinear();
    });

  addLightParams(subfolder, light);
}

export { addHemisphereLightDebug };
