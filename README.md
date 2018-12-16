# Three-app

A simple wrapper for [three.js](https://threejs.org/) that simplifies setting up a scene while following best practices for a small to medium size project.

three-app sets up all the boilerplate for you, leaving you free to concentrate on lighting, models and making your scenes look amazing!

It will also set up [OrbitControls](https://threejs.org/docs/#examples/controls/OrbitControls) as `App.controls` and the [GLTFLoader](https://threejs.org/docs/#examples/loaders/GLTFLoader) as `app.loader`. If you don't need controls or the loader, just leave out the scripts and they will be gracefully skipped. Simple!

## Features

* Automatic resizing
* VR ready
* [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
* [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
* [glTF Loader](https://threejs.org/docs/#examples/loaders/GLTFLoader)
* [Orbit Controls](https://threejs.org/docs/#examples/controls/OrbitControls)
* Simple canvas size setup using CSS

## Installation

### Via NPM

First install the package from NPM:

`npm install three-app`

Then in your JS:

```js
import * as THREE from './vendor/three.module.js';
import GLTFLoader from './vendor/GLTFLoader.js';
import OrbitControls from './vendor/OrbitControls.js';
import THREE_APP from 'three-app';

// add THREE to the global scope
window.THREE = THREE;
window.THREE.GLTFLoader = GLTFLoader;
window.THREE.OrbitControls = OrbitControls;

```

Then proceed to follow the usage instructions below.

Module aware tools such as Rollup or WebPack will load this as an [ES6 module](https://github.com/looeee/npm-three-app/blob/master/build/esm.js), other tools will import the [Universal Module Definition file](https://github.com/looeee/npm-three-app/blob/master/build/umd.js).

[System JS](https://github.com/looeee/npm-three-app/blob/master/build/system.js), [AMD](https://github.com/looeee/npm-three-app/blob/master/build/amd.js), and [Common JS](https://github.com/looeee/npm-three-app/blob/master/build/cjs.js) versions are also available on GitHub.

### From GitHub

  Alternatively, get [this file](https://github.com/looeee/npm-three-app/blob/master/build/iife.js) from GitHub and include it in your HTML:

  ``` html
  <script src="three_app/iife.js"></script>
  ```

## Demo

1. [Script tags](https://codesandbox.io/s/github/looeee/npm-three-app/tree/master/demo/script-tags)
2. [ES6 module imports](https://codesandbox.io/s/github/looeee/npm-three-app/tree/master/demo/module-import)

## Basic setup

### HTML

```html
<!DOCTYPE html>
<html>

  <head>

    <title>three-app demo</title>

    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

    <meta charset="UTF-8" />

    <link href="styles/main.css" rel="stylesheet" type="text/css">

    <!--

      For the time being, importing three.js add-ons such as
      OrbitControls and GLTFLoader as ES6 modules is a bit complex.

      For simplicity, we'll demonstrate how to use this while importing three.js
      files from the GitHub CDN.
      Don't do this in a production app!

      See the module import demo and the NPM install instructions above for
      details on how to use three-app via ES6 imports.

    -->

    <script src="https://threejs.org/build/three.js"></script>
    <script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
    <script src="https://threejs.org/examples/js/loaders/GLTFLoader.js"></script>

    <script src="three_app/iife.js"></script>

  </head>

  <body>

    <div id="container">
      <!-- This div will hold your scene-->
    </div>

    <!-- Your app -->
    <script src="main.js"></script>

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

Setting up the app takes just a couple of lines:

```js
const app = new THREE_APP( 'container' );

function init() {

  app.init();

  // you'll need to move the camera back a bit to view the scene
  app.camera.position.set( 0, 0, 5 );

  app.start();

}

init();

```

### Add A Mesh

``` js
const geo = new THREE.BoxBufferGeometry();
const mat = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geo, mat );

app.scene.add( mesh );
```

### Per Object Per Frame Updates

three-app puts each object in charge of updating itself - just put an `onUpdate` function in the object's `userData`:

```js
mesh.userData.onUpdate = ( delta ) => {

  mesh.rotation.x += delta;
  mesh.rotation.y += delta;
  mesh.rotation.z += delta;

}
```

three-app will look for `userData.onUpdate` on each object in the scene and call it once per frame.

A single parameter called `delta` is available which is the time elapsed since the previous frame - this can be used for smooth animation timing.

### Global Per Frame Update

Sometimes you will need to make per frame updates that are not tied to a particular object.

In this case, you can define the `app.onUpdate` function like this:

```js
app.onUpdate = ( delta ) => {

  // code called once per frame

}
```

Always keep your `onUpdate` functions as simple as possible!

### Custom `OnResize` function

If you need to do extra work when the resize event is called, define the function `app.onResize`:

``` js
app.onResize = () => {

  // code called whenever the resize event occurs

}

```

### Disable Automatic Resizing

If you would prefer to take charge of handling resizes yourself, just set `app.autoResize` to false. But make sure to do it _before_ you call `app.init` so that the resize events are not added!

```js
app.autoResize = false;

app.init();

// now you can set up your own resize handler:

window.addEventListener( 'resize', () => { ... } );
```

### Check If The App Is Running

A boolean `app.running` is available to check whether your app is running or not. This will add an event listener to start or stop your app on clicking:

```js
app.container.addEventListener( 'click', () => {

  app.running ? app.stop() : app.start();

} );
```

### The Camera

By default a [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) with the following setting is created:

* Field of View: 35,
* Aspect ratio: `container.clientWidth / container.clientHeight`
* 1
* 1000

Note that you will (almost) always want to move your camera back to view your scene! Otherwise any objects you create will be in the same position as your camera, meaning that your camera will be inside them and they will be invisible!

```js
app.camera.position.set( 0, 0, 5 );
```

You can change the camera entirely, for example to an [OrthographicCamera](https://threejs.org/docs/#api/en/cameras/OrthographicCamera), although note that automatic resizing only works with the default PerspectiveCamera.

```js
app.autoResize = false;

app.camera = new THREE.OrthographicCamera( ... );

app.init();
```

Or you can change setting for the default camera, but remember to call `updateProjectMatrix` after you change them! Checkout out Discover three.js [Chapter 1.1](https://discoverthreejs.com/book/1-first-steps/1-first-scene/) if you need a refresher on how the camera's frustum work.

```js
app.camera.fov = 60;
app.camera.near = 10;
app.camera.far = 100;

// update the camera's frustum.
app.camera.updateProjectionMatrix();
```

### The Renderer

A [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) with the following settings is created:

* antialias: true
* alpha: true
* powerPreference: 'high-performance'
* stencil: false

You can change these to whatever you like, but you'll need to do so before calling `app.init()`, since these can't be changed after the renderer has been created:

``` js
app.alpha = false;
app.antialias = true;
app.stencil = false;
app.powerPreference = 'default';

app.init();
```

If you prefer, you can set up your own renderer entirely:

```js
app.renderer = new THREE.WebGLRenderer( { yourOptions } );

app.init()
```

### Rendering

Once everything is set up, start your app using:

```js
app.start();
```

This sets up an animation loop that calls `app.render` and `app.update` once per frame.

### The Controls

If you have included the `OrbitControls.js` script then the controls will be set up for you and available in `app.controls`.

You can adjust the settings like this, after calling `app.init()`:

```js
app.controls.enablePan = false;
app.controls.autoRotate = true;
```

If you prefer, you can set up a different type of controls instead of OrbitControls:

```js
app.controls = new THREE.MapControls();

app.init();
```

### The Loader

If you have included the `GLTFLoader.js` script as described above, then the app will set this up for you and it will be available in `app.loader`. If you prefer, you can set up a different loader manually:

```js
app.loader = new THREE.FBXLoader();

app.init();
```

### Loading Models

If you included the [GLTFLoader](https://threejs.org/docs/#examples/loaders/GLTFLoader) script, then the app will have set this up in `app.loader` for you, using the [Default Loading Manager](https://threejs.org/docs/#api/en/loaders/managers/DefaultLoadingManager).

See Discover three.js [Chapter 1.7](https://discoverthreejs.com/book/1-first-steps/7-load-models/) for a brief intro to using this loader and an explanation of this function, or check out the demo above to see it in action.

``` js
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
```

The only difference here is that we are using the `model.userData.onUpdate` function to update the animations.

## Post-Processing

If you want to use post-processing or render targets you will need to overwrite `app.render()`. Here's how you would do that to use post-processing:

```js
// include post processing scripts and set up post processing
const composer = new THREE.EffectComposer( app.renderer );
composer.addPass( new THREE.RenderPass( app.scene, app.camera ) );
// ...add post-processing passes

// overwrite the render function to use the composer
app.render = () => {
  composer.render();
}
```

For more information on how the three.js animation loop works, see Discover three.js [Chapter 1.2](https://discoverthreejs.com/book/1-first-steps/2-lights-color-action/) and [Chapter 1.3](https://discoverthreejs.com/book/1-first-steps/3-resize/).


## Have Fun! :)

### License
All code is MIT licensed and free to use, modify, or distribute in any way that you wish. Have fun!