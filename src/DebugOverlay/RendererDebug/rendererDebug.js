import {
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  Uncharted2ToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping,
} from '/node_modules/three/build/three.module.js';

import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';

function setupRendererDebug(gui, renderer) {
  let _renderer;
  if (renderer instanceof EffectComposer) {
    _renderer = renderer.renderer;
  } else {
    _renderer = renderer;
  }

  const folder = gui.addFolder('Renderer');
  folder.open();

  const params = {
    // autoClear: _renderer.autoClear,
    // autoClearColor: _renderer.autoClearColor,
    // autoClearDept: _renderer.autoClearDepth,
    // autoClearStencil: _renderer.autoClearStencil,
    gammaFactor: _renderer.gammaFactor,
    outputEncoding: _renderer.outputEncoding,
    // localClippingEnable: _renderer.localClippingEnabled,
    // maxMorphTargets: _renderer.maxMorphTargets,
    // maxMorphNormals: _renderer.maxMorphNormals,
    // physicallyCorrectLights: _renderer.physicallyCorrectLights,
    // shadowMap: _renderer.shadowMap,
    'shadowMap.enabled': _renderer.shadowMap.enabled,
    'shadowMap.autoUpdate': _renderer.shadowMap.autoUpdate,
    'shadowMap.needsUpdate': _renderer.shadowMap.needsUpdate,
    'shadowMap.type': _renderer.shadowMap.type,
    // sortObjects: _renderer.sortObjects,
    toneMapping: _renderer.toneMapping,
    toneMappingWhitePoint: _renderer.toneMappingWhitePoint,
    toneMappingExposure: _renderer.toneMappingExposure,
    // forceContextLoss: _renderer.forceContextLoss,
  };

  // folder
  //   .add(params, 'gammaFactor', 0.1, 8.0, 0.1)
  //   .name('gammaFactor')
  //   .onChange(() => {
  //     _renderer.gammaFactor = params.gammaFactor;
  //   });
  // folder
  //   .add(params, 'toneMapping', {
  //     NoToneMapping,
  //     LinearToneMapping,
  //     ReinhardToneMapping,
  //     Uncharted2ToneMapping,
  //     CineonToneMapping,
  //     ACESFilmicToneMapping,
  //   })
  //   .name('toneMapping')
  //   .onChange(() => {
  //     _renderer.toneMapping = params.toneMapping;
  //   });
  folder
    .add(params, 'toneMappingExposure', 0.001, 2.0, 0.001)
    .name('toneMappingExposure')
    .onChange(() => {
      _renderer.toneMappingExposure = params.toneMappingExposure;
    });
  // folder
  //   .add(params, 'toneMappingWhitePoint', 0.001, 2.0, 0.001)
  //   .name('toneMappingWhitePoint')
  //   .onChange(() => {
  //     _renderer.toneMappingWhitePoint = params.toneMappingWhitePoint;
  //   });
}

export { setupRendererDebug };
