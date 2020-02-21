import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

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

export { ModelLoader };
