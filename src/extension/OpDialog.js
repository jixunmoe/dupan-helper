import { confirmDialog } from '../baidu/getDialog';
import LocalStore from '../utils/LocalStore';

export default class OpDialog {
  confirmText = '确定';

  createStore(key) {
    return LocalStore.create(this, key);
  }

  constructor(template, options = {}) {
    this.root = $(template);

    this.title = options.title || '';
    if (options.confirmText) {
      this.confirmText = options.confirmText;
    }

    this.bindContext();
    this.createDialog();
    this.bootstrap();
  }

  bindContext() {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  createDialog() {
    this.dialog = confirmDialog({
      title: this.title,
      body: this.root,
      sureText: this.confirmText,
      onSure: this.onConfirm,
      onCancel: this.onCancel,
    });
  }

  /**
   * 选择对话框内的内容。
   * @param selector
   * @returns {JQuery<HTMLElement>}
   */
  $(selector) {
    return $(selector, this.root);
  }

  /**
   * Bind events.
   */
  bootstrap() {
    return this;
  }

  show() {
    this.dialog.show();
  }

  hide() {
    this.dialog.hide();
  }

  async onConfirm() {
    this.hide();
  }

  onCancel() {
    this.hide();
  }
}
