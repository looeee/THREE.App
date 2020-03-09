import { addTransformDebug } from './subfolders/addTransformDebug.js';

function setupModelsDebug(gui, models) {
  const folder = gui.addFolder('Models');
  addTransformDebug(folder, models.heart);
}

export { setupModelsDebug };
