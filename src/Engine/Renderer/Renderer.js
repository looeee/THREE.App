import {
  sRGBEncoding,
  WebGLRenderer,
} from '/node_modules/three/build/three.module.js';

class Renderer {
  constructor(container) {
    const renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      alpha: false,
      antialias: true,
      stencil: false,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.physicallyCorrectLights = true;

    container.appendChild(renderer.domElement);

    return renderer;
  }
}

export { Renderer };
