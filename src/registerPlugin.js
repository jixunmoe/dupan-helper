import { pluginBlacklist } from './constants';
import StandardCodeDialog from './extension/StandardCodeDialog';

export default function registerPlugin() {
  // 注入到 manifest 定义文件
  window.define('function-widget:jixun/standard-code.js', (require, exports) => {
    // require, exports, module
    exports.start = StandardCodeDialog.create;
  });

  window.manifest = window.manifest.filter((plugin) => !pluginBlacklist.includes(plugin.name));

  window.manifest.push({
    name: '标准提取码插件',
    group: 'moe.jixun.code',
    version: '1.0',
    type: '1',
    description: '类似于 115 的标准提取码',
    filesType: '*',
    buttons: [{
      index: 2,
      disabled: 'none',
      title: '标准提取码',
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
