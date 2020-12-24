---
title: 关于 app_context() 的一些坑
comments: true
toc: true
permalink: posts/flask-with-app-context/
date: 2020-12-21 12:05:15
categories:
tags:
---

想使用 app_context 进行数据库的初始化，于是手动 push, pop context。

但是报错

<!-- more -->
