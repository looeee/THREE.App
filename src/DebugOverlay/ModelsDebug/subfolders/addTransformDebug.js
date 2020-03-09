function addTransformDebug(folder, model) {
  const subfolder = folder.addFolder(model.name);
  const params = {
    'position.x': model.position.x,
    'position.y': model.position.y,
    'position.z': model.position.z,
    'scale.x': model.scale.x,
    'scale.y': model.scale.y,
    'scale.z': model.scale.z,
    'rotation.x': model.rotation.x,
    'rotation.y': model.rotation.y,
    'rotation.z': model.rotation.z,
  };
  subfolder
    .add(params, 'position.x', -0.5, 0.5, 0.001)
    .name('position.x')
    .onChange(() => {
      model.position.x = params['position.x'];
    });
  subfolder
    .add(params, 'position.y', -0.5, 0.5, 0.001)
    .name('position.y')
    .onChange(() => {
      model.position.y = params['position.y'];
    });
  subfolder
    .add(params, 'position.z', -0.5, 0.5, 0.001)
    .name('position.z')
    .onChange(() => {
      model.position.z = params['position.z'];
    });
  subfolder
    .add(params, 'scale.x', -100, 100, 0.01)
    .name('scale.x')
    .onChange(() => {
      model.scale.x = params['scale.x'];
    });
  subfolder
    .add(params, 'scale.y', -100, 100, 0.01)
    .name('scale.y')
    .onChange(() => {
      model.scale.y = params['scale.y'];
    });
  subfolder
    .add(params, 'scale.z', -100, 100, 0.01)
    .name('scale.z')
    .onChange(() => {
      model.scale.z = params['scale.z'];
    });
  subfolder
    .add(params, 'rotation.x', -Math.PI, Math.PI, 0.01)
    .name('rotation.x')
    .onChange(() => {
      model.rotation.x = params['rotation.x'];
    });
  subfolder
    .add(params, 'rotation.y', -Math.PI, Math.PI, 0.01)
    .name('rotation.y')
    .onChange(() => {
      model.rotation.y = params['rotation.y'];
    });
  subfolder
    .add(params, 'rotation.z', -Math.PI, Math.PI, 0.01)
    .name('rotation.z')
    .onChange(() => {
      model.rotation.z = params['rotation.z'];
    });
}

export { addTransformDebug };
