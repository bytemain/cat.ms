---
title: 安装 ArchWSL 并配置
comments: true
toc: true
permalink: install-arch-wsl
date: 2019-07-12 09:42:25
categories: WSL
tags:
- WSL
- ArchLinux
- Linux
- ZSH
---

用 windows 写程序很不好的地方就是命令行不好用，感谢 WSL,在 win 下能体会到Linux 的便捷。  
之前使用的是商店里的 Ubuntu，没感觉到有啥不好，在 github 上看到有 ArchWSL, 曾经用过 manjaro，感觉不错。

[![yuk7/ArchWSL - GitHub](https://gh-card.dev/repos/yuk7/ArchWSL.svg)](https://github.com/yuk7/ArchWSL)

<!-- more -->
# 下载安装 ArchWSL
有作者写的 wiki 来参考：<https://github.com/yuk7/ArchWSL/wiki>
我选择的是传统方式安装(不使用AppX)：
1. 在[Release](https://github.com/yuk7/ArchWSL/releases)下载最新版的 `Arch.zip`
2. 解压到 C盘根目录，C盘其他位置你喜欢的目录也可以，但是你要有该目录的执行权限，注意不能放到：`Program Files`等目录中。
3. 双击 `Arch.exe` 进行安装，这个 exe 可执行文件的名字就是你要创建的 WSL实例的名字，就是说可以自己改。

安装好之后会提示安装好了，接下来就是配置的时候了。

# 配置 ArchWSL

## 配置软件仓库
### Arch Linux 软件仓库国内镜像
编辑 `/etc/pacman.d/mirrorlist`，可以在下面翻到 `China` 的镜像，选一个你喜欢的取消注释就可以了。

更新软件包缓存： `pacman -Syyu`

其他用法可以参考这里：  
<https://wiki.archlinux.org/index.php/Mirrors_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)>

### 添加 ArchlinuxCN 源

Arch Linux 中文社区仓库 是由 Arch Linux 中文社区驱动的非官方用户仓库。包含中文用户常用软件、工具、字体/美化包等。

官方仓库地址：http://repo.archlinuxcn.org  

这里我使用的是腾讯的镜像：  
镜像地址: http://mirrors.cloud.tencent.com/archlinuxcn/

使用方法：  
在 `/etc/pacman.conf` 文件末尾添加以下两行：
```conf
[archlinuxcn]
Server = https://mirrors.cloud.tencent.com/archlinuxcn/$arch
```
之后安装 archlinuxcn-keyring 包导入 GPG key:
```sh
pacman-key --init
pacman-key --populate
pacman -Syy && pacman -S archlinuxcn-keyring
```

### 安装 yay
> Arch User Repository（常被称作 AUR），是一个为 Arch 用户而生的社区驱动软件仓库。Debian/Ubuntu 用户的对应类比是 PPA。  
> 
> AUR 包含了不直接被 Arch Linux 官方所背书的软件。如果有人想在 Arch 上发布软件或者包，它可以通过这个社区仓库提供。这让最终用户们可以使用到比默认仓库里更多的软件。
> 
> 所以你该如何使用 AUR 呢？简单来说，你需要另外的工具以从 AUR 中安装软件。Arch 的包管理器 pacman 不直接支持 AUR。那些支持 AUR 的“特殊工具”我们称之为 AUR 助手。

我们想从 AUR 仓库中安装东西时，就需要 AUR 助手，这里推荐 `yay`.
[![Jguer/yay - GitHub](https://gh-card.dev/repos/Jguer/yay.svg)](https://github.com/Jguer/yay)


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
你也可以设置成其他的编辑器:比如 `micro`，非常好用! 需要自己安装。
让用户可以执行 sudo 命令：
```sh
visudo
```
并在里面添加
```sh
artin ALL=(ALL) ALL
```
![image](https://user-images.githubusercontent.com/13938334/61097920-a2326100-a48f-11e9-8d8e-36b5901fa80f.png)

这里我只把自己的用户名写进去了，你也可以设置一个用户组的权限，然后将你的用户加入到该用户组。

### 切换 ArchWSL 默认用户
在 cmd 中打开你的安装目录：
![image](https://user-images.githubusercontent.com/13938334/61098825-e5da9a00-a492-11e9-8a77-c8979e233688.png)
执行：
```sh
Arch.exe config --default-user artin
```

## 配置 ArchWSL
然后就是一些配置啦。
### 安装 zsh 和 oh-my-zsh
将 `bash` 换成 `zsh`：
```sh
export ALL_PROXY="http://127.0.0.1:7890"
export all_proxy="http://127.0.0.1:7890"
```
先将代理设置为我本地的代理链接，因为等下会从 `github` 下载东西，国内下的慢~

```
pacman -S zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

### 配置 zsh
#### 配置 alias
之后要经常修改 zsh，先配置几个有用的 alias，方便。
```sh
vim ~/.zshrc
```
在文件的最后几行加上：
```sh
alias vizsh="micro ~/.zshrc"
alias ohmyzsh="micro ~/.oh-my-zsh"
alias rezsh="source ~/.zshrc"
```
这里的 `micro` 是我用的编辑器，你也可以改成你喜欢的，比如 `vim`。
[![zyedidia/micro - GitHub](https://gh-card.dev/repos/zyedidia/micro.svg)](https://github.com/zyedidia/micro)

保存后执行：
```sh
source ~/.zshrc
```
即可~

#### 配置 PATH
WSL 中的环境变量会来自 Windows 系统，所以如果你两边都装了 npm 或者 python，可能会引起各种报错...
![image](https://user-images.githubusercontent.com/13938334/61099457-f5f37900-a494-11e9-8b97-b8ea5455abef.png)

```sh
vizsh
```
修改前几行：
```sh
export PATH="$HOME/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"
export PATH="/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:$PATH"
export PATH="/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:$PATH"
export PATH="/mnt/c/Users/withw/AppData/Local/Programs/Microsoft VS Code/bin:$PATH"
```
这里的都是我需要的，你可以根据自己的需要来判断用什么。
![image](https://user-images.githubusercontent.com/13938334/61099545-4f5ba800-a495-11e9-9959-2d667f7ba442.png)

### 其他的一些配置
配置 `oh-my-zsh` 的几个插件：
```sh
plugins=(git npm node history)
```
配置 不匹配通配符：
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

上面的 `http` 命令来自 `httpie`。  
安装：
```sh
pacman -S httpie
```

大概就先写这么多吧~