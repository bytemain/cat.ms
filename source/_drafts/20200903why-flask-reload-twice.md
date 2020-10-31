---
title: 为什么 flask 在 debug 模式下会自动 reload 两次
date: 2020-08-21 00:46:21
categories: flask
tags:
  - flask
comments: true
toc: true
permalink: why-does-running-the-flask-dev-server-run-itself-twice
---

之前遇到过一个问题，flask 开发过程中，自动 reload 每次都会 reload 两次，研究了一下到底是怎么回事。

flask 开启 debug 模式之后就会自动检测文件是否有改动，有改动则重启服务。



<!-- more -->
https://flask.palletsprojects.com/en/1.1.x/server/
