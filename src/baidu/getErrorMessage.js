import getContext from './getContext';

export default function getErrorMessage(code) {
  const msg = String(getContext().errorMsg(code));
  return msg.replace(/\s+rapidupload 错误码$/, '');
}

export function injectErrorMessage(obj) {
  if ($.isPlainObject(obj)) {
    obj.error = obj.show_msg || getErrorMessage(obj.errno || 0);
  }
  return obj;
}
