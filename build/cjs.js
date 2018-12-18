'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Lewy Blue / https://discoverthreejs.com
 *
 */
var THREE_APP = function () {
  function THREE_APP(container) {
    _classCallCheck(this, THREE_APP);

    container = container || '#container'; // default ID if none provided

    this.container = document.querySelector(container);

    if (!this.container) {

      console.error('Couldn\'t find the container element: ' + container);

      return;
    }

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.running = false;

    // make sure to set these to the values you want before calling init
    // since they can't be changed without creating a new WebGLRenderer
    this.alpha = false;
    this.antialias = true;
    this.powerPreference = 'high-performance';
    this.stencil = false;

    // this also needs to be set before calling init()
    this.autoResize = true;

    // set this to a value less than 3 to increase performance on low power mobile devices with high pixel ratio
    this.maxPixelRatio = Infinity;

    this.onUpdate = null;
    this.onResize = null;
  }

  _createClass(THREE_APP, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.initCamera();
      this.initControls();
      this.initLoader();
      this.initRenderer();

      if (this.autoResize) window.addEventListener('resize', function () {
        return _this.onWindowResize();
      });
    }
  }, {
    key: 'initCamera',
    value: function initCamera() {

      if (!this.camera) this.camera = new THREE.PerspectiveCamera(35, this.container.clientWidth / this.container.clientHeight, 1, 1000);
    }
  }, {
    key: 'initControls',
    value: function initControls() {

      // allow custom controls to be set up
      if (this.controls) return;

      // if the controls script was loaded, we'll set them up
      if (typeof THREE.OrbitControls === 'function') this.controls = new THREE.OrbitControls(this.camera, this.container);

      // otherwise we'll skip them
      else return;

      // gives the controls a feeling of "weight"
      this.controls.enableDamping = true;
    }
  }, {
    key: 'initLoader',
    value: function initLoader() {

      // allow custom loader to be set up
      if (this.loader) return;

      if (typeof THREE.GLTFLoader === 'function') this.loader = new THREE.GLTFLoader();
    }
  }, {
    key: 'initRenderer',
    value: function initRenderer() {

      // allow custom renderer to be set up
      if (this.renderer) return;

      this.renderer = new THREE.WebGLRenderer({
        powerPreference: this.powerPreference,
        alpha: this.alpha,
        antialias: this.antialias,
        stencil: this.stencil
      });

      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.maxPixelRatio));

      // to avoid page pulling
      this.renderer.domElement.addEventListener('touchstart', function (e) {
        return e.preventDefault();
      });

      this.container.appendChild(this.renderer.domElement);
    }
  }, {
    key: 'render',
    value: function render() {

      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: 'update',
    value: function update() {

      var delta = this.clock.getDelta();

      if (this.controls && this.controls.update) this.controls.update();

      // step through the scene and call custom onUpdate functions on any object
      // for which we have defined them
      this.scene.traverse(function (child) {

        if (child.userData.onUpdate) child.userData.onUpdate(delta);
      });

      if (this.onUpdate) this.onUpdate(delta);
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      // clear previous delta to prevent large delta values when
      // starting and stopping the app
      this.clock.getDelta();

      this.renderer.setAnimationLoop(function () {

        _this2.update();
        _this2.render();
      });

      this.running = true;
    }
  }, {
    key: 'stop',
    value: function stop() {

      this.renderer.setAnimationLoop(null);

      this.running = false;
    }
  }, {
    key: 'onWindowResize',
    value: function onWindowResize() {

      if (!this.autoResize) return;

      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;

      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.maxPixelRatio));

      // render an extra frame to prevent jank
      this.renderer.render(this.scene, this.camera);

      if (this.onResize) this.onResize();
    }
  }]);

  return THREE_APP;
}();

module.exports = THREE_APP;
