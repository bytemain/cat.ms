---
title: \[翻译\] 值得学习的 Python 内置方法
comments: true
toc: true
permalink: python-builtins-worth-learning
date: 2019-07-13 13:52:04
categories: 
  - Python
tags:
  - Python
  - 翻译
---

原文链接：<https://treyhunner.com/2019/05/python-builtins-worth-learning/>

---

每一次我给 Python 新手上课时，总有人说：“我们怎么能记住这么多的东西啊？”

这些问题的方式通常是以下几种：

1. Python 有那么多内置的函数，有什么好方法能记住所有的呢？
2. 学习那些常用函数有什么捷径吗？像 `enumerate` 和 `range`这些。
3. 你是怎么知道用 Python 解决问题的这么多方法呢？全靠背吗？

在 [Python 标准库](https://docs.python.org/3/library/index.html)中有非常多的的函数、类，百来种工具，甚至 Pypi 上还有成千上万的第三方库。任何人都没办法记住这么多东西。

我建议把这些知识分个类：

1. 第一种，我需要记下来以便理解的。
2. 第二种，我需要知道以便之后快速查找的。
3. 第三种，直到我需要用到的那一天前，我都不需要了解的。

让我们通过这种方式来看一遍 Python 文档中的 [内置函数页面](https://docs.python.org/3/library/functions.html)。

这将是一篇非常长的文章，如果你时间比较紧，或者你只想看其中一节的话，我将全篇 5 节的链接和 20 个专门介绍的内置函数的链接都放在了下一部分，你可以很方便的点击链接查看相应的内容。

<!-- more -->
## 你应该知道哪些内置函数

我估计**大多数 Python 开发者只需要大约 30 个内置函数**，但是这取决于你实际使用 Python 做什么。

我们将以鸟瞰图的方式来看看所有的 69 个 Python 内置函数。

我将这些函数大致分为五类：

1. [众所周知的](#10_Commonly_known_built-in_functions)：大部分 Python 新手
2. [被初学者忽视的](#Built-ins_overlooked_by_new_Pythonistas)：
3. [稍后学习的](#Learn_it_later)：
4. [某一天最终会学到的](#Maybe_learn_it_eventually)：
5. [你可能不大需要的](#You_likely_don%E2%80%99t_need_these)：
