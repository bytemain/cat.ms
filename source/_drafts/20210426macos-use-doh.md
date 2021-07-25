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

最近折腾了一下在 MacOS 本地搭建 DoH，把折腾过程记录一下。

使用工具为 dnscrypt-proxy + dnsmasq。

dnscrypt-proxy 只负责帮我们发起 DoH 请求。

dnsmasq 是一个轻量级的域名解析服务器，帮我们把 DNS 请求转发到 dnscrypt-proxy，而把一些公司域内的域名转发到路由器分发的上游 DNS。

还写了个 [uTools 插件](https://github.com/lengthmin/utools-dns) 来快速切换 DNS。

<!-- more -->

## 什么是 DoH

什么是 DoH，我现在就带你研究。

## 准备工作

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

### 配置 dnsmasq

看 brew 提示你的配置文件在哪里，像我的 m1 的 brew 就提示配置文件在 `/opt/homebrew/etc/dnsmasq.conf`：

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
listen_addresses = ['127.0.0.1:5553']

log_file = '/var/log/dnscrypt-proxy.log'
```

## 参考

- https://page.codespaper.com/2019/dnsmasq-cloudflare-doh/
- https://github.com/DNSCrypt/dnscrypt-proxy/wiki/Installation-macOS
- https://linux.cn/article-9438-1.html
- https://www.scriptjc.com/article/1128
- https://studygolang.com/articles/844
- https://dnscrypt.info/public-servers/
