import toStdHex from './toStdHex';

/**
 * UTF-8 字符转换成 base64 后在 JS 里解析会出毛病。
 * @param str
 * @returns {string}
 */
export function decodeBase64(str) {
  return decodeURIComponent(atob(str).replace(/[^\x00-\x7F]/g, (z) => `%${toStdHex(z.charCodeAt(0))}`));
}

export default null;
