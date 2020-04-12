export default function debounce(fn) {
  let timer;
  return () => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(fn);
  };
}
