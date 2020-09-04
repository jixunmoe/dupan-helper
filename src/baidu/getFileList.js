import { load } from '../my-loader';
import lazyCache from '../utils/lazyCache';

const getFileList = lazyCache(() => load('disk-system:widget/pageModule/list/listInit.js'));

export default getFileList;

export function getCheckedItems() {
  return getFileList().getCheckedItems();
}

export function anythingChecked() {
  return getCheckedItems().length > 0;
}

export function getCurrentDirectory() {
  return getFileList().currentKey;
}
