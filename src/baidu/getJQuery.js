import { load } from '../my-loader';
import lazyCache from '../utils/lazyCache';

const getJQuery = lazyCache(() => load('base:widget/libs/jquerypacket.js'));

export default getJQuery;

export function $() {
  return getJQuery().apply(window, arguments);
}

function proxyJQuery(key) {
  Object.defineProperty($, key, {
    get: () => getJQuery()[key],
  });
}

proxyJQuery('fn');
proxyJQuery('ajax');
proxyJQuery('isPlainObject');
