const postcss = require('rollup-plugin-postcss');
const { string } = require('rollup-plugin-string');
const userScript = require('./user-script/rollup-user-script');

module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/dupan-helper.user.js',
    format: 'cjs',
  },
  plugins: [
    string({
      include: 'src/**/*.html',
    }),
    postcss({
      // extract: 'dist/main.css',
      plugins: [],
    }),
    userScript(),
  ],
};
