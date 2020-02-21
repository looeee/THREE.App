import { ModelLoader } from './ModelLoader.js';

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

export { AssetManager };
