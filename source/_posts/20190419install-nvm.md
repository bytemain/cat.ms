---
title: 安装 nvm 与 nodejs
comments: true
toc: true
permalink: posts/install-nvm/
date: 2019-04-19 17:17:33
updated: 2019-07-04 11:00:00
categories: 
    - Nodejs
tags:
    - Nodejs
    - nvm
---
在网上看到nvm这个神器之后，最近装Nodejs都是用nvm来装了。
刚好又装了 Linux Mint ，重新在Linux下安装一遍nvm。Windows 上也有的类似工具[nvm-windows](https://github.com/coreybutler/nvm-windows)，使用方法都差不多。

GitHub 链接： [https://github.com/creationix/nvm](https://github.com/creationix/nvm)

nvm 是 nodejs 的一个版本控制工具，也就是 "Node Version Manager" 的三个首字母。

2019-06-29更新 Windows 安装 nvm
<!-- more -->
# Linux 安装 nvm
## 安装和升级 nvm
要安装或升级 nvm, 可以使用官方给的一个脚本：
官方目前的版本号是 `v0.34.0`。
你可以去上面给的链接里去安装最新的。
可以使用curl：
```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

或者 wget:
```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

这个脚本会克隆 nvm 的远程仓库到 `~/.nvm` 路径下，并且会将添加激活代码到你终端的配置文件中。

执行完这条命令之后，一切就安装好了。
But in China, 你还需要配置一下代理。

### 配置 git 代理
我本地使用的是 electron-ssr，代理的地址是 `socks5://127.0.0.1:1080`。
执行下面这个命令，就可以针对 GitHub 设置代理了。

```bash
# 只对 github.com
git config --global http.https://github.com.proxy socks5://127.0.0.1:1080

# 取消代理
git config --global --unset http.https://github.com.proxy
```
> 注意哦，这种方式不支持 ssh 方式的代理，那个需要另外配置。在这里就不多讲，我会再写一篇博客来讲配置 ssh 的代理。

使用命令行的配置等效于修改个人目录下的 `.gitconfig` 文件。 Windows/Linux 都可以。
也就是说，可以通过修改 `~/.gitconfig` 达到一样的效果：
加入下面这块代码就可以了。Windows同理。
```
[http "https://github.com"]
        proxy = socks5://127.0.0.1:1080
```
### 配置终端代理
因为终端里的命令是不走系统代理的，可以使用 proxychains4 等软件代理命令。
配置好 proxychains4 后，使用
```
proxychains4 wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```
就安装好了。

## 配置 zsh
安装好 nvm 后，发现我本机只把启动的配置写入到 `~/.bashrc` 而已，手动将配置复制到`~/.zshrc`中。
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
然后执行 `source ~/.zshrc`，即可

# 安装 nodejs
## 配置 nvm 下载来源
执行：
```
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
```
将下载来源设置为国内淘宝镜像。

## nvm 安装 nodejs
执行：
```shell
# 安装node稳定版
nvm install stable
# 安装node最新版
nvm install node
```
就是这么简单～～～

## nvm 基本使用
详见：[https://github.com/creationix/nvm#usage](https://github.com/creationix/nvm#usage)
我自己使用的就几个命令，其实也就掌握这几个命令就够用了：
```shell
nvm list # 展示可下载的版本
nvm install 10.10.0 # 安装对应版本
nvm use 10.10.0 # 使用对应版本
nvm which 10.10.0 # 查看对应版本的安装目录
```

## 配置 npm 国内源
```shell
npm install -g mirror-config-china --registry=http://registry.npm.taobao.org
```
一下就可以配置好 好几个国内源～

That's All.

# Windows 安装 nvm

## 下载安装
[nvm-windows](https://github.com/coreybutler/nvm-windows)

在 Releases 中下载最新版的 nvm-windows，如果下载的是 `nvm-noinstall.zip`，则需要配置环境变量。  
这里直接安装了 setup 版，安装之后在 cmd 中输入 `nvm`，有显示即成功安装。

## 配置国内源

```bash
nvm node_mirror https://npm.taobao.org/mirrors/node/
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
```
可设置 nvm 从国内下载安装。
安装 nodejs 可见上一节：[#配置 npm 国内源]
