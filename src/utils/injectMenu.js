import { load } from '../my-loader';
import { anythingChecked } from '../baidu/getFileList';
import CustomShareDialog from '../extension/CustomShareDialog';
import BatchRenameDialog from '../extension/BatchRenameDialog';

function menuInsertAfter(list, name, item, noPush) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] instanceof Array) {
      if (menuInsertAfter(list[i], name, item, true)) {
        return false;
      }
    } else if (list[i].title === name) {
      i++;
      list.splice(i, 0, item);
      return true;
    }
  }

  if (!noPush) list.push(item);
  return false;
}

export default function injectMenu() {
  const faceData = load('system-core:data/faceData.js');

  const fileCtxMenu = faceData.getData().contextMenu.file;
  menuInsertAfter(fileCtxMenu, '分享', {
    index: 8,
    keyboard: 'u',
    title: '自定义分享',
    display: anythingChecked,
    action: CustomShareDialog.create,
  });

  fileCtxMenu.forEach((m) => {
    if (m.index >= 2) {
      m.index += 1;
    }
  });

  fileCtxMenu.push({
    index: 2, // '删除' 的 index。
    keyboard: 'r',
    position: 'bottom',
    title: '批量重命名',
    display: anythingChecked,
    action: BatchRenameDialog.create,
  });
}
