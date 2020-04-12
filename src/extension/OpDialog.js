import { confirmDialog } from '../baidu/getDialog';
import LocalStore from '../utils/LocalStore';

const PREFIX = '__jx_';

export default class OpDialog {
  get id() {
    return this.constructor.name;
  }

  getNamespacedKey(key) {
    return `${PREFIX}_${this.id}_${key}`;
  }

  createStore(key) {
    return new LocalStore(this.getNamespacedKey(key));
  }

  constructor(template, title) {
    this.title = title;
    this.root = $(template);

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
