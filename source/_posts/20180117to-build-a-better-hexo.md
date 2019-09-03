---
title: 如何创建一个更好的Hexo使用体验
comments: true
toc: true
permalink: to-build-a-better-hexo
date: 2018-01-17 10:24:03
updated: 2019-07-18 14:03:00
categories: 
  - Hexo
tags:
  - Hexo
---
我经常在webide更新博客，但这只限于有网络的情况下。想本地调试的话，在没网之前就需要把源文件同步到本地来。这个功能用`git`来实现会非常好。  
大概的思路就是在博客的仓库创建一个分支来备份源文件。  
在部署网页之前可以先把源文件同步到备份分支，然后需要的时候本地拉取回来。  

<!-- more -->
***
## 备份到仓库 ##
你需要安装好git。
首先，你要在博客根目录下添加远程仓库。

```bash
# git remote add [shortname] [url]
# [shortname] 设置仓库的名称
# [url] 远程仓库的链接
git remote add hexo https://git.coding.net/Artin/Artin.git
```

然后创建一个新的分支
```bash
git branch backup
```
切换到backup分支
```
git checkout backup
```
然后在博客根目录下执行
```
git add .
git commit -am "update"
git push hexo backup
```
你可以去看看[廖雪峰的git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)
关于push主题失败的同学，把主题中的.git给删掉就ok了

***
## 更加便携的方法 ##
这个主意我只在ubuntu下试过。
首先，在博客根目录创建一个`git.sh`
在里面输入如下代码
```bash
#!/bin/bash/
# 这里的路径是你的博客的路径
cd /home/ubuntu/workspace/hexo/
echo "执行hexo clean"
hexo clean
echo "hexo clean 执行完毕"
echo "推送源代码"
git add .
git commit -am "update"
git push hexo master
echo "推送源代码 执行完毕"
echo "执行hexo g -d"
hexo g -d
echo "hexo g -d 执行完毕"
```
以后想要更新博客，直接在博客根目录下输入:
```bash
sh git.sh
```