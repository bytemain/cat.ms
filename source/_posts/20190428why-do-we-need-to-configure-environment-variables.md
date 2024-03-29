---
title: 为什么我们需要配置环境变量
comments: true
toc: true
permalink: posts/why-do-we-need-to-configure-environment-variables/
date: 2019-04-28 00:03:42
updated: 2020-12-18 14:56:00
categories:
  - 思考
tags:
  - Python
  - 思考
---

之前学习 Java 的时候，感觉最难做的一件事情就是配置 jdk 的环境。那叫一个困难啊，Path、JAVA_HOME、CLASSPATH 印象深刻的很...（但是现在 JDK11 不用再配置 classpath 了，jre 和 jdk 合并了）。
就在去年暑假，要 [配 OpenCV 的环境](/posts/install-opencv-windows-vs/)，要调的东西还是比较多的，对环境配置的概念又加深了。

现在懂的多了，配过的环境也多了，配过的平台也不算少。现在就想分享一下「关于我对配环境这件事情的感受」。

那就以 Windows 来说说环境配置的问题，Linux 下的其实差不多。

<!-- more -->

## 为什么需要环境变量

我记得计算机网络的老师在给我们讲 ip/mac 地址的时候提过一个例子：

**问：**你刚到这个班，班里都是新同学，你想找班里的小明同学该怎么办？  
**答：**在班里喊一声小明。这当然可以，小明肯定会响应你。在网络上来说也是如此。但是，如果有一张座位表，上面有每个同学的座位信息，你想找到某个人是不是就很简单了。

环境变量也是如此，也很适合这个例子。

当用户在 cmd 中执行一个命令的时候，命令行的解释器就会去找你要执行的命令。
那么是去哪里找可执行的命令呢？两个地方：

- 当前路径下的可执行文件
- 环境变量 Path 中保存的路径下的可执行文件（包括系统变量和用户变量）

## 举个例子

举个栗子：

`win + r` 大家都用过吧，经常用来快速运行某些程序，比如打开命令行窗口我们就会用到：

![打开 cmd](https://i.lengthm.in/posts/why-do-we-need-to-configure-environment-variables/5ccafd6ee176b.png)

那电脑是怎么知道 cmd 在哪儿的呢？

![在Everything搜索cmd.exe](https://i.lengthm.in/posts/why-do-we-need-to-configure-environment-variables/5ccafe08db5ec.png)

能看到 `cmd.exe` 是在 `C:\Windows\System32\`和 `C:\Windows\SysWOW64\` 这两个路径下都有的，那就是说，电脑是去这两个路径之一打开的 `cmd.exe`，那我们来看一下，系统环境变量里到底有没有这两个路径的其中一个呢？

查看一下系统的环境变量中的 Path 是不是有这个路径：
在小娜的输入框里输入 `path` 或者「环境」可以直接跳转到修改环境变量的地方，不行的话只能在计算机图标右键属性了。

![我的环境变量](https://i.lengthm.in/posts/why-do-we-need-to-configure-environment-variables/5ccb0002c8879.png)

可以发现有，验证了我们的想法~
所以这个流程我们也弄清楚了：

```plaintxt
你在运行窗口输入 cmd：
    -> 解释器去寻找这个文件：
        -> 先寻找当前路径下是否有
        -> 再寻找环境变量中的Path保存的路径是否有
    -> 没找到就报没找到
```

所以如果你没配置某个可执行文件到 Path 里，那你就得手动输入该文件的绝对路径才能打开了。

## Path 外的其他字段

其他的一些字段也是方便我们使用的，想用的时候使用 `%字段名%` 就能调用了。
比如说我在系统设置里设置了 `CMDER_ROOT` 字段，将其赋值为`D:\0ArtinD\cmder`，这是一个路径。
![设置 CMDER_ROOT](https://i.lengthm.in/posts/why-do-we-need-to-configure-environment-variables/5ccb026a1dbfb.png)

然后我想打开该路径，就可以使用该字段名啦：
![Snipaste_2019-05-02_22-47-37](https://i.lengthm.in/posts/why-do-we-need-to-configure-environment-variables/5ccb03181acf3.png)

简单来说！就是编程中的变量名。定义一个常量，想用的时候可以使用。

在 Windows CMD 中，我们可以使用 `%VAR%` 来使用一个变量。

```bat
set VAR=hello
echo %VAR%
```

在 Unix Bash (Linux, Mac, etc.) 中，我们可以使用 `$VAR` 来使用一个变量。

```bash
export VAR=hello
echo $VAR
```

在 PowerShell 中，我们可以使用 `$env:VAR` 来使用一个变量。

```ps1
$env:VAR = "hello"
Write-Output $env:VAR
```

## 用户变量和系统变量

操作系统中有用户的概念。

用户变量只对当前登录的用户生效。  
系统变量对当前计算机的所有用户生效。
