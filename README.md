# Three-app module by [Discover three.js](https://discoverthreejs.com/)

A simple wrapper for the THREE global object that simplifies setting up a three.js app.

## Installation

  `npm install three-app`
  `npm install three`

## Basic setup

### HTML

```html
<canvas id="my-canvas"></canvas>
```

### JavaScript

This is the basic minimal setup for an App, it will create a [PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera) and automatically handle resizing on browser window size changes.

```js
import * as THREE from 'three';
import App from 'three-app';

const canvas = document.querySelector( '#my-canvas' );

const app = new App( THREE, canvas );

// add a simple purple cube
const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
const cube = new THREE.Mesh( geometry, material );
app.add( cube );

const rotateCube = ( cube ) => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
}

// register a function to be called once per frame, you can
// add as many functions as you like this way
app.registerOnUpdateFunction( rotateCube );

// start the app running
this.app.play();

// a running total of the total frames rendered so far
const howManyFrames = app.frameCount;

// get the frames per second since app.play was called
const fps = app.averageFrameTime;

// pause app but don't reset timers / frame count
this.app.pause();

// stop app and reset all timers / frame count
this.app.stop();
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