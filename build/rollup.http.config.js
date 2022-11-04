import path from 'path';
import plugins from './plugins.js';

export default {
	input: path.resolve(__dirname, '../packages/http/WkHttp.ts'),
	output: {
		file: path.resolve(__dirname, '../packages/http/dist/http.js'),
		name: 'http',
		format: 'umd',
		globals: {
			axios: 'axios',
		},
	},
	plugins: [
		...plugins,
	],
	external: [
		"axios",
	],
};
