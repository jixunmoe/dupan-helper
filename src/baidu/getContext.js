import { load } from '../my-loader';

export default function getContext() {
  return load('system-core:context/context.js').instanceForSystem;
}
