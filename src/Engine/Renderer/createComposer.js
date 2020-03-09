import {
  RGBFormat,
  Vector2,
  WebGLMultisampleRenderTarget,
} from '/node_modules/three/build/three.module.js';

import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';

function createRenderTarget(size, isWebGL2) {
  if (!isWebGL2) return null;

  const parameters = {
    format: RGBFormat,
    stencilBuffer: false,
  };

  const renderTarget = new WebGLMultisampleRenderTarget(
    size.width,
    size.height,
    parameters,
  );

  renderTarget.samples = 8;

  return renderTarget;
}

class PostRenderer extends EffectComposer {
  constructor(renderer) {
    const size = renderer.getDrawingBufferSize(new Vector2());
    const isWebGL2 = renderer.capabilities.isWebGL2;
    const renderTarget = createRenderTarget(size, isWebGL2);

    super(renderer, renderTarget);

    this.resize(renderer.container);
  }

  setAnimationLoop(callback) {
    this.renderer.setAnimationLoop(callback);
  }

  resize(container) {
    this.renderer.resize();
    this.setSize(container.clientWidth, container.clientHeight);
    this.setPixelRatio(window.devicePixelRatio);
  }
}

export { PostRenderer };
