const fs = require('fs');

const pkg = require('../package.json');

function updateVersion(str) {
  return str.replace(/\b__VERSION__\b/g, pkg.version);
}

const loader = fs.readFileSync(`${__dirname}/loader.js`, 'utf-8');
const meta = updateVersion(fs.readFileSync(`${__dirname}/meta.js`, 'utf-8'));

const wrapUserScript = (code, name) => `${meta.replace(/\b__NAME__\b/g, name)}

function entryPoint () {
${code}
}

${loader}
`;

function rollupUserScript(name) {
  return {
    name: 'user-script',

    generateBundle(options, bundle) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(bundle)) {
        bundle[key].code = wrapUserScript(bundle[key].code, name);
      }
    },
  };
}

module.exports = rollupUserScript;
