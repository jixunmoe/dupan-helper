import { load } from '../my-loader';

export default function getFileList() {
  return load('disk-system:widget/pageModule/list/listInit.js');
}

export function getCheckedItems() {
  return getFileList().getCheckedItems();
}

export function anythingChecked() {
  return getCheckedItems().length > 0;
}

export function getCurrentDirectory() {
  return getFileList().currentKey;
}
