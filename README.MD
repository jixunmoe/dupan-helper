仓库用度盘投稿助手
==================

适用于：Google Chrome (80+)、Firefox (74+)。

[![到 GreasyFork 安装][btn_gf]][install_gf]
[![到 jsDelivr 安装][btn_jd]][install_jd]
[![到 GitHub 安装][btn_gh]][install_gh]

[install_gf]: https://greasyfork.org/scripts/3285
[install_gh]: https://raw.githubusercontent.com/JixunMoe/dupan-helper/master/dist/dupan-helper.user.js
[install_jd]: https://cdn.jsdelivr.net/gh/JixunMoe/dupan-helper/dist/dupan-helper.user.js

你的浏览器不在上方或者无效果？你可以安装兼容版：<br>
[![到 GreasyFork 安装][btn_gf]][install_gfl]
[![到 jsDelivr 安装][btn_jd]][install_jdl]
[![到 GitHub 安装][btn_gh]][install_ghl]

[install_gfl]: https://greasyfork.org/scripts/400800
[install_ghl]: https://raw.githubusercontent.com/JixunMoe/dupan-helper/master/dist/dupan-helper-legacy.user.js
[install_jdl]: https://cdn.jsdelivr.net/gh/JixunMoe/dupan-helper/dist/dupan-helper-legacy.user.js

※ 兼容版使用 `babel` 对代码进行降级处理以支援更多的浏览器。

[btn_gh]: https://i.loli.net/2020/04/15/uRf3yFnAUS1ztXC.png
[btn_gf]: https://i.loli.net/2020/04/15/hXDqr2SPsHWjVKI.png
[btn_jd]: https://i.loli.net/2020/04/15/PvMEgj7tsiufA83.png

---

<!-- 
<del>Chrome 插件版：[仓库用度盘投稿助手](https://chrome.google.com/webstore/detail/iaogjohjloacflojfjajlcmmoajbdpcb)</del>
源码丢了，实现内容和这个脚本（的旧版本）基本没差别。
-->

⚠　只需要「秒传」功能的可以参见这个脚本：<br>
　　　[秒传链接提取](https://greasyfork.org/scripts/397324)

👉　源代码托管在 [<img src="https://github.githubassets.com/favicons/favicon.png" width=14 /> GitHub](https://github.com/JixunMoe/dupan-helper)

## 脚本功能

* 自定义分享 (自定义提取码，自动生成仓库投稿代码[旧版])　　⚠ 目前严打，有些文件根本分享不出去  
  ![自定义提取码][custom_pwd]
* 批量重命名 (自定义命名规则)  
  ![批量重命名][batch_rename]
* 标准提取码 - 再也不怕文件链接坏掉了^<sup>1</sup>  
  ![标准提取码][std_code]

[custom_pwd]: https://i.loli.net/2020/04/15/ocXN1sSOEeAwjZ8.png
[batch_rename]: https://i.loli.net/2020/04/15/QOL4kcC6IGdR8Ze.png
[std_code]: https://i.loli.net/2020/04/15/3tZ5Ae6oE2aVRqI.png

^<sup>1</sup>: 取决于百度网盘的服务器是否有这个文件以及是否屏蔽。

## 提取码支持

* 「游侠」的「[肚娘提取码](http://game.ali213.net/thread-5465798-1-1.html)」。  
  游侠格式的提取码一次只能添加一个，不能与其他格式混搭。
* 梦姬标准提取码
* PanDownload 的 `bdpan://` 协议链接。

### 标准提取码格式

一行一个文件数据，格式如下：

    <完整 MD5> # <片段 MD5> # <文件长度> # <文件名>

* 完整 MD5: 文件的整体 MD5 校验数据。
* 片段 MD5: 文件前 256KiB 的 MD5 校验数据。
* 文件长度: 文件的字节长度，纯数字。
* 文件名　: 导入的文件名称。

合并起来就是下面这个样子（提取码仅供测试用途）:

```
855E7B1A30C30612AF4EF48E98ADA278#3DF18E7BF1E05C9E40EA5B6E061FE4D8#295682048#LibreOffice_6.2.4_Win_x64.msi
85F1F1A093F7645985C5B87DB9D0411B#AB3E81997FB8E223EF9FDEA99AC3CBEF#156026792#xampp-windows-x64-7.3.6-1-VC15-installer.exe
828D08946421B5B2215625DEF1C7745E#D3A1FB7C331013ADC3E7BA46CF22F9A2#111087432#MeGUI-2896-32.zip
1C06E48C6A85C2FD6D1C0CF8BD57ABAF#C97B8AF390F4E50B0C13A3C7A6CD9A9C#59287984#Wireshark-win64-3.0.2.exe
C654643F3BCFBC305CA61151ED407DDA#D79939D48BAC90ADE0CA8EE922FD6EF6#785958680#android-studio-ide-192.6241897-windows.exe
CF5D5D149E4A6ECF993B720D4C3D5FE9#8032F875BDA5C2C6EC8DFDF25BCD5B32#170460680#VirtualBox-6.0.14-133895-Win.exe
70FDFA614E781514C37E3A990A2E3821#A414B184565F7B48FD6B192290F7F9FD#50930768#eclipse-inst-win64.exe
```

注：如果已经被 5 秒教育的视频依旧会 5 秒，请随便压缩一下，上个密码。
