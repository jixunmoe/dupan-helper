import parseQueryString from './parseQueryString';

export default class Query {
  constructor() {
    this.search = {};
  }

  parse(source) {
    this.search = parseQueryString(source.replace(/^(#\??|\?)/g, '').replace(/\+/g, '%2b'));
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.search, name);
  }

  get(name) {
    return this.search[name];
  }
}
