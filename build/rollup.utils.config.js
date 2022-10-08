import path from 'path';
import baseConfig from './rollup.base.config.js';

export default {
	input: path.resolve(__dirname, '../packages/wk-utils/index.ts'),
	output: {
		file: path.resolve(__dirname, '../packages/wk-utils/dist/utils.js'),
		format: 'esm'
	},
	...baseConfig,
};
