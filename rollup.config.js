import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

const input = 'src/typescript/index.ts';

export default [
  // ES modules build
  {
    input,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declarationDir: './dist/types',
      }),
    ],
    external: ['fs', 'path', 'js-yaml'],
  },
  // CommonJS build
  {
    input,
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    external: ['fs', 'path', 'js-yaml'],
  },
  // UMD build for browsers
  {
    input,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'XStrApiSpec',
      sourcemap: true,
      globals: {
        'fs': 'fs',
        'path': 'path',
        'js-yaml': 'jsyaml',
      },
    },
    plugins: [
      resolve({ preferBuiltins: false, browser: true }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      terser(),
    ],
    external: ['fs', 'path', 'js-yaml'],
  },
  // TypeScript declarations
  {
    input,
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];
