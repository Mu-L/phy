import terser from '@rollup/plugin-terser';

export default [
	{
		input: 'private/Speech/src/Speech.js',
		plugins: [
			terser()
		],
		output: [
			{
				format: 'esm',
				file: 'src/libs/speech.module.js'
			}
		]
	}
];