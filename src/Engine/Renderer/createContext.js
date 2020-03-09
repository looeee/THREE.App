import { WEBGL } from '/node_modules/three/examples/jsm/WebGL.js';

function createContext(canvas, antialias) {
  const contextAttributes = {
    alpha: false,
    antialias,
    depth: true,
    desynchronized: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'high-performance',
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: false,
  };

  if (WEBGL.isWebGL2Available()) {
    console.log('Using WebGL2');
    return canvas.getContext('webgl2', contextAttributes);
  }
  console.log('Using WebGL');
  return (
    canvas.getContext('webgl', contextAttributes) ||
    canvas.getContext('experimental-webgl', contextAttributes)
  );
}

export { createContext };
