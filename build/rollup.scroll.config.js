import path from 'path';
import baseConfig from './rollup.base.config.js';

export default {
	input: path.resolve(__dirname, '../packages/wk-scroll/src/core.ts'),
	output: {
		file: path.resolve(__dirname, '../packages/wk-scroll/dist/scroll.js'),
		format: 'esm'
	},
	...baseConfig,
};
