import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';

export default {
	plugins: [
		typescript(),
		nodeResolve(),
		commonjs(),
		terser(),
		image({
			dom: true,
		}),
	]
}
