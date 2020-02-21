class DebugOverlay {
  constructor(spec) {
    this.setupCameraDebugOverlay(spec);
    this.setupEffectsDebugOverlay(spec);
    this.setupLightsDebugOverlay(spec);
    this.setupMaterialsDebugOverlay(spec);
    this.setupRendererDebugOverlay(spec);
  }

  setupCameraDebugOverlay(spec) {
    if (!spec.camera) return;
  }

  setupEffectsDebugOverlay(spec) {
    if (!spec.effects) return;
  }

  setupLightsDebugOverlay(spec) {
    if (!spec.lights) return;
  }

  setupMaterialsDebugOverlay(spec) {
    if (!spec.materials) return;
  }

  setupRendererDebugOverlay(spec) {
    if (!spec.renderer) return;
  }
}

export { DebugOverlay };
