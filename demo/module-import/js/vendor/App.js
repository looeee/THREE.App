export default class App {

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

    // make sure to set these to the values you want before calling init
    // since they can't be changed without creating a new WebGLRenderer
    this.alpha = false;
    this.antialias = true;
    this.stencil = false;

    this.autoResize = true;

    this.onUpdate = () => {};

  }

  init() {

    this.initCamera();
    this.initControls();
    this.initLoader();
    this.initRenderer();

    this.canvas = this.renderer.domElement;

    window.addEventListener( 'resize', () => this.onWindowResize() );

  }

  initCamera() {

    this.camera = new THREE.PerspectiveCamera( 35, this.container.clientWidth / this.container.clientHeight, 1, 1000 );

  }

  initControls() {

    // if the controls script was loaded, we'll set them up
    if ( typeof THREE.OrbitControls === 'function' ) this.controls = new THREE.OrbitControls( this.camera, this.container );
    else if ( typeof OrbitControls === 'function' ) this.controls = new OrbitControls( this.camera, this.container );

    // otherwise we'll skip them
    else return;

    // gives the controls a feeling of "weight"
    this.controls.enableDamping = true;

  }

  initLoader() {

    if ( typeof THREE.GLTFLoader === 'function' ) this.loader = new THREE.GLTFLoader();
    if ( typeof GLTFLoader === 'function' ) this.loader = new GLTFLoader();

  }

  initRenderer() {

    this.renderer = new THREE.WebGLRenderer( {
      powerPreference: 'high-performance',
      alpha: this.alpha,
      antialias: this.antialias,
      stencil: this.stencil,
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

    this.onUpdate();

  }

  start() {

    if ( this.running === true ) return;

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

    if( ! this.autoResize ) return;

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

    // render an extra frame to prevent jank
    this.renderer.render( this.scene, this.camera );

  }

}
