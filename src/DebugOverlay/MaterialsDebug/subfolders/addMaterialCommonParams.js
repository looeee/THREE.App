function addMaterialCommonParams(subfolder, material) {
  const params = {
    alphaTest: material.alphaTest,
    // blendDst: material.blendDst,
    // blendDstAlpha: material.blendDstAlpha,
    // blendEquation: material.blendEquation,
    // blendEquationAlpha: material.blendEquationAlpha,
    // blending: material.blending,
    // blendSrc: material.blendSrc,
    // blendSrcAlpha: material.blendSrcAlpha,
    // clipIntersection: material.clipIntersection,
    // clippingPlanes: material.clippingPlanes,
    // clipShadows: material.clipShadows,
    // colorWrite: material.colorWrite,
    // depthFunc: material.depthFunc,
    // depthTest: material.depthTest,
    // depthWrite: material.depthWrite,
    // stencilWrite: material.stencilWrite,
    // stencilFunc: material.stencilFunc,
    // stencilRef: material.stencilRef,
    // stencilMask: material.stencilMask,
    // stencilFail: material.stencilFail,
    // stencilZFail: material.stencilZFail,
    // stencilZPass: material.stencilZPass,
    flatShading: material.flatShading,
    // fog: material.fog,
    opacity: material.opacity,
    // polygonOffset: material.polygonOffset,
    // polygonOffsetFactor: material.polygonOffsetFactor,
    // polygonOffsetUnits: material.polygonOffsetUnits,
    // precision: material.precision,
    premultipliedAlpha: material.premultipliedAlpha,
    // shadowSide: material.shadowSide,
    // side: material.side,
    transparent: material.transparent,
    // vertexColors: material.vertexColors,
    // vertexTangents: material.vertexTangents,
    visible: material.visible,
  };
  subfolder
    .add(params, 'alphaTest', 0, 1, 0.01)
    .name('Alpha Cutout')
    .onChange(() => {
      material.alphaTest = params.alphaTest;
    });
  subfolder
    .add(params, 'flatShading')
    .name('Flat Shading')
    .onChange(() => {
      material.flatShading = params.flatShading;
    });
  subfolder
    .add(params, 'premultipliedAlpha')
    .name('Premultiplied_Alpha')
    .onChange(() => {
      material.premultipliedAlpha = params.premultipliedAlpha;
    });
  subfolder
    .add(params, 'transparent')
    .name('Transparent')
    .onChange(() => {
      material.transparent = params.transparent;
    });
  subfolder
    .add(params, 'opacity', 0, 1, 0.01)
    .name('Opacity')
    .onChange(() => {
      material.opacity = params.opacity;
    });
  subfolder
    .add(params, 'visible')
    .name('Visible')
    .onChange(() => {
      material.visible = params.visible;
    });
}

export { addMaterialCommonParams };
