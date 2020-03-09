import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Loader } from './Loader.js';

class AssetManager {
  constructor() {
    this.assets = {
      environments: {},
      models: {},
      textures: {},
    };
  }

  async loadManifest() {
    return (await fetch('/config/assets.manifest.json')).json();
  }

  async loadAssets() {
    this.manifest = await this.loadManifest();

    this.loadEnvironments();
    this.loadModels();
    this.loadTextures();

    await this.finishLoading();

    return this.assets;
  }

  loadEnvironments() {
    if (!this.manifest.environments) return;

    this.environmentLoader = new Loader(new RGBELoader());

    this.environmentLoader.startLoading(this.manifest.environments);
  }

  loadModels() {
    if (!this.manifest.models) return;

    this.modelLoader = new Loader(new GLTFLoader());

    this.modelLoader.startLoading(this.manifest.models);
  }

  loadTextures() {
    // if (!this.manifest.textures) return;
    // TODO
    // this.textureLoader = new Loader();
    // this.textureLoader.startLoading(this.manifest.texture);
  }

  async finishLoading() {
    if (this.environmentLoader) {
      this.assets.environments = await this.environmentLoader.finishLoading();
    }
    if (this.textureLoader) {
      this.assets.textures = await this.textureLoader.finishLoading();
    }
    if (this.modelLoader) {
      this.assets.models = await this.modelLoader.finishLoading();
    }
  }
}

export { AssetManager };
