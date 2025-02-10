import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

function polyfills() {

	return {

		transform( code, filePath ) {

			if ( filePath.endsWith( 'src/Physx.js' ) || filePath.endsWith( 'src\\Physx.js' ) ) {

				code = 'import \'regenerator-runtime\';\n' + code;

			}

			return {
				code: code,
				map: null
			};

		}

	};

}


export default [
	{
		input: 'src/Physx.js',
		plugins: [
			polyfills(),
			nodeResolve(),
			terser()
		],
		output: [
			{
				format: 'umd',
				name: 'PHYSX',
				file: 'build/Physx.min.js'
			}
		]
	},
	{
		input: 'src/Physx.js',
		plugins: [
		    terser()
		],
		output: [
			{
				format: 'esm',
				file: 'build/Physx.module.js'
			}
		]
	}
];