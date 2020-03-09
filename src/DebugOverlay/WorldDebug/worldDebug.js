import { highlightsDebug } from './subfolders/highlightsDebug.js';
import { startStopDebug } from './subfolders/startStopDebug.js';

function setupWorldDebug(gui, world) {
  const folder = gui.addFolder('Main');
  folder.open();

  startStopDebug(folder, world);
  highlightsDebug(folder, world);
}

export { setupWorldDebug };
