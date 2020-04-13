import './Checkbox.css';

export default class Checkbox {
  constructor(options = {}) {
    const {
      content = '',
      className = '',
      checked = false,
    } = options;

    this.root = $('<label class="jx-label">').addClass(className);
    this.$input = $('<input class="jx-checkbox" type="checkbox" />');
    this.$text = $('<span>');

    if (typeof content === 'string') {
      this.$text.text(content);
    } else {
      this.$text.append(content);
    }

    this.$input.prop('checked', checked);
    this.root.append(this.$input).append(this.$text);
  }

  get checked() {
    return this.$input.prop('checked');
  }

  set checked(checked) {
    return this.$input.prop('checked', Boolean(checked));
  }

  appendTo(target) {
    this.root.appendTo(target);
  }
}
