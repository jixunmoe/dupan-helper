import getDialog from '../baidu/getDialog';
import { hideTip, showTip } from '../baidu/getTip';
import { getCheckedItems } from '../baidu/getFileList';
import ajax from '../utils/ajax';
import escapeHtml from '../utils/escapeHtml';

import template from './CustomShareDialogTpl.html';
import OpDialog from './OpDialog';
import LocalStore from '../utils/LocalStore';

/* 依赖函数表 */
function isCodeValid(code) {
  // 百度现在改了规则；
  // 只允许：由数字字母组成的提取码，并且不能全部都是同一个字符。
  return /^[\da-z]{4}$/i.test(code) && (new Set(code)).size > 1;
}

function fixCode(code) {
  return code.replace(/"/g, '&#x22;').replace(/]/g, '&#x5D;');
}

function fixWidthDigits(d) {
  return (`0${d.toString()}`).slice(-2);
}

function makeDate(d) {
  return `${d.getFullYear()}.${fixWidthDigits(d.getMonth() + 1)}.${fixWidthDigits(d.getDate())}`;
}

function genKey(size = 4) {
  // length => 26 + 10, 36
  const keySet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let r = '';
  for (let i = size; i--;) {
    // eslint-disable-next-line no-bitwise
    r += keySet[0 | (Math.random() * 36)];
  }

  return r;
}

function getFileId(item) {
  return item.fs_id;
}

export default class CustomShareDialog extends OpDialog {
  /**
   * @param {Object} config
   * @return CustomShareDialog
   */
  static create(config = {}) {
    return new CustomShareDialog(config);
  }

  /**
   * @param {Object} config
   */
  constructor(config = {}) {
    super(template, {
      title: '自定义分享',
      ...config,
    });
  }

  bindContext() {
    super.bindContext();

    this.validateCode = this.validateCode.bind(this);
    this.hideError = this.hideError.bind(this);
  }

  bootstrap() {
    this.codeStore = LocalStore.create(this, 'code');

    this.$error = this.$('.jx_errmsg');
    this.$footer = this.dialog.find(getDialog().QUERY.dialogFooter);
    this.$key = this.$('#jx_shareKey').val(this.codeStore.value || genKey());

    this.$key.on('input change blur', this.validateCode);
    this.$key.on('focus', this.hideError);
  }

  async onConfirm() {
    this.hide();

    let key = this.$key.val();
    if (!isCodeValid(key)) {
      key = genKey(4);
      this.value = key;
    }
    this.codeStore.value = key;

    showTip({
      mode: 'loading',
      msg: '正在分享，请稍后 ...',
      autoClose: false,
    });

    const sharedItems = getCheckedItems();

    const resp = await ajax({
      url: '/share/set',
      type: 'POST',
      data: {
        fid_list: JSON.stringify(sharedItems.map(getFileId)),
        schannel: 4,
        channel_list: '[]',
        pwd: key,
        // 0: 永久
        // 1、7: 天数
        period: 0,
      },
      dataType: 'json',
    });

    hideTip();

    if (resp.errno || !resp.shorturl) {
      showTip({
        mode: 'failure',
        msg: `分享失败：${resp.error}`,
      });
      return;
    }

    showTip({
      mode: 'success',
      msg: '分享成功!',
    });

    this.$footer.children('.g-button-blue-large').hide();
    this.$footer.children('.g-button-large').find('.text').text('关闭');

    const url = `${resp.shorturl}#${key}`;
    this.$('#jx_shortUrl').val(url);
    this.$('#jx_shareCode').val(key);

    this.root.toggleClass('jx_hide');

    const title = fixCode(sharedItems[0].server_filename) + (sharedItems.length === 1 ? '' : ' 等文件');
    const code = `[dlbox title="${escapeHtml(title)}" from="浩瀚的宇宙" time="${makeDate(new Date())}" `
      + `info="提取：${escapeHtml(key)}" link1="度娘|${url}"][/dlbox]`;

    this.$('#jx_dlboxCode').val(code);

    this.show();
  }

  /**
   * @returns string
   */
  get value() {
    return this.$key.val();
  }

  set value(value) {
    return this.$key.val(value);
  }

  get isValueValid() {
    return isCodeValid(this.value);
  }

  hideError() {
    this.$error.addClass('jx_hide');
  }

  validateCode() {
    this.$error.toggleClass('jx_hide', this.isValueValid);
  }
}
