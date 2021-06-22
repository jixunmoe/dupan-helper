const styleInject = (function styleLoaderFactory() {
  let pending = [];

  function addStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectPendingCSS() {
    styleInject.pending.forEach(addStyle);
    pending = undefined;
    window.removeEventListener('DOMContentLoaded', injectPendingCSS);
  }

  window.addEventListener('DOMContentLoaded', injectPendingCSS);

  function styleLoader(css) {
    if (document.head) {
      addStyle(css);
    } else {
      pending.push(css);
    }
  }

  return styleLoader;
}());

const isGm = (typeof unsafeWindow !== 'undefined') && (unsafeWindow !== window);
if (isGm) {
  const INFO = '[仓库助手]';

  console.info('%s 以 GreaseMonkey 兼容模式执行。该脚本管理器所遇到的问题不能保证能够修复。', INFO);
  unsafeWindow.eval(`;(${entryPoint})();`);
} else {
  entryPoint();
}
