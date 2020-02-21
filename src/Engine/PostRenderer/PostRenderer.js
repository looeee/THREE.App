import {
  RGBFormat,
  Vector2,
  WebGLMultisampleRenderTarget,
} from '/node_modules//three/build/three.module.js';

import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';

import { RenderPass } from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/node_modules/three/examples/jsm/postprocessing/ShaderPass.js';

import { GammaCorrectionShader } from '/node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js';

import { SMAAPass } from '/node_modules/three/examples/jsm/postprocessing/SMAAPass.js';

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

export { PostRenderer };
