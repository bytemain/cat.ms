---
title: Flask-Migrate migrate 不生效
comments: true
toc: true
permalink: posts/flask-migrate-no-change/
date: 2021-04-22 11:46:40
categories: flask
tags:
  - Flask
---

耗费了一个晚上，把这个坑趟平了。

想使用 flask-migrate 插件做数据库版本管理，但是一直遇到这个问题。

```txt
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.env] No changes in schema detected.
```

各种方法都尝试过了，在每个地方都试了引入了 `models` 里的内容、调整使用 flask script 等等等等...

<!-- more -->

## 解决方案

因为我的数据库已经启动了，我的数据库和我的 `models` 内容是一致的。
所以这句话不会生效...

所以 migrate 最好的时机是没有建立数据库之前...

然后我就删库重来了，删库之后 migrate 果然成功了。

## 其他踩坑

看了一下大部分网友的坑都是没有引入 `models` 的内容，这个需要注意一下就好。

注意不要循环引用。

migrate 要在 `db.init` 之后。
