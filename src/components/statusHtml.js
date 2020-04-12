export default function statusHtml(result) {
  const className = result.success ? 'success' : 'fail';
  return `<span class="jx-status jx-status-${className}">${result.error}</span>`;
}
