import { addMaterialCommonParams } from './addMaterialCommonParams.js';
import { addMeshMaterialCommonParams } from './addMeshMaterialCommonParams.js';

function addMeshBasicMaterialDebug(folder, material) {
  const subfolder = folder.addFolder(material.name);
  addMaterialCommonParams(subfolder, material);
  addMeshMaterialCommonParams(subfolder, material);
  const params = {
    // combine: material.combine,
    reflectivity: material.reflectivity,
  };
  subfolder
    .add(params, 'reflectivity', 0, 1, 0.01)
    .name('Reflectivity')
    .onChange(() => {
      material.reflectivity = params.reflectivity;
    });
}

export { addMeshBasicMaterialDebug };
