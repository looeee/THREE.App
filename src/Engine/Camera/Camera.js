import { PerspectiveCamera } from '/node_modules/three/build/three.module.js';

class Camera extends PerspectiveCamera {
  constructor(container) {
    super(35, container.clientWidth / container.clientHeight, 1, 500);

    this.position.set(-5, 10, 25);
  }

  resize(container) {
    this.aspect = container.clientWidth / container.clientHeight;

    this.updateProjectionMatrix();
  }

}

export { Camera };
