---
title: 使用 CI 工具自动部署 Hexo 博客
comments: true
toc: true
permalink: update-hexo-by-ci
date: 2019-07-17 21:44:54
categories:
  - Hexo
tags:
  - CI/CD
  - Buddy.works
---

先说说用自动部署博客的好处：

1. 你每次部署所需要做的动作就是把源文件推送到 Github 的仓库。
2. 可以直接在 Github 网页上编辑 `.md` 文件，保存后 CI 工具会自动部署。
3. 接上条：只要你敢想，你可以在任何一端写 markdown 文档，然后推送至仓库。
4. 使用自动部署后， Hexo 的迁移成本极速下降。

而且放心~ 不会影响本地预览，本地部署等功能、不用担心 `_config.yml` 会泄露。

这篇博客非常简单，主要是写出如何自动部署的方法，就两步：

1. 将 Hexo 源码推到仓库中
2. 设置自动集成和部署

这篇博客还会介绍一下 Hexo 的 filter 方法（包括 Next 主题的 theme-inject）， 站点 `_config.yml` 和 主题 `_config.yml` 的合并，使用脚本来减少工作量。

看完这篇博客之后，你会有很多新想法的~

{% note [info] [no-icon] %}

本文使用的 CI 工具是：[Buddy](https://buddy.works/)，介绍的方法需要将 Hexo 源码托管于 Github，但是你可以自己尝试托管在其他平台，Buddy 不仅支持 Github，还支持自建的 Git 仓库，BitBucket 之类的。

如果你希望将 markdown 源码托管在 Coding 上，参考 Coding 文档：[第三方集成](https://coding.net/help/doc/integrations)，大概步骤差不多。

{% endnote %}

**这里是 Github 支持的第三方 CI：[Continuous integration](https://github.com/marketplace/category/continuous-integration)，你可以自己选用。**

**文末提供了一些参考资料。**

可以参考我的仓库：
[![lengthmin.me](https://gh-card.dev/repos/lengthmin/lengthmin.me.svg)](https://github.com/lengthmin/lengthmin.me)

<!-- more -->
## 备份源文件到仓库

### 建立 git 仓库

> [如何创建一个更好的Hexo使用体验](/posts/to-build-a-better-hexo/)
>
> 以前写的备份 Hexo 源文件的教程

如果你以前没有备份过源文件，可以往下跟着一步步操作。

```sh
# 将当前目录作为 git 目录
git init
```

添加远程仓库：
<!-- markdownlint-disable -->
{% tabs remote add %}
<!-- tab SSH -->

复制你的 Hexo 仓库地址，然后执行：
{% code lang:sh %}
git remote add origin git@github.com:xxxxxx.git
{% endcode %}

解释一下上面这段代码：
{% code lang:sh %}
git remote add [-t <branch>] [-m <master>] [-f] [--[no-]tags] [--mirror=<fetch|push>] <name> <url>
{% endcode %}

- `git remote add` 本地添加远程仓库地址
- `origin` 设置的仓库名字，以后你就可以拿这个名字标识这个远程仓库。
- `git@github.com:xxxxxx.git` 通过 SSH 方式与仓库通信，需要先设置好 SSH 密钥。

<!-- endtab -->


<!-- tab HTTPS -->
复制你的 Hexo 仓库地址，然后执行：
{% code lang:sh %}
git remote add origin https://github.com/xxxxxx.git
{% endcode %}

解释一下上面这段代码：
{% code lang:sh %}
git remote add [-t <branch>] [-m <master>] [-f] [--[no-]tags] [--mirror=<fetch|push>] <name> <url>
{% endcode %}
- `git remote add` 本地添加远程仓库地址
- `origin` 设置的仓库名字，以后你就可以拿这个名字标识这个远程仓库。
- `https://github.com/xxxxxx.git` HTTP 方式，你需要手动输入账号密码。

<!-- endtab -->
{% endtabs %}
<!-- markdownlint-restore -->
切换到 backup 分支：

```sh
git checkout -b backup
```

由于 GitHub Pages 的限制，我们生成的静态文件需要托管在仓库的 master 分支，所以我们得再开一个分支来放源代码。

第一步就完成了。

### 设置 .gitignore ＆ package.json

为啥要把这一部分单独拿出来讲呢？因为这一部分才是精髓了。

先说一说我的情况，我是将站点的 `_config.yml` 文件和主题的 `_config.yml` 合并起来了。
见：[数据文件](https://github.com/theme-next/hexo-theme-next/blob/master/docs/zh-CN/DATA-FILES.md#选择-1hexo-方式)

弄好之后就可以往下看了~
你也可以自己选择一种兼容的方法。

这样对我而言的好处就是可以 CI 每次去克隆最新版的主题~ 一个配置文件还方便管理。

我们在将代码提交到 backup 分支之前，先设置一些忽略项，这完全依赖于你自己的博客源文件：
你可以参考我的[.gitignore](https://github.com/lengthmin/lengthmin.me/blob/backup/.gitignore)。

```sh
_config.yml # 忽略你的配置文件
themes/ # 忽略上传主题
themes/* # 忽略上传主题
secrets_.json # 密钥文件
```

重头戏来啦~
把 `_config.yml` 复制一份为 `_config_base.yml`，将里面的有用到口令、密钥一些隐私的字段用文本字段替换。
比如这是我的 gitalk 的配置：

```yaml
gitalk:
  client_id: 87xxxxxxxxxxxe1
  client_secret: aexxxxxxxxxxxxx69
```

我必须不能让这些密钥泄密呀，所以替换成：

```yaml
gitalk:
  client_id: _gitalk_client_id_
  client_secret: _gitalk_client_secret_
```

在这之前，还要记得备份一下哦~ 创建一个 json 文件当成密钥文件

我们之后在部署或者生成的时候使用相应的密钥替换掉就好。

可以参考我的 [_config_base.yml](https://github.com/lengthmin/lengthmin.me/blob/backup/_config_base.yml)。
![_config_base.yml](https://cdn.jsdelivr.net/gh/riril/i/posts/update-hexo-by-ci/_config_base_yml.png)

## 选择一个合适的 CI 工具

> 持续集成(Continuous integration，CI)指的是在开发过程中持续地将所有开发人员的代码合并到代码库的主线上，然后对该主线代码进行编译、测试运行等操作对代码进行检验，其目的是尽可能早的发现代码集成后导致的问题。
>
> 实现持续集成的要点主要有：共享的代码库、自动化编译、自动化测试等，同时要保证合理的集成频率，一般持续集成的时机在于开发人员将代码提交到代码库时自动进行，但是如果提交过于频繁，那么应该使用时间间隔的形式进行持续集成。
>
> 持续发布(Continuous delivery,CD)实际上是持续集成上的一个拓展，在持续集成的基础上将发布工作自动化，避免人为操作从而减少发布时间和发布时人为造成的错误。

![Buddy 可选的 Git 托管服务商](https://cdn.jsdelivr.net/gh/riril/i/posts/update-hexo-by-ci/Optional_Git_hosting_service.png)

## 其他参考资料

- [持续集成在Hexo自动化部署上的实践](https://qinyuanpei.github.io/posts/3521618732/#实现Hexo博客的自动化部署)
- [利用 Travis CI 将 Hexo 持续集成部署到 GitHub Pages](https://easyhexo.com/1-Hexo-install-and-config/1-5-continuous-integration.html#自动部署)
- [Hexo NexT 高阶教程之 Injects](https://www.dnocm.com/articles/beechnut/hexo-next-injects/)
