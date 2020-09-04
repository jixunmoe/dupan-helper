import { load } from '../my-loader';
import lazyCache from '../utils/lazyCache';

const getContext = lazyCache(() => load('system-core:context/context.js').instanceForSystem);

export default getContext;
