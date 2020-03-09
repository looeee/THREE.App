import {
  Color,
  PMREMGenerator,
  sRGBEncoding,
  Texture,
  DataTexture,
} from 'three/build/three.module.js';

import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';

class Environment {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
  }

  set(texture, setBackground = true) {
    if (texture.isCubeTexture) {
      // TODO
    } else if (texture.isTexture) {
      const pmremGenerator = new PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromEquirectangular(texture)
        .texture;

      this.scene.environment = envMap;
      if (setBackground) this.scene.background = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    }
  }

  setBackground(value) {
    if (value.isColor) {
      this.scene.background = value;
    } else if (
      typeof value === 'number' ||
      typeof value === 'string'
    ) {
      this.scene.background = new Color(value);
      // TODO: handle conversion to sRGB if doing post processing
    } else {
      this.scene.background = value;
    }
  }
}

export { Environment };
