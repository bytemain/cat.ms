---
title: Windows 安装 NodeRT 踩坑
date: 2020-08-20 11:25:18
updated: 2020-08-24 16:44:31
categories: Nodejs
tags:
  - Nodejs
  - Windows
  - NodeRT
  - electron
comments: true
toc: true
permalink: posts/windows-install-nodert/
---

最近在学习 electron，因为在 Windows 上 electron 自带的 Notification 功能有点少，没法加按钮啥的。

查了一下，发现有人已经基于 `NodeRT` 做了 [electron-windows-notifications](https://github.com/felixrieseberg/electron-windows-notifications)，可以在 electron 展示原生的通知框。`NodeRT` 能让我们在 Node.js 中使用 Windows Runtime API。

然后兴高采烈的执行 `yarn add electron-windows-notifications`, 结果报错了：

```plain
[4/4] Building fresh packages...
[1/5] ⠈ @nodert-win10-au/windows.applicationmodel
[2/5] ⠁ @nodert-win10-au/windows.data.xml.dom
[3/5] ⠁ @nodert-win10-au/windows.foundation
[4/5] ⠁ @nodert-win10-au/windows.ui.notifications
error SECRETPATH\node_modules\@nodert-win10-au\windows.foundation: Command failed.
Exit code: 1
Command: node-gyp rebuild
Arguments:
Directory: SECRETPATH\node_modules\@nodert-win10-au\windows.foundation
Output:
...
[SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\build\binding.vcxproj]
  _nodert_generated.cpp
  NodeRtUtils.cpp
  OpaqueWrapper.cpp
  CollectionsConverterUtils.cpp
SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\nodertutils.cpp : fatal error C1107: 未能找到程序集“Windows.winmd”: 请使用 /AI 或通过设置 LIBPATH 环境变量指定程序集搜索路径 [SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\build\binding.vcxproj]
SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\_nodert_generated.cpp : fatal error C1107: 未能找到程序集“Windows.winmd”: 请使用 /AI 或通过设置 LIBPATH 环境变量指定程序集搜索路径 [SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\build\binding.vcxproj]
  win_delay_load_hook.cc
NPMPATH\node_modules\node-gyp\src\win_delay_load_hook.cc : fatal error C1107: 未能找到程序集“Windows.winmd”: 请使用 /AI 或通过设置 LIBPATH 环境变量指定程序集搜索路径 [SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\build\binding.vcxproj]
SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\opaquewrapper.cpp : fatal error C1107: 未能找到程序集“Windows.winmd”: 请使用 /AI 或通过设置 LIBPATH 环境变量指定程序集搜索路径 [SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\build\binding.vcxproj]
SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\collectionsconverterutils.cpp : fatal error C1107: 未能找到程序集“Windows.winmd”: 请使用 /AI 或通过设置 LIBPATH 环境变量指定程序集搜索路径 [SECRETPATH\node_modules\@nodert-win10-au\windows.foundation\build\binding.vcxproj]
gyp ERR! build error
```

<!-- more -->

啊，这熟悉的 msvc 工具链报错。错误原因是 [fatal error C1107: 未能找到程序集“Windows.winmd”](https://docs.microsoft.com/zh-cn/cpp/error-messages/compiler-errors-1/fatal-error-c1107?view=vs-2019)，提示说可以用 LIBPATH 设置这个文件的位置。
使用 listary 查了一下本机的 `Windows.winmd` 的 位置，然后就开始了第一次的错误尝试，设置了 `LIBPATH`，依然报错。

想想以前使用 VS 的时候，需要在项目中配置一下引用的库的位置才能正确编译，所以这很有可能还是找不到库的位置所以报的错。中间的摸索过程就不写了，直接写怎么解决。

## 配置 node-gyp

因为之前装 `node-sass` 的时候接触过 `node-gyp`，所以现在第一件事就是要确保 `node-gyp` 能使用。

查看 `node-gyp` 的仓库 README，发现有教程： [Installation On Windows](https://github.com/nodejs/node-gyp#on-windows)

强烈建议去看原教程后再看本教程。  
强烈建议去看原教程后再看本教程。  
强烈建议去看原教程后再看本教程。  

首先需要安装 Python，如果你本地没有，最简单的方法就是从微软商店直接安装，直接打开 Microsoft Store，搜索安装即可。  
[Python Microsoft Store package](https://docs.python.org/3/using/windows.html#the-microsoft-store-package)

`node-gyp` 支持以下这几个 Python 版本：v2.7, v3.5, v3.6, v3.7, v3.8。

### 方案 1（个人不推荐，可能会出现自己不可控制的局面）

使用 [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) 来自动配置 MsBuild 和 Python 环境。

打开一个有管理员权限的 CMD 或者 PowerShell 终端，执行：`npm install --global --production windows-build-tools`，等待完成即可。

### 方案 2

手动安装:

1. 安装 Visual C++ Build 环境: [Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools) (安装组件时勾选 "Visual C++ build tools") 或者 [Visual Studio 2017 Community](https://visualstudio.microsoft.com/pl/thank-you-downloading-visual-studio/?sku=Community) (安装组件时勾选 "Desktop development with C++")
2. 打开 cmd, 执行：`npm config set msvs_version 2017`

如果你的程序还需要运行在其他的处理器平台上，记得安装组件的时候也要勾上对应的。比如 ARM64 平台的，要选择："Visual C++ compilers and libraries for ARM64" 和 "Visual C++ ATL for ARM64" 两个组件。

如何确定自己的 `node-gyp` 环境安装好了呢？
以下包随便安装一个就行了，安装成功则说明 node-gyp 环境已经好了：

- bson
- bufferutil
- kerberos
- node-sass
- sqlite3
- phantomjs

## 解决找不到 `Windows.winmd` 文件

其实这个问题就是代码的问题，根据[这个 issue 中的描述](https://github.com/NodeRT/NodeRT/issues/65#issuecomment-303938757)，当前版本的 NodeRT 只会去扫描 `C:\Program Files (x86)\Windows Kits\10\UnionMetadata` 路径下的 `.winmd` 文件，硬编码了依赖库目录（不过也说得通）。

所以解决方案就是，把你的 `Windows.winmd` 文件放到这个文件夹下就行了，默认安装的 Windows 10 SDK 应该都在这个文件夹下的一个个子文件夹，直接把对应版本的 Windows.winmd 挪出来就行。

比如说我就把 `C:\Program Files (x86)\Windows Kits\10\UnionMetadata\10.0.19041.0\Windows.winmd` 这个文件往上移动了一级，也就是移动到了 `..` 文件夹。现在再去安装，就已经可以了。

---
从此以后，遇到打包 Native 的场景，我再也不怕了！

![安装成功](https://i.lengthm.in/posts/windows-install-nodert/succ.png)

---

2020/08/24 后记

`electron-windows-notifications` 确实 8 太行啊，简单的 toast 写上去倒是可以弹通知，加了 `actions` 之后就展示不出来通知了。

而且这个库也很久没更新了，依赖的 `NodeRT` 的版本都很久远了，所以现在使用 `node-notifier`，这个包在 Windows 下会使用一个编译好的程序：`SnoreToast`，通过调用这个 Native 程序来显示通知。
