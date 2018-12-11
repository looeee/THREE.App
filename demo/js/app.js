class App {

  constructor( containerID ) {

    containerID = containerID || 'container'; // default ID if none provided

    this.container = document.getElementById( containerID );

    if ( !this.container ) {

      console.error( `Couldn't find the container element with ID #${containerID}!` );

      return;

    }

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.running = false;

    this.initCamera();
    this.initControls();
    this.initLoader();
    this.initRenderer();

    window.addEventListener( 'resize', () => this.onWindowResize() );

  }

  initCamera() {

    this.camera = new THREE.PerspectiveCamera( 35, this.container.clientWidth / this.container.clientHeight, 1, 1000 );

  }

  initControls() {

    // Case 1: controls loaded via <script> tag
    if ( typeof THREE.OrbitControls === 'function' ) this.controls = new THREE.OrbitControls( this.camera, this.container );
    // Case 2: controls loaded as ES6 module
    else if ( typeof OrbitControls === 'function' ) this.controls = new OrbitControls( this.camera, this.container );

    else {
      console.error( 'Couldn\'t find the glTFLoader, please check that you have included the script correctly!' );
    }

    // gives the controls a feeling of "weight"
    this.controls.enableDamping = true;

  }

  initLoader() {

    if ( typeof THREE.GLTFLoader === 'function' ) this.loader = new THREE.GLTFLoader();
    else if ( typeof GLTFLoader === 'function' ) this.loader = new GLTFLoader();
    else {
      console.error( 'Couldn\'t find the glTFLoader, please check that you have included the script correctly!' );
    }

  }

  initRenderer() {

    this.renderer = new THREE.WebGLRenderer( {
      powerPreference: 'high-performance',
      alpha: true,
      antialias: true,
    } );

    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
    this.renderer.setPixelRatio( window.devicePixelRatio );

    // to avoid page pulling
    this.renderer.domElement.addEventListener( 'touchstart', e => e.preventDefault() );

    this.container.appendChild( this.renderer.domElement );

  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

  update() {

    const delta = this.clock.getDelta();

    if ( this.controls ) this.controls.update();

    // step through the scene and call custom onUpdate functions on any object
    // for which we have defined them
    this.scene.traverse( ( child ) => {

      if ( child.userData.onUpdate ) child.userData.onUpdate( delta );

    } );

  }

  start() {

    // clear previous delta to prevent large delta values when
    // starting and stopping the app
    this.clock.getDelta();

    this.renderer.setAnimationLoop( () => {

      this.update();
      this.render();

    } );

    this.running = true;

  }

  stop() {

    this.renderer.setAnimationLoop( null );

    this.running = false;

  }

  onWindowResize() {

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

    // render an extra frame to prevent jank
    this.renderer.render( this.scene, this.camera );

  }

}

const app = new App();

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

app.container.addEventListener( 'click', ( e ) => {

  app.running ? app.stop() : app.start();

} );