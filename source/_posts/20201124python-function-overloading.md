---
title: "[译] 在 Python 中实现函数重载"
comments: true
toc: true
permalink: posts/function-overloading-in-python/
date: 2020-11-24 16:42:00
updated: 2020-11-24 16:42:00
categories: 
- Python
tags: 
- Python
- 翻译
---

译自：<https://arpitbhayani.me/blogs/function-overloading>  
作者：[@arpit_bhayani](https://twitter.com/arpit_bhayani)  
翻译已获原作者授权  

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

<!-- more -->

## 为什么 Python 中没有函数重载？

Python 默认不支持函数重载。当我们定义多个同名函数时，后一个总会覆盖掉前一个函数，因此在同一个命名空间内，每个函数名总是只有一个函数执行入口。我们可以调用函数 `locals()` 和 `globals()` 来查看命名空间中有什么， 这两个函数分别返回本地命名空间和全局命名空间。

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

定义好函数之后，执行 `locals()` 函数，这个函数会返回一个包含当前命名空间中定义的所有变量的字典。该字典的键是变量名称，字典的值是变量的引用或值。当运行时遇到另一个同名函数时，它会更新本地命名空间中的函数入口，从而消除两个函数共存的可能性。因此 Python 不支持函数重载。这是在创建语言时做出的设计决策，但这并不妨碍我们实现它。来，让我们重载一些函数。

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

在上面的这个代码片段中，`Function` 类的 `key` 方法返回一个元组，该元组可以在整个代码库中唯一的标识被包装的函数，元组中还保存了以下内容：

- 函数所属的模块
- 函数所属的类
- 函数名称
- 函数接受的参数个数

覆盖的 `__call__` 方法调用被包装的函数并返回计算出的值（目前这里还只是常规操作，值原样返回）。这使得这个类的实例可以像函数一样被调用，并且其行为与被包装的函数完全一样。

```python
def area(l, b):
  return l * b

>>> func = Function(area)
>>> func.key()
('__main__', <class 'function'>, 'area', 2)
>>> func(3, 4)
12
```

在上面的这个例子里，我们把 `area` 函数 传入 `Function` 类，并把实例赋给 `func`，调用 `func.key()` 返回了一个元组，该元组的第一个元素就是当前模块名 `__main__`，第二个元素是类型 `<class 'function'>`，第三个是函数的名字 `area`，第四个是函数 `area` 能接受的参数个数：`2`。

这个例子同时也说明了如何调用 `func` 实例，就像我们平常调用 `area` 函数那样调用就可以，传入两个参数：`3` 和 `4`，然后得到结果 `12`。这和我们调用 `area(3, 4)` 的表现是一模一样的。

当我们在后面的阶段使用装饰器时，这种表现能派上大用场。

### 创建虚拟命名空间

在这一步，我们会构建一个虚拟命名空间（函数注册表），这个函数注册表会存储所有在函数定义阶段要重载的函数。

由于全局只需要一个命名空间（把所有的要重载的函数保存到一起），我们创建了一个单例类，内部使用字典来保存不同的函数，字典的键就是我们从 `key` 方法获得的元组，该元组可以唯一标识整个代码中的函数。这样一来，即使传入的函数名称相同（但参数不同），我们也可以把它们保存在字典中，从而实现函数重载。

```python
class Namespace(object):
  """Namespace 这个单例类保存了所有要重载的的函数
  """
  __instance = None

  def __init__(self):
    if self.__instance is None:
      self.function_map = dict()
      Namespace.__instance = self
    else:
      raise Exception("已存在实例，无法再进行实例化")

  @staticmethod
  def get_instance():
    if Namespace.__instance is None:
      Namespace()
    return Namespace.__instance

  def register(self, fn):
    """在虚拟命名空间中注册函数，并且返回一个包装好
    的 `Function` 实例。
    """
    func = Function(fn)
    self.function_map[func.key()] = fn
    return func
```

`Namespace` 有一个 `register` 方法，该方法接收一个 `fn` 参数，根据 `fn` 创建一个唯一的键值然后保存到字典中，最后返回一个包装好的 `Function` 实例。

这意味着 `register` 方法的返回值也是可调用的，并且（到目前为止）其行为与要包装的函数 `fn` 完全相同。

```python
def area(l, b):
  return l * b

>>> namespace = Namespace.get_instance()
>>> func = namespace.register(area)
>>> func(3, 4)
12
```

### 使用装饰器

现在我们已经定义了一个能够注册函数的虚拟命名空间，我们需要一个在函数定义期间被调用的钩子（注：原文为 hook），这里使用装饰器来实现。

在 Python 中，我们可以用装饰器包装函数，这样我们就能在不修改函数原结构的情况下向函数添加新功能。装饰器接受要被包装的函数 `fn` 作为参数，并返回一个可调用的新函数。新函数也可以接受你在函数调用时传递的 `args`和 `kwargs` 并返回值。

下面展示了一个装饰器示例，它可以计算函数的执行时间。

```python
import time


def my_decorator(fn):
  """my_decorator 是我们自定义的一个装饰器
  它能包装传入的函数并且输出该函数的执行时间。
  """
  def wrapper_function(*args, **kwargs):
    start_time = time.time()

    # 调用原函数获得原函数的返回值
    value = fn(*args, **kwargs)
    print("函数执行花费了:", time.time() - start_time, "秒")

    # 返回原函数的调用值
    return value

  return wrapper_function


@my_decorator
def area(l, b):
  return l * b


>>> area(3, 4)
函数执行花费了: 9.5367431640625e-07 秒
12
```

上面这个例子里我们定义了一个名为 `my_decorator` 的装饰器，我们使用这个装饰器包装了定义的 `area` 函数，包装后的函数在执行后可以打印执行花费的时间。

当 Python 解释器遇到被装饰的函数定义的时候，都会执行一遍装饰器函数 `my_decorator`（这样它就完成了对被装饰函数的包装，并将装饰器返回的函数存储在 Python 的本地或全局命名空间中）。对我们来说，这就是一个能在虚拟命名空间中注册函数的理想的钩子。因此，我们创建一个名为 `overload` 的装饰器，这个装饰器会在虚拟命名空间中注册被装饰的函数，并返回一个能被调用的 `Function` 实例。

```python
def overload(fn):
  """overload 是我们用来包装函数的装饰器，会返回一个 
  能被调用的 `Function` 实例。
  """
  return Namespace.get_instance().register(fn)
```

`overload` 装饰器返回了一个 `Function` 的实例，该实例是通过调用 `Namespace` 单例类中的 `.register()` 方法得到的。现在只要函数（被 `overload` 装饰过的）被调用，实际上是这个 `Function` 的实例的 `__call__` 方法被调用，该方法也会接收函数传入相应的参数。

现在我们还需要做的就是完善 `Function` 这个类的 `__call__` 方法，让 `__call__` 方法被调用的时候根据传入的参数找到正确的函数定义。

### 从命名空间中找到正确的函数

函数歧义消除的条件除了判断模块的类和名称之外，还需要判断函数接收的参数数量，因此我们在虚拟命名空间中定义了一个方法 `get`， 这个方法接收一个 Python 命名空间中（区别于我们创建的虚拟命名空间，我们并没有改变 Python 命名空间的默认行为）的函数，我们根据函数的参数数量（我们设置的消歧因子）返回一个可以被调用的消歧后的函数。

这个 `get` 方法的作用就是决定函数的哪个实现（如果被重载过）会被调用。找到正确函数的过程其实很简单，根据传入的函数和函数参数创建一个全局唯一键然后查找这个键是否在命名空间中注册过；如果是，则读取与键对应的实现。

```python
def get(self, fn, *args):
  """get 返回在命名空间中匹配到的函数

  如果未匹配到任何函数则返回 None
  """
  func = Function(fn)
  return self.function_map.get(func.key(args=args))
```

`get` 方法在内部创建了一个 `Function` 的实例，然后通过该实例的 `key` 方法获取函数的唯一键。然后使用该键从函数注册表中获取相应的函数。

### 函数调用

如上所述，每次调用被 `overload` 装饰过的函数时，都会调用 `Function` 类中的 `__call__` 方法。我们要在这个方法里通过虚拟命名空间的 `get` 方法找到并调用正确的重载函数实现。`__call__` 方法的实现如下：

```py
def __call__(self, *args, **kwargs):
  """覆盖类的 `__call__` 方法可以让一个实例可被调用
  """
  # 从虚拟命名空间中获取真正的要被调用的函数
  fn = Namespace.get_instance().get(self.fn, *args)
  if not fn:
    raise Exception("no matching function found.")

  # 返回函数调用值
  return fn(*args, **kwargs)
```

该方法从虚拟命名空间中找到正确的函数，如果没找到任何函数，则抛出 `Exception` 异常，如果函数存在，则调用该函数并返回值。

### 实战

将所有的代码整理好，我们定义两个名为 `area` 的函数：一个函数计算矩形的面积，另一个函数计算圆形的面积。

我们将两个函数都使用 `overload` 装饰器进行装饰。

```python
@overload
def area(l, b):
  return l * b

@overload
def area(r):
  import math
  return math.pi * r ** 2


>>> area(3, 4)
12
>>> area(7)
153.93804002589985
```

当我们调用 `area` 只传一个参数时，可以看到它返回了圆的面积；当我们传入两个参数时，可以发现返回了矩形的面积。

完整代码见：<https://repl.it/@arpitbbhayani/Python-Function-Overloading>

## 结论

Python 默认不支持函数重载，但通过简单的语言结构我们整出了一个解决方法。我们使用装饰器和用户维护的虚拟命名空间，将函数参数数量作为消歧因子来重载函数。我们也可以使用函数参数的数据类型来做消歧，这样就能实现参数个数相同但参数类型不同的函数重载。重载的粒度仅受 `getfullargspec` 函数和我们的想象力限制。

你也可以通过上述内容自己整一个更整洁、更干净、更高效的实现，所以请随意实现一个，并发推给我 [@arpit_bhayani](https://twitter.com/arpit_bhayani)，我会很高兴学习你的实现。

>   
> 从 Python 3.4 开始，可以使用 [functools.singledispatch](https://docs.python.org/3/library/functools.html#functools.singledispatch) 实现函数的重载。  
> 从 Python 3.8 开始，可以使用 [functools.singledispatchmethod](https://docs.python.org/3/library/functools.html#functools.singledispatchmethod) 实现实例方法的重载。
> 
>   感谢 [Harry Percival](https://twitter.com/hjwp) 的更正
