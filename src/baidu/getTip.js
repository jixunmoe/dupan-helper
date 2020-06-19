import { load } from '../my-loader';
import lazyCache from '../utils/lazyCache';

const getTip = lazyCache(function getTip() {
  return load('system-core:system/uiService/tip/tip.js');
});

export default getTip;

export function showTip() {
  return getTip().show.apply(this, arguments);
}

export function hideTip() {
  return getTip().hide.apply(this, arguments);
}
