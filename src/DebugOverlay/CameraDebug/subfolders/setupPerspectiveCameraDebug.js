function setupPerspectiveCameraDebug(folder, camera) {
  const subfolder = folder.addFolder('Camera');
  const params = {
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom,
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  subfolder
    .add(params, 'near', 0.01, 1.0, 0.01)
    .name('Near Clipping Plane')
    .onChange(() => {
      camera.near = params.near;
      camera.updateProjectionMatrix();
    });
  subfolder
    .add(params, 'far', 1, 10.0, 0.1)
    .name('Far Clipping Plane')
    .onChange(() => {
      camera.far = params.far;
      camera.updateProjectionMatrix();
    });
  subfolder
    .add(params, 'zoom', 0, 10.0, 0.1)
    .name('Zoom')
    .onChange(() => {
      camera.zoom = params.zoom;
      camera.updateProjectionMatrix();
    });
  subfolder
    .add(params, 'x', -1, 1, 0.01)
    .name('X position')
    .onChange(() => {
      camera.position.x = params.x;
    });
  subfolder
    .add(params, 'y', -1, 1, 0.01)
    .name('Y position')
    .onChange(() => {
      camera.position.y = params.y;
    });
  subfolder
    .add(params, 'z', -1, 1, 0.01)
    .name('Z position')
    .onChange(() => {
      camera.position.z = params.z;
    });
}

export { setupPerspectiveCameraDebug };
