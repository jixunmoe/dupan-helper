import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { string } from 'rollup-plugin-string';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import postcssUrl from 'postcss-url';

const userScript = require('./user-script/rollup-user-script');

function build(suffix, plugins) {
  return {
    input: 'src/app.js',
    output: {
      file: `dist/dupan-helper${suffix}.user.js`,
      format: 'cjs',
    },
    plugins: [
      string({
        include: 'src/**/*.html',
      }),
      postcss({
        plugins: [
          postcssUrl({
            url: 'inline',
          }),
        ],
      }),
      commonjs(),
      ...plugins,
      resolve(),
      userScript(),
    ],
  };
}

export default [
  build('', []),
  build('-legacy', [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
  ]),
];
