# Three-app

A simple wrapper for [three.js](https://threejs.org/) that simplifies setting up a scene that follows best practices for a small to medium size project.

## Features

* Automatic resizing
* VR ready
* [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
* [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
* [glTF Loader](https://threejs.org/docs/#examples/loaders/GLTFLoader)
* [Orbit Controls](https://threejs.org/docs/#examples/controls/OrbitControls)
* The scene will match the size of the containing div, making it easy to style with CSS

## Installation

  `npm install three-app`

## Demo

* [script tags](https://codesandbox.io/s/github/looeee/npm-three-app/tree/master/demo?module=%2Fjs%2Fapp.js)
* ES6 imports (TODO)


## Basic setup


### HTML

```html
<!DOCTYPE html>
<html>

  <head>

    <title>Discoverthreejs.com - three-app module demo</title>

    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

    <meta charset="UTF-8" />

    <link href="styles/main.css" rel="stylesheet" type="text/css">

    <!--

      For the time being, importing three.js addons such as OrbitControls and GLTFLoader
      as ES6 modules is a bit complex.

      three-app will work equally well whichever method you use, so for simplicity we'll
      demonstrate loading as script tag from the GitHub CDN (via threejs.org) here.

    -->

    <script src="https://threejs.org/build/three.js"></script>
    <script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
    <script src="https://threejs.org/examples/js/loaders/GLTFLoader.js"></script>

  </head>

  <body>

    <div id="container">
      <!-- This div will hold your scene-->
    </div>

    <!-- Your app -->
    <script src="app.js"></script>

  </body>

</html>
```

### CSS

The following CSS will make the scene take up the full screen.

``` css
body {
  margin: 0px;
  overflow: hidden;
}

#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
```

### JavaScript

The App handles setting up all the boilerplate for you, leaving you free to concentrate on lighting, models and making your scenes look amazing!

It will also set up [OrbitControls](https://threejs.org/docs/#examples/controls/OrbitControls) as `App.controls` and the [GLTFLoader](https://threejs.org/docs/#examples/loaders/GLTFLoader) as `app.loader`.

If you don't need controls or the loader, just leave out the scripts and they will be gracefully skipped. Simple!

```js
import App from 'three-app';

const app = new App( 'container' );

app.scene.background = new THREE.Color( 0x8FBCD4 );
app.camera.position.set( -50, 50, 150 );

function initLights() {

  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  app.scene.add( ambientLight );

  const frontLight = new THREE.DirectionalLight( 0xffffff, 1 );
  frontLight.position.set( 10, 10, 10 );

  const backLight = new THREE.DirectionalLight( 0xffffff, 1 );
  backLight.position.set( -10, 10, -10 );

  app.scene.add( frontLight, backLight );

}

// create a simple rotating box mesh
function initMeshes() {

  const geo = new THREE.BoxBufferGeometry( 2, 2, 2 );
  const mat = new THREE.MeshBasicMaterial();

  const mesh = new THREE.Mesh( geo, mat );

  // three-app will look for userData.onUpdate on each object in the scene and call it once per frame.
  // A single parameter called delta is available which is the time elapsed since the previous frame - this can be used for smooth animation timing
  mesh.userData.onUpdate = ( delta ) => {

    mesh.rotation.x += delta;
    mesh.rotation.y += delta;
    mesh.rotation.z += delta;

  }
}

// See https://discoverthreejs.com/book/1-first-steps/7-load-models/
// for an explanation of this function
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
  app.loader.load( 'models/Parrot.glb', gltf => onLoad( gltf, parrotPosition ), null, onError );

  const flamingoPosition = new THREE.Vector3( 150, 0, -200 );
  app.loader.load( 'models/Flamingo.glb', gltf => onLoad( gltf, flamingoPosition ), null, onError );

  const storkPosition = new THREE.Vector3( 0, -50, -200 );
  app.loader.load( 'models/Stork.glb', gltf => onLoad( gltf, storkPosition ), null, onError );

}

initLights();
loadModels();

app.start();

// start and stop the app on click
app.container.addEventListener( 'click', ( e ) => {

  app.running ? app.stop() : app.start();

} );

```

## The Camera

By default a [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) with the following setting is created:

* Field of View: 35,
* Aspect ratio: container.clientWidth / container.clientHeight
* 1
* 1000

You can change the camera entirely, for example to an Orthographic Camera

```js
app.camera = new THREE.OrthographicCamera( ... );
```

Or you can change setting for the default camera, but remember to call `updateProjectMatrix` after you change them! Checkout out Discover three.js [Chapter 1.1](https://discoverthreejs.com/book/1-first-steps/1-first-scene/) if you need a refresher on how the camera's frustum work.

```js
app.camera.fov = 60;
app.camera.near = 10;
app.camera.far = 100;

// update the camera's frustum.
app.camera.updateProjectionMatrix();
```

## The renderer

A [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) with the following settings is created:

* antialias: true
* alpha: true
* powerPreference: 'high-performance'

If you want to use other options, just set `app.renderer = new THREE.WebGLRenderer( { yourOptions } )`.

## Rendering

By default, `app.render()` is called automatically each frame. This just calls `app.renderer.render( app.scene, app.camera )`. If you need to overwrite this, for example to add post-processing, then you can overwrite `app.render()`:

```js
// include post processing scripts and set up post processing
const composer = new THREE.EffectComposer( app.renderer );
composer.addPass( new THREE.RenderPass( app.scene, app.camera ) );
// ...add post-processing passes

app.render = () => {
  composer.render();
}
```

## The animation loop

three-app uses a "Game Loop" concept to render each frame. This means that the animation loop is divided into two parts, each called once per frame:

* `update()`: handle updating of any animations, physics etc
* `render()`: render the scene

The `update` functions looks through all the objects in the scene for a custom function defined in `myObject.userData.onUpdate` and call this once per frame.

The `delta` parameter which stores the elapsed time since the previous frame is available inside this function.

## License
All code is MIT licensed and free to use, modify, or distribute in any way that you wish. Have fun!