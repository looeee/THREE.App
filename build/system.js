System.register([], function (exports, module) {
  'use strict';
  return {
    execute: function () {

      var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      /**
       * @author Lewy Blue / https://discoverthreejs.com
       *
       */
      var App = function () {
        function App(containerID) {
          var _this = this;

          _classCallCheck(this, App);

          containerID = containerID || 'container'; // default ID if none provided

          this.container = document.getElementById(containerID);

          if (!this.container) {

            console.error('Couldn\'t find the container element with ID #' + containerID + '!');

            return;
          }

          this.scene = new THREE.Scene();
          this.clock = new THREE.Clock();
          this.running = false;

          this.initCamera();
          this.initControls();
          this.initLoader();
          this.initRenderer();

          window.addEventListener('resize', function () {
            return _this.onWindowResize();
          });
        }

        _createClass(App, [{
          key: 'initCamera',
          value: function initCamera() {

            this.camera = new THREE.PerspectiveCamera(35, this.container.clientWidth / this.container.clientHeight, 1, 1000);
          }
        }, {
          key: 'initControls',
          value: function initControls() {

            // Case 1: controls loaded via <script> tag
            if (typeof THREE.OrbitControls === 'function') this.controls = new THREE.OrbitControls(this.camera, this.container);
            // Case 2: controls loaded as ES6 module
            else if (typeof OrbitControls === 'function') this.controls = new OrbitControls(this.camera, this.container);else return;

            // gives the controls a feeling of "weight"
            this.controls.enableDamping = true;
          }
        }, {
          key: 'initLoader',
          value: function initLoader() {

            if (typeof THREE.GLTFLoader === 'function') this.loader = new THREE.GLTFLoader();else if (typeof GLTFLoader === 'function') this.loader = new GLTFLoader();
          }
        }, {
          key: 'initRenderer',
          value: function initRenderer() {

            this.renderer = new THREE.WebGLRenderer({
              powerPreference: 'high-performance',
              alpha: true,
              antialias: true
            });

            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);

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

            if (this.controls) this.controls.update();

            // step through the scene and call custom onUpdate functions on any object
            // for which we have defined them
            this.scene.traverse(function (child) {

              if (child.userData.onUpdate) child.userData.onUpdate(delta);
            });
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

            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

            // render an extra frame to prevent jank
            this.renderer.render(this.scene, this.camera);
          }
        }]);

        return App;
      }();
      exports('default', App);

    }
  };
});
