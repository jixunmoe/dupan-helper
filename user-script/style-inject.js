// eslint-disable-next-line no-unused-vars
function styleInject(css) {
  function addStyle(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  if (document.head) {
    addStyle(css);
  } else if (styleInject.pending) {
    styleInject.pending.push(css);
  } else {
    const injectPendingCSS = () => {
      styleInject.pending.forEach(addStyle);
      styleInject.pending = undefined;
      window.removeEventListener('DOMContentLoaded', injectPendingCSS);
    };

    styleInject.pending = [css];
    window.addEventListener('DOMContentLoaded', injectPendingCSS);
  }
}
