function addMeshMaterialCommonParams(subfolder, material) {
  const params = {
    // alphaMap: material.alphaMap,
    // aoMap: material.aoMap,
    // aoMapIntensity: material.aoMapIntensity,
    color: material.color.getHex(),
    // envMap: material.envMap,
    // lightMap: material.lightMap,
    // lightMapIntensity: material.lightMapIntensity,
    // map: material.map,
    // morphTargets: material.morphTargets,
    skinning: material.skinning,
    wireframe: material.wireframe,
    refractionRatio: material.refractionRatio,
  };
  subfolder
    .addColor(params, 'color')
    .name('Color')
    .onChange(() => {
      material.color.set(params.color);
      material.color.convertSRGBToLinear();
    });
  subfolder
    .add(params, 'skinning')
    .name('Skinning')
    .onChange(() => {
      material.skinning = params.skinning;
    });
  subfolder
    .add(params, 'wireframe')
    .name('Wireframe')
    .onChange(() => {
      material.wireframe = params.wireframe;
    });
  subfolder
    .add(params, 'refractionRatio', 0.01, 3, 0.01)
    .name('Refraction Ratio')
    .onChange(() => {
      material.refractionRatio = params.refractionRatio;
    });
}

export { addMeshMaterialCommonParams };
