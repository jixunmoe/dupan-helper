// 百度云的文件书 (目录树) UI 组件。

define('disk-system:widget/system/uiService/fileTree/fileTree.js', (load, exports, module) => {
  const { yunData } = window;
  const $ = load('base:widget/libs/jquerypacket.js');
  const _ = load('base:widget/libs/underscore.js');
  const toolsUtil = load('base:widget/tools/service/tools.util.js');
  const toolsEvent = load('base:widget/tools/service/tools.event.js').EventEmitter;
  const ctx = load('system-core:context/context.js').instanceForSystem;
  const CacheManager = load('system-core:system/cache/listCache/cacheManage.js');
  const { topMountManager, shareDirManager } = ctx.tools;
  const { message } = ctx;

  function FileTreeWidget() {
    this._mHandleListener = window.disk.obtainId();
    this._vHost = null;
    this._vTreeViewCache = {};
    this.selectedCallback = null;
    this._vInit = false;
    this._showShareDir = false;
    this._isZip = false;
    this._vSelectPath = '/';
    this._vError = true;
    this.vInitPath = '/';
    this.historyConfig = {
      maxLength: 40,
      overlength: false,
      minAveragelength: 5,
      averageLength: 5,
    };
    this.folderCache = new CacheManager('tree', this.folderCacheConfig);
    this.template = _.template([
      '<li>',
      "<div class=\"treeview-node <% print(data.dirEmpty ? 'treenode-empty' : '') %> ",
      "<% print(data.nodeOn ? 'treeview-node-on' : '') %> ",
      "<% print(data.nodeRoot ? 'treeview-root' :  '') %> ",
      "<% print(data.minus ? '_minus' : '') %> \" ",
      "<% print(data.isShareDir ? 'data-sharedir=1' : '') %> ",
      "<% print(data.disableCheck ? 'data-disable-check=1' : '') %>  ",
      "<% print(data.icon ? ('data-icon='+data.icon) : '') %>  ",
      'data-padding-left="<%= data.paddingLeft %>" style="padding-left:<%= data.paddingLeft %>px">',
      '<span class="treeview-node-handler">',
      "<em class=\"b-in-blk plus icon-operate <% print(data.minus ? 'minus' : '') %>\" ></em>",
      '<dfn class="b-in-blk treeview-ic ',
      "<% print(data.notShowIcon ? 'treeview-dir' : (data.icon || 'treeview-dir')) %>\"></dfn>",
      '<span class="treeview-txt" data-file-path="<%= data.path %>"><%= data.fileName %></span>',
      '</span>',
      '</div>',
      "<ul class=\"treeview <% print(data.nodeRoot ? 'treeview-root-content' : '') %> ",
      "treeview-content <% print(data.minus ? '' : 'treeview-collapse') %>\"",
      " data-padding-left=\"<% print((data.paddingLeft + 15) + 'px') %>\"></ul>",
      '</li>',
    ].join(''), {
      variable: 'data',
    });
  }
  toolsUtil.inherits(FileTreeWidget, toolsEvent);
  FileTreeWidget.ROOT = 0;
  FileTreeWidget.NORMAL = 1;
  FileTreeWidget.PARTICULAR_DIR_MAP = {
    '/': '/全部文件',
    '/apps': '/我的应用数据',
    '/百度云收藏': '/百度云收藏',
    '/来自PC的备份文件': '/来自PC的备份文件',
    '/我的分享': '/我的分享',
    '/我的作品': '/我的作品',
  };
  FileTreeWidget.prototype.folderCacheConfig = {
    api: '/api/list',
    params: {
      folder: 1,
      order: 'name',
      desc: 0,
      showempty: 0,
      web: 1,
    },
    limit: 500,
    currentPage: 0,
    listKey: 'list',
    getParamsBykey(dir) {
      return { dir };
    },
    getPageParams(page, num) {
      return { page, num };
    },
    getKeyByParams(e) {
      return e.dir;
    },
    beforeListPush(e) {
      for (let i = 0; i < e.length; i++) {
        e[i].share = e[i].share ? e[i].share % 2 : 0;
      }
      return e;
    },
    failCallBack(e, unknown, event) {
      event = event.params;
      event.FileTreeView._errorToast(e);
      event.host.parent().find('.minus').removeClass('treeview-leaf-loading');
    },
  };

  if (yunData.sharedir === 1) {
    FileTreeWidget.prototype.folderCacheConfig.topMount = (mountp1, mountp2, mountp3) => {
      const params = [mountp1, mountp2, mountp3, topMountManager.FILE_IDENTITY.SHARE];
      if (FileTreeWidget.obtain._showShareDir) {
        return topMountManager.mount(...params);
      }
      return topMountManager.demount(...params);
    };
  }

  FileTreeWidget.prototype.buildDialogTree = function buildDialogTree(fileName, initialPadding) {
    fileName = fileName || '全部文件';
    const listContainer = document.createElement('ul');
    listContainer.className = `treeview treeview-content ${this._mHandleListener || ''}`;
    this._vHost.appendChild(listContainer);

    const path = this.vInitPath;
    let isShareDir = false;
    let icon = false;
    if (yunData.sharedir !== 255) {
      isShareDir = shareDirManager.checkIsShareDirByPath(path);
      icon = isShareDir ? topMountManager.SHARE_DIR_ICON : false;
    }
    listContainer.innerHTML = this._tpl({
      nodeOn: true,
      path,
      fileName,
      icon,
      isShareDir,
      nodeRoot: true,
      minus: true,
      paddingLeft: initialPadding,
      notShowIcon: true,
    });

    this._vInit = true;
    this._buildTreeView({
      dir: path,
      paddingLeft: 15,
    });
  };

  FileTreeWidget.prototype._init = function _init() {
    let initialPadding = 0;
    if (this._isZip && this.vInitPath !== '/') {
      initialPadding = 1;
      this.showFileHistory(this.vInitPath);
    } else {
      $('.filetree-history').remove();
    }

    if (this._isZip || this.vInitPath === '/') {
      this.buildDialogTree(initialPadding);
    } else {
      shareDirManager.getNameByFakepath(this.vInitPath, this.buildDialogTree.bind(this, initialPadding));
    }
  };

  FileTreeWidget.prototype._populateTreeView = function _populateTreeView(paddingLeft, cache) {
    let html = '';
    this._vError = true;
    this._vTreeViewCache = cache;

    const r = this._vTreeViewCache.length;
    for (let i = 0; r > i; i++) {
      const file = this._vTreeViewCache[i];
      const filePath = file.path;
      let fileName = '';
      let isShareDir = false;
      let f = false;
      let icon = false;
      if (yunData.sharedir !== 255) {
        isShareDir = shareDirManager.checkIsShareDirByPath(filePath);
        f = isShareDir || !!file.share;
        icon = f ? topMountManager.SHARE_DIR_ICON : file.icon;
      }
      if (isShareDir) {
        if (file.isdir === 0) continue;
        fileName = file.server_filename;
        icon = topMountManager.SHARE_DIR_ICON;
      } else {
        fileName = this.changePath(filePath);
      }
      html += this._tpl({
        dirEmpty: file.dir_empty,
        paddingLeft,
        path: filePath,
        fileName,
        icon,
        isShareDir: f,
        disableCheck: file.disableCheck,
      });
    }
    this.$host.html(html).attr('data-padding-left', paddingLeft);
    this.handleEvent();
    this.$minusNode.removeClass('treeview-leaf-loading');
  };

  FileTreeWidget.prototype._buildTreeView = function _buildTreeView(config) {
    const self = this;
    const dir = config.dir || '/';
    const host = config.host || $('.treeview-root-content');
    this.$host = host;
    const $minusNode = host.parent().find('.minus');
    const populateTreeNode = this._populateTreeView.bind(this, config.paddingLeft);

    this.$minusNode = $minusNode;
    $minusNode.addClass('treeview-leaf-loading');
    if (shareDirManager.checkIsShareDirByPath(dir)) {
      message.trigger('system-load-share-dir-list', {
        dir,
        complete: populateTreeNode,
        host,
        FileTreeView: self,
      });
    } else {
      this.folderCache.updateKey(dir);
      this.folderCache.getCacheData(-1, populateTreeNode, {
        host,
        FileTreeView: self,
      });
    }
  };

  FileTreeWidget.prototype._tpl = function _tpl(e) {
    return this.template(e);
  };

  FileTreeWidget.prototype._errorToast = function _errorToast(error) {
    let msg = '';
    if (error && typeof error === 'string') {
      msg = error;
    } else {
      msg = ctx.errorMsg(error.errno, '列表加载失败，请稍后重试&hellip;');
      this._vError = false;
    }
    ctx.ui.tip({
      mode: 'failure',
      msg,
    });
    return false;
  };

  FileTreeWidget.prototype._getPath = function _getPath($el) {
    let selectedPath = $el.find('.treeview-txt').attr('data-file-path');
    if (!selectedPath) {
      selectedPath = $el
        .parent().parent()
        .prev()
        .find('.treeview-txt')
        .attr('data-file-path') || '/';
    }

    this._vSelectPath = selectedPath;
    return selectedPath;
  };

  FileTreeWidget.prototype.getParentPath = function getParentPath(e) {
    return e.slice(0, e.lastIndexOf('/')) || '/';
  };

  FileTreeWidget.prototype.parseNameFromPath = function parseNameFromPath(e) {
    return e.substring(e.lastIndexOf('/') + 1, e.length);
  };

  FileTreeWidget.prototype.changePath = function changePath(e) {
    return this.parseNameFromPath(FileTreeWidget.PARTICULAR_DIR_MAP[e] ? FileTreeWidget.PARTICULAR_DIR_MAP[e] : e);
  };

  FileTreeWidget.prototype.build = function build(e) {
    // const time = Date.now();
    this._vHost = e && e.host;
    this.selectedCallback = e && e.selectedCallback;
    this._showShareDir = e.showShareDir;
    this._isZip = e.isZip;
    e && e.path && (this.vInitPath = e.path);

    if (!this._vInit || this._vError) {
      this._vHost.innerHTML = '';
      this._init();
    }

    // const timeDiff = Date.now() - time;
    // ctx.log.send({
    //   name: 'fileTreeRender',
    //   value: timeDiff,
    // });
  };

  FileTreeWidget.prototype.getSelectPath = function getSelectPath() {
    return this._getPath($('.treeview-node-on'));
  };

  FileTreeWidget.prototype.showFileHistory = function showFileHistory(e) {
    if (e === '/') {
      $('.filetree-history').remove();
      return;
    }

    const { historyConfig } = this;
    const pathSectors = e.split('/');
    if (e.length > historyConfig.maxLength) {
      this.historyConfig.overlength = true;
      const average = Math.floor(historyConfig.maxLength / pathSectors.length);
      this.historyConfig.averageLength = (average > historyConfig.minAveragelength + 3) ? average : 5;
    } else {
      this.historyConfig.overlength = false;
    }
    this.buildHistory(pathSectors);
    this.handleEvent();
  };

  // 顶部的访问节点
  FileTreeWidget.prototype.buildHistory = function buildHistory(pathSectors) {
    const self = this;
    const { historyConfig } = self;
    let pathText = '';
    let dirName = '';
    let html = '';
    historyConfig.maxDeep = Math.floor(historyConfig.maxLength / (historyConfig.minAveragelength + 3));

    const {
      averageLength,
      minAveragelength,
      maxDeep,
      overlength,
    } = historyConfig;

    html = '<span class="filetree-history-item" node-type="filetree-history-item" path="/">全部文件</span>';
    if (averageLength === minAveragelength && pathSectors.length > maxDeep + 1) {
      html += '<span class="filetree-separator-gt">></span><span class="dot">...</span>';
    }
    for (let i = 1; i < pathSectors.length; i++) {
      pathText += `/${pathSectors[i]}`;
      if (overlength && pathSectors[i].length > maxDeep + 1) {
        dirName = `${pathSectors[i].substring(0, averageLength)}...`;
      } else {
        dirName = pathSectors[i];
      }
      if (averageLength === minAveragelength && pathSectors.length > maxDeep + 1) {
        if (i > pathSectors.length - (maxDeep + 1)) {
          html += '<span class="filetree-separator-gt"></span>';
          html += '<span class="filetree-history-item" node-type="filetree-history-item" ';
          html += `path="${pathText}">${dirName}</span>`;
        }
      } else {
        html += '<span class="filetree-separator-gt"></span>';
        html += '<span class="filetree-history-item" node-type="filetree-history-item" ';
        html += `path="${pathText}">${dirName}</span>`;
      }
    }
    const container = $('.filetree-history');
    if (container.length) {
      container.html(html);
    } else {
      $(self._vHost).before(`<div class="filetree-history">${html}</div>`);
    }
  };

  FileTreeWidget.prototype.handleEvent = function handleEvent() {
    const self = this;
    $('.treeview-node').off().on({
      mouseenter() {
        $(this).addClass('treeview-node-hover');
      },
      mouseleave() {
        $(this).removeClass('treeview-node-hover');
      },
      click() {
        const $node = $(this);
        const $minus = $node.hasClass('_minus');
        const treeviewOn = $node.hasClass('treeview-node-on');
        const empty = $node.hasClass('treenode-empty');
        const paddingLeft = $node.attr('data-padding-left');
        // t.hasClass('waitHandle');
        const dir = self._getPath($node);
        const $subDirTree = $node.next('ul');
        const isSharedDir = !!$node.attr('data-sharedir');
        const $plus = $node.find('.plus');
        const $treeIc = $node.find('.treeview-ic');
        if (!treeviewOn) {
          $('.treeview-node-on').removeClass('treeview-node-on');
          $node.addClass('treeview-node-on');
        }

        if ((treeviewOn && $minus) || empty) {
          $node.removeClass('_minus');
          $plus.removeClass('minus');
          $subDirTree.addClass('treeview-collapse');
          if (isSharedDir) {
            $treeIc.addClass('dir-share-small').removeClass('treeview-dir');
          }
        } else {
          $node.addClass('_minus');
          $plus.addClass('minus');
          $subDirTree.removeClass('treeview-collapse');
          if (isSharedDir) {
            $treeIc.removeClass('dir-share-small').addClass('treeview-dir');
          }
        }

        if (typeof self.selectedCallback === 'function') {
          self.selectedCallback.call(self.selectedCallback);
        }

        if ($node.next('ul').children().length === 0 && !empty) {
          // => _buildTreeView: 建立起来
          self._buildTreeView({
            dir,
            host: $subDirTree,
            paddingLeft: parseInt(paddingLeft, 10) + 15,
          });
        }

        if (self._isZip && self.vInitPath !== '/') {
          self.showFileHistory(dir);
        } else {
          self.emit('selectfolder', dir);
        }
      },
    });

    $('.filetree-history-item').off().on({
      click() {
        const path = $(this).attr('path');

        if (typeof self.selectedCallback === 'function') {
          self.selectedCallback.call(self.selectedCallback);
        }

        self.build({
          host: self._vHost,
          path: path || '/',
        });
        self.showFileHistory(path);
      },
    });
  };

  FileTreeWidget.obtain = new FileTreeWidget();
  module.exports = FileTreeWidget.obtain;
});
