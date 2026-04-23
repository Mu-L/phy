import terser from '@rollup/plugin-terser';

export default [
	{
		input: 'private/AnimLab/src/AnimLab.js',
		external: ['three'],
		plugins: [
			terser()
		],
		output: [
			{
				format: 'esm',
				file: 'src/libs/animlab.module.js'
			}
		]
	}
];