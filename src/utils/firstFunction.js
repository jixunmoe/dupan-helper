export default function firstFunction(...fns) {
  return fns.find((fn) => typeof fn === 'function');
}
