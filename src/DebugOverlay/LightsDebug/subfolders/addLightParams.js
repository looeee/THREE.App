function addLightParams(folder, light) {
  const params = {
    visible: light.visible,
    color: light.color.getHex(),
    intensity: light.intensity,
    'position.x': light.position.x,
    'position.y': light.position.y,
    'position.z': light.position.z,
  };

  folder
    .add(params, 'visible')
    .name('Visible')
    .onChange(() => {
      light.visible = params.visible;
    });

  folder
    .addColor(params, 'color')
    .name('Color')
    .onChange(() => {
      light.color.set(params.color);
      light.color.convertSRGBToLinear();
    });

  folder
    .add(params, 'intensity', 0, light.intensity * 2, 0.1)
    .name('Intensity')
    .onChange(() => {
      light.intensity = params.intensity;
    });

  folder
    .add(
      params,
      'position.x',
      light.position.x - 5,
      light.position.x + 5,
      0.001,
    )
    .name('position.x')
    .onChange(() => {
      light.position.x = params['position.x'];
    });

  folder
    .add(
      params,
      'position.y',
      light.position.y - 5,
      light.position.y + 5,
      0.001,
    )
    .name('position.y')
    .onChange(() => {
      light.position.y = params['position.y'];
    });

  folder
    .add(
      params,
      'position.z',
      light.position.z - 5,
      light.position.z + 5,
      0.001,
    )
    .name('position.z')
    .onChange(() => {
      light.position.z = params['position.z'];
    });
}

export { addLightParams };
