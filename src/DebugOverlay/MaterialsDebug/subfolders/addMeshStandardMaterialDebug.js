import { addMaterialCommonParams } from './addMaterialCommonParams.js';
import { addMeshMaterialCommonParams } from './addMeshMaterialCommonParams.js';

function addMeshStandardMaterialDebug(folder, material) {
  const subfolder = folder.addFolder(material.name);

  addMaterialCommonParams(subfolder, material);
  addMeshMaterialCommonParams(subfolder, material);

  const params = {
    envMapIntensity: material.envMapIntensity,
    // bumpMap: material.bumpMap,
    // bumpScale: material.bumpScale,
    // displacementMap: material.displacementMap,
    // displacementScale: material.displacementScale,
    // displacementBias: material.displacementBias,
    emissive: material.emissive.getHex(),
    // emissiveMap: material.emissiveMap,
    emissiveIntensity: material.emissiveIntensity,
    metalness: material.metalness,
    // metalnessMap: material.metalnessMap,
    // morphNormals: material.morphNormals,
    // normalMap: material.normalMap,
    // normalMapType: material.normalMapType,
    // normalScale: material.normalScale,
    roughness: material.roughness,
  };

  subfolder
    .addColor(params, 'emissive')
    .name('Emissive Color')
    .onChange(() => {
      material.emissive.set(params.emissive);
      material.emissive.convertSRGBToLinear();
    });

  subfolder
    .add(params, 'emissiveIntensity', 0, 1, 0.01)
    .name('Emissive Intensity ')
    .onChange(() => {
      material.emissiveIntensity = params.emissiveIntensity;
    });

  subfolder
    .add(params, 'envMapIntensity', 0, 1, 0.01)
    .name('Environment Intensity')
    .onChange(() => {
      material.envMapIntensity = params.envMapIntensity;
    });

  subfolder
    .add(params, 'metalness', 0, 1, 0.1)
    .name('Metallic')
    .onChange(() => {
      material.metalness = params.metalness;
    });

  subfolder
    .add(params, 'roughness', 0, 1, 0.01)
    .name('Gloss/Rough')
    .onChange(() => {
      material.roughness = params.roughness;
    });
}

export { addMeshStandardMaterialDebug };
