---
title: MacOS 使用 DNS Over HTTPS
comments: true
toc: true
permalink: posts/macos-use-doh/
date: 2021-04-26 13:09:22
categories: DNS
tags:
- DOH
- MacOS
---

最近折腾了一下在 MacOS 本地搭建 DOH，把折腾过程记录一下。

使用工具为 dnscrypt-proxy + dnsmasq

dnscrypt-proxy 只负责帮我们发起 DOH 请求。dnsmasq 帮我们把普通 DNS 请求转发到 dnscrypt-proxy。

还写了个 [uTools 插件](https://github.com/lengthmin/utools-dns) 来快速切换 DNS。

<!-- more -->

## 什么是 DoH

什么是 DoH，我现在就带你研究。

## dnsmasq

这是一个轻量级的域名解析服务器，提供 DNS 缓存功能。

安装很简单，使用 brew：

```sh
brew install dnsmasq
```

### locationchanger

我们要添加一句 `default` 到 location changer 脚本里：

```bash
DEFAULT_SCRIPT="$HOME/.locations/default"
if [ -f "$DEFAULT_SCRIPT" ]; then
    ts "Running default '$DEFAULT_SCRIPT'"
    "$DEFAULT_SCRIPT"
fi
```

这样我们切换网络的时候就会运行这个脚本，`$HOME/.locations/default` 的内容如下：

```bash
#!/usr/bin/env bash

DNS=`ipconfig getpacket en0|grep domain_name_server|awk -F"[{,}]" '{print $2}'`
echo "$DNS"
echo "nameserver $DNS" > "$HOME/upstream.conf"
```

这个命令会把路由器下发的 DNS 写入到 `$HOME/upstream.conf` 文件中。

### 配置 dnsmasq

```ini
domain-needed
bogus-priv

# Change this line if you want dns to get its upstream servers from
# somewhere other that /etc/resolv.conf
resolv-file=/Users/xxx/upstream.conf

all-servers

# Add other name servers here, with domain specs if they are for
# non-public domains.
server=127.0.0.1#5553

listen-address=127.0.0.1

# For debugging purposes, log each DNS query as it passes through
# dnsmasq.
log-facility=/var/log/dnsmasq.log
log-queries
```

## 配置 dnscrypt-proxy

其实根本不用配置个啥，只需要设置好这个 listen_addresses 就好了，然后我们就可以往这个地址上发送 DNS 请求了。

```toml
## List of local addresses and ports to listen to. Can be IPv4 and/or IPv6.
## Example with both IPv4 and IPv6:
listen_addresses = ['127.0.0.1:5553']

## Require servers (from static + remote sources) to satisfy specific properties

# Use servers reachable over IPv4
ipv4_servers = true

# Use servers reachable over IPv6 -- Do not enable if you don't have IPv6 connectivity
ipv6_servers = false

# Use servers implementing the DNSCrypt protocol
dnscrypt_servers = true

# Use servers implementing the DNS-over-HTTPS protocol
doh_servers = true

## Log file for the application, as an alternative to sending logs to
## the standard system logging service (syslog/Windows event log).
##
## This file is different from other log files, and will not be
## automatically rotated by the application.

log_file = '/var/log/dnscrypt-proxy.log'
```

## 参考

- https://page.codespaper.com/2019/dnsmasq-cloudflare-doh/
- https://github.com/DNSCrypt/dnscrypt-proxy/wiki/Installation-macOS
- https://linux.cn/article-9438-1.html
- https://www.scriptjc.com/article/1128
- https://studygolang.com/articles/844
- https://dnscrypt.info/public-servers/
