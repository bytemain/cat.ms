---
title: 使用nvm管理node
date: 2019-02-01 18:40:01
tags:
---

# 在 Linux 下安装 nvm

可以在官方 github 看到安装教程。
https://github.com/creationix/nvm

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
# 或者
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

command -v nvm

NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
```
