---
title: 为什么 flask 在 debug 模式下会自动 reload 两次
date: 2020-08-21 00:46:21
categories: flask
tags:
  - flask
comments: true
toc: true
permalink: posts/why-does-running-the-flask-dev-server-run-itself-twice/
---

在刚接触 flask 的时候，就观察到这样一个现象：flask 在开发环境下，开启自动 reload，每次都会 reload 两次，导致重启就很慢。。。

flask 开启 debug 模式之后就会自动检测文件是否有改动，有改动则重启服务。



<!-- more -->
https://flask.palletsprojects.com/en/1.1.x/server/
