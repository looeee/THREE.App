function addDirectionalLightShadowDebug(folder, light) {
  const subfolder = folder.addFolder('Shadow');
  subfolder.open();
  const shadowCamera = light.shadow.camera;

  const params = {
    castShadow: light.castShadow,
    near: shadowCamera.near,
    far: shadowCamera.far,
    top: shadowCamera.top,
    bottom: shadowCamera.bottom,
    left: shadowCamera.left,
    right: shadowCamera.right,
    radius: light.shadow.radius,
    bias: light.shadow.bias,
  };

  subfolder
    .add(params, 'castShadow')
    .name('Cast Shadow')
    .onChange(() => {
      light.castShadow = params.castShadow;
    });

  subfolder
    .add(params, 'near', 0.001, shadowCamera.near + 5, 0.001)
    .name('Near')
    .onChange(() => {
      shadowCamera.near = params.near;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(
      params,
      'far',
      shadowCamera.far - 5,
      shadowCamera.far + 5,
      0.001,
    )
    .name('far')
    .onChange(() => {
      shadowCamera.far = params.far;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(
      params,
      'top',
      shadowCamera.top - 5,
      shadowCamera.top + 5,
      0.001,
    )
    .name('top')
    .onChange(() => {
      shadowCamera.top = params.top;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(
      params,
      'bottom',
      shadowCamera.bottom - 5,
      shadowCamera.bottom + 5,
      0.001,
    )
    .name('bottom')
    .onChange(() => {
      shadowCamera.bottom = params.bottom;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(
      params,
      'left',
      shadowCamera.left - 5,
      shadowCamera.left + 5,
      0.001,
    )
    .name('left')
    .onChange(() => {
      shadowCamera.left = params.left;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(
      params,
      'right',
      shadowCamera.right - 5,
      shadowCamera.right + 5,
      0.001,
    )
    .name('right')
    .onChange(() => {
      shadowCamera.right = params.right;
      shadowCamera.updateProjectionMatrix();
    });

  subfolder
    .add(params, 'radius', 1, 8, 0.1)
    .name('radius')
    .onChange(() => {
      light.shadow.radius = params.radius;
    });

  subfolder
    .add(params, 'bias', -0.01, 0.01, 0.00001)
    .name('bias')
    .onChange(() => {
      light.shadow.bias = params.bias;
    });
}

export { addDirectionalLightShadowDebug };
