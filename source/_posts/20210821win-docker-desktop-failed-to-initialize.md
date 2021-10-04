---
title: Windows Docker Desktop 启动失败
comments: true
toc: true
permalink: posts/win-docker-desktop-failed-to-initialize/
date: 2021-08-21 06:09:28
categories: "Docker Desktop"
tags:
- Docker
---

在 Windows 上遇到一个 Docker Desktop 无法启动的问题，表现就是点击 Docker 图标，但是就是不启动，过了一会弹了一个框：

![弹框](https://i.lengthm.in/uimages/1629526988050-1629526988031-afaa3675ccc17c8f48c136af73aa4d2f7b8c2ba4.png)

中文提示的应该是：操作已超时。

<!-- more -->

## 解决方案

可能是因为在 Windows 的更新中 Docker 还没退出？然后计算机重新启动后 Docker 检测到某个文件还在，但发现一直请求都请求不到。

删除 Docker 的几个数据文件就可以了:

- C:\Users\\[USER]\AppData\Local\Docker
- C:\Users\\[USER]\AppData\Roaming\Docker
- C:\Users\\[USER]\AppData\Roaming\Docker Desktop

## 参考链接

- [Docker failed to initialize](https://forums.docker.com/t/docker-failed-to-initialize/111341/8)
- [Docker failed to initialize.Operation timed out](https://forums.docker.com/t/docker-failed-to-initialize-operation-timed-out/111321/3)
