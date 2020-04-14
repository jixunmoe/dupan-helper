import { TAG } from './constants';

let oRequire;

const hooks = new Map();

function fakeRequire(module) {
  // console.info('%s Load module: %s', INFO, module);
  const result = oRequire.apply(this, arguments);
  const moduleHook = hooks.get(module);
  if (moduleHook) {
    try {
      moduleHook();
    } catch (e) {
      console.error('%s: 执行 %s hook 时发生错误: %s', TAG, e.message);
      console.trace(e);
    }
    hooks.delete(module);
  }
  return result;
}

export function load(module) {
  return oRequire.call(window, module);
}

export function loadAsync(module) {
  return new Promise(((resolve) => {
    fakeRequire.async(module, resolve);
  }));
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
