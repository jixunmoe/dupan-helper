export default function compose(...fns) {
  return (...args) => fns.reduce((result, fn) => fn.apply(fn, result), args);
}
