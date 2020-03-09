import { setupControlsDebug } from './subfolders/setupControlsDebug.js';
import { setupPerspectiveCameraDebug } from './subfolders/setupPerspectiveCameraDebug.js';

function setupCameraDebug(gui, camera, controls) {
  const folder = gui.addFolder('Camera and Controls');

  setupPerspectiveCameraDebug(folder, camera);

  // setupControlsDebug(folder, controls);
}

export { setupCameraDebug };
