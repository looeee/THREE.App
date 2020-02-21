import { Core } from './Core/Core.js';
import { OrbitingPerspectiveCamera } from './Camera/OrbitingPerspectiveCamera.js';
import { Renderer } from './Renderer/Renderer.js';
// import { ColorManager } from './Color/ColorManager.js';
import { DebugOverlay } from './Debug/DebugOverlay.js';
// import { PostEffects } from './Effects/PostEffects.js';
import { handleWindowResizeEvent } from './utilities/handleResize.js';

import { Scene } from '/node_modules/three/build/three.module.js';
import { PostRenderer } from './PostRenderer/PostRenderer.js';

let usingPostRenderer = false;

class Engine {
  constructor(container, debug = false) {
    this.camera = new OrbitingPerspectiveCamera(container);
    this.renderer = new Renderer(container);
    this.scene = new Scene();

    this.core = new Core(container);

    // this array contains objects with an update
    // method that will run once per frame
    this.updatables = [this.camera];

    handleWindowResizeEvent(container, this.camera, this.renderer);

    if (debug) this.setupDebugOverlay();
  }

  addRenderableObject(object, updatable = false) {
    this.scene.add(object);

    if (updatable) {
      this.updatables.push(object);
    }
  }

  // Automatically switch to post renderer when effects are added
  // To force this to happen early,
  // e.g. to prevent shader recompilation when adding passes later,
  // pass an empty array to this function
  addEffects(effects) {
    if (usingPostRenderer === false) {
      this.renderer = new PostRenderer(
        this.renderer,
        this.scene,
        this.camera,
      );

      usingPostRenderer = true;
    }

    for (const effect of effects) {
      this.renderer.addEffect(effect);
    }
  }

  start() {
    this.core.start(
      this.renderer,
      this.scene,
      this.camera,
      this.updatables,
    );
  }

  stop() {
    this.core.stop(this.renderer);
  }

  setupDebugOverlay() {
    const overlay = new DebugOverlay({
      camera: null,
      effects: null,
      lights: null,
      materials: null,
      renderer: null,
    });
  }
}

export { Engine };
