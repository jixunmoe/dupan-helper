// ==UserScript==
// @name         仓库用度盘投稿助手
// @namespace    moe.jixun.dupan.galacg
// @version      1.3.12
// @description  简易功能增强, 方便仓库投稿用
// @author       Jixun<https://jixun.moe/>

// @include      http://pan.baidu.com/disk/home*
// @include      http://yun.baidu.com/disk/home*
// @include      https://pan.baidu.com/disk/home*
// @include      https://yun.baidu.com/disk/home*

// @compatible   firefox GreaseMonkey (有限)
// @compatible   firefox Violentmonkey
// @compatible   chrome Violentmonkey

// @grant        none
// @run-at       document-start
// ==/UserScript==


function entryPoint () {
'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".jx_btn {\n    background: #fefefe;\n    background: linear-gradient(to bottom,  #fefefe 0%,#f2f2f2 88%);\n\n    display: inline-block;\n    line-height: 25px;\n    vertical-align: middle;\n    margin: 0 0 0 10px;\n    text-decoration: none;\n    border: 1px solid #AAA;\n    padding: 0 20px;\n    height: 26px;\n    border-radius: 2px;\n\n    min-width: 3em;\n    text-align: center;\n}\n.jx_btn, .jx_btn:hover, .jx_btn:focus {\n    color: #666;\n}\n.jx_btn:active {\n    color: #06C;\n    background: #e3e3e3;\n    background: -moz-linear-gradient(top,  #e3e3e3 0%, #f7f7f7 12%);\n    background: -webkit-linear-gradient(top,  #e3e3e3 0%,#f7f7f7 12%);\n    background: linear-gradient(to bottom,  #e3e3e3 0%,#f7f7f7 12%);\n}\n.jx-input {\n    margin: 9px 0;\n    padding: 0 0 0 5px;\n    width: 200px;\n    height: 24px;\n    vertical-align: middle;\n    border: 1px solid rgba(58,140,255,.3);\n    background: #fff;\n    border-radius: 2px;\n}\n\n.jx_hide   { display: none }\n.jx_c_warn { color: red }\n\n.jx_list {\n    text-align: left;\n    max-height: 5.5em;\n    overflow-y: scroll;\n    overflow-x: hidden;\n    line-height: 1;\n    padding: .2em;\n    margin-bottom: .5em;\n}\n\n/*\n.jx_list:not(:empty) {\n  border: 1px solid #ddd;\n}\n*/\n\n.jx_list > li {\n    display: flex;\n    white-space: nowrap;\n    line-height: 1.3;\n}\n\n.jx_list .name {\n    color: black;\n\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.jx_list .size {\n    color: #777;\n\n    flex-grow: 1;\n}\n\n.save-complete-details {\n    max-height: 30em;\n}\n\n.jx-status {\n    padding-left: 0.25em;\n}\n\n.jx-status-success {\n    color: green;\n}\n\n.jx-status-skip {\n    color: gray;\n}\n\n.jx-status-fail {\n    color: red;\n}\n\ntextarea.jx{\n    width: 100%;\n    min-height: 5em;\n    line-height: 1;\n}\n\n.jx-form-options {\n    display: flex;\n    justify-content: left;\n}\n\n.jx-form-options > label {\n    display: inline-flex;\n    align-items: center;\n}\n\n.jx-form-options > label + label {\n    margin-left: 0.5em;\n}\n\n.jx-form-options > label > input {\n    margin-right: 0.25em;\n}\n\n.dialog-header-title > .select-text {\n    pointer-events: none;\n}\n\n.g-button-violet .text,\n.g-button-violet .icon,\n.g-button.g-button-violet:hover .icon {\n    color: #fff;\n}\n\n.g-button.g-button-violet:hover .icon {\n    opacity: 0.9;\n}\n\n.g-button-violet {\n    background: #A238FF;\n    border: 1px solid #A238FF;\n}\n\n.g-button-violet:hover {\n    background: #AE52FF;\n    border: 1px solid #AE52FF\n}\n";
styleInject(css_248z);

const TAG = '[仓库助手]';
const pluginBlacklist = ['右上角广告位', '网盘APP下载', '满减活动', '会员提醒'];

let oRequire;

const hooks = new Map();

function fakeRequire(module) {
  // console.info('%s Load module: %s', INFO, module);
  const result = oRequire.apply(this, arguments);
  const moduleHook = hooks.get(module);
  if (moduleHook) {
    try {
      moduleHook();
    } catch (e) {
      console.error('%s: 执行 %s hook 时发生错误: %s', TAG, e.message);
      console.trace(e);
    }
    hooks.delete(module);
  }
  return result;
}

function load(module) {
  return oRequire.call(window, module);
}

function loadAsync(module) {
  return new Promise(((resolve) => {
    fakeRequire.async(module, resolve);
  }));
}

function hook(module, fn) {
  hooks.set(module, fn);
}

if (window.require) {
  console.warn('%s 覆盖方式安装，若无效请强制刷新。', TAG);
  oRequire = window.require;
  window.require = fakeRequire;
  Object.assign(fakeRequire, oRequire);
} else {
  console.info('%s 钩子方式安装，若失效请报告。', TAG);
  Object.defineProperty(window, 'require', {
    set(require) {
      oRequire = require;
    },
    get() {
      return fakeRequire;
    },
  });
}

function getFileList() {
  return load('disk-system:widget/pageModule/list/listInit.js');
}

function getCheckedItems() {
  return getFileList().getCheckedItems();
}

function anythingChecked() {
  return getCheckedItems().length > 0;
}

function getCurrentDirectory() {
  return getFileList().currentKey;
}

var css_248z$1 = ".jx-dialog-body {\n    text-align:center;\n    padding:22px;\n}\n";
styleInject(css_248z$1);

let id = 0;

function nextId() {
  // eslint-disable-next-line no-plusplus
  return id++;
}

function firstFunction(...fns) {
  return fns.find((fn) => typeof fn === 'function');
}

function getDialog() {
  return load('system-core:system/uiService/dialog/dialog.js');
}

const bigButton = {
  type: 'big',
  padding: ['50px', '50px'],
};

function confirmDialog(data) {
  let dialog;

  const hideDialog = () => dialog.hide();

  const dialogData = {
    id: `confirm-${nextId()}`,
    show: true,
    title: data.title,
    body: $('<div class="jx-dialog-body">').append(data.body),
    buttons: [{
      ...bigButton,
      name: 'confirm',
      title: data.sureText || '确定',
      color: 'blue',
      click: firstFunction(data.onSure, hideDialog),
    }],
  };

  if (data.cancel !== false) {
    dialogData.buttons.push({
      ...bigButton,
      name: 'cancel',
      title: data.cancelText || '取消',
      click: firstFunction(data.onCancel, hideDialog),
    });
  }
  const Dialog = getDialog();
  dialog = new Dialog(dialogData);
  return dialog;
}

function infoDialog(data) {
  return confirmDialog({
    ...data,
    cancel: false,
  });
}

function getTip() {
  return load('system-core:system/uiService/tip/tip.js');
}

function showTip() {
  return getTip().show.apply(this, arguments);
}

function hideTip() {
  return getTip().hide.apply(this, arguments);
}

function getContext() {
  return load('system-core:context/context.js').instanceForSystem;
}

function getErrorMessage(code) {
  const msg = String(getContext().errorMsg(code));
  return msg.replace(/\s+rapidupload 错误码$/, '');
}

function injectErrorMessage(obj) {
  if ($.isPlainObject(obj)) {
    obj.error = obj.show_msg || getErrorMessage(obj.errno || 0);
  }
  return obj;
}

async function ajax(data) {
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

const div = document.createElement('a');

const escapeDict = {
  '"': 'quot',
  "'": 'apos',
};

function escapeHtml(text) {
  div.textContent = text;
  const result = div.innerHTML.replace(/["']/g, (x) => `&${escapeDict[x]};`);
  div.textContent = '';
  return result;
}

var template = "<div>\n  <p><label>请输入分享密码: <input id=\"jx_shareKey\" class=\"jx-input\" style=\"width: 6em\"/></label></p>\n  <p class=\"jx_errmsg jx_c_warn jx_hide\">无效的分享密码, 脚本将随机生成一个分享代码 &hellip;</p>\n</div>\n\n<div class=\"jx_hide\">\n  <p><label>分享地址: <input id=\"jx_shortUrl\" class=\"jx-input\" style=\"width: 20em\" readonly/></label></p>\n  <p><label>分享密码: <input id=\"jx_shareCode\" class=\"jx-input\" style=\"width: 5em; text-align: center\" readonly/></label></p>\n\n  <p style=\"text-align: left\">\n    <label for=\"jx_dlboxCode\">投稿代码:</label><br/>\n    <textarea readonly id=\"jx_dlboxCode\" class=\"jx jx-input\"></textarea>\n  </p>\n</div>\n";

const PREFIX = '__jx_';

class LocalStore {
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

class OpDialog {
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

/* 依赖函数表 */
function isCodeValid(code) {
  return encodeURIComponent(code).replace(/%[A-F\d]{2}/gi, '-').length === 4;
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

class CustomShareDialog extends OpDialog {
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
    this.$error = this.$('.jx_errmsg');
    this.$footer = this.dialog.find(getDialog().QUERY.dialogFooter);
    this.$key = this.$('#jx_shareKey').val(genKey());

    this.$key.on('input change', this.validateCode);
    this.$key.on('focus', this.hideError);
  }

  async onConfirm() {
    this.hide();

    let key = this.$key.val();
    if (!isCodeValid(key)) {
      key = genKey(4);
      this.$key.val(key);
    }

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
      + `info="提取：${escapeHtml(key)}" link1="度娘|${url}"][/dlbox]]`;

    this.$('#jx_dlboxCode').val(code);

    this.show();
  }

  /**
   * @returns string
   */
  get value() {
    return this.$key.val();
  }

  get isValueValid() {
    return encodeURIComponent(this.value).replace(/%[A-F\d]{2}/gi, '-').length === 4;
  }

  hideError() {
    this.$error.addClass('jx_hide');
  }

  validateCode() {
    this.$error.toggleClass('jx_hide', this.isValueValid);
  }
}

var template$1 = "<p>\n  <label for=\"jx_nameRule\">请输入新的命名规则 (自动储存)</label>:\n  <input id=\"jx_nameRule\" class=\"jx-input\" style=\"width:20em\" />\n</p>\n\n<p style=\"line-height: 1; padding-top: 1em;\">\n  <code>:n</code> 表示不带扩展名的文件名; <code>:e</code> 表示扩展名; <code>:E</code> 表示 .扩展名;\n  <br><code>:d</code> 表示一位随机数字; <code>:c</code> 表示一位随机字符; <code>:t</code> 表示当前时间戳\n</p>\n";

function getMessage() {
  return load('system-core:system/baseService/message/message.js');
}

function trigger(event) {
  getMessage().trigger(event);
}

/**
 * 刷新当前文件列表
 */
function refreshFileListView() {
  trigger('system-refresh');
}

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

class BatchRenameDialog extends OpDialog {
  /**
   * @param {Object} config
   * @return StandardCodeDialog
   */
  static create(config = {}) {
    return new BatchRenameDialog(config);
  }

  /**
   * @param {Object} config
   */
  constructor(config = {}) {
    super(template$1, {
      title: '批量重命名',
      ...config,
    });
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

function injectMenu() {
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

var template$2 = "<form>\n  <p>\n    <label>\n      <textarea class=\"jx jx_code jx-input\" rows=\"7\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"></textarea>\n    </label>\n  </p>\n\n  <section class=\"jx-form-options\">\n    文件重复时：\n    <!-- <label><input name=\"ondup\" type=\"radio\" value=\"\" /> 忽略</label> -->\n    <label><input name=\"ondup\" type=\"radio\" value=\"newcopy\" checked /> 建立副本</label>\n    <label><input name=\"ondup\" type=\"radio\" value=\"overwrite\" /> 覆盖</label>\n  </section>\n\n  <!--\n  <p style=\"line-height: 1; padding: .5em 0;\">\n    扩展阅读:\n    <a href=\"http://game.ali213.net/thread-5465798-1-1.html\" target=\"_blank\">肚娘代码说明 [游侠]</a>\n    | <a href=\"https://jixun.moe/2017/06/13/du-code-gen/\" target=\"_blank\">标准度娘提取码 [梦姬]</a>\n  </p>\n  -->\n\n  <p style=\"text-align:left\">\n    <b>文件列表</b> (版本: <span class=\"jx_version\" style=\"color:black\">--</span>):\n  </p>\n  <ul class=\"jx_list\"></ul>\n  <p class=\"jx_c_warn jx_hide jx_errmsg\">识别不出任何有效的秒传链接。</p>\n</form>\n";

function debounce(fn) {
  let timer;
  return () => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(fn);
  };
}

/**
 * 将数值转换为 2 位数的十六进制文本。
 * @param {Number} value
 * @returns {string}
 */
function toStdHex(value) {
  const hex = Math.floor(value).toString(16);
  return (`0${hex}`).slice(-2);
}

const slice = Function.prototype.call.bind(Array.prototype.slice);

/**
 * 一个简单的类似于 NodeJS Buffer 的实现.
 * 用于解析游侠度娘提取码。
 */
class SimpleBuffer {
  /**
   * @param {String} str
   */
  constructor(str) {
    this.fromString(str);
  }

  fromString(str) {
    const len = str.length;

    this.buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      this.buf[i] = str.charCodeAt(i);
    }
  }

  readUnicode(index, size) {
    const bufText = slice(this.buf, index, index + size).map(toStdHex);

    const buf = [''];
    for (let i = 0; i < size; i += 2) {
      buf.push(bufText[i + 1] + bufText[i]);
    }

    return JSON.parse(`"${buf.join('\\u')}"`);
  }

  readNumber(index, size) {
    let ret = 0;

    for (let i = index + size; i > index;) ret = this.buf[--i] + (ret * 256);

    return ret;
  }

  readUInt(index) {
    return this.readNumber(index, 4);
  }

  readULong(index) {
    return this.readNumber(index, 8);
  }

  readHex(index, size) {
    return Array.prototype.slice.call(this.buf, index, index + size).map(toStdHex).join('');
  }
}

/**
 * UTF-8 字符转换成 base64 后在 JS 里解析会出毛病。
 * @param str
 * @returns {string}
 */
function decodeBase64(str) {
  try {
    str = atob(str);
  } catch (e) {
    console.error('%s: base64 decode failed: %s', TAG, str);
    console.trace(e);
    return '';
  }
  return decodeURIComponent(str.replace(/[^\x00-\x7F]/g, (z) => `%${toStdHex(z.charCodeAt(0))}`));
}

const trim = (str) => String.prototype.trim.call(str);

/**
 * 百度网盘用的(非官方)标准提取码。
 * 支持解析：
 * 1. 游侠的 `BDLINK` 提取码
 * 2. 我的“标准提取码”
 * 3. PanDownload 的 `bdpan://` 协议。
 */
class DuParser {
  constructor() {
    this.reset();
  }

  reset() {
    this.results = [];
    this.versions = new Set();
  }

  /**
   * 判断地址类型并解析。
   * @param url
   */
  parse(url) {
    // 游侠的格式是多行，不好判断结束位置。
    // 所以一次只能解析一条数据。
    if (url.indexOf('BDLINK') === 0) {
      this.parseAli(url);
      return;
    }

    // 其他两个格式一行一个文件信息。
    const links = url.split('\n').map(trim);
    for (const link of links) {
      if (link.startsWith('bdpan://')) {
        this.parsePanDownload(link);
      } else {
        this.parseStandard(link);
      }
    }
  }

  hasResults() {
    return this.results.length;
  }

  parseAli(url) {
    const raw = atob(url.slice(6).replace(/\s/g, ''));
    if (raw.slice(0, 5) !== 'BDFS\x00') return null;

    const buf = new SimpleBuffer(raw);

    let ptr = 9;

    const fileCount = buf.readUInt(5);
    if (fileCount === 0) {
      return null;
    }

    this.versions.add('游侠 v1');
    for (let i = 0; i < fileCount; i++) {
      // 大小 (8 bytes)
      // MD5 + MD5S (0x20)
      // nameSize (4 bytes)
      // Name (unicode)
      const fileInfo = Object.create(null);
      fileInfo.size = buf.readULong(ptr);
      fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
      fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
      const sizeofName = buf.readUInt(ptr + 0x28) * 2;
      ptr += 0x2C;

      fileInfo.name = buf.readUnicode(ptr, sizeofName);
      this.results.push(fileInfo);
      ptr += sizeofName;
    }

    return true;
  }

  parseStandard(szUrl) {
    const match = szUrl.trim().match(/^([\dA-F]{32})#([\dA-F]{32})#([\d]{1,20})#([\s\S]+)$/i);
    if (match) {
      const [, md5, md5s, size, name] = match;
      this.versions.add('梦姬标准');
      this.results.push({
        md5, md5s, size, name,
      });
    }
    return null;
  }

  parsePanDownload(szUrl) {
    const match = decodeBase64(szUrl.slice(8)).match(/^([\s\S]+)\|([\d]{1,20})\|([\dA-F]{32})\|([\dA-F]{32})$/i);
    if (match) {
      const [, name, size, md5, md5s] = match;
      this.versions.add('PanDownload');
      this.results.push({
        md5, md5s, size, name,
      });
    }
    return null;
  }
}

/**
 * 将文本形式的文件大小转换为
 * @param {string} size
 * @returns {string}
 */
function parseSize(size) {
  let unit = 'MiB';
  let sizeInUnit = parseInt(size, 10) / 1024 / 1024;

  // 超过 GB
  if (sizeInUnit > 1024) {
    unit = 'GiB';
    sizeInUnit /= 1024;
  }

  return `${sizeInUnit.toFixed(2)} ${unit}`;
}

function itemInfo(item) {
  const name = escapeHtml(item.name);
  return `
    <span class="name" title="${name}">${name}</span>
    <span class="size">(${escapeHtml(parseSize(item.size))})</span>
  `;
}

function wrapTag(tag) {
  return (html) => `<${tag}>${html}</${tag}>`;
}

const lower = Function.prototype.call.bind(String.prototype.toLowerCase);
const upper = Function.prototype.call.bind(String.prototype.toUpperCase);

async function rapidUploadOnce(dir, name, md5, md5s, size, ondup) {
  if (dir.slice(-1) !== '/') {
    dir += '/';
  }

  return ajax({
    url: '/api/rapidupload?rtype=1',
    type: 'POST',
    // https://github.com/iikira/BaiduPCS-Go/blob/9837f8e24328e5f881d6a07cf1249508c485a063/baidupcs/prepare.go#L272-L279
    data: {
      // overwrite: 表示覆盖同名文件; newcopy: 表示生成文件副本并进行重命名，命名规则为“文件名_日期.后缀”
      ondup,

      path: dir + name,
      'content-md5': md5,
      'slice-md5': md5s,
      'content-length': size,
      local_mtime: '',
    },
  });
}

async function rapidUpload(dir, file, ondup) {
  const {
    name,
    md5,
    md5s,
    size,
  } = file;

  // 先尝试小写，如果失败则尝试大写。如果都失败则不重试。
  const resp = await rapidUploadOnce(dir, name, lower(md5), lower(md5s), size, ondup);
  if (resp.errno === 0) {
    return resp;
  }
  return rapidUploadOnce(dir, name, upper(md5), upper(md5s), size, ondup);
}

function statusHtml(result) {
  const className = result.success ? 'success' : 'fail';
  return `<span class="jx-status jx-status-${className}">${result.error}</span>`;
}

const defaultConfirmCallback = async () => true;

class StandardCodeDialog extends OpDialog {
  /**
   * @param {Object} config
   * @return StandardCodeDialog
   */
  static create(config) {
    return new StandardCodeDialog(config);
  }

  confirmText = '导入';

  confirmCallback = defaultConfirmCallback;

  constructor(config = {}) {
    super(template$2, {
      title: '从秒传链接导入',
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

function registerPlugin() {
  // 注入到 manifest 定义文件
  window.define('function-widget:jixun/standard-code.js', (require, exports) => {
    // require, exports, module
    exports.start = StandardCodeDialog.create;
  });

  window.manifest = window.manifest.filter((plugin) => !pluginBlacklist.includes(plugin.name));

  window.manifest.push({
    name: '秒传链接支持',
    group: 'moe.jixun.code',
    version: '1.0',
    type: '1',
    description: '类似于 115 的标准提取码',
    filesType: '*',
    buttons: [{
      index: 2,
      disabled: 'none',
      color: 'violet',
      icon: 'icon-upload',
      title: '秒传链接',
      buttonStyle: 'normal',
      pluginId: 'JIXUNSTDCODE',
      position: 'tools',
    }],
    preload: false,
    depsFiles: [],
    entranceFile: 'function-widget:jixun/standard-code.js',
    pluginId: 'JIXUNSTDCODE',
  });
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function parseQueryString(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  const obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  qs = qs.split(sep);

  let maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  let len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (let i = 0; i < len; ++i) {
    const x = qs[i];
    const idx = x.indexOf(eq);
    let kstr;
    let vstr;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    const k = decodeURIComponent(kstr);
    const v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

class Query {
  constructor() {
    this.search = {};
  }

  parse(source) {
    this.search = parseQueryString(source.replace(/^(#\??|\?)/g, '').replace(/\+/g, '%2b'));
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.search, name);
  }

  get(name) {
    return this.search[name];
  }
}

var css_248z$2 = ".jx-prev-path > span {\n    white-space: nowrap;\n    display: flex;\n    padding: 0 12px;\n}\n\n.jx-prev-path code {\n    padding-left: 0.5em;\n    flex-grow: 1;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n";
styleInject(css_248z$2);

var css_248z$3 = ".jx-checkbox {\n    display: none;\n}\n\n.jx-label {\n    cursor: pointer;\n}\n\n.jx-label span {\n    display: flex;\n}\n\n.jx-checkbox + span::before {\n    content: '';\n    padding-left: 20px;\n    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAOBAMAAACWQvIuAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURQAAAP///8rKyujt8TWJ4ViV2/b29srb7vLy8m2l4fX2+K3L6lKt8u7y93/G+Pn5+VodYkgAAAABdFJOUwBA5thmAAAAbElEQVQY02NQggAGZAATUzYGASMUOZiYRqIgEAihyIHFLIQY1AQx5UBiUjOFGBSxyIHElrpswi5nLCgf4roIq5yyy8WlLgexm6nt4h7iKYjDvhIXl4O45MRdPAVxyQmWPMQtJyGIWw4ihiesAfWzHJ0JZlnhAAAAAElFTkSuQmCC') no-repeat left;\n}\n\n.jx-checkbox:checked + span::before {\n    background-position-x: -40px;\n}\n";
styleInject(css_248z$3);

class Checkbox {
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

class ImportOnLoad {
  static create(content) {
    return new ImportOnLoad(content);
  }

  constructor(content = '') {
    this.content = content;

    this.onConfirm = this.onConfirm.bind(this);
    this.selectDirectory = this.selectDirectory.bind(this);

    this.initTreeSelector().catch(console.error);
  }

  async initTreeSelector() {
    // 百度的这个依赖没处理好啊，还得我手动照着顺序来加载
    await loadAsync('disk-system:widget/system/baseService/shareDir/shareDirManager.js');
    this.fileTreeDialog = await loadAsync('disk-system:widget/system/uiService/fileTreeDialog/fileTreeDialog.js');

    this.ui = getContext().ui;
    this.directoryStore = LocalStore.create(this, 'import_dir');
    this.prevPath = this.directoryStore.value || '/';

    this.confirmFileList();
  }

  selectDirectory() {
    this.dirSelectDialog = this.fileTreeDialog.show({
      title: '导入至…',
      confirm: this.onConfirm,
      isZip: true,
      showShareDir: false,
      path: '/',
    });

    this.$dialogBody = this.dirSelectDialog.dialog.$dialog.find(getDialog().QUERY.dialogBody);
    this.checkUsePrevPath = new Checkbox({
      content: '使用上次储存的位置',
      className: 'jx-prev-path',
      checked: true,
    });
    this.checkUsePrevPath.appendTo(this.$dialogBody);
    this.$prevPath = $('<code>').text(this.prevPath);
    this.checkUsePrevPath.$text.append(this.$prevPath);
    this.checkUsePrevPath.root.prop('title', this.prevPath);

    return new Promise(((resolve) => {
      this.resolveDirectorySelect = resolve;
    }));
  }

  confirmFileList() {
    const { content } = this;

    this.stdCodeDialog = StandardCodeDialog.create({
      content,
      forceRefresh: true,
      confirmText: '选择目录',
      confirmCallback: this.selectDirectory,
    });
  }

  onConfirm(targetDir) {
    this.fileTreeDialog.hide();

    const directory = this.checkUsePrevPath.checked ? this.prevPath : targetDir;
    this.directoryStore.value = directory;
    this.stdCodeDialog.setDirectory(directory);
    this.resolveDirectorySelect(true);
  }
}

const KEY_BDLINK = 'bdlink';
const { search, hash } = window.location;

function initialiseQueryLink() {
  const query = new Query();

  query.parse(search);
  if (!query.has(KEY_BDLINK)) {
    query.parse(hash);
  }

  if (query.has(KEY_BDLINK)) {
    ImportOnLoad.create(decodeBase64(query.get(KEY_BDLINK).replace(/#.{4}$/, '')));
  }
}

hook('disk-system:widget/system/uiRender/menu/listMenu.js', injectMenu);
hook('system-core:pluginHub/register/register.js', registerPlugin);
hook('system-core:system/uiService/list/list.js', initialiseQueryLink);

// ESC 将关闭所有漂浮窗口
document.addEventListener('keyup', (e) => {
  if (e.keyCode === 0x1b) {
    $('.dialog-close').click();
  }
}, false);

}

const isGm = (typeof unsafeWindow !== 'undefined') && (unsafeWindow !== window);
if (isGm) {
  const INFO = '[仓库助手]';

  console.info('%s 以 GreaseMonkey 兼容模式执行。该脚本管理器所遇到的问题不能保证能够修复。', INFO);
  unsafeWindow.eval(`;(${entryPoint})();`);
} else {
  entryPoint();
}

