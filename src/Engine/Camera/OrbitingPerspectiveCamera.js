import {
  PerspectiveCamera,
  Vector3,
  Object3D,
} from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

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

export { OrbitingPerspectiveCamera };
