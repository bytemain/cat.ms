---
title: 为yelee主题加入腾讯分析
comments: true
toc: true
date: 2016-07-15 10:58:13
updated: 2019-07-18 14:03:00
categories:
  - Hexo
tags:
  - Hexo
  - 主题
permalink: /posts/add-tencent-analytics-to-yelee
layout: post

---

hexo 的原生主题自带了谷歌分析,而谷歌分析在国内水土不服。琢磨琢磨，把 next 主题上的腾讯分析添加到了正在用的 yelee 主题上。
顺带一提，腾讯分析真的是用过的最好用的站点统计软件。

<!-- more -->

用的主题是 yelee，没有腾讯分析，自己加了一个。
在`主题目录`下操作。
在`_config.yml`中添加

```yml
tencent-analytics:
# 在冒号后面配置你的腾讯分析id，id就是获取到的代码的数字部分
```

在`layout/_partial/`中创建一个新的`tencent-analytics.ejs`文件,
加入如下代码

```ejs
<% if (theme.tencent_analytics){ %>
<script type="text/javascript" src="http://tajs.qq.com/stats?sId=<%= theme.tencent_analytics %>" charset="UTF-8"></script>

<script type="text/javascript">
    var _speedMark = new Date();
</script>
<% } %>
```

上面的代码包括了腾讯分析了。
在`layout/_partial/`中修改`head.ejs`：

```ejs
#随便找一行添加如下代码，让用户在打开网页时加载腾讯分析。
<%- partial('tencent-analytics') %>
```

然后在主题的`_config.yml`中输入你的腾讯分析 id。
执行

```
hexo clean
hexo g -d
```

就 ok 了。
