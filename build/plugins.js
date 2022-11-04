import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel'

export default [
	commonjs(),
	babel({
		exclude: ["node_modules/**"],
		babelHelpers: 'bundled'
	}),
	json(),
	typescript(),
	resolve(),
	// terser(),
]
