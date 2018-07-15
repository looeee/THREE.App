(function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var build = createCommonjsModule(function (module) {
	(function () {

	  /**
	   * @author Lewy Blue / https://github.com/looeee
	   */

	  module.exports = function Time() {

	    // Keep track of time when pause() was called
	    var _pauseTime = null;

	    // Keep track of time when delta was last checked
	    var _lastDelta = 0;

	    // Hold the time when start() was called
	    // There is no point in exposing this as it's essentially a random number
	    // and will be different depending on whether performance.now or Date.now is used
	    var _startTime = 0;

	    this.running = false;
	    this.paused = false;

	    // The scale at which the time is passing. This can be used for slow motion effects.
	    var _timeScale = 1.0;
	    // Keep track of scaled time across scale changes
	    var _totalTimeAtLastScaleChange = 0;
	    var _timeAtLastScaleChange = 0;

	    Object.defineProperties(this, {

	      now: {
	        get: function get() {

	          return (performance || Date).now();
	        }
	      },

	      timeScale: {
	        get: function get() {

	          return _timeScale;
	        },
	        set: function set(value) {

	          _totalTimeAtLastScaleChange = this.totalTime;
	          _timeAtLastScaleChange = this.now;
	          _timeScale = value;
	        }
	      },

	      unscaledTotalTime: {
	        get: function get() {

	          return this.running ? this.now - _startTime : 0;
	        }
	      },

	      totalTime: {
	        get: function get() {

	          var diff = (this.now - _timeAtLastScaleChange) * this.timeScale;

	          return this.running ? _totalTimeAtLastScaleChange + diff : 0;
	        }
	      },

	      // Unscaled time since delta was last checked
	      unscaledDelta: {
	        get: function get() {

	          var diff = this.now - _lastDelta;
	          _lastDelta = this.now;

	          return diff;
	        }
	      },

	      // Scaled time since delta was last checked
	      delta: {
	        get: function get() {

	          return this.unscaledDelta * this.timeScale;
	        }
	      }

	    });

	    this.start = function () {

	      if (this.paused) {

	        var diff = this.now - _pauseTime;

	        _startTime += diff;
	        _lastDelta += diff;
	        _timeAtLastScaleChange += diff;
	      } else if (!this.running) {

	        _startTime = _lastDelta = _timeAtLastScaleChange = this.now;

	        _totalTimeAtLastScaleChange = 0;
	      }

	      this.running = true;
	      this.paused = false;
	    };

	    // Reset and stop clock
	    this.stop = function () {

	      _startTime = 0;
	      _totalTimeAtLastScaleChange = 0;

	      this.running = false;
	    };

	    this.pause = function () {

	      _pauseTime = this.now;

	      this.paused = true;
	    };
	  };

	}());
	});

	// functions borrowed from https://github.com/mattdesl/threejs-app/blob/master/src/webgl/WebGLApp.js

	function dataURIToBlob(dataURI) {
	  var binStr = window.atob(dataURI.split(',')[1]);
	  var len = binStr.length;
	  var arr = new Uint8Array(len);
	  for (var i = 0; i < len; i++) {
	    arr[i] = binStr.charCodeAt(i);
	  }
	  return new window.Blob([arr]);
	}

	function defaultFileName(ext) {
	  var str = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString() + ext;
	  return str.replace(/\//g, '-').replace(/:/g, '.');
	}

	function saveDataURI(dataURI, name) {

	  if (!name) name = defaultFileName('.png');
	  var blob = dataURIToBlob(dataURI);

	  // force download
	  var link = document.createElement('a');
	  link.download = name;
	  link.href = window.URL.createObjectURL(blob);
	  link.onclick = function () {
	    window.setTimeout(function () {
	      window.URL.revokeObjectURL(blob);
	      link.removeAttribute('href');
	    }, 500);
	  };
	  link.click();
	}

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	/**
	 * @author Lewy Blue / https://github.com/looeee
	 *
	 */

	var _scene = void 0;
	var _camera = void 0;
	var _renderer = void 0;
	var _canvas = void 0;
	var _THREE = void 0;

	var setRendererSize = function setRendererSize() {

	  if (_renderer && _canvas) _renderer.setSize(_canvas.clientWidth, _canvas.clientHeight, false);
	};

	var setCameraAspect = function setCameraAspect() {

	  if (_camera && _canvas) {
	    _camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
	    _camera.updateProjectionMatrix();
	  }
	};

	var setPixelRatio = function setPixelRatio() {

	  if (!_renderer) return;

	  if (_renderer.getPixelRatio() !== window.devicePixelRatio) {

	    _renderer.setPixelRatio(window.devicePixelRatio);
	  }
	};

	module.exports = function () {
	  function App(THREE, canvas) {
	    _classCallCheck(this, App);

	    _THREE = THREE;

	    if (canvas !== undefined) _canvas = canvas;else console.warn('Canvas is undefined! ');

	    this.canvas = _canvas;

	    // to avoid page pulling
	    this.canvas.addEventListener('touchstart', function (e) {
	      return e.preventDefault();
	    });

	    this.autoRender = true;
	    this.autoResize = true;

	    this.time = new build();
	    this.frameCount = 0;
	    this.delta = 0;

	    this.isPlaying = false;
	    this.isPaused = false;

	    this.onResizeFunctions = [];
	    this.onUpdateFunctions = [];
	    this.preRenderFunctions = [];

	    this.initOnWindowResize();
	  }

	  _createClass(App, [{
	    key: 'add',
	    value: function add() {
	      var _scene2;

	      (_scene2 = this.scene).add.apply(_scene2, arguments);
	    }
	  }, {
	    key: 'registerOnResizeFunction',


	    // each function registered here will be called once every time the browser window's size changes
	    value: function registerOnResizeFunction(func) {
	      this.onResizeFunctions.push(func);
	    }

	    // each function registered here will be called once per frame

	  }, {
	    key: 'registerOnUpdateFunction',
	    value: function registerOnUpdateFunction(func) {
	      this.onUpdateFunctions.push(func);
	    }

	    // each function registered here will be called once per frame, after all onUpdate
	    // functions are called. For renderTargets

	  }, {
	    key: 'registerPreRenderFunction',
	    value: function registerPreRenderFunction(func) {
	      this.preRenderFunctions.push(func);
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      var _this = this;

	      if (this.isPlaying && !this.isPaused) return;

	      var self = this;

	      var onUpdate = function onUpdate() {

	        _this.onUpdateFunctions.forEach(function (func) {
	          func();
	        });
	      };

	      var preRender = function preRender() {

	        _this.preRenderFunctions.forEach(function (func) {
	          func();
	        });
	      };

	      this.render = function () {
	        self.renderer.render(self.scene, self.camera);
	      };

	      this.update = function () {

	        self.frameCount++;
	        self.delta = self.time.delta;

	        onUpdate();

	        if (self.controls && self.controls.enableDamping) self.controls.update();
	      };

	      this.time.start();

	      this.isPlaying = true;
	      this.isPaused = false;

	      self.renderer.setAnimationLoop(function () {

	        self.update();
	        preRender();
	        self.render();
	      });
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {

	      if (this.isPaused) return;

	      this.isPaused = true;

	      this.time.pause();

	      this.renderer.setAnimationLoop(null);
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {

	      this.isPlaying = false;
	      this.isPaused = false;

	      this.time.stop();
	      this.frameCount = 0;

	      this.renderer.setAnimationLoop(null);
	    }
	  }, {
	    key: 'initControls',
	    value: function initControls(OrbitControls, listenerElem) {

	      if (typeof THREE.OrbitControls === 'function') this.controls = new THREE.OrbitControls(this.camera, listenerElem || _canvas);else if (typeof OrbitControls === 'function') this.controls = new OrbitControls(this.camera, listenerElem || _canvas);
	    }
	  }, {
	    key: 'initOnWindowResize',
	    value: function initOnWindowResize() {
	      var _this2 = this;

	      var self = this;

	      var onResize = function onResize() {

	        _this2.onResizeFunctions.forEach(function (func) {
	          func();
	        });
	      };

	      var onWindowResize = function onWindowResize() {

	        if (!self.autoResize) return;

	        // don't do anything if the camera doesn't exist yet
	        if (!_camera) return;

	        if (!_camera.isPerspectiveCamera) {

	          console.warn('App: AutoResize only works with PerspectiveCamera, you will need to set up a manual resize function for OrthographicCamera');
	          return;
	        }

	        setCameraAspect();
	        setRendererSize();
	        setPixelRatio();

	        onResize();

	        // draw a frame to prevent visual jank
	        _renderer.render(self.scene, self.camera);
	      };

	      window.addEventListener('resize', onWindowResize, false);
	      window.addEventListener('orientationchange', onWindowResize);
	    }
	  }, {
	    key: 'fitCameraToObject',
	    value: function fitCameraToObject(object, zOffset) {

	      zOffset = zOffset || 1;

	      var boundingBox = new _THREE.Box3();

	      // get bounding box of object - this will be used to setup controls and camera
	      boundingBox.setFromObject(object);

	      var center = boundingBox.getCenter(new _THREE.Vector3());
	      var size = boundingBox.getSize(new _THREE.Vector3());

	      // get the max side of the bounding box
	      var maxDim = Math.max(size.x, size.y, size.z);
	      var fov = this.camera.fov * (Math.PI / 180);
	      var cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

	      cameraZ *= zOffset; // zoom out a little so that objects don't fill the screen

	      var minZ = boundingBox.min.z;
	      var cameraToFarEdge = -minZ + cameraZ;

	      var far = cameraToFarEdge * 3;
	      this.camera.far = far;

	      // camera near needs to be set to accommodate tiny objects
	      // but not cause artefacts for large objects
	      if (far < 1) this.camera.near = 0.001;else if (far < 100) this.camera.near = 0.01;else if (far < 500) this.camera.near = 0.1;
	      // else if ( far < 1000 ) this.camera.near = 1;
	      else this.camera.near = 1;

	      this.camera.position.set(center.x, size.y, cameraZ);

	      this.camera.updateProjectionMatrix();

	      if (this.controls) {
	        // set camera to rotate around center of loaded object
	        this.controls.target.copy(center);

	        // // prevent camera from zooming out far enough to create far plane cutoff
	        this.controls.maxDistance = cameraToFarEdge * 2;

	        this.controls.update();
	        this.controls.saveState();
	      }

	      return boundingBox;
	    }
	  }, {
	    key: 'takeScreenshot',
	    value: function takeScreenshot(width, height) {

	      // set camera and renderer to desired screenshot dimension if provided
	      if (width && height) {
	        _camera.aspect = width / height;
	        _camera.updateProjectionMatrix();
	        _renderer.setSize(width, height);

	        // draw a frame at the new width and height
	        _renderer.render(_scene, _camera, null, false);
	      }

	      // save the image
	      saveDataURI(_renderer.domElement.toDataURL('image/png'));

	      // reset the width and height if we changed them
	      if (width && height) {

	        setCameraAspect();
	        setRendererSize();
	        setPixelRatio();
	      }
	    }
	  }, {
	    key: 'averageFrameTime',
	    get: function get() {

	      return this.frameCount !== 0 ? this.time.unscaledTotalTime / this.frameCount : 0;
	    }
	  }, {
	    key: 'scene',
	    get: function get() {

	      if (_scene === undefined) {

	        _scene = new _THREE.Scene();
	      }

	      return _scene;
	    },
	    set: function set(newScene) {
	      _scene = newScene;
	    }
	  }, {
	    key: 'camera',
	    get: function get() {

	      if (_camera === undefined) {

	        _camera = new _THREE.PerspectiveCamera(35, _canvas.clientWidth / _canvas.clientHeight, 0.1, 1000);
	      }

	      return _camera;
	    },
	    set: function set(newCamera) {

	      _camera = newCamera;
	      setCameraAspect();
	    }
	  }, {
	    key: 'renderer',
	    get: function get() {

	      if (_renderer === undefined) {

	        _renderer = new _THREE.WebGLRenderer({
	          powerPreference: 'high-performance',
	          alpha: true,
	          canvas: _canvas,
	          antialias: true
	        });

	        _renderer.setPixelRatio(window.devicePixelRatio);
	        _renderer.setSize(_canvas.clientWidth, _canvas.clientHeight, false);
	      }

	      return _renderer;
	    },
	    set: function set(newRenderer) {

	      _renderer = newRenderer;
	      setRendererSize();
	    }
	  }]);

	  return App;
	}();

}());
