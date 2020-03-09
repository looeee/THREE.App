import { Clock } from 'three/build/three.module.js';

const clock = new Clock();

class Core {
  update(updatables) {
    const delta = clock.getDelta();
    for (const object of updatables) {
      if (typeof object.update === 'function') {
        object.update(delta);
      }
    }
  }

  render(renderer, scene, camera) {
    renderer.render(scene, camera);
  }

  start(renderer, scene, camera, updatables) {
    renderer.setAnimationLoop(() => {
      this.update(updatables);
      this.render(renderer, scene, camera);
    });
  }

  stop(renderer) {
    renderer.setAnimationLoop(null);
  }
}

export { Core };
