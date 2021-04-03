---
title: MacOS "重新生成" /etc/resolv.conf
comments: true
toc: true
permalink: posts/macos-regenerate-resolv-dot-conf/
date: 2021-04-03 16:57:34
categories: MacOS
tags:
---

想自己本地架个 DNS 服务器，中途不小心把 `/etc/resolv.conf` 删除了，想着重启恢复还是怎么样，重启多遍发现没有什么用。

于是搜索了一下，发现其实 `/etc/resolv.conf` 只是 `/var/run/resolv.conf` 的一个软链接。

![soft link](https://i.lengthm.in/uPic/2rrWP7.png)

<!-- more -->

## 解决方案

所以解决办法就很简单了：

```bash
sudo ln -s /var/run/resolv.conf /etc/resolv.conf
```

## 参考

1. [How to force MacOS to regenerate /etc/resolv.conf file?
](https://apple.stackexchange.com/questions/264165/how-to-force-macos-to-regenerate-etc-resolv-conf-file)
