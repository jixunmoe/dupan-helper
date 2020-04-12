import { load } from '../my-loader';

export default function getTip() {
  return load('system-core:system/uiService/tip/tip.js');
}

export function showTip() {
  return getTip().show.apply(this, arguments);
}

export function hideTip() {
  return getTip().hide.apply(this, arguments);
}
