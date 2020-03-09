import { addMeshBasicMaterialDebug } from './subfolders/addMeshBasicMaterialDebug.js';
import { addMeshStandardMaterialDebug } from './subfolders/addMeshStandardMaterialDebug.js';

function setupMaterialsDebug(gui, materials) {
  const folder = gui.addFolder('Materials');

  for (const material of materials) {
    if (material.type === 'MeshBasicMaterial') {
      addMeshBasicMaterialDebug(folder, material);
    }
    if (
      material.type === 'MeshStandardMaterial' ||
      material.type === 'MeshPhysicalMaterial'
    ) {
      addMeshStandardMaterialDebug(folder, material);
    }
  }
}

export { setupMaterialsDebug };
