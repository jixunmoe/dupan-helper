import { load } from '../my-loader';
import lazyCache from '../utils/lazyCache';

const getContext = lazyCache(function getContext() {
  return load('system-core:context/context.js').instanceForSystem;
});

export default getContext;
