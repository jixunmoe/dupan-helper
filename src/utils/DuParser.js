import SimpleBuffer from './SimpleBuffer';
import { decodeBase64 } from './base64';

const trim = (str) => String.prototype.trim.call(str);

export default class DuParser {
  constructor() {
    this.reset();
  }

  reset() {
    this.results = [];
    this.versions = new Set();
  }

  parse(url) {
    if (url.indexOf('BDLINK') === 0) {
      this.parseAli(url);
      return;
    }

    const links = url.split('\n').map(trim);
    for (const link of links) {
      if (link.startsWith('bdpan://')) {
        this.parsePanDownload(link);
      } else {
        this.parseStandard(link);
      }
    }
  }

  hasResults() {
    return this.results.length;
  }

  parseAli(url) {
    const raw = atob(url.slice(6).replace(/\s/g, ''));
    if (raw.slice(0, 5) !== 'BDFS\x00') return null;

    const buf = new SimpleBuffer(raw);

    let ptr = 9;

    const fileCount = buf.readUInt(5);
    if (fileCount === 0) {
      return null;
    }

    this.versions.add('游侠 v1');
    for (let i = 0; i < fileCount; i++) {
      // 大小 (8 bytes)
      // MD5 + MD5S (0x20)
      // nameSize (4 bytes)
      // Name (unicode)
      const fileInfo = Object.create(null);
      fileInfo.size = buf.readULong(ptr);
      fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
      fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
      const sizeofName = buf.readUInt(ptr + 0x28) * 2;
      ptr += 0x2C;

      fileInfo.name = buf.readUnicode(ptr, sizeofName);
      this.results.push(fileInfo);
      ptr += sizeofName;
    }

    return true;
  }

  parseStandard(szUrl) {
    const match = szUrl.trim().match(/^([\dA-F]{32})#([\dA-F]{32})#([\d]{1,20})#([\s\S]+)$/i);
    if (match) {
      const [, md5, md5s, size, name] = match;
      this.versions.add('梦姬标准');
      this.results.push({
        md5, md5s, size, name,
      });
    }
    return null;
  }

  parsePanDownload(szUrl) {
    const match = decodeBase64(szUrl.slice(8)).match(/^([\s\S]+)\|([\d]{1,20})\|([\dA-F]{32})\|([\dA-F]{32})$/i);
    if (match) {
      const [, name, size, md5, md5s] = match;
      this.versions.add('PanDownload');
      this.results.push({
        md5, md5s, size, name,
      });
    }
    return null;
  }
}
