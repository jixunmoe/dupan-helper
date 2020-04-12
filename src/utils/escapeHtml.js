const div = document.createElement('a');

const escapeDict = {
  '"': 'quot',
  "'": 'apos',
};

function escapeHtml(text) {
  div.textContent = text;
  const result = div.innerHTML.replace(/["']/g, (x) => `&${escapeDict[x]};`);
  div.textContent = '';
  return result;
}

export default escapeHtml;
