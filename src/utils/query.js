import parseQueryString from './parseQueryString';

const search = parseQueryString(window.location.search.slice(1).replace(/\+/g, '%2b'));

export function hasQuery(name) {
  return Object.prototype.hasOwnProperty.call(search, name);
}

export function getQuery(name) {
  return search[name];
}

export default null;
