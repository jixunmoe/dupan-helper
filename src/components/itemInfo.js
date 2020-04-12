import escapeHtml from '../utils/escapeHtml';
import parseSize from '../utils/parseSize';

export default function itemInfo(item) {
  const name = escapeHtml(item.name);
  return `
    <span class="name" title="${name}">${name}</span>
    <span class="size">(${escapeHtml(parseSize(item.size))})</span>
  `;
}
