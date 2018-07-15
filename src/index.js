import Time from 'three-time';
import saveDataURI from './saveDataURI.js';
/**
 * @author Lewy Blue / https://github.com/looeee
 *
 */

let _scene;
let _camera;
let _renderer;
let _canvas;
let _THREE;

const setRendererSize = () => {

  if ( _renderer && _canvas ) _renderer.setSize( _canvas.clientWidth, _canvas.clientHeight, false );

};

const setCameraAspect = () => {

  if ( _camera && _canvas ) {
    _camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
    _camera.updateProjectionMatrix();
  }

};

const setPixelRatio = () => {

  if ( !_renderer ) return;

  if ( _renderer.getPixelRatio() !== window.devicePixelRatio ) {

    _renderer.setPixelRatio( window.devicePixelRatio );

  }

};

module.exports = class App {

  constructor( THREE, canvas ) {

    _THREE = THREE;

    if ( canvas !== undefined ) _canvas = canvas;
    else console.warn( 'Canvas is undefined! ' );

    this.canvas = _canvas;

    // to avoid page pulling
    this.canvas.addEventListener( 'touchstart', e => e.preventDefault() );

    this.autoRender = true;
    this.autoResize = true;

    this.time = new Time();
    this.frameCount = 0;
    this.delta = 0;

    this.isPlaying = false;
    this.isPaused = false;

    this.onResizeFunctions = [];
    this.onUpdateFunctions = [];
    this.preRenderFunctions = [];

    this.initOnWindowResize();

  }

  add( ...objects ) {

    this.scene.add( ...objects );

  }

  get averageFrameTime() {

    return ( this.frameCount !== 0 ) ? this.time.unscaledTotalTime / this.frameCount : 0;

  }

  get scene() {

    if ( _scene === undefined ) {

      _scene = new _THREE.Scene();

    }

    return _scene;

  }

  set scene( newScene ) { _scene = newScene; }

  get camera() {

    if ( _camera === undefined ) {

      _camera = new _THREE.PerspectiveCamera( 35, _canvas.clientWidth / _canvas.clientHeight, 0.1, 1000 );

    }

    return _camera;

  }

  set camera( newCamera ) {

    _camera = newCamera;
    setCameraAspect();

  }

  get renderer() {

    if ( _renderer === undefined ) {

      _renderer = new _THREE.WebGLRenderer( {
        powerPreference: 'high-performance',
        alpha: true,
        canvas: _canvas,
        antialias: true,
      } );

      _renderer.setPixelRatio( window.devicePixelRatio );
      _renderer.setSize( _canvas.clientWidth, _canvas.clientHeight, false );

    }

    return _renderer;

  }

  set renderer( newRenderer ) {

    _renderer = newRenderer;
    setRendererSize();

  }

  // each function registered here will be called once every time the browser window's size changes
  registerOnResizeFunction( func ) { this.onResizeFunctions.push( func ); }

  // each function registered here will be called once per frame
  registerOnUpdateFunction( func ) { this.onUpdateFunctions.push( func ); }

  // each function registered here will be called once per frame, after all onUpdate
  // functions are called. For renderTargets
  registerPreRenderFunction( func ) { this.preRenderFunctions.push( func ); }

  play() {

    if ( this.isPlaying && !this.isPaused ) return;

    const self = this;

    const onUpdate = () => {

      this.onUpdateFunctions.forEach( ( func ) => { func(); } );

    };

    const preRender = () => {

      this.preRenderFunctions.forEach( ( func ) => { func(); } );

    };

    this.render = () => {
      self.renderer.render( self.scene, self.camera );
    };

    this.update = () => {

      self.frameCount++;
      self.delta = self.time.delta;

      onUpdate();

      if ( self.controls && self.controls.enableDamping ) self.controls.update();

    };

    this.time.start();

    this.isPlaying = true;
    this.isPaused = false;

    self.renderer.setAnimationLoop( () => {

      self.update();
      preRender();
      self.render();

    } );

  }

  pause() {

    if ( this.isPaused ) return;

    this.isPaused = true;

    this.time.pause();

    this.renderer.setAnimationLoop( null );

  }

  stop() {

    this.isPlaying = false;
    this.isPaused = false;

    this.time.stop();
    this.frameCount = 0;

    this.renderer.setAnimationLoop( null );

  }

  initControls( OrbitControls, listenerElem ) {

    if ( typeof THREE.OrbitControls === 'function' ) this.controls = new THREE.OrbitControls( this.camera, listenerElem || _canvas );
    else if ( typeof OrbitControls === 'function' ) this.controls = new OrbitControls( this.camera, listenerElem || _canvas );

  }

  initOnWindowResize() {

    const self = this;

    const onResize = () => {

      this.onResizeFunctions.forEach( ( func ) => { func(); } );

    };

    const onWindowResize = () => {

      if ( !self.autoResize ) return;

      // don't do anything if the camera doesn't exist yet
      if ( !_camera ) return;

      if ( !_camera.isPerspectiveCamera ) {

        console.warn( 'App: AutoResize only works with PerspectiveCamera, you will need to set up a manual resize function for OrthographicCamera' );
        return;

      }

      setCameraAspect();
      setRendererSize();
      setPixelRatio();

      onResize();

      // draw a frame to prevent visual jank
      _renderer.render( self.scene, self.camera );

    };

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'orientationchange', onWindowResize );
  }

  fitCameraToObject( object, zOffset ) {

    zOffset = zOffset || 1;

    const boundingBox = new _THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( object );

    const center = boundingBox.getCenter( new _THREE.Vector3() );
    const size = boundingBox.getSize( new _THREE.Vector3() );

    // get the max side of the bounding box
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = this.camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

    cameraZ *= zOffset; // zoom out a little so that objects don't fill the screen

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = -minZ + cameraZ;

    const far = cameraToFarEdge * 3;
    this.camera.far = far;

    // camera near needs to be set to accommodate tiny objects
    // but not cause artefacts for large objects
    if ( far < 1 ) this.camera.near = 0.001;
    else if ( far < 100 ) this.camera.near = 0.01;
    else if ( far < 500 ) this.camera.near = 0.1;
    // else if ( far < 1000 ) this.camera.near = 1;
    else this.camera.near = 1;

    this.camera.position.set( center.x, size.y, cameraZ );

    this.camera.updateProjectionMatrix();

    if ( this.controls ) {
      // set camera to rotate around center of loaded object
      this.controls.target.copy( center );

      // // prevent camera from zooming out far enough to create far plane cutoff
      this.controls.maxDistance = cameraToFarEdge * 2;

      this.controls.update();
      this.controls.saveState();
    }

    return boundingBox;

  }

  takeScreenshot( width, height ) {

    // set camera and renderer to desired screenshot dimension if provided
    if ( width && height ) {
      _camera.aspect = width / height;
      _camera.updateProjectionMatrix();
      _renderer.setSize( width, height );

      // draw a frame at the new width and height
      _renderer.render( _scene, _camera, null, false );
    }

    // save the image
    saveDataURI( _renderer.domElement.toDataURL( 'image/png' ) );

    // reset the width and height if we changed them
    if ( width && height ) {

      setCameraAspect();
      setRendererSize();
      setPixelRatio();

    }

  }

};
