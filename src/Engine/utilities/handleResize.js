function onWindowResize(container, camera, renderer) {
  camera.aspect = container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

function handleWindowResizeEvent(container, camera, renderer) {
  window.addEventListener('resize', () => {
    onWindowResize(container, camera, renderer);
  });
}

export { handleWindowResizeEvent };
