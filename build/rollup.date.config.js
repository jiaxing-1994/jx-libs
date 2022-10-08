import path from 'path';
import baseConfig from './rollup.base.config.js';

export default {
	input: path.resolve(__dirname, '../packages/wk-date/src/core.ts'),
	output: {
		file: path.resolve(__dirname, '../packages/wk-date/dist/date.js'),
		format: 'esm'
	},
	...baseConfig,
};
