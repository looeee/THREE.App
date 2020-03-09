import {
  ACESFilmicToneMapping,
  NoToneMapping,
  sRGBEncoding,
  WebGLRenderer,
  VSMShadowMap,
} from '/node_modules/three/build/three.module.js';

import { createContext } from './createContext.js';

class Renderer extends WebGLRenderer {
  constructor(container, usingPost = false) {
    const antialias = !usingPost;
    const canvas = document.createElementNS(
      'http://www.w3.org/1999/xhtml',
      'canvas',
    );
    const context = createContext(canvas, antialias);

    super({
      canvas,
      context,
    });

    this.container = container;
    this.resize();

    this.physicallyCorrectLights = true;
    this.outputEncoding = sRGBEncoding;

    this.shadowMap.enabled = true;
    // this.shadowMap.shadowMap.autoUpdate = false;
    this.shadowMap.type = VSMShadowMap;

    if (usingPost) {
      this.toneMapping = NoToneMapping;
    } else {
      this.toneMapping = ACESFilmicToneMapping;
      // TODO: some way to set this more elegantly
      this.toneMappingExposure = 1;
    }

    this.addCanvasToContainer(container, this.domElement);
  }

  addCanvasToContainer(container, canvas) {
    // delete all contents of container
    // required if creating new renderer (e.g. when switching on composer)
    // TODO: more elegant solution
    container.innerHTML = '';
    container.appendChild(canvas);
  }

  resize() {
    this.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
      true,
    );
    this.setPixelRatio(window.devicePixelRatio);
  }
}

export { Renderer };
