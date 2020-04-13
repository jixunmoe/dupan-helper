/* eslint-disable global-require */

const postcss = require('rollup-plugin-postcss');
const { string } = require('rollup-plugin-string');
const builtins = require('rollup-plugin-node-builtins');
const userScript = require('./user-script/rollup-user-script');

module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/dupan-helper.user.js',
    format: 'cjs',
  },
  plugins: [
    builtins(),
    string({
      include: 'src/**/*.html',
    }),
    postcss({
      // extract: 'dist/main.css',
      plugins: [
        require('postcss-nested'),
        require('postcss-url')({
          url: 'inline',
        }),
      ],
    }),
    userScript(),
  ],
};
