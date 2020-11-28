---
title: WSL2 的一些网络访问问题
comments: true
toc: true
permalink: posts/wsl2-network-tricks/
date: 2019-12-28 20:39:31
updated: 2020-11-12 19:54:00
categories:
  - WSL
tags:
  - Linux
---
快考完试了，这个学期一直在使用 WSL 在进行开发，无论是 Python/C/React 都是用 VSCode Remote WSL 进行开发的，体验非常好。

> 无特别说明，本文以下内容所提到的 WSL 皆指 WSL2。

这篇文章大概有以下内容：

1. WSL2 中连接到主机代理
    让 WSL2 里能连上 Windows 上的代理软件
2. 主机访问 WSL2
    这里主要是靠设置 hosts，让一个域名一直解析到 WSL2 的 ip 上。
3. 局域网访问 WSL2
    局域网内访问你的 Windows 主机，Windows 转发端口到 WSL2 上

还有几个前置知识：

1. Windows 和 WSL2 算是在同一个局域网内，这个局域网是由 Hyper-V 创建的。
2. WSL2 使用的网络适配器是 'Default Hyper-V Switch'，这个适配器每次重启都会被删除重建，这就是 WSL2 为什么 IP 不固定的原因。
3. WSL2 内有些微软特意做的东西：
   1. 向 **WSL2 的 IP** 发送的请求都会被转发到 **Windows 的 IP** 上，但是这个时灵时不灵。


<!-- more -->

## WSL2 连接到主机代理

其实这个问题我在之前那篇[配置 ArchWSL 的文章](/posts/install-arch-wsl/#zsh-的其他的一些配置)里简单提了一下，大概流程如下：

1. 获取 Windows 的 ip
2. Windows 上的代理软件允许局域网访问
3. 设置 WSL2 的代理

### 获取主机的 ip

由于 WSL2 是使用 Hyper-V 虚拟机实现的，也就不能跟 Windows 共享同一个 localhost 了，而且每次重启 ip 都会变。目前在 WSL 中可以用以下两个命令来获取主机的 ip:

```bash
ip route | grep default | awk '{print $3}'
# 或者
cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }'
```

原理可见: [User Experience Changes Between WSL 1 and WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-ux-changes#accessing-network-applications)

![image.png](https://i.lengthm.in/posts/wsl2-network-tricks/get_wsl_ip.png)

### 设置代理

Windows 的 IP 都已经拿到了，比如说我的代理软件是监听在 7890 端口的，那我只要设置代理链接为 `{windows_ip}:7890` 即可。

如果无法连接的话，请你检查一下你 Windows 上的代理软件允许局域网访问了吗。

还是没法连接的话有可能是 **Windows 防火墙**的原因，我是把防火墙关了的。

---

感谢评论区 Xing Fang 给了[一个链接](https://github.com/microsoft/WSL/issues/4585) 以及开放防火墙的一句命令。

直接放开网卡名的防火墙：


```ps1
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL)" -Action Allow
```

---

还有这篇**必读**的文章：

- [Ubuntu「一键」设置代理](https://blog.skk.moe/post/enable-proxy-on-ubuntu/)

作者详细的介绍了自己是怎么在 WSL 中使用代理的。

顺着作者的思路，我也实现了我自己的一个 **「一键」设置代理** 的脚本：

[「一键」设置代理](#一键设置代理)

## 主机访问 WSL2

WSL2 的 IP 会变，所以怎么随时随地的都能访问到 WSL2 呢？看了很多 issue，解决方案各种各样。

这个问题困扰了我好久，因为在 WSL2 中开发，有时候就启动一些 web 应用，然后 localhost 又没法访问到.. 官方说 Windows 版本更新到 18945 之后的，程序 listen 到 `0.0.0.0` 上之后，在 Windows 中就可以通过 localhost 访问了，而我在测试的时候发现很多时候还是不生效，也许需要看脸吧。

### 自动设置 hosts 关联到 WSL 的 IP

**解决方案**就是在 WSL 更新 IP 的时候，自动把 ip 加到 hosts 中，用自己喜欢的一个域名解析上去。

请看：

在 GitHub 上找到了这个 issue：[[WSL 2] NIC Bridge mode 🖧 (Has Workaround🔨) #4150](https://github.com/microsoft/WSL/issues/4150)，根据回复有了思路。

思路就是使用**任务计划程序**执行 powershell 脚本，来做一些事。

我们需要写一个脚本（[地址](https://github.com/lengthmin/dotfiles/blob/master/windows/wsl2.ps1)）实现我们想要的功能。

脚本的功能大概是：

1. 读取 WSL 和 Windows 的 IP
2. 将 IP 和想设定的域名组合起来，如：`{wsl_ip} wsl.local # wsl_ip`
3. 将具体内容写入 Windows 的 `hosts` 中。

这样你就能用自己定义的域名来访问两个系统了，wsl2 能访问 `win.local` 是因为它会向主机查询 dns（因为 wsl2 默认的 nameserver 指向了 windows 主机），主机会把 hosts 中的域名直接缓存起来然后直接作为一个 dns 记录。

关键来了，我们要使用**任务计划程序**在 `WSL` 要更新 IP 的时候执行这个脚本。

[English version here](https://github.com/microsoft/WSL/issues/4210#issuecomment-606381534)
[English version here](https://github.com/microsoft/WSL/issues/4210#issuecomment-606381534)
[English version here](https://github.com/microsoft/WSL/issues/4210#issuecomment-606381534)

具体**在 `WSL` 要更新 IP 时运行特定脚本**步骤如下：

1. 将[链接](https://github.com/lengthmin/dotfiles/blob/master/windows/wsl2.ps1)中的代码保存到本地文件中，文件名后缀设为 `.ps1`。
2. 打开**事件查看器**。在小娜的搜索框里搜一下就能打开了。
3. 点击 **Windows 日志** -> **系统**。
4. 找到 `Hyper-V-VmSwith` 事件，查看有没有内容类似 `Port ... (Friendly Name: ...) successfully created on switch ... (Friendly Name: WSL).`的事件。
5. 右键单击该事件，选择 **将任务附加到该事件**。
6. **操作** 选择 **启动程序**，**程序**中填 `powershell`，**参数**填 `-file 你的脚本地址的绝对地址` 就好了。参数中加上 `-WindowStyle Hidden` 可以让 Powershell 执行该脚本时隐藏窗口。
7. 然后在**任务计划程序**左侧资源栏中找到：**事件查看器任务** -> **你刚创建的任务**，右键**属性**，然后勾选下面的复选框：**使用最高权限运行**。

看看效果：

在 WSL 中启动一个 http 服务器：
![image.png](https://i.lengthm.in/posts/wsl2-network-tricks/wsl_http_server.png)

我们在 win 下请求一下：
![image.png](https://i.lengthm.in/posts/wsl2-network-tricks/curl_wsl.png)

Awesome! 成功啦

你也可以使用下面这个小工具来实现一样的功能：
[![shayne/go-wsl2-host](https://gh-card.dev/repos/shayne/go-wsl2-host.svg)](https://github.com/shayne/go-wsl2-host)

这是一个用 Go 写的小工具，会创建一个 Windows 服务，Automatically update your Windows hosts file with the WSL2 VM IP address.

### 让 Windows 访问到 WSL 中监听本地的应用

> 来源: <https://github.com/shayne/wsl2-hacks>
> 见 README 内的 Access localhost ports from Windows 一节

上面已经做到了 Windows 下根据固定域名访问 WSL 中监听 `0.0.0.0` 的应用程序，那么对于 WSL 中一些默认监听 `127.0.0.1` 的程序，咋办呢？

监听 `127.0.0.1` 的图解：
![image.png](https://i.lengthm.in/posts/wsl2-network-tricks/win_wsl_request_bofore.png)

所以让请求 `0.0.0.0` 的请求都转发到请求 `127.0.0.1` 上。

现在：
![image.png](https://i.lengthm.in/posts/wsl2-network-tricks/win_wsl_request_now.png)

WSL 中执行两条命令（花括号里面的两条）就能做到，增加 `iptables` 的路由规则：

```bash
expose_local(){
    sudo sysctl -w net.ipv4.conf.all.route_localnet=1 >/dev/null 2>&1
    sudo iptables -t nat -I PREROUTING -p tcp -j DNAT --to-destination 127.0.0.1
}
```


### Windows 局域网内其他机器访问 WSL2

[[WSL 2] NIC Bridge mode 🖧 (Has Workaround🔨) #4150](https://github.com/microsoft/WSL/issues/4150#issuecomment-504209723)
上面提到过的这个 issue 里其实就是解决的局域网访问的问题，将需要用的端口通过 Windows 代理转发到 WSL 中。

原理也类似于上面的两幅图。

如果你用了主机访问 WSL2 里的那个脚本，就可以跳过这一节了，因为那个脚本包括了这一节的内容了。

关键代码如下：

不懂的请看注释。

```powershell
# 获取 Windows 和 WSL2 的 ip
$winip = bash.exe -c "ip route | grep default | awk '{print \`$3}'"
$wslip = bash.exe -c "hostname -I | awk '{print \`$1}'"
$found1 = $winip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';
$found2 = $wslip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( !($found1 -and $found2) ){
  # 如果没找到 wsl 的 ip, 就退出执行
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

# 你需要映射到局域网中端口
$ports=@(80,443,10000,3000,5000,27701,8080);

# 监听的 ip，这么写是可以来自局域网
$addr='0.0.0.0';
# 监听的端口，就是谁来访问自己
$ports_a = $ports -join ",";

# 移除旧的防火墙规则
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' " | Out-Null

# 允许防火墙规则通过这些端口
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP"  | Out-Null
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP"  | Out-Null

# 使用 portproxy 让 Windows 转发端口
# https://docs.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh-interface-portproxy
for( $i = 0; $i -lt $ports.length; $i++ ){
  $port = $ports[$i];
  iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr"  | Out-Null
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$wslip"  | Out-Null
}
```

Powershell 语法里 `@()` 就是数组的意思，这个脚本遍历你设置的想暴露到局域网的端口的数组，然后用 portproxy 反代 Windows 的端口到 WSL 中。

## 一键设置代理

先上效果：
![image.png](https://i.lengthm.in/posts/wsl2-network-tricks/proxy.png)
而且还可以为 git 以及 ssh 同时设置代理。

代码见:
<https://github.com/lengthmin/dotfiles/blob/master/ubuntu_wsl/zshrc>

重点见里面的 `proxy`, `unpro`, `getIp`, `proxy_git`, `proxy_npm` 等函数。

这样我们执行 proxy 的时候，就能一键连接到主机的代理上了。

有用的话别忘了给个 star，谢谢~
