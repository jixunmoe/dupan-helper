/**
 * 将数值转换为 2 位数的十六进制文本。
 * @param {Number} value
 * @returns {string}
 */
export default function toStdHex(value) {
  const hex = Math.floor(value).toString(16);
  return (`0${hex}`).slice(-2);
}
