class Loader {
  constructor(loader) {
    this.loader = loader;
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
    this.loadedData = { ...manifest };

    const urls = Object.values(manifest);
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
    const data = await Promise.all(this.promises);

    for (const [index, name] of Object.keys(
      this.loadedData,
    ).entries()) {
      this.loadedData[name] = data[index];
    }

    return this.loadedData;
  }
}

export { Loader };
