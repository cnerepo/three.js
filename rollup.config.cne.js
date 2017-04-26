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
	  nodeResolve({ jsnext: true, main: true })
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
