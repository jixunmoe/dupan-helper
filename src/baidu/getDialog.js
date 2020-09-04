import './Dialog.css';

import { load } from '../my-loader';
import nextId from '../utils/nextId';
import firstFunction from '../utils/firstFunction';
import { $ } from './getJQuery';
import lazyCache from '../utils/lazyCache';

const getDialog = lazyCache(() => load('system-core:system/uiService/dialog/dialog.js'));

export default getDialog;

export const bigButton = {
  type: 'big',
  padding: ['50px', '50px'],
};

export function confirmDialog(data) {
  let dialog;

  const hideDialog = () => dialog.hide();

  const dialogData = {
    id: `confirm-${nextId()}`,
    show: true,
    title: data.title,
    body: $('<div class="jx-dialog-body">').append(data.body),
    buttons: [{
      ...bigButton,
      name: 'confirm',
      title: data.sureText || '确定',
      color: 'blue',
      click: firstFunction(data.onSure, hideDialog),
    }],
  };

  if (data.cancel !== false) {
    dialogData.buttons.push({
      ...bigButton,
      name: 'cancel',
      title: data.cancelText || '取消',
      click: firstFunction(data.onCancel, hideDialog),
    });
  }
  const Dialog = getDialog();
  dialog = new Dialog(dialogData);
  return dialog;
}

export function infoDialog(data) {
  return confirmDialog({
    ...data,
    cancel: false,
  });
}
