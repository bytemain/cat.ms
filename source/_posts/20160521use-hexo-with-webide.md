---
title: 使用在线ide和pages服务搭建一个免费的Hexo博客
categories:
  - Hexo
tags:
  - Hexo
  - c9.io
  - webide
date: 2016-05-21 16:03:00
updated: 2019-07-18 14:03:00
permalink: use-hexo-with-webide
---

一直有着想写一点东西的想法，想有个自己的博客。但是现在国内的知名博客服务(某浪，CSXN)首页都是广告= = ，最后在知乎发现了 Hexo 这么个东西。
自己就能搭建一个国内访问快无广告自定义颇多的炫酷博客。

- [`Hexo`](https://hexo.io/)是一个用 nodejs 编写的静态博客框架，可以将生成的静态博客网页托管在服务器上。
- 国外的[`github.com`](https://github.com/)和国内的[`coding.net`](https://coding.net/) 都提供免费的 pages 服务，可以用托管博客。
- ~~[`c9.io`](https://c9.io/)提供免费的在线 webide 服务~~
- 好难过，评论说现在**注册 c9 要绑定信用卡**了，这是真的这不是梦。

优点:

1. 有网络就可以更新博客，只需要一个浏览器。
2. 源文件在云端，可下载回本地。
3. 可实时预览 markdown 文件。
4. 完善的 linux 终端,有 root 权限。

我在 c9 的 workspace：<https://ide.c9.io/lengthmin/hexo/>

<!-- more -->

---

# 安装

## 关于 Hexo

官网： https://hexo.io/zh-cn/

- A fast, simple & powerful blog framework
- 快速、简洁且高效的博客框架

作者：[Tommy Chen](https://zespia.tw/)

## 准备准备

- 注册 [coding.net](https://coding.net/) ｜ [c9.io](https://c9.io/) <br/>
  ** 注意:c9 没有被墙，但是注册的时候需要输入验证码，验证码使用的是 google 的 reCAPTCHA 服务。因此注册的时候需要科学上网。 **

在你的 c9 控制台界面，创建一个 workspace，名字 hexo(自己喜欢就好)
选择模板为 blank
<!-- ![](http://7xt1wl.com1.z0.glb.clouddn.com/16-5-22/58944002.jpg) -->
c9 的控制台是 ubuntu 系统，并且已经装了我们搭建 Hexo 需要的 `nodejs` 跟 `git`。<br/>

---

## 开始安装

打开 workspace,在终端中输入

```bash
npm install hexo-cli -g
```

<!-- ![](http://7xt1wl.com1.z0.glb.clouddn.com/16-5-22/25005751.jpg) -->
等待安装成功<br/>
创建一个 blog 文件夹，

```
mkdir blog
```

安装 Hexo

```bash
cd blog
hexo init
```

这样 Hexo 就安装完成了，我们先预览一下

```bash
hexo s -p 8081
```

> - 先按照我这么输命令，因为 c9 只允许使用 8080，8081，8082 三个端口，而 Hexo 默认的端口是 4000，所以如果只使用`hexo s`的话就预览不了。后面讲命令的时候会再提一下。

<!-- ![](http://7xt1wl.com1.z0.glb.clouddn.com/16-5-22/60800577.jpg) -->
点击终端出现的地址，出现如下图的话就说明安装好了。
<!-- ![](http://7xt1wl.com1.z0.glb.clouddn.com/16-5-22/45253572.jpg) -->

> 调教 hexo 请参见[《hexo 你的博客》](https://ibruce.info/2013/11/22/hexo-your-blog/)

> 在这推荐两个主题： [yelee](https://moxfive.coding.me/yelee/) 跟 [next](https://theme-next.iissnan.com/)

---

## hexo 的常用命令

到这里，已经可以使用 Hexo 了
hexo 的常用命令有这些，都要在 Hexo 的根目录下执行

```
hexo g
# 编译生成静态文件
hexo d
# 部署博客
hexo g -d
# g 跟 d 一起使用
hexo clean
# 清除以前生成的静态文件。
# 通常，清理一下可以解决大多数问题。
hexo s
# 本地预览博客
hexo new xxx
# 新建一篇标题为xxx的文章
hexo new draft xxx
# 新建一篇标题为xxx的草稿
hexo new page xxx
# 新建一个页面
hexo help
#查看帮助
```

### 在 c9 使用`hexo s`时注意事项

c9 只允许用户使用**8080、8081、8082**三个端口。并且 8080 端口已被占用,
所以使用默认的`hexo server`是预览不了的，因为你进不去 4000 这个端口。
要把`hexo server`的命令改成

```
hexo server -p 端口号
# 可简写
hexo s -p 端口号
```

也可以在站点配置文件`_config.yml`加入:

```yaml
server:
  port: 8081
```

以后只要使用`hexo s`就可以了。

---

# 部署博客

## 配置 SSH

coding 的中文 ssh 配置帮助页面
<https://coding.net/help/doc/git/ssh-key.html>
c9 已经默认生成了 ssh 密钥，
ssh 密钥在 ~/.ssh/id_rsa.pub <br/>
把这个密钥添加到 coding 就好了。

- 点击文件目录右上角的齿轮 - show home in favorite ，就能查看根目录了。<br/>

---

## 配置 Deploy

在 coding 中创建一个仓库
名字为你的 coding 用户名，不区分大小写。
创建完仓库后，复制你的 SSH 地址
<!-- ![](http://7xt1wl.com1.z0.glb.clouddn.com/16-7-7/31815771.jpg) -->
在 hexo 根目录下的 `_config.yml`中翻到尾部找到下面这串代码。然后**修改 coding 后面的地址为你的仓库的 ssh 地址，这里的 master 是分支的意思。**。<br/>

> 一定要注意改成你自己的 ssh 地址，注意是 ssh 地址。而且`coding:`后面是有个空格的，这就是 yaml 语言的格式，以后编辑`_config.yml`也要注意的。

```yml
deploy:
  type: git
  repo:
    coding: git@git.coding.net:Artin/Artin.git,master
```

---

## 部署到 Coding Pages 上

这是 Coding 关于 Pages 的介绍。

> https://coding.net/help/doc/pages/index.html

首先要安装 git 的插件:<br/>
在终端输入

```bash
npm install hexo-deployer-git --save
```

等待安装完成。

然后输入命令：

```
hexo clean
hexo g -d
```

**每一次更新博客，都要重新部署。**

---

# 一些 Tips

## 修改终端时区

c9 的终端默认的时区是 UTC，和中国相差了 8 个时区。
终端输入:

```
sudo dpkg-reconfigure tzdata
```

然后进入图形交互界面，选择`Asia/Shanghai`时区就行了
出现下面的提示即为成功

```bash
Current default time zone: 'Asia/Shanghai'

Local time is now:      Sat Aug  6 20:13:22 CST 2016.
Universal Time is now:  Sat Aug  6 12:13:22 UTC 2016.
```

---

## 开启 c9 的 markdown 实时预览

写 markdown 时点击工具栏的`Preview`，选择第一个`Live Prebiew file`。
然后屏幕就会变成双栏，左边码 markdown，右边可实时预览。

---

## 未完待续
