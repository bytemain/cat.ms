---
title: 安装 Arch WSL 并配置
comments: true
toc: true
permalink: install-arch-wsl
date: 2019-07-12 09:42:25
categories: WSL
tags:
- WSL
- Arch Linux
- Linux
- ZSH
---

用 windows 写代码最想吐槽的就是 cmd 了！WSL 真的就是吾等救星。  
之前使用的是商店里的 Ubuntu WSL ，没感觉到有啥不好的，然鹅试了 Arch WSL 以后，能体会到 Ubuntu WSL 的龟速...
Arch WSL 真的是秒开哦~
链接拿去：
[![yuk7/ArchWSL](https://gh-card.dev/repos/yuk7/ArchWSL.svg)](https://github.com/yuk7/ArchWSL)

<!-- more -->
## 下载安装 Arch WSL

这里是作者的安装教程：<https://github.com/yuk7/ArchWSL/wiki>

我选择的是传统方式安装(不使用AppX方式)：
1. 在[Release](https://github.com/yuk7/ArchWSL/releases)下载最新版的 `Arch.zip`
2. 解压到 C 盘根目录，(一定要在 C 盘，其他位置也可以)，但是你要有该目录的读写权限，所以不能放到 `Program Files`等目录中。
3. 双击解压好的 `Arch.exe` 进行安装，这个 **.exe 的名字** 就是要创建的 **WSL实例的名字**，改不同的名字就能创建多个 Arch WSL。

安装好之后，进行配置。


## 配置软件仓库

### Arch Linux 软件仓库国内镜像

编辑 `/etc/pacman.d/mirrorlist`，里面有注释了的 `China` 的镜像，选一个你喜欢的取消注释就可以了。
然后更新软件包缓存，执行： `pacman -Syyu`

其他跟镜像有关的可以看这里：  
<https://wiki.archlinux.org/index.php/Mirrors_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)>

### 添加 ArchlinuxCN 源

> Arch Linux 中文社区仓库 是由 Arch Linux 中文社区驱动的非官方用户仓库。包含中文用户常用软件、工具、字体/美化包等。
>
> 官方仓库地址：http://repo.archlinuxcn.org  

这里我使用的是腾讯的镜像： <http://mirrors.cloud.tencent.com/archlinuxcn/>

使用方法：  
在 `/etc/pacman.conf` 文件末尾添加以下两行：

```conf
[archlinuxcn]
Server = https://mirrors.cloud.tencent.com/archlinuxcn/$arch
```

之后安装 `archlinuxcn-keyring` 包导入 GPG key:

```sh
pacman-key --init
pacman-key --populate
pacman -Syy && pacman -S archlinuxcn-keyring
```

### 安装 AUR 助手 yay

> Arch User Repository（常被称作 AUR），是一个为 Arch 用户而生的社区驱动软件仓库。Debian/Ubuntu 用户的对应类比是 PPA。  
> 
> AUR 包含了不直接被 Arch Linux 官方所背书的软件。如果有人想在 Arch 上发布软件或者包，它可以通过这个社区仓库提供。这让最终用户们可以使用到比默认仓库里更多的软件。
> 
> 所以你该如何使用 AUR 呢？简单来说，你需要另外的工具以从 AUR 中安装软件。Arch 的包管理器 pacman 不直接支持 AUR。那些支持 AUR 的“特殊工具”我们称之为 AUR 助手。

我们想从 AUR 仓库中安装东西时，就需要 AUR 助手，这里推荐 `yay`.
[![Jguer/yay](https://gh-card.dev/repos/Jguer/yay.svg)](https://github.com/Jguer/yay)


```sh
pacman -S yay
```

安装完 `yay`，`git` 也会被一起装好。

检查本地软件包的更新:
```sh
yay
```

## 创建普通用户
刚安装好的 Arch 是 root 用户，为了不至于权限太大误伤系统，可以先创建一个普通用户。

添加一个用户：
```sh
useradd -m artin
# 参数解析
# -m 参数能帮助创建 /home/artin
```

设置用户密码：
```sh
passwd artin
```

在下一步之前，要先把默认编辑器设置成 vim，因为用不来默认的 vi...
```sh
export EDITOR=vim; 
```
你也可以设置成自己喜欢的编辑器。

让用户可以执行 sudo 命令，这一步不能省略。
使用如下系统自带命令修改 `sudoers` 文件。
```sh
visudo
```

在里面添加这一行即可：
```sh
artin ALL=(ALL) ALL
```
![](https://user-images.githubusercontent.com/13938334/61097920-a2326100-a48f-11e9-8d8e-36b5901fa80f.png)

这里我只把自己的用户名写进去了，你也可以设置一个用户组的权限，然后将你的用户加入到该用户组。

## 切换 Arch WSL 默认用户
在 cmd 中打开你的安装目录：
![](https://user-images.githubusercontent.com/13938334/61098825-e5da9a00-a492-11e9-8a77-c8979e233688.png)
执行：
```sh
Arch.exe config --default-user artin
```

## 玩转 Arch WSL
然后就是一些我自己喜欢的配置啦。
### 安装 zsh 和 oh-my-zsh
`zsh` 又好看又好用又强大~

先将代理设置为我本地的代理链接，因为等下 `oh-my-zsh` 的脚本会从 `github` 下载东西，国内下的慢~
```sh
export ALL_PROXY="http://127.0.0.1:7890"
export all_proxy="http://127.0.0.1:7890"
```

先安装 `zsh`，再装 `oh-my-zsh`。

- [Zsh (简体中文) - ArchWiki](https://wiki.archlinux.org/index.php/Zsh_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))
- [Oh My ZSH!](https://ohmyz.sh/)
- [Zsh Web Pages](http://zsh.sourceforge.net/)


在终端执行：
```
sudo pacman -S zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```


### 配置 alias

之后要经常修改 zsh，先配置几个方便、快捷的 alias。

编辑 `~/.zshrc`， `zsh` 的配置文件。
```sh
vim ~/.zshrc
```

在文件的最后几行加上：
```sh
alias vizsh="micro ~/.zshrc"
alias ohmyzsh="micro ~/.oh-my-zsh"
alias rezsh="source ~/.zshrc"
```

这里的 `micro` 是我在用的编辑器：
[![zyedidia/micro](https://gh-card.dev/repos/zyedidia/micro.svg)](https://github.com/zyedidia/micro)
你可以改成你喜欢的， whatever.

保存后要在终端里激活一下 zsh 的配置文件：

```sh
source ~/.zshrc
```

即可~

### 配置 PATH 变量

WSL 中的环境变量会来自 Windows 系统，所以如果你两边都装了 npm 或者 python，可能会引起各种报错...
![](https://user-images.githubusercontent.com/13938334/61099457-f5f37900-a494-11e9-8b97-b8ea5455abef.png)

所以手动的精简一些环境变量，从上面这个图中拿下来一点就好啦。
编辑 `~/.zshrc`：
```sh
vizsh
```

添加：
```sh
export PATH="$HOME/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"
export PATH="/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:$PATH"
# 添加 `c/WINDOWS/system32` 这些目录是为了支持在 `vscode` 的 `remote-wsl`。
export PATH="/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:$PATH"
# 为了使用 vscode 的 `code .`
export PATH="/mnt/c/Users/withw/AppData/Local/Programs/Microsoft VS Code/bin:$PATH"
```
这里的都是我需要的，你可以根据自己的需要来判断用什么。
![](https://user-images.githubusercontent.com/13938334/61099545-4f5ba800-a495-11e9-9959-2d667f7ba442.png)


### 其他的一些配置

配置 `oh-my-zsh` 的自带几个插件：

- 自带插件列表：<https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins>
- 插件Wiki:<https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins>

找到下面这一行，填入即可。
```sh
plugins=(git npm node history)
```

配置 不匹配通配符：
这个蛮有用的，比如想用 `find *.txt` 的时候。
```sh
setopt no_nomatch
```

设置几个顺手的函数：
```sh
proxy () {
    export ALL_PROXY="http://127.0.0.1:7890"
    export all_proxy="http://127.0.0.1:7890"
    http --follow -b https://api.ip.sb/geoip
}

unpro () {
    unset ALL_PROXY
    unset all_proxy
    http --follow -b https://api.ip.sb/geoip
}

# 参考自：
# 来源：Ubuntu「一键」设置代理 | Sukka's Blog
# 链接：https://blog.skk.moe/post/enable-proxy-on-ubuntu/

ip_ () {
    http --follow -b https://api.ip.sb/geoip
}

git-config() {
    echo -n "Please input Git Username: "      
    read username      
    echo -n "Please input Git Email: "
    read email      
    echo -n "Done!"
    git config --global user.name "${username}"
    git config --global user.email "${email}"  
}
# 参考自：
# 链接：https://github.com/SukkaW/dotfiles
```

上面的脚本中的 `http` 命令来自 [httpie](https://httpie.org/) 。  
安装：
```sh
pacman -S httpie
```

大概就先写这么多吧~