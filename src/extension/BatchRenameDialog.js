import OpDialog from './OpDialog';
import template from './BatchRenameDialogTpl.html';
import { getCheckedItems } from '../baidu/getFileList';
import { hideTip, showTip } from '../baidu/getTip';
import ajax from '../utils/ajax';
import { refreshFileListView } from '../baidu/getMessage';

const fixRules = {
  n(name) {
    const match = name.match(/^(.+)\./);
    return match ? match[1] : match;
  },

  c() {
    return String.fromCharCode(97 + Math.random() * 26);
  },

  d() {
    return Math.random().toString().slice(3, 4);
  },

  t() {
    return Date.now();
  },

  e(name) {
    const ext = name.match(/\.([^.]+)$/);
    return ext ? ext[1] : '';
  },

  E(name) {
    return name.match(/\.[^.]+$/) || '';
  },
};

/* 依赖函数表 */
function fixName(name, code) {
  const fn = fixRules[code];
  if (fn) {
    return fn(name);
  }
  return null;
}

export default class BatchRenameDialog extends OpDialog {
  static create() {
    return new BatchRenameDialog();
  }

  constructor() {
    super(template, '批量重命名');
  }

  bindContext() {
    super.bindContext();

    this.namePatternStore = this.createStore('pattern');
  }

  bootstrap() {
    this.$namePattern = this.$('#jx_nameRule');

    this.$namePattern.val(this.namePatternStore.value || '[GalACG] :d:d:d:d:d:d:d:d:d:d:E');
  }

  async onConfirm() {
    this.hide();

    const namePattern = this.$namePattern.val();
    this.namePatternStore.value = namePattern;

    const fileList = getCheckedItems().map((item) => ({
      path: item.path,
      newname: namePattern.replace(/:([cdeEnt])/g, (_, code) => fixName(item.server_filename, code)),
    }));

    showTip({
      mode: 'loading',
      msg: '正在批量重命名，请稍后 ...',
      autoClose: false,
    });

    const resp = await ajax({
      url: '/api/filemanager?opera=rename',
      type: 'POST',
      data: {
        filelist: JSON.stringify(fileList),
      },
    });

    hideTip();

    refreshFileListView();

    if (resp.errno) {
      showTip({
        mode: 'failure',
        msg: `批量重命名失败, 请稍后重试! (${resp.error})`,
      });
    } else {
      showTip({
        mode: 'success',
        msg: '重命名成功!',
      });
    }
  }
}
