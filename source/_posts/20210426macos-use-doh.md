---
title: MacOS 配置 DNS Over HTTPS
comments: true
toc: true
permalink: posts/macos-use-doh/
date: '2021-04-26 13:09:22'
updated: '2023-03-08 17:33:02'
categories: DNS
tags:
  - DoH
  - MacOS
---

最近折腾了一下在 MacOS 本地搭建 DoH，把折腾过程记录一下。

使用工具为 dnscrypt-proxy + dnsmasq。

dnscrypt-proxy 只负责帮我们发起 DoH 请求。

dnsmasq 是一个轻量级的域名解析服务器，帮我们把 DNS 请求转发到 dnscrypt-proxy，而把一些公司域内的域名转发到路由器分发的上游 DNS。

还写了个 [uTools 插件](https://github.com/bytemain/utools-dns) 来快速切换 DNS。

<!-- more -->

## 什么是 DoH

什么是 DoH，可以看：<https://zh.wikipedia.org/zh-cn/DNS_over_HTTPS>。

## 使用 smartdns-rs

[smartdns-rs](https://github.com/mokeyish/smartdns-rs) 是一个用 Rust 编写的跨平台本地DNS服务器，获取最快的网站IP，获得最佳上网体验，支持DoH，DoT。

开源在 GitHub: <https://github.com/mokeyish/smartdns-rs>

使用这个软件可以非常方便的使用 DoH。

在 [releases 页面](https://github.com/mokeyish/smartdns-rs/releases) 下载你的系统的二进制文件，解压，然后执行：

```sh
# 安装服务并启动
sudo ./smartdns service install
sudo ./smartdns service start

# 关闭服务
# sudo ./smartdns service stop
# 卸载服务
# sudo ./smartdns service uninstall
```

此时软件会把自己安装到 `/usr/local/bin/smartdns`，以后你只需要执行 `smartdns` 就可以控制服务的行为了。

服务默认使用的配置文件是：`/usr/local/etc/smartdns/smartdns.conf`，具体各参数可以查看官方文档：

直接在这个文件的底部加入如下配置即可：

```conf
# ... 默认配置

# server-tls dns.alidns.com
# server-https https://cloudflare-dns.com/dns-query
# server-https https://dns.alidns.com/dns-query
server-tls 8.8.8.8:853
server-https https://223.5.5.5/dns-query
```

`smartdns` 会默认监听本机的 53 端口。

## 使用 dnsmasq & dnscrypt-proxy

### 安装 dnsmasq、dnscrypt-proxy

安装很简单，使用 brew：

```sh
brew install dnsmasq dnscrypt-proxy
```

### 安装 locationchanger

<https://github.com/eprev/locationchanger>

执行：

```bash
curl -L https://github.com/eprev/locationchanger/raw/master/locationchanger.sh | bash
```

然后将下面这段代码粘贴到 location changer 脚本 `/usr/local/bin/locationchanger` 末尾：

```bash
DEFAULT_SCRIPT="$HOME/.locations/default"
if [ -f "$DEFAULT_SCRIPT" ]; then
    ts "Running default '$DEFAULT_SCRIPT'"
    "$DEFAULT_SCRIPT"
fi
```

这样我们连接网络的时候就会运行这个脚本。

然后我们创建一个文件 `$HOME/.locations/default` ：

```bash
mkdir -p $HOME/.locations && touch $HOME/.locations/default
```

内容如下：

```bash
#!/usr/bin/env bash

DNS=`ipconfig getpacket en0|grep domain_name_server|awk -F"[{,}]" '{print $2}'`
echo "$DNS"
echo "nameserver $DNS" > "$HOME/upstream.conf"
```

这个命令会把路由器下发的 DNS 写入到 `$HOME/upstream.conf` 文件中。

然后我们手动执行一遍 `locationchanger`，将这个文件生成出来。

### 配置

#### 配置 dnsmasq

看 brew 提示你的配置文件在哪里，像我的 m1 的 brew 就提示配置文件在 `/opt/homebrew/etc/dnsmasq.conf`：
然后修改这个配置文件的内容：

```ini
# 设置只解析域名
domain-needed
bogus-priv

# 我们刚刚生成的路由器分发的上游 DNS 地址
resolv-file=/Users/xxx/upstream.conf
# 下文配置的 dnscrypt-proxy 监听地址
server=127.0.0.1#5553
# dnsmasq 的监听地址
listen-address=127.0.0.1

# 打日志出来，好排查问题
log-queries
log-facility=/var/log/dnsmasq.log
```

#### 配置 dnscrypt-proxy

M1 系统的配置文件地址在：/opt/homebrew/etc/dnscrypt-proxy.toml

这里主要是我个人的配置，我只保留一个阿里云的 DoH，然后把 sources 下的所有内容都注释掉，这样启动会快很多。

如果保留 sources 下的内容的话，每次启动软件都要去找一个最快的 DNS，要遍历很久。

```toml
# 监听地址
listen_addresses = ['127.0.0.1:5553']
# 打日志出来，好排查问题
log_file = '/var/log/dnscrypt-proxy.log'

# 配置 alidns
[static]
  [static.'alidns-doh']
  stamp = 'sdns://AgAAAAAAAAAACTIyMy41LjUuNSCoF6cUD2dwqtorNi96I2e3nkHPSJH1ka3xbdOglmOVkQ5kbnMuYWxpZG5zLmNvbQovZG5zLXF1ZXJ5'
```

### 参考

- <https://page.codespaper.com/2019/dnsmasq-cloudflare-doh/>
- <https://github.com/DNSCrypt/dnscrypt-proxy/wiki/Installation-macOS>
- <https://linux.cn/article-9438-1.html>
- <https://www.scriptjc.com/article/1128>
- <https://studygolang.com/articles/844>
- <https://dnscrypt.info/public-servers/>
