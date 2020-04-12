import { load } from '../my-loader';

export default function getMessage() {
  return load('system-core:system/baseService/message/message.js');
}

export function trigger(event) {
  getMessage().trigger(event);
}

/**
 * 刷新当前文件列表
 */
export function refreshFileListView() {
  trigger('system-refresh');
}
