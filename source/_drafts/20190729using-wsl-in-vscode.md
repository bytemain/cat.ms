---
title: 在 VSCode 中使用 WSL
comments: true
toc: true
permalink: using-wsl-in-vscode
date: 2019-07-29 15:57:56
categories: WSL
tags:
  - WSL
  - VSCode
---
WSL1 刚出来那会体验过一下，但是一直没有正式上手使用，而是使用 Cmder 作为 Win 下的开发终端。  
Cmder 很优秀，提供了一种 Linux 操作的体验。  
在 VSCode 发布了 `Remote Development` 插件之后，试用了一下，太香了。  
能直接编辑 WSL 中的文件，WSL 与主机共享 localhost，WSL 共享主机环境变量，能直接调用 Win 的 exe 文件(这意味着你可以使用 `explorer .` 来打开 Windows 资源管理器)

当然 WSL 和 Windows 都很努力，也解决了很多痛点：可以开启磁盘上文件夹的大小写敏感，可以直接在 Windows 编辑 WSL 文件。

VSCode 足够优秀，搭配上 Arch WSL，启动也不慢，可以说是很满意了。
<!-- more -->


[1]: https://code.visualstudio.com/blogs/2019/05/02/remote-development
[2]: https://juejin.im/post/5ccbb971e51d453aa27a7141
[3]: https://code.visualstudio.com/docs/remote/wsl