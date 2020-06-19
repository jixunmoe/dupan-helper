const cache = value => () => value;

export default function lazyCache(fn) {
    let cacheWrapper = function () {
        const result = fn.apply(this, arguments);
        cacheWrapper = cache(result);
        return result;
    };

    return function () {
        return cacheWrapper.apply(this, arguments);
    };
}
