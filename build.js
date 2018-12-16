const rollup = require( 'rollup' );
const babel = require( 'rollup-plugin-babel' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );
const fs = require( 'fs' );

const writeFile = ( fileName, data ) => {

  fs.writeFileSync( fileName, data, 'utf8' );

};

const inputFile = 'src/index.js';

const defaultPlugins = [
  nodeResolve(),
  commonjs(),
  babel( {
    compact: false,
    exclude: ['node_modules/**'],
    babelrc: false,
    presets: [
      ['env',
        {
          modules: false,
          targets: {
            browsers: [ 'last 2 versions', '> 5%' ],
          },
        } ],
    ],
  } ),
];

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
// const stderr = console.error.bind( console );

async function build( inputOpts, outputOpts ) {

  // create a bundle
  const bundle = await rollup.rollup( inputOpts );

  // generate code and a sourcemap
  const { code, map } = await bundle.generate( outputOpts );

  console.log( 'Writing file: ' + outputOpts.file );
  writeFile( outputOpts.file, code );

  console.log( 'Generated bundle: ', bundle.getTimings()[ '# GENERATE' ] );

}

const inputOpts = {
  input: inputFile,
  plugins: defaultPlugins,
  perf: true,
};

build( inputOpts, {
  file: 'build/iife.js',
  name: 'THREE_APP',
  format: 'iife',
} );

build( inputOpts, {
  file: 'build/umd.js',
  name: 'THREE_APP',
  format: 'umd',
} );

build( inputOpts, {
  file: 'build/esm.js',
  format: 'esm',
} );

build( inputOpts, {
  file: 'build/cjs.js',
  format: 'cjs',
} );

build( inputOpts, {
  file: 'build/amd.js',
  format: 'amd',
} );

build( inputOpts, {
  file: 'build/system.js',
  format: 'system',
} );

