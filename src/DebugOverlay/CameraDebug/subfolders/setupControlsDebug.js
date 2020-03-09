function setupControlsDebug(folder, controls) {
  const subfolder = folder.addFolder('Controls');
  const params = {
    autoRotate: controls.autoRotate,
    autoRotateSpeed: controls.autoRotateSpeed,
    dampingFactor: controls.dampingFactor,
    enableDamping: controls.enableDamping,
    enableKeys: controls.enableKeys,
    enablePan: controls.enablePan,
    enableRotate: controls.enableRotate,
    enableZoom: controls.enableZoom,
    keyPanSpeed: controls.keyPanSpeed,
    minAzimuthAngle: controls.minAzimuthAngle,
    maxAzimuthAngle: controls.maxAzimuthAngle,
    minDistance: controls.minDistance,
    maxDistance: controls.maxDistance,
    minPolarAngle: controls.minPolarAngle,
    maxPolarAngle: controls.maxPolarAngle,
    panSpeed: controls.panSpeed,
    rotateSpeed: controls.rotateSpeed,
    targetX: controls.target.x,
    targetY: controls.target.y,
    targetZ: controls.target.z,
    minZoom: controls.minZoom,
    maxZoom: controls.maxZoom,
    zoomSpeed: controls.zoomSpeed,
  };
  subfolder
    .add(params, 'targetX', -0.1, 0.1, 0.001)
    .name('Target X Position')
    .onChange(() => {
      controls.target.x = params.targetX;
      controls.update();
    });
  subfolder
    .add(params, 'targetY', -0.1, 0.1, 0.001)
    .name('Target Y Position')
    .onChange(() => {
      controls.target.y = params.targetY;
      controls.update();
    });
  subfolder
    .add(params, 'targetZ', -0.1, 0.1, 0.001)
    .name('Target Z Position')
    .onChange(() => {
      controls.target.z = params.targetZ;
      controls.update();
    });
  subfolder
    .add(params, 'autoRotate')
    .name('Auto Rotate')
    .onChange(() => {
      controls.autoRotate = params.autoRotate;
    });
  subfolder
    .add(params, 'autoRotateSpeed', -10, 10, 0.01)
    .name('Auto Rotate Speed')
    .onChange(() => {
      controls.autoRotateSpeed = params.autoRotateSpeed;
    });
  subfolder
    .add(params, 'enableDamping')
    .name('Enable Damping')
    .onChange(() => {
      controls.enableDamping = params.enableDamping;
    });
  subfolder
    .add(params, 'dampingFactor', 0.01, 1, 0.01)
    .name('Damping Factor')
    .onChange(() => {
      controls.dampingFactor = params.dampingFactor;
    });
  subfolder
    .add(params, 'enablePan')
    .name('Enable Pan')
    .onChange(() => {
      controls.enablePan = params.enablePan;
    });
  subfolder
    .add(params, 'enableKeys')
    .name('Keyboard Pan')
    .onChange(() => {
      controls.enableKeys = params.enableKeys;
    });
  subfolder
    .add(params, 'panSpeed', 0, 5, 0.01)
    .name('Mouse/Touch Pan Speed')
    .onChange(() => {
      controls.panSpeed = params.panSpeed;
    });
  subfolder
    .add(params, 'keyPanSpeed', 0, 20, 0.01)
    .name('Keys Pan Speed')
    .onChange(() => {
      controls.keyPanSpeed = params.keyPanSpeed;
    });
  subfolder
    .add(params, 'enableRotate')
    .name('Enable Rotate')
    .onChange(() => {
      controls.enableRotate = params.enableRotate;
    });
  subfolder
    .add(params, 'rotateSpeed', 0, 10, 0.01)
    .name('Rotate Speed')
    .onChange(() => {
      controls.rotateSpeed = params.rotateSpeed;
    });
  subfolder
    .add(params, 'minAzimuthAngle', -Math.PI, Math.PI, 0.01)
    .name('Min Azimuth Angle')
    .onChange(() => {
      controls.minAzimuthAngle = params.minAzimuthAngle;
    });
  subfolder
    .add(params, 'maxAzimuthAngle', -Math.PI, Math.PI, 0.01)
    .name('Max Azimuth Angle')
    .onChange(() => {
      controls.maxAzimuthAngle = params.maxAzimuthAngle;
    });
  subfolder
    .add(params, 'minPolarAngle', 0, Math.PI, 0.01)
    .name('Min Polar Angle')
    .onChange(() => {
      controls.minPolarAngle = params.minPolarAngle;
    });
  subfolder
    .add(params, 'maxPolarAngle', 0, Math.PI, 0.01)
    .name('Max Polar Angle')
    .onChange(() => {
      controls.maxPolarAngle = params.maxPolarAngle;
    });
  subfolder
    .add(params, 'enableZoom')
    .name('Enable Zoom')
    .onChange(() => {
      controls.enableZoom = params.enableZoom;
    });
  subfolder
    .add(params, 'minDistance', 0, 10, 0.01)
    .name('Min Zoom')
    .onChange(() => {
      controls.minDistance = params.minDistance;
    });
  subfolder
    .add(params, 'maxDistance', 1, 10, 0.01)
    .name('Max Zoom')
    .onChange(() => {
      controls.maxDistance = params.maxDistance;
    });
  subfolder
    .add(params, 'zoomSpeed', 0, 5, 0.01)
    .name('Zoom Speed')
    .onChange(() => {
      controls.zoomSpeed = params.zoomSpeed;
    });
}

export { setupControlsDebug };
