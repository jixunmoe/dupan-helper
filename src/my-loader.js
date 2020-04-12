import { TAG } from './constants';

let oRequire;

const hooks = new Map();

function fakeRequire(module) {
  // console.info('%s Load module: %s', INFO, module);
  const moduleHook = hooks.get(module);
  if (moduleHook) {
    moduleHook();
    hooks.delete(module);
  }
  return oRequire.apply(this, arguments);
}

export function load(module) {
  return oRequire.call(window, module);
}

export function hook(module, fn) {
  hooks.set(module, fn);
}

if (window.require) {
  console.warn('%s 覆盖方式安装，若无效请强制刷新。', TAG);
  oRequire = window.require;
  window.require = fakeRequire;
  Object.assign(fakeRequire, oRequire);
} else {
  console.info('%s 钩子方式安装，若失效请报告。', TAG);
  Object.defineProperty(window, 'require', {
    set(require) {
      oRequire = require;
    },
    get() {
      return fakeRequire;
    },
  });
}

// window.__debug_G = _G;
export default null;
