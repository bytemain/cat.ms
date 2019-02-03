---
title: 用coding提供的动态pages来制作一个自己的rss订阅
comments: true
toc: true

date: 2018-01-15 14:31:34
categories:
  - 教程
tags:
  - RSS
  - Coding

permalink: tinytinyrss
---

先说结论，不够好用，弃坑了，用国内的一览提供的 rss 服务。
多平台支持，和 inoreader 相比速度更快，而且对于目前我订阅的源来说并没有不可阅读的，而且在 inoreader 上看不了電腦玩物的图片，在一览上没问题的。

## 关于 ttrss

因为很喜欢关注科技界的新闻，需要一个聚合来看新闻的软件。
说不上是 rss 重度使用者吧，但是还是每天必刷新闻的
用了各种新闻软件之后，发现 rss 才是正道，不会被推荐打扰，就订阅那么几个源。每天刷一刷。
现在微信公众号几乎都不怎么看了，二者功能几乎重复哈哈哈哈哈

ttrss 即为 tinytinyrss(https://tt-rss.org/)
可以自己控制的自定义项较多的 rss 服务，
多平台支持
android 上推荐 feedme，最新的 3.5.1 版本支持了 tinytinyrss，体验很好。
之前用 inoreader 的时候就用的 feedme，已通过 play 请开发者吃了个苹果哈哈哈哈哈，
tinytinyrss 也就是在 php 环境下安装的，pc 上用浏览器打开就可以了。

<!-- more -->

## 关于 coding 的动态 pages

coding 提供了免费的动态 pages，可以用来架设自己的个人动态博客。
但是我最近在 rss 服务选择上犯了选择困难证，刚好想到之前看到过 ttrss
coding 提供了 php+mysql 的环境，于是想试一试。
要准备的东西：

- coding webide
- coding pages
- baidu **or** google

---

## 安装 tinytinyrss

首先你需要注册一个 coding 的账户
[coding.net](https://coding.net/)

### 创建一个仓库备用

![Snipaste_2018-01-15_13-18-53.png](https://i.loli.net/2018/01/15/5a5c3ae2a6052.png)
这里会显示当前的仓库地址，留着备用。

### 下载 tt-rss 的源码传到 git 上

tiny 是一个开源项目，项目链接：https://git.tt-rss.org/git/tt-rss/src/master
如果你的电脑没装 git 的话建议用 coding 提供的 webide，秒开很省心，而且 push 代码的时候很快很快的。免费用户可以可且仅可开一个。
在安卓平台上也有提供 linux 终端的的软件，如 NeoTerm 和 Termux。
先把源代码 clone 到本地

```bash
git clone https://git.tt-rss.org/git/tt-rss.git
```

![term.png](https://i.loli.net/2018/01/15/5a5c3e29a595a.png)

克隆好后，修改`/tt-rss/.git/config`文件里的 remote url 为你的仓库地址(图里红框的位置)，仓库地址刚刚创建的时已经显示出来了
![Snipaste_2018-01-15_13-35-55.png](https://i.loli.net/2018/01/15/5a5c3e29a6434.png)

#### 设置文件权限

在这步有一个小问题，需要把目录下的每个文件的权限都设置成 777,否则后面会遇到文件无法读写导致站点无法访问的问题。
在终端输入

```bash
chmod -R 777 .
```

保存好后就可以 push 到仓库里了，

> 如果你创建仓库的时候勾选了`使用readme初始化仓库`，那么你在 push 的时候会遇到文件冲突。
> 方法是：修改了仓库地址之后先把本地的 readme.md 删除掉，
> 然后使用`git pull`将远程仓库的 readme.md 拉回本地。

push 的方法很简单

```bash
cd tt-rss #进入你的ttrss文件夹下使用下面的命令
# 不需要进行 add 和 commit
git push origin master
```

输入你的用户名密码就可以了，一般来说输入密码的时候是不可见的，不用担心。

### 开启动态 Pages

打开你的仓库，在侧边上选择 pages,然后选择 tab 上的**动态 Pages**
![Snipaste_2018-01-15_13-50-12.png](https://i.loli.net/2018/01/15/5a5c4125bfd47.png)
**一定要等待部署完成后才能使用**

### 配置 tinyrss

部署完成后打开上面给的链接，会来到
`http://969983a8-4bea-4d25-bab5-2ac8183353ad.coding.io/install/`
要开始对 tiny 的配置了，在仓库的 pages 页面有数据库的连接信息，按相应的填到框中就可以了。
![Snipaste_2018-01-15_13-56-34.png](https://i.loli.net/2018/01/15/5a5c435383b2d.png)

如果不需要改访问目录的话就直接点`Test configuration`
然后`Initialize database`就可以了

![Snipaste_2018-01-15_13-58-09.png](https://i.loli.net/2018/01/15/5a5c435390342.png)

在`Generated configuration file`这一步，不要点击**Save configuration**，我们自己创建一个。方便我们之后调整 config
在刚刚的`tt-rss`目录下创建`config.php`，将图中文本框的内容复制进去
打开`.gitignore`文件，把 config,php 字样去掉才能 push，否则 git 会忽视这个文件。
继续将修改好的代码 push 到仓库

```bash
git add .
git commit -m "push config.php"
git push origin master
```

等待再次部署好
就可以访问了，默认的用户名密码为`admin`和`password`

### 更好用的 tinytiny

进去之后会让你改密码。
设置中有很多选项，也有很多插件，大家可以百度一下。
你需要启用 API 访问才能使用第三方客户端登陆。
推荐关闭`在连续模式下自动展开文章`和`合并信息源，使之连续显示`
总之自己使用吧，还是很好玩的。
