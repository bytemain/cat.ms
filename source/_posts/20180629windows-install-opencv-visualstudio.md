---
title: Win10下为Visual Studio安装OpenCV3.4.1(C++)
comments: true
toc: true
permalink: windows-install-opencv-visualstudio
date: 2018-06-29 15:54:41
categories: 教程
tags:
- OpenCV
---

    Windows下安装OpenCV以及配环境的事情，对于VS来说一点都不麻烦，简单几步就可以让VS使用OpenCV。

<!-- more -->
- [OpenCV的下载链接](https://opencv.org/releases.html)，下载winpack就行了

下载下来是一个`.exe`格式的可执行文件，双击打开之后会自动解压缩，选择安装目录就好了。
我选的是`c:/opencv`，之后的教程都是有关这个目录的。

打开系统设置界面（可以在小娜上输入`系统设置`），小娜就会帮你打开高级系统设置，点击环境变量，在系统变量的Path一栏中新建两个:
```
C:\opencv\build\bin
C:\opencv\build\x64\vc14\bin
```

打开VS，创建一个项目
属性页
VC++目录：
包含文件目录：
- C:\opencv\build\include\
- C:\opencv\build\include\opencv2
- C:\opencv\build\include\opencv
库目录：
- C:\opencv\build\x64\vc14\lib

链接器：
输入：
附加依赖项：opencv_world341d.lib

如果是release的话就是把d去掉opencv_world341.lib

测试一下
```c++
// opcv.cpp: 定义控制台应用程序的入口点。
//

#include "stdafx.h"
#include "cv.h"
#include "highgui.h"

int main()
{
	IplImage* src = cvLoadImage("C:\\1.png");//此处的路径，一定是绝对路径，相对路径会报错的
	cvNamedWindow("showImage");
	cvShowImage("showImage", src);
	cvWaitKey(0);
	cvReleaseImage(&src);
	cvDestroyWindow("showImage");
	return 0;
}
```

图片自己设置