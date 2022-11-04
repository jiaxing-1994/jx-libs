import path from 'path';
import image from '@rollup/plugin-image';
import plugins from './plugins.js';

export default {
	input: path.resolve(__dirname, '../packages/scroll/src/core.ts'),
	output: {
		file: path.resolve(__dirname, '../packages/scroll/dist/scroll.js'),
		format: 'esm'
	},
	watch: {
		exclude: 'node_modules/**'
	},
	plugins: [
		...plugins,
		image({
			dom: true,
		}),
	],
};
