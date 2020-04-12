import { injectErrorMessage } from '../baidu/getErrorMessage';
import { TAG } from '../constants';

export default async function ajax(data) {
  return new Promise((resolve) => {
    $.ajax(data)
      .fail((err) => {
        resolve({ errno: -1, error: '网络错误。' });
        console.error('%s 网络请求错误: %o', TAG, err);
      })
      .success((result) => {
        resolve(injectErrorMessage(result));
      });
  });
}
