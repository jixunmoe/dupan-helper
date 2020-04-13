// 只做了简单的格式化处理。

define('disk-system:widget/system/uiService/fileTreeDialog/fileTreeDialog.js', (load, exports, module) => {
  function FileTreeDialog() {
    this.config = {},
    this.dialog = null,
    this.zipPath = '/',
    this.showShareDir = false;
    const e = this;
    fileTree.on('selectfolder', (i) => {
      e.setButtonDisable(i === h);
    });
  }
  const $ = load('base:widget/libs/jquerypacket.js');
  const _ = load('base:widget/libs/underscore.js');
  var fileTree = load('disk-system:widget/system/uiService/fileTree/fileTree.js');
  const Dialog = load('system-core:system/uiService/dialog/dialog.js');
  const context = load('system-core:context/context.js').instanceForSystem;
  const createFolder = load('disk-system:widget/system/fileService/mkdirInTree/createFolder.js');
  var h = 'shareHolder';
  FileTreeDialog.singleton = null;
  FileTreeDialog.obtain = function () {
    if (!FileTreeDialog.singleton) {
      FileTreeDialog.singleton = new FileTreeDialog();
    }
    return FileTreeDialog.singleton;
  };
  FileTreeDialog.DIALOG_ID = 'fileTreeDialog';
  FileTreeDialog.prototype.getFileTree = function (path, isZip) {
    const { showShareDir, selectedCallback } = this;
    isZip = !!isZip;

    const options = {
      host: this.dialog.$dialog.find('.file-tree-container')[0],
      path: path || '/',
      showShareDir,
      isZip,
    };

    if (isZip && path && path !== '/') {
      $.extend(true, options, {
        selectedCallback,
      });
    }

    fileTree.build(options);
  };
  FileTreeDialog.prototype.setOptions = function (e) {
    if (!e) throw new Error('[fileTreeDialog] must set options for FileTreeDialog');
    if (!e.title) throw new Error(`[fileTreeDialog] title "${e.title}" should be set`);
    if (this.config.title = e.title,
    !_.isFunction(e.confirm)) throw new Error('[fileTreeDialog] confirm should be set');
    this.confirm = e.confirm,
    e.zipPath && (this.zipPath = e.zipPath),
    _.isFunction(e.afterHide) && (this.afterHide = e.afterHide),
    this.showShareDir = e.showShareDir,
    this.cancel = e.cancel;
  };
  FileTreeDialog.prototype.buildDialog = function () {
    const e = this;
    this.dialog = new Dialog({
      id: FileTreeDialog.DIALOG_ID,
      title: this.config.title,
      body: '<div class="file-tree-container"></div>',
      draggable: true,
      position: {
        xy: 'center',
      },
      buttons: [{
        name: 'cancel',
        title: '取消',
        type: 'big',
        padding: ['50px', '50px'],
        position: 'right',
        click() {
          e.dialog.hide(),
          typeof e.cancel === 'function' && e.cancel();
        },
      }, {
        name: 'confirm',
        title: '确定',
        type: 'big',
        color: 'blue',
        padding: ['50px', '50px'],
        position: 'right',
        click() {
          const i = $('.save-zip-path');
          let t = fileTree.getSelectPath() || {};
          return i.hasClass('check') && (t = e.getSavePath()),
          t === h ? void context.ui.tip({
            mode: 'caution',
            msg: '不能复制文件至“共享给我的文件夹”',
          }) : void e.confirm(t);
        },
      }, {
        title: '新建文件夹',
        icon: 'icon-newfolder',
        type: 'big',
        position: 'left',
        click() {
          const i = e.dialog.$dialog;
          const t = e.dialog.$dialog.find('.treeview-node-on');
          createFolder.reBuild({
            icon: t.attr('data-icon'),
            insertDom: t.next('.treeview-content'),
            container: i.find('.file-tree-container'),
          });
        },
      }],
      afterHide() {
        typeof e.afterHide === 'function' && e.afterHide();
      },
    }),
    this.bindSavePathEvent();
  };
  FileTreeDialog.prototype.setButtonDisable = function (e) {
    this.dialog.setButtonDisable(e, 2);
  };
  FileTreeDialog.prototype.changeTitle = function () {
    this.config.title && this.dialog.title(this.config.title);
  };
  FileTreeDialog.prototype.show = function (e) {
    const i = _.now();
    return this.setOptions(e),
    this.dialog || this.buildDialog(),
    this.changeTitle(),
    this.dialog.show(),
    e.zipPath ? this.showZipPath(e.zipPath) : $('.save-zip-path').remove(),
    this.getFileTree(e.path),
    context.log.send({
      name: 'dialogShow-file',
      value: _.now() - i,
    }),
    this;
  };
  FileTreeDialog.prototype.hide = function () {
    return this.dialog.hide(),
    this;
  };
  FileTreeDialog.prototype.showZipPath = function (e) {
    const i = $('.save-zip-path');
    i.length ? (i.html(`<span class="save-chk-io"></span>解压到压缩包所在目录：${e}`),
    i.attr('title', e),
    i.removeClass('check')) : this.dialog.$dialog.find('.dialog-body').after(`<div class="save-zip-path" title="${e}"><span class="save-chk-io"></span>解压到压缩包所在目录：${e}</div>`);
  };
  FileTreeDialog.prototype.getSavePath = function () {
    let e = null;
    return $('.save-zip-path').hasClass('check') && (e = this.zipPath),
    e;
  };
  FileTreeDialog.prototype.bindSavePathEvent = function () {
    const e = this;
    const i = e.dialog.$dialog;
    i.on('click', '.save-zip-path', function () {
      const i = $(this);
      const t = i.attr('class');
      t.indexOf('check') >= 0 ? (i.removeClass('check'),
      e.getFileTree('/', true)) : (i.addClass('check'),
      e.getFileTree(e.zipPath, true));
    });
  };
  FileTreeDialog.prototype.selectedCallback = function () {
    $('.save-zip-path').removeClass('check');
  };
  module.exports = FileTreeDialog.obtain();
});
