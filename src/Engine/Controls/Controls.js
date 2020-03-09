import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Controls extends OrbitControls {
  constructor(camera, container) {
    super(camera, container);

    this.enableDamping = true;
  }

  setTarget(target) {
    if (target.isObject3D) {
      this.controls.target.copy(target.position);
    } else if (target.isVector3) {
      this.controls.target.copy(target);
    }
  }
}

export { Controls };
