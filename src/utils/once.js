const noop = () => {};

export default function once(fn) {
  let _f = fn;
  return () => {
    _f();
    _f = noop;
  };
}
