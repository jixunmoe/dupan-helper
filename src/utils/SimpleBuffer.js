import toStdHex from './toStdHex';

const slice = Function.prototype.call.bind(Array.prototype.slice);

/**
 * 一个简单的类似于 NodeJS Buffer 的实现.
 * 用于解析游侠度娘提取码。
 */
export default class SimpleBuffer {
  /**
   * @param {String} str
   */
  constructor(str) {
    this.fromString(str);
  }

  fromString(str) {
    const len = str.length;

    this.buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      this.buf[i] = str.charCodeAt(i);
    }
  }

  readUnicode(index, size) {
    const bufText = slice(this.buf, index, index + size).map(toStdHex);

    const buf = [''];
    for (let i = 0; i < size; i += 2) {
      buf.push(bufText[i + 1] + bufText[i]);
    }

    return JSON.parse(`"${buf.join('\\u')}"`);
  }

  readNumber(index, size) {
    let ret = 0;

    for (let i = index + size; i > index;) ret = this.buf[--i] + (ret * 256);

    return ret;
  }

  readUInt(index) {
    return this.readNumber(index, 4);
  }

  readULong(index) {
    return this.readNumber(index, 8);
  }

  readHex(index, size) {
    return Array.prototype.slice.call(this.buf, index, index + size).map(toStdHex).join('');
  }
}
