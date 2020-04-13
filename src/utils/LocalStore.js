const PREFIX = '__jx_';

export default class LocalStore {
  constructor(id) {
    this.id = id;
  }

  get value() {
    return localStorage.getItem(this.id);
  }

  set value(value) {
    return localStorage.setItem(this.id, value);
  }

  static create(instance, key) {
    return new LocalStore(`${PREFIX}_${instance.constructor.name}_${key}`);
  }
}
