import toStdHex from './toStdHex';
import { TAG } from '../constants';

/**
 * UTF-8 字符转换成 base64 后在 JS 里解析会出毛病。
 * @param str
 * @returns {string}
 */
export function decodeBase64(str) {
  try {
    str = atob(str);
  } catch (e) {
    console.error('%s: base64 decode failed: %s', TAG, str);
    console.trace(e);
    return '';
  }
  return decodeURIComponent(str.replace(/[^\x00-\x7F]/g, (z) => `%${toStdHex(z.charCodeAt(0))}`));
}

export default null;
