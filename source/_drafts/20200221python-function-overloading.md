---
title: 在 Python 中实现函数重载
comments: true
toc: true
permalink: function-overloading-in-python
date: 2020-02-21 12:21:36
updated: 2020-02-21 12:21:36
categories: 
- Python
tags: 
- Python
- 翻译
---
本文译自：<https://arpitbhayani.me/blogs/function-overloading> &nbsp;&nbsp; 作者：[@arpit_bhayani](https://twitter.com/arpit_bhayani)
翻译已获取原作者授权

---

函数重载是指可以创建多个同名函数，但是每个函数的形参以及实现可以不一样。当一个重载函数 `fn` 被调用时，运行时会根据传入的参数/对象，来判断并调用相应的实现函数。

```cpp
int area(int length, int breadth) {
  return length * breadth;
}

float area(int radius) {
  return 3.14 * radius * radius;
}
```

上面这个例子中(C++实现)，函数 `area` 被两个实现重载，第一个函数允许传入两个参数(且都是整数型)，根据传入的长方形的宽高，返回长方形的面积；第二个函数需要传入一个整形参数：圆的半径。当我们调用函数 `area` 时，如调用 `area(7)` 时会使用第二个函数，而调用 `area(3, 4)` 时则会使用第一个。

### 为什么 Python 中没有函数重载？

Python 不支持函数重载。当我们定义多个同名函数时，后一个总会覆盖掉前一个函数，因此在同一个命名空间内，每个函数名总是只有一个函数执行入口。我们可以调用函数 `locals()` 和 `globals()` 来查看命名空间中有什么， 这两个函数分别返回本地命名空间和全局命名空间。

```python
def area(radius):
    return 3.14 * radius ** 2

>>> locals()
{
  ...
  'area': <function __main__.area(radius)>,
  ...
}
```

先定义好函数，在使用 `locals()` 之后我们能看到它返回了一个当前命名空间中定义的所有变量的字典。字典的键是变量名，字典的值是变量的引用或值。当运行时遇到另一个同名函数时，它会更新本地命名空间中的函数入口，从而消除两个函数共存的可能性。因此 Python 不支持函数重载。这是在创建语言时做出的设计决策，但这并不妨碍我们实现它。来，让我们来重载一些函数。
<!-- more -->

## 在 Python 中实现函数重载

我们已经知道了 Python 怎样管理命名空间，如果我们想实现函数重载，我们需要：

- 维护一个虚拟命名空间，在其中管理函数定义
- 根据传入的参数找到调用相应函数的方法

简单起见，我们实现的函数重载将由函数接受的**参数数量**来区分。

### 包装函数

我们创建一个名为 `Function` 的类，这个类可以传入任意的函数，通过重写类的 `__call__` 方法使得该类可被调用，最后，我们实现一个 `key` 方法，该方法返回一个元组，可以在全局中唯一标识传入的函数。

```python
from inspect import getfullargspec


class Function(object):
    """包装标准的 Python 函数.
    """

    def __init__(self, fn):
        self.fn = fn

    def __call__(self, *args, **kwargs):
        """该方法使得整个类能像函数一样被调用，然后返回传入函数的
        调用结果。
        """
        return self.fn(*args, **kwargs)

    def key(self, args=None):
        """返回唯一标识函数的 key
        """
        # 如果没有手动传入参数，从函数定义中获取参数
        if args is None:
            args = getfullargspec(self.fn).args

        return tuple(
            [self.fn.__module__, self.fn.__class__, self.fn.__name__, len(args or [])]
        )
```
