import { Clock, PerspectiveCamera, WebGLRenderer, Scene } from '../../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { Vector2, WebGLMultisampleRenderTarget, RGBFormat } from '../../../../../node_modules/three/build/three.module.js';
import { EffectComposer } from '../../../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../../../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from '../../../../../node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js';
import { SMAAPass } from '../../../../../node_modules/three/examples/jsm/postprocessing/SMAAPass.js';
import { GLTFLoader } from '../../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const clock = new Clock();

class Core {
  constructor() {
    this.objectsToUpdate = [];
  }

  update(updatables) {
    const delta = clock.getDelta();
    for (const object of updatables) {
      if (typeof object.update === 'function') {
        object.update(delta);
      }
    }
  }

  render(renderer, scene, camera) {
    renderer.render(scene, camera);
  }

  start(renderer, scene, camera, updatables) {
    renderer.setAnimationLoop(() => {
      this.update(updatables);
      this.render(renderer, scene, camera);
    });
  }

  stop(renderer) {
    renderer.setAnimationLoop(null);
  }
}

class OrbitingPerspectiveCamera extends PerspectiveCamera {
  constructor(container) {
    super(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    // this.position.set(-50, 100, 250);
    this.position.set(-10, 20, 50);

    this.setupControls(container);
  }

  setupControls(container) {
    this.controls = new OrbitControls(this, container);

    this.controls.enableDamping = true;
  }

  update(delta) {
    this.controls.update(delta);
  }

  setTarget(target) {
    if (target.isObject3D) {
      this.controls.target.copy(target.position);
    } else if (target.isVector3) {
      this.controls.target.copy(target);
    }
  }
}

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

class PostRenderer {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    this.aaPass = null;
    this.aaPassIndex = -1;
    this.colorPassIndex = -1;

    const size = this.renderer.getDrawingBufferSize(new Vector2());

    this.createComposer(size);
    this.createBasePass();
    this.createColorPass();
    this.createAAPass(size);

    console.log(this);
  }

  createComposer(size) {
    let renderTarget;
    if (this.renderer.capabilities.isWebGL2) {
      const parameters = {
        format: RGBFormat,
        stencilBuffer: false,
      };

      renderTarget = new WebGLMultisampleRenderTarget(
        size.width,
        size.height,
        parameters,
      );

      renderTarget.samples = 8;
    }

    this.composer = new EffectComposer(this.renderer, renderTarget);
  }

  createBasePass() {
    const basePass = new RenderPass(this.scene, this.camera);
    basePass.name = 'Initial Render Pass';
    this.composer.addPass(basePass);
  }

  createColorPass() {
    this.colorPass = new ShaderPass(GammaCorrectionShader);
    this.colorPass.name = 'Linear to sRGB Pass';
    this.composer.addPass(this.colorPass);
    this.colorPassIndex = this.composer.passes.indexOf(
      this.colorPass,
    );
  }

  createAAPass(size) {
    if (this.renderer.capabilities.isWebGL2) return;
    this.aaPass = new SMAAPass(size.x, size.y);
    this.aaPass.name = 'SMAA Pass';
    this.composer.addPass(this.colorPass);
    this.aaPassIndex = this.composer.passes.indexOf(this.aaPass);
  }

  render() {
    this.composer.render();
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  setPixelRatio(pixelRatio) {
    this.composer.setPixelRatio(pixelRatio);
  }

  // details =
  // {
  //   effect,
  //   position: 'beforeColor' (default), 'afterColor', 'beforeAA', 'afterAA', index (int)
  // }
  addEffect(details) {
    if (typeof details.position === 'number') {
      this.insertPass(details.effect, details.position + 1);
      return;
    }
    // TODO: test these
    switch (details.position) {
      case 'afterAA':
        this.insertPass(
          details.effect,
          this.composer.passes.length - 1,
        );
        break;
      case 'beforeAA':
        this.insertPass(details.effect, this.aaPassIndex);
        break;
      case 'afterColor':
        this.insertPass(details.effect, this.colorPassIndex + 1);
        break;
      case 'beforeColor':
      default:
        this.insertPass(details.effect, this.colorPassIndex);
        break;
    }

    this.colorPassIndex = this.composer.passes.indexOf(
      this.colorPass,
    );
    this.colorPassIndex = this.composer.passes.indexOf(
      this.colorPass,
    );
  }

  insertPass(pass, index) {
    if (this.composer.passes.length < index) {
      console.error('Cannot place Effect at that position');
    } else {
      this.composer.insertPass(pass, index);
    }
  }

  setAnimationLoop(callback) {
    this.renderer.setAnimationLoop(callback);
  }
}

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

class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
  }

  load(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        gltfData => resolve(gltfData),
        null,
        reject,
      );
    });
  }

  startLoadingModels(manifest) {
    // create copy of the manifest which maps names to URLS
    // once the models have loaded we'll switch the URLS
    // for the loaded data
    this.models = { ...manifest.models };

    const urls = Object.values(manifest.models);
    this.promises = urls.map(url =>
      this.load(url).catch(errorData => {
        return {
          status: 'failed',
          errorData,
        };
      }),
    );
  }

  async finishLoadingModel() {
    const modelData = await Promise.all(this.promises);

    for (const [index, name] of Object.keys(this.models).entries()) {
      this.models[name] = modelData[index];
    }

    return this.models;
  }
}

class AssetManager {
  constructor() {
    this.assets = {
      models: {},
      textures: {},
    };
  }

  async loadManifest() {
    return (await fetch('/config/assets.manifest.json')).json();
  }

  async loadAssets() {
    this.manifest = await this.loadManifest();

    this.loadModels();
    this.loadTextures();

    await this.finishLoading();

    return this.assets;
  }

  loadModels() {
    if (!this.manifest.models) return;

    this.modelLoader = new ModelLoader();

    this.modelLoader.startLoadingModels(this.manifest);
  }

  loadTextures() {
    // if (!this.manifest.textures) return;
    // TODO
  }

  async finishLoading() {
    this.assets.models = await this.modelLoader.finishLoadingModel();
  }
}

export { AssetManager, Engine };
//# sourceMappingURL=main.js.map
