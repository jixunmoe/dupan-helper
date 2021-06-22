const cache = (value) => () => value;

export default function lazyCache(fn) {
  let cacheWrapper = function uncached() {
    const result = fn.apply(this, arguments);
    cacheWrapper = cache(result);
    return result;
  };

  return function cacheProxy() {
    return cacheWrapper.apply(this, arguments);
  };
}
