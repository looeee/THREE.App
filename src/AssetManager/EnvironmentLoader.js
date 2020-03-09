// import { RoughnessMipmapper } from './jsm/utils/RoughnessMipmapper.js';

class EnvironmentLoader {
  constructor() {
    this.loader = new RGBELoader();
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

  startLoading(manifest) {
    // create copy of the manifest which maps names to URLS
    // once the files have loaded we'll switch the URLS
    // for the loaded data
    this.environments = { ...manifest.environments };

    const urls = Object.values(manifest.environments);
    this.promises = urls.map(url =>
      this.load(url).catch(errorData => {
        return {
          status: 'failed',
          errorData,
        };
      }),
    );
  }

  async finishLoading() {
    const loadedData = await Promise.all(this.promises);

    for (const [index, name] of Object.keys(
      this.environments,
    ).entries()) {
      this.environments[name] = loadedData[index].scene.children[0];
    }

    return this.environments;
  }
}

export { EnvironmentLoader };
