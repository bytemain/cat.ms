---
title: 关于手贱执行了sudo git之后那些事
comments: true
toc: true
date: 2016-07-22 09:45:38
updated: 2019-04-28 00:12:04
categories:
    - Git
tags:
    - Linux
permalink: sudo-git-fix
---

在 Ubuntu 下用 git 的时候使用了`sudo git add`命令，导致每次不使用`sudo`前缀都无法对仓库进行操作。
因为用了 sudo 之后普通用户组就没有操作的权限了。在 stackoverflow 找到了解决办法。

 <!-- more -->

首先我们要知道自己的用户和用户组的 id，在终端输入

```bash
id -a
```

就能显示出来用户跟组的 id，
![Snipaste_2018-01-25_14-48-31.png](https://i.loli.net/2018/01/25/5a697dd25ebc3.png)

接下来需要用 chown 命令：

```bash
cd .git/objects
ls -al
sudo chown -R uid:groups *
## 将uid和groups换成你自己的
```
