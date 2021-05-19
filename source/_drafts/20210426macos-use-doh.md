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
# Never forward plain names (without a dot or domain part)
domain-needed
# Never forward addresses in the non-routed address spaces.
bogus-priv

# Change this line if you want dns to get its upstream servers from
# somewhere other that /etc/resolv.conf
resolv-file=/Users/artin/upstream.conf

# If you don't want dnsmasq to read /etc/resolv.conf or any other
# file, getting its servers from this file instead (see below), then
# uncomment this.
# no-resolv

all-servers
# If you don't want dnsmasq to poll /etc/resolv.conf or other resolv
# files for changes and re-read them then uncomment this.
#no-poll

# Add other name servers here, with domain specs if they are for
# non-public domains.
server=127.0.0.1#5553

# If you want dnsmasq to listen for DHCP and DNS requests only on
# specified interfaces (and the loopback) give the name of the
# interface (eg eth0) here.
# Repeat the line for more than one interface.
#interface=
# Or you can specify which interface _not_ to listen on
#except-interface=
# Or which to listen on by address (remember to include 127.0.0.1 if
# you use this.)
listen-address=127.0.0.1

# For debugging purposes, log each DNS query as it passes through
# dnsmasq.
log-facility=/var/log/dnsmasq.log
log-queries
```

## 配置 dnscrypt-proxy

```toml
# server_names = ['cloudflare']


## List of local addresses and ports to listen to. Can be IPv4 and/or IPv6.
## Example with both IPv4 and IPv6:
listen_addresses = ['127.0.0.1:5553']


## Maximum number of simultaneous client connections to accept
max_clients = 250

## Require servers (from static + remote sources) to satisfy specific properties

# Use servers reachable over IPv4
ipv4_servers = true

# Use servers reachable over IPv6 -- Do not enable if you don't have IPv6 connectivity
ipv6_servers = false

# Use servers implementing the DNSCrypt protocol
dnscrypt_servers = true

# Use servers implementing the DNS-over-HTTPS protocol
doh_servers = true


## Require servers defined by remote sources to satisfy specific properties

# Server must support DNS security extensions (DNSSEC)
require_dnssec = false

# Server must not log user queries (declarative)
require_nolog = false

# Server must not enforce its own blocklist (for parental control, ads blocking...)
require_nofilter = true

# Server names to avoid even if they match all criteria
disabled_server_names = []


## Always use TCP to connect to upstream servers.
## This can be useful if you need to route everything through Tor.
## Otherwise, leave this to `false`, as it doesn't improve security
## (dnscrypt-proxy will always encrypt everything even using UDP), and can
## only increase latency.

force_tcp = false


## How long a DNS query will wait for a response, in milliseconds.
## If you have a network with *a lot* of latency, you may need to
## increase this. Startup may be slower if you do so.
## Don't increase it too much. 10000 is the highest reasonable value.

timeout = 5000


## Keepalive for HTTP (HTTPS, HTTP/2) queries, in seconds

keepalive = 30


## Log level (0-6, default: 2 - 0 is very verbose, 6 only contains fatal errors)

# log_level = 2


## Log file for the application, as an alternative to sending logs to
## the standard system logging service (syslog/Windows event log).
##
## This file is different from other log files, and will not be
## automatically rotated by the application.

log_file = '/var/log/dnscrypt-proxy.log'


## When using a log file, only keep logs from the most recent launch.

# log_file_latest = true


## Use the system logger (syslog on Unix, Event Log on Windows)

# use_syslog = true


## Delay, in minutes, after which certificates are reloaded

cert_refresh_delay = 240


## Fallback resolvers
## These are normal, non-encrypted DNS resolvers, that will be only used
## for one-shot queries when retrieving the initial resolvers list, and
## only if the system DNS configuration doesn't work.
##
## No user application queries will ever be leaked through these resolvers,
## and they will not be used after IP addresses of resolvers URLs have been found.
## They will never be used if lists have already been cached, and if stamps
## don't include host names without IP addresses.
##
## They will not be used if the configured system DNS works.
## Resolvers supporting DNSSEC are recommended, and, if you are using
## DoH, fallback resolvers should ideally be operated by a different entity than
## the DoH servers you will be using, especially if you have IPv6 enabled.
##
## People in China may need to use 114.114.114.114:53 here.
## Other popular options include 8.8.8.8 and 1.1.1.1.
##
## If more than one resolver is specified, they will be tried in sequence.

fallback_resolvers = ['1.1.1.1:53', '8.8.8.8:53']


## Always use the fallback resolver before the system DNS settings.

ignore_system_dns = true


## Maximum time (in seconds) to wait for network connectivity before
## initializing the proxy.
## Useful if the proxy is automatically started at boot, and network
## connectivity is not guaranteed to be immediately available.
## Use 0 to not test for connectivity at all (not recommended),
## and -1 to wait as much as possible.

netprobe_timeout = 60

## Address and port to try initializing a connection to, just to check
## if the network is up. It can be any address and any port, even if
## there is nothing answering these on the other side. Just don't use
## a local address, as the goal is to check for Internet connectivity.
## On Windows, a datagram with a single, nul byte will be sent, only
## when the system starts.
## On other operating systems, the connection will be initialized
## but nothing will be sent at all.

netprobe_address = '9.9.9.9:53'


## Automatic log files rotation

# Maximum log files size in MB - Set to 0 for unlimited.
log_files_max_size = 10

# How long to keep backup files, in days
log_files_max_age = 7

# Maximum log files backups to keep (or 0 to keep all backups)
log_files_max_backups = 1



#########################
#        Filters        #
#########################

## Note: if you are using dnsmasq, disable the `dnssec` option in dnsmasq if you
## configure dnscrypt-proxy to do any kind of filtering (including the filters
## below and blocklists).
## You can still choose resolvers that do DNSSEC validation.


## Immediately respond to IPv6-related queries with an empty response
## This makes things faster when there is no IPv6 connectivity, but can
## also cause reliability issues with some stub resolvers.

block_ipv6 = false


## Immediately respond to A and AAAA queries for host names without a domain name

block_unqualified = true


## Immediately respond to queries for local zones instead of leaking them to
## upstream resolvers (always causing errors or timeouts).

block_undelegated = true


## TTL for synthetic responses sent when a request has been blocked (due to
## IPv6 or blocklists).

reject_ttl = 600


######################################################
#        Pattern-based blocking (blocklists)        #
######################################################

## Blocklists are made of one pattern per line. Example of valid patterns:
##
##   example.com
##   =example.com
##   *sex*
##   ads.*
##   ads*.example.*
##   ads*.example[0-9]*.com
##
## Example blocklist files can be found at https://download.dnscrypt.info/blocklists/
## A script to build blocklists from public feeds can be found in the
## `utils/generate-domains-blocklists` directory of the dnscrypt-proxy source code.

[blocked_names]

  ## Path to the file of blocking rules (absolute, or relative to the same directory as the config file)

  # blocked_names_file = 'blocked-names.txt'


  ## Optional path to a file logging blocked queries

  # log_file = 'blocked-names.log'


  ## Optional log format: tsv or ltsv (default: tsv)

  # log_format = 'tsv'



###########################################################
#        Pattern-based IP blocking (IP blocklists)        #
###########################################################

## IP blocklists are made of one pattern per line. Example of valid patterns:
##
##   127.*
##   fe80:abcd:*
##   192.168.1.4

[blocked_ips]

  ## Path to the file of blocking rules (absolute, or relative to the same directory as the config file)

  # blocked_ips_file = 'blocked-ips.txt'


  ## Optional path to a file logging blocked queries

  # log_file = 'blocked-ips.log'


  ## Optional log format: tsv or ltsv (default: tsv)

  # log_format = 'tsv'

```

## 参考

- https://page.codespaper.com/2019/dnsmasq-cloudflare-doh/
- https://github.com/DNSCrypt/dnscrypt-proxy/wiki/Installation-macOS
