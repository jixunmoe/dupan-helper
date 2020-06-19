import './app.css';

import { hook } from './my-loader';
import injectMenu from './utils/injectMenu';
import registerPlugin from './registerPlugin';
import initialiseQueryLink from './extension/initialiseQueryLink';
import { $ } from './baidu/getJQuery';

hook('disk-system:widget/system/uiRender/menu/listMenu.js', injectMenu);
hook('system-core:pluginHub/register/register.js', registerPlugin);
hook('system-core:system/uiService/list/list.js', initialiseQueryLink);

// ESC 将关闭所有漂浮窗口
document.addEventListener('keyup', (e) => {
  if (e.keyCode === 0x1b) {
    $('.dialog-close').click();
  }
}, false);
