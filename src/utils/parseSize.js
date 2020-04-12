/**
 * 将文本形式的文件大小转换为
 * @param {string} size
 * @returns {string}
 */
export default function parseSize(size) {
  let unit = 'MiB';
  let sizeInUnit = parseInt(size, 10) / 1024 / 1024;

  // 超过 GB
  if (sizeInUnit > 1024) {
    unit = 'GiB';
    sizeInUnit /= 1024;
  }

  return `${sizeInUnit.toFixed(2)} ${unit}`;
}
