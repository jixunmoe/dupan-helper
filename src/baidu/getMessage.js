import { load } from '../my-loader';
import lazyCache from '../utils/lazyCache';

const getMessage = lazyCache(function getMessage() {
  return load('system-core:system/baseService/message/message.js');
});

export default getMessage;

export function trigger(event) {
  getMessage().trigger(event);
}

/**
 * 刷新当前文件列表
 */
export function refreshFileListView() {
  trigger('system-refresh');
}
