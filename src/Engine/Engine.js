import { Core } from './Core/Core.js';
import { Camera } from './Camera/Camera.js';
import { Renderer } from './Renderer/Renderer.js';
import { Controls } from './Controls/Controls.js';
import { Environment } from './Environment/Environment.js';
// import { ColorManager } from './Color/ColorManager.js';

import { Scene } from 'three/build/three.module.js';
import { PostRenderer } from './PostRenderer/PostRenderer.js';

class Engine {
  constructor(container) {
    this.container = container;
    this.camera = new Camera(container);
    this.renderer = new Renderer(container);
    this.scene = new Scene();
    this.controls = new Controls(this.camera, container);
    this.environment = new Environment(this.scene, this.renderer);

    this.core = new Core(container);

    // this array contains objects with an update
    // method that will run once per frame
    this.updatables = [this.controls];

    this.resizeables = [this.camera, this.renderer];
    this.setupResizeHandler();
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      for (const object of this.resizeables) {
        if (typeof object.resize === 'function') {
          object.resize(this.container);
        }
      }
    });
  }

  setControls(controls) {
    if (this.controls.dispose) {
      this.controls.dispose();
    }

    const index = this.updatables.indexOf(this.controls);
    if (index !== -1) this.updatables[index] = controls;

    this.controls = controls;
  }

  addRenderable(object, updatable = false) {
    this.scene.add(object);

    if (updatable) {
      // const name = object.name !== '' ? object.name : object.uuid;
      // this.updatables[name] = object;
      this.updatables.push(object);
    }
  }

  removeRenderable(object) {
    this.scene.remove(object);

    this.updatables = this.updatables.filter(item => item !== object);
  }

  // Automatically switch to post renderer when effects are added
  // To force this to happen early,
  // e.g. to prevent shader recompilation when adding passes later,
  // pass an empty array to this function
  addEffects(effects) {
    if (!(this.renderer instanceof PostRenderer)) {
      this.resizeables = this.resizeables.filter(
        item => item !== this.renderer,
      );

      this.renderer = new PostRenderer(
        new Renderer(this.container, true),
        this.scene,
        this.camera,
      );

      this.resizeables.push(this.renderer);
    }
    for (const effect of effects) {
      this.renderer.addPass(effect);
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
}

export { Engine };
