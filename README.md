# Three-app module by [Discover three.js](https://discoverthreejs.com/)

A simple wrapper for the THREE global object that simplifies setting up a three.js app.

## Tested up to three.js r95

## Installation

  `npm install three`
  `npm install three-app`

## Basic setup

This is the basic minimal setup for an App, it will create a [PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera) and automatically handle resizing on browser window size changes.

### HTML

```html
<!DOCTYPE html>
<html>

  <head>

    <title>Discoverthreejs.com - Ch 2.2</title>

    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

    <meta charset="UTF-8" />

    <link href="styles/main.css" rel="stylesheet" type="text/css">

    <!--

      For the time being, importing three.js addons such as OrbitControls and GLTFLoader
      as ES6 modules is a little problematic.

      three-app will work equally well whichever method you use, so for simplicity we'll
      demonstrate loading as script tag from the GitHub CDN (via threejs.org) here

    -->

    <script src="https://threejs.org/build/three.js"></script>
    <script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
    <script src="https://threejs.org/examples/js/loaders/GLTFLoader.js"></script>

  </head>

  <body>

    <div id="container">
      <!-- This div will hold our scene-->
    </div>

    <script></script>

  </body>

</html>
```

### CSS

The following CSS will make the scene take up the full screen

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

  // three-app will look for userData.onUpdate on each object in the scene and call it once per frame. A single parameter called delta is available which is the time elapsed since the previous frame - this can be used for smooth animation timing

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

By default a Perspective Camera with the following setting is created:

* Field of View: 35,
* Aspect ratio: canvas.clientWidth / canvas.clientHeight
* 0.1
* 1000

You can change the camera entirely, for example to an Orthographic Camera

```js
app.camera = new THREE.OrthographicCamera( ... );
```

Or you can change setting for the default camera, but remember to all `updateProjectMatrix` after you change them!

```js
app.camera.fov = 60;
app.camera.near = 10;
app.camera.far = 100;

app.camera.updateProjectionMatrix();
```

### Fit camera to object

To automatically zoom an object into view, use the `app.fitCameraToObject( object, zOffset )` method.

```js
app.add( object );
const zOffset = 1.5;
app.fitCameraToObject( object, zOffset );
```

This also sets the camera's near and far values, and if you are using OrbitControls then it also sets the control's target to the object position and updates `controls.maxDistance`. These are all set somewhat conservatively for maximum performance, which generally works but may cause problems if your model is animated and moves large distances.

## Orbit Controls

The app can automatically set up OrbitControls for you, however you will need to include the script seperately, either as as a `<script src="OrbitControls.js"></script>`, or
`import OrbitControls from './OrbitControls.module.js'`.

Once you have included the controls script, you can add set them up like so:

```js
app.initControls( OrbitControls );

// if you set damping to true, the app will handle the per frame controls.update() call
app.controls.enableDamping = true;
```

## The renderer

Internally, a WebGLRenderer with the following settings is created:

* antialias: true
* alpha: true
* powerPreference: 'high-performance'

If you want to use other options, just set `app.renderer = new WebGLRenderer( yourOptions )`.

## Rendering

By default, app.render() is called automatically each frame. This just calls `app.renderer.render( app.scene, app.camera )`. If you need to overwrite this, for example to add post-processing, then you can overwrite `app.render()`:

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

three-app uses a "Game Loop" concept to render each frame. This means that the animation loop is divided into two parts, both called once per frame:

* update(): handle updating of any animations, physics etc
* render(): render the scene

You can add additional `onUpdate` functions using `app.registerOnUpdateFunction( func )`, and then these are stored in an array called `app.onUpdateFunctions`. Before rendering each frame, the app loops over the functions and calls them one by one, in the order they are stored in the array.

## Timing

[three-time](https://www.npmjs.com/package/three-time) is used for timing, which means that you can play with the `app.time.timeScale` to create slow motion / speed up effect. Timescale less than 1 will slow down time, greater than 1 will speed it up.

```js
app.time.timeScale = 0.5; // run at half speed
```

In any onUpdate functions you, use `app.delta` for timing:

```js
const mixer = new THREE.AnimationMixer( object );

// this mixer will be updated each frame taking into account the timescale
const updateAnimation = () => {
  mixer.update( app.delta );
}

app.registerOnUpdateFunction( updateAnimation );
```

## Automatic resizing

If you are using a perspective camera (the default camera created by the App), then updating  the renderer and the perspective camera's frustum when the browser window changes size will handled automatically for you, by default.

If you want to add additional functions to be called each a resize even happens, then you can use `app.registerOnResizeFunction( func )`:

```js
const myOnResizeFunction = () => {
  console.log( 'The new window dimensions are: ', window.innerWidth, window.innerHeight );
}

app.registerOnResizeFunction( myOnResizeFunction );
```

As with `onUpdate` functions, any functions added this way will be stored in an array called `app.onResizeFunctions`.

If you would rather handle resizing entirely yourself, set

```js
app.autoResize = false;
```

## Render targets

You can easily set up render targets using `app.registerPreRenderFunction( func )`. Any function registered this way will be stored in an array called `app.preRenderFunctions`, and will be injected into the animation loop after `update()` but before `render()`.

Here is a very simple render target example:

```js
const target = new THREE.WebGLRenderTarget( 512, 512 );
// set target options here

const rtScene = new THREE.Scene();

const rtCamera = new THREE.PerspectiveCamera( 50, 1, 1, 100 );
rtCamera.position.set( 0, 0, -8 );

// add a simple purple cube to the rtScene
const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
const cube = new THREE.Mesh( geometry, material );
rtScene.add( cube );

app.registerOnUpdateFunction( ( ) => {
  cube.rotation.x += 0.001 * app.delta;
  cube.rotation.y += 0.001 * app.delta;
  cube.rotation.z += 0.001 * app.delta;
} );

app.registerPreRenderFunction( () => {

  app.renderer.render( rtScene, rtCamera, target );

} );

const rtMaterial = new THREE.MeshBasicMaterial( { map: target.texture } );
```

Now you can apply the material to any object and it will have a snazzy spinning purple cube on it

## License
All code is MIT licensed and free to use, modify, or distribute in any way that you wish. Have fun!