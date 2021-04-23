---
title: docker push 时显示 access denied
comments: true
toc: true
permalink: posts/docker-push-denied-access/
date: 2021-04-23 18:11:55
categories: Docker
tags:
- Docker
- Linux
---

在 Ubuntu 上使用 docker push 的时候一直报 access denied:

```bash
denied: requested access to the resource is denied
```

使用 docker login 之后也不行，给镜像打的标签也是正常的，就很奇怪。

<!-- more -->

## 解决方案

其实这也是个很神奇的问题，你会发现这篇文章有个 tag 是 Linux。

因为 docker login 会把用户信息保存在当前的用户路径下，从 login 后会有一个『你是使用明文密码登录』的提示可以看出这一点。

```txt
WARNING! Your password will be stored unencrypted in /home/xxxx/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

我在一个普通账户下，而且 docker login 没加 sudo，但后面我却使用了 sudo docker push...

so 在 root 账户下，docker 是没有登录信息的，所以就一直推不上去。

所以大家要检查的是自己当前的操作系统的登录用户是否有 docker 登录信息。

## 相关问题

在搜索过程中发现大家推不上去几乎都是同一个问题，推镜像的时候没有加 scope。
