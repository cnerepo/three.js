import { rollup } from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

var outro = `
Object.defineProperty( exports, 'AudioContext', {
	get: function () {
		return exports.getAudioContext();
	}
});`;

function glsl () {
	return {
		transform ( code, id ) {
			if ( !/\.glsl$/.test( id ) ) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.replace( /[ \t]*\/\/.*\n/g, '' )
					.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
					.replace( /\n{2,}/g, '\n' )
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			}
		}
	};
}

export default {
	entry: 'src/ThreeCNE.js',
	indent: '\t',
	plugins: [
		glsl(),
		nodeResolve({ jsnext: true, main: true }),
		commonjs({
	    // non-CommonJS modules will be ignored, but you can also
	    // specifically include/exclude files
	    include: 'node_modules/**',  // Default: undefined

	    // search for files other than .js files (must already
	    // be transpiled by a previous plugin!)
	    extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]

	    // if true then uses of `global` won't be dealt with by this plugin
	    ignoreGlobal: false,  // Default: false

	    // if false then skip sourceMap generation for CommonJS modules
	    sourceMap: false,  // Default: true
	  })
	],
	targets: [
		{
			format: 'umd',
			moduleName: 'THREE',
			dest: 'build-cne/three.js'
		},
		{
			format: 'es',
			dest: 'build-cne/three.modules.js'
		}
	],
	outro: outro
};
