---
title: WSL2 的一些网络访问问题
comments: true
toc: true
permalink: wsl2-network-tricks
date: 2019-12-28 20:39:31
updated: 2019-12-28 20:39:31
categories:
  - WSL
tags:
  - Linux
---
快考完试了，这个学期一直在使用 Ubuntu WSL2 在进行开发，无论是 Python/C/React 都是用 VSCode Remote WSL 进行开发的，体验非常好。

这篇文章大概有以下内容：

1. wsl2 中连接到主机代理
2. 主机访问 wsl2
3. 局域网访问 wsl2

<!-- more -->

## wsl2 连接到主机代理

其实这个问题我在之前那篇[配置 ArchWSL 的文章](/posts/install-arch-wsl/#zsh-的其他的一些配置)里简单提了一下，大概流程如下：

1. 获取主机的 ip
2. Win 上的代理软件允许局域网访问
3. 设置 Linux 下的代理

### 获取主机的 ip

由于 wsl2 是使用 Hyper-V 虚拟机实现的，也就不能跟 Windows 共享同一个 localhost 了，而且每次重启 ip 都会变。目前在 WSL 中可以用以下两个命令来获取主机的 ip:

```bash
ip route | grep default | awk '{print $3}'
# 或者
cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }'
```

原理可见: [User Experience Changes Between WSL 1 and WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-ux-changes#accessing-network-applications)

![image.png](https://cdn.jsdelivr.net/gh/riril/i/posts/wsl2-network-tricks/Pp7MZ1m8WALlr4a.png)

[一个命令设置 proxy](#一个命令)

## 主机访问 wsl2

这个问题困扰了我好久，因为在 wsl2 中开发，有时候就需要预览，或者查看某些应用启动的本地 web 服务，一般这种时候我也懒得启动 x11 打开 Ubuntu 中的 火狐了...

还是因为 wsl2 在 Hyper-V 的容器中，所以主机访问 wsl2 也有些麻烦，官方说 Windows 版本更新到 18945 之后的，程序 listen 到 0.0.0.0 上，在 Windows 中就可以通过 localhost 访问了，而我在测试的时候发现很多时候还是不生效，也许需要看脸吧。

在 github 上找到了这个 issue：[[WSL 2] NIC Bridge mode 🖧 (Has Workaround🔨) #4150](https://github.com/microsoft/WSL/issues/4150)

自己根据需要改了一下，链接在这儿：<https://github.com/lengthmin/dotfiles/blob/master/windows/wsl2.ps1>

设置任务计划程序，监听 Hyper-V 创建 switch 的事件，每次自动执行该脚本。

[English Version](https://github.com/microsoft/WSL/issues/4210#issuecomment-606381534)  
[English Version](https://github.com/microsoft/WSL/issues/4210#issuecomment-606381534)  
[English Version](https://github.com/microsoft/WSL/issues/4210#issuecomment-606381534)  

步骤如下：

1. 将[链接](https://github.com/lengthmin/dotfiles/blob/master/windows/wsl2.ps1)中的代码保存到本地文件中，文件名后缀设为 `.ps1`。
2. 打开事件查看器，在小娜的搜索框里搜一下就能打开了。
3. 点击 Windows 日志 -> 系统，应该就能看到相应的 HyperV 的日志了
4. 找到 Hyper-V-VmSwith 事件，查看有没有内容类似 `Port B217DD51-3CA0-4C73-94DB-D0CE5D3EE60D (Friendly Name: 04D5DDE8-EE79-46B0-9D64-023AE57DF84F) successfully created on switch 1EBD754E-346A-49AE-8BDC-EDD6F9E2F651 (Friendly Name: WSL).`的事件，右键单击该项，选择 将任务附加到该事件。
5. 操作选择 启动程序，程序中填 powershell，参数填 `-file 你的脚本地址的绝对地址` 就好了。设置 `-WindowStyle Hidden` 可以在启动时隐藏 powershell 窗口。
6. 然后在任务计划程序中找到：事件查看器任务 -> 你刚创建的任务，右键属性，然后勾选下面的复选框：使用最高权限运行

### 脚本说明

关键代码如下：

```powershell
# [Config]
$wsl_hosts = "artin.wsl"
$win_hosts = "artin.win"
$HOSTS_PATH = "$env:windir\System32\drivers\etc\hosts"

# [Start]
$winip = bash.exe -c "ip route | grep default | awk '{print \`$3}'"
$wslip = bash.exe -c "hostname -I | awk '{print \`$1}'"
$found1 = $winip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';
$found2 = $wslip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( !($found1 -and $found2) ){
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

((Get-Content -Path $HOSTS_PATH | Select-String -Pattern '# w(sl)|(in)_hosts' -NotMatch | Out-String) + "$wslip $wsl_hosts # wsl_hosts`n$winip $win_hosts # win_hosts").Trim() | Out-File -FilePath $HOSTS_PATH -encoding ascii;

ipconfig /flushdns | Out-Null
```

设置想被解析的域名，然后将 wsl 和 win 的 ip 都写入 windows 的 hosts，wsl 中 DNS 查询默认设置的就是主机，所以两边对自己 hosts 中域名的解析都没有问题。

在 wsl 中启动一个 http 服务器：
![image.png](https://cdn.jsdelivr.net/gh/riril/i/posts/wsl2-network-tricks/s89jrHB2iVlZTNz.png)

我们在 win 下请求一下：
![image.png](https://cdn.jsdelivr.net/gh/riril/i/posts/wsl2-network-tricks/8Jr9kToFdgnINUu.png)

Awesome! 成功啦

也可以使用这个小工具来实现：
[![shayne/go-wsl2-host](https://gh-card.dev/repos/shayne/go-wsl2-host.svg)](https://github.com/shayne/go-wsl2-host)

这是一个用 Go 写的小工具，利用 Windows 服务，Automatically update your Windows hosts file with the WSL2 VM IP address.

### wsl 暴露内部端口到主机

> 来源: <https://github.com/shayne/wsl2-hacks>
> 见 README 内的 Access localhost ports from Windows 一节

那么对于一些默认 listen 127.0.0.1 的程序，你又懒得改的，咋办呢？

可以通过 linux 的命令来做到：

```bash
expose_local(){
    sudo sysctl -w net.ipv4.conf.all.route_localnet=1 >/dev/null 2>&1
    sudo iptables -t nat -I PREROUTING -p tcp -j DNAT --to-destination 127.0.0.1
}
```

### 局域网访问 wsl

还是上面提到过的这个 issue 里的解决方法:
<https://github.com/microsoft/WSL/issues/4150#issuecomment-504209723>，需要的端口通过 windows 代理转发到 wsl 中。

关键代码如下：

```powershell
# [Start]
$winip = bash.exe -c "ip route | grep default | awk '{print \`$3}'"
$wslip = bash.exe -c "hostname -I | awk '{print \`$1}'"
$found1 = $winip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';
$found2 = $wslip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( !($found1 -and $found2) ){
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

# [Ports]
# All the ports you want to forward separated by coma
$ports=@(80,443,10000,3000,5000,27701,8080);

# [Static ip]
# You can change the addr to your ip config to listen to a specific address
$addr='0.0.0.0';
$ports_a = $ports -join ",";

# Remove Firewall Exception Rules
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' " | Out-Null

# Adding Exception Rules for inbound and outbound Rules
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP"  | Out-Null
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP"  | Out-Null

for( $i = 0; $i -lt $ports.length; $i++ ){
  $port = $ports[$i];
  iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr"  | Out-Null
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$wslip"  | Out-Null
}
```

powershell 中 `@()` 就是声明数组的意思，这个脚本遍历你设置的想暴露到局域网的端口的数组，先关闭相应的防火墙策略，然后设置 portproxy 反代 windows 的端口到 wsl 中。

## 一个命令

先上效果：
![image.png](https://cdn.jsdelivr.net/gh/riril/i/posts/wsl2-network-tricks/3cGZ8gwpRlSnPhs.png)
而且还可以为 git 以及 ssh 同时设置代理。

代码：

```bash
# 获取 windows 的 ip
winip=$(ip route | grep default | awk '{print $3}')
wslip=$(hostname -I | awk '{print $1}')

# 我使用的是 clash，并且开启了局域网访问
PROXY_HTTP="http://${winip}:7890"
PROXY_SOCKS5="socks5://${winip}:7891"

# 查看我的 ip
ip_() {
    curl https://ip.cn/$1
    echo "WIN ip: ${winip}"
    echo "WSL ip: ${wslip}"
}

# 设置 npm 代理，但是一般来说将 npm 换成淘宝镜像就没什么问题了
proxy_npm() {
    npm config set proxy ${PROXY_HTTP}
    npm config set https-proxy ${PROXY_HTTP}
    yarn config set proxy ${PROXY_HTTP}
    yarn config set https-proxy ${PROXY_HTTP}
}

unpro_npm() {
    npm config delete proxy
    npm config delete https-proxy
    yarn config delete proxy
    yarn config delete https-proxy
}

# 代理 github，因为在国内 clone 的时候很慢
# 先检测 ~/.ssh/config 文件中有没有 github.com 这个域名，有的话就将 ip 换成最新的 ip
proxy-git() {
    git config --global http.https://github.com.proxy ${PROXY_HTTP}
    if ! grep -qF "Host github.com" ~/.ssh/config ; then
        echo "Host github.com" >> ~/.ssh/config
        echo "    User git" >> ~/.ssh/config
        echo "    ProxyCommand nc -X 5 -x ${PROXY_SOCKS5} %h %p" >> ~/.ssh/config
    else
        lino=$(($(awk '/Host github.com/{print NR}'  ~/.ssh/config)+2))
        sed -i "${lino}c\    ProxyCommand nc -X 5 -x ${PROXY_SOCKS5} %h %p" ~/.ssh/config
    fi
}

# 设置一系列的代理命令
proxy () {
    # pip can read http_proxy & https_proxy
    export http_proxy="${PROXY_HTTP}"
    export HTTP_PROXY="${PROXY_HTTP}"

    export https_proxy="${PROXY_HTTP}"
    export HTTPS_proxy="${PROXY_HTTP}"

    export ftp_proxy="${PROXY_HTTP}"
    export FTP_PROXY="${PROXY_HTTP}"

    export rsync_proxy="${PROXY_HTTP}"
    export RSYNC_PROXY="${PROXY_HTTP}"

    export ALL_PROXY="${PROXY_SOCKS5}"
    export all_proxy="${PROXY_SOCKS5}"

    proxy-git
    # proxy_npm
    if [ ! $1 ]; then
        ip_
    fi
}

unpro () {
    unset http_proxy
    unset HTTP_PROXY
    unset https_proxy
    unset HTTPS_PROXY
    unset ftp_proxy
    unset FTP_PROXY
    unset rsync_proxy
    unset RSYNC_PROXY
    unset ALL_PROXY
    unset all_proxy
    ip_
}
```

这样我们执行 proxy 的时候，就能一键连接到主机的代理上了。
