import * as THREE from './vendor/three.module.js';
import GLTFLoader from './vendor/GLTFLoader.js';
import OrbitControls from './vendor/OrbitControls.js';
import THREE_APP from 'three-app';

window.THREE = THREE;
window.THREE.GLTFLoader = GLTFLoader;
window.THREE.OrbitControls = OrbitControls;

const app = new THREE_APP( 'container' );

function initLights() {

  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  app.scene.add( ambientLight );

  const frontLight = new THREE.DirectionalLight( 0xffffff, 1 );
  frontLight.position.set( 10, 10, 10 );

  const backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  backLight.position.set( -10, 10, -10 );

  app.scene.add( frontLight, backLight );

}

function loadModels() {

  // A reusable function to setup the models
  const onLoad = ( gltf, position ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

    const animation = gltf.animations[ 0 ];
    const mixer = new THREE.AnimationMixer( model );

    // we'll check every object in the scene for
    // this function and call it once per frame
    model.userData.onUpdate = ( delta ) => {

      mixer.update( delta );

    };

    const action = mixer.clipAction( animation );
    action.play();

    app.scene.add( model );

  };

  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3( 0, 0, 50 );
  app.loader.load( 'https://threejs.org/examples/models/gltf/Parrot.glb', gltf => onLoad( gltf, parrotPosition ), null, onError );

  const flamingoPosition = new THREE.Vector3( 150, 0, -200 );
  app.loader.load( 'https://threejs.org/examples/models/gltf/Flamingo.glb', gltf => onLoad( gltf, flamingoPosition ), null, onError );

  const storkPosition = new THREE.Vector3( 0, -50, -200 );
  app.loader.load( 'https://threejs.org/examples/models/gltf/Stork.glb', gltf => onLoad( gltf, storkPosition ), null, onError );

}

function init() {

  app.init();

  app.scene.background = new THREE.Color( 0x8FBCD4 );
  app.camera.position.set( -50, 50, 150 );

  app.controls.enablePan = false;

  initLights();
  loadModels();

  app.start();

  app.container.addEventListener( 'click', () => {

    app.running ? app.stop() : app.start();

  } );

}

init();
