import template from './StandardCodeDialogTpl.html';
import OpDialog from './OpDialog';
import debounce from '../utils/debounce';
import DuParser from '../utils/DuParser';
import itemInfo from '../components/itemInfo';
import wrapTag from '../utils/wrapTag';
import rapidUpload from '../service/rapidUpload';
import { getCurrentDirectory } from '../baidu/getFileList';
import { showTip } from '../baidu/getTip';
import { refreshFileListView } from '../baidu/getMessage';
import { infoDialog } from '../baidu/getDialog';
import statusHtml from '../components/statusHtml';

const defaultConfirmCallback = async () => true;

export default class StandardCodeDialog extends OpDialog {
  /**
   * @param {Object} config
   * @return StandardCodeDialog
   */
  static create(config) {
    return new StandardCodeDialog(config);
  }

  confirmCallback = defaultConfirmCallback;

  constructor(config = {}) {
    super(template, {
      title: '通用提取码',
      ...config,
    });

    if (config) {
      this.setText(config.content);
      this.setDirectory(config.directory);
      this.setConfirmCallback(config.confirmCallback);
      this.forceRefresh = config.forceRefresh || false;
    }
  }

  bindContext() {
    super.bindContext();
    this.hideError = this.hideError.bind(this);
    this.updatePreview = this.updatePreview.bind(this);

    this.parser = new DuParser();
    this.directory = getCurrentDirectory();
  }

  bootstrap() {
    this.jx_list = this.$('.jx_list');
    this.jx_code = this.$('.jx_code');
    this.jx_errmsg = this.$('.jx_errmsg');
    this.jx_version = this.$('.jx_version');
    this.jx_ondup = this.$('input[name="ondup"]');
    this.ondup = this.root[0].elements.ondup;

    this.ondupStore = this.createStore('ondup');

    this.jx_ondup.filter(`[value="${this.ondupStore.value}"]`).prop('checked', true);

    this.jx_code.on('blur input', debounce(this.updatePreview));
    this.jx_code.on('focus', this.hideError);
  }

  hideError() {
    this.jx_errmsg.addClass('jx_hide');
  }

  get versions() {
    return Array.from(this.parser.versions).join('、');
  }

  get results() {
    return this.parser.results;
  }

  updatePreview() {
    const code = this.getText();

    this.parser.reset();
    this.parser.parse(code);

    const hasResults = this.parser.hasResults();

    // 如果输入框不为空却没有解析到任何内容
    this.jx_errmsg.toggleClass('jx_hide', Boolean(!code || hasResults));

    if (hasResults) {
      this.jx_version.text(this.versions);
      this.jx_list.html(this.results.map(itemInfo).map(wrapTag('li')).join(''));
    } else {
      this.jx_version.text('--');
      this.jx_list.text('');
    }
  }

  setText(content) {
    this.jx_code.val(content || '');
    this.updatePreview();
  }

  getText() {
    return this.jx_code.val();
  }

  getDirectory() {
    return this.directory;
  }

  setConfirmCallback(confirmCallback) {
    this.confirmCallback = confirmCallback || defaultConfirmCallback;
  }

  setDirectory(directory) {
    if (!directory) {
      directory = getCurrentDirectory();
    }
    this.directory = directory;
  }

  async onConfirm() {
    this.hide();

    // 取消了操作
    if (!await this.confirmCallback()) {
      return;
    }

    const ondup = this.ondup.value;
    this.ondupStore.value = ondup;

    const totalCount = this.results.length;
    let failed = 0;
    let counter = 1;
    for (const file of this.results) {
      showTip({
        mode: 'loading',
        msg: `正在转存文件 (${counter}/${totalCount}), 请稍后 ..`,
        autoClose: false,
      });

      const resp = await rapidUpload(this.getDirectory(), file, ondup);
      file.success = resp.errno === 0;
      file.errno = resp.errno;
      file.error = resp.error;
      file.resp = resp;
      if (!file.success) {
        failed++;
      }
      counter++;
    }

    if (this.forceRefresh || this.getDirectory() === getCurrentDirectory()) {
      refreshFileListView();
    }

    infoDialog({
      title: `转存完毕 (失败 ${failed} 个, 共 ${totalCount} 个)!`,
      body: `
        <ul class="save-complete-details jx_list">
          ${this.results.map((result) => `${itemInfo(result)}${statusHtml(result)}`).map(wrapTag('li')).join('')}
        </ul>
      `,
      cancel: false,
    });
  }
}
