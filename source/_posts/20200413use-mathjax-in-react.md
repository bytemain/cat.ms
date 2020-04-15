---
title: React 项目中动态加载 Mathjax
date: 2020-04-13 15:35:24
categories: 
- React
tags:
- Web
comments: true
toc: true
permalink: use-mathjax-in-react
---

做一个 React 项目的时候，想在网页上渲染数学公式，不想用别人封装好的 React 组件，采用动态加载的方式直接渲染 DOM。

Mathjax@3 做了很大的一个更新，使用方式也和 2.x 版本不同。

<!-- more -->

## React 动态加载 js

首先需要知道的一件事就是如何动态加载 js，用 js 将一个新的 script 节点挂载到 dom 上即可。

创建一个 dom 元素 `script`，设置 `src` 属性为要加载的链接，然后将节点添加到 body 元素内。

封装成函数如下，只需要传入需要加载的 js 链接，然后使用 `.then` 方法进行后续操作。

```ts
export const loadJS = (url: string) =>
  new Promise(function (resolve, reject) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    script.onload = function () {
      resolve(`success: ${url}`);
    };
    script.onerror = function () {
      reject(Error(`${url} load error!`));
    };
  });
```

在需要使用的地方：

```ts
loadJS(url).then(() => {
  // do something
}).catch(() => {
  // do something
});
```

## mathjax@2.x 版本

先给出参考的官方链接，本文讲的可能不太清楚。

- Loading and Configuring MathJax
  <https://docs.mathjax.org/en/v2.7-latest/configuration.html>
- Loading MathJax Dynamically
  <https://docs.mathjax.org/en/v2.7-latest/advanced/dynamic.html>
- Modifying Math on the Page
  <https://docs.mathjax.org/en/v2.7-latest/advanced/typeset.html>

加载了 mathjax 之后，我们只要在合适的时机让 mathjax 渲染 dom 即可。

举个例子：

```ts
componentDidMount() {
  const mathjaxUrl = 'https://cdn.bootcss.com/mathjax/2.7.4/MathJax.js?config=TeX-AMS_CHTML';
  loadJS(mathjaxUrl).then(() => {
    this.showMathjax();
  });
}

componentDidUpdate () {
  if (!(window as any).MathJax) {
    (window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub, ReactDOM.findDOMNode(this)]);
  }
}

showMathjax = () => {
  if ((window as any).MathJax) {
    (window as any).MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
        skipTags: ['script', 'noscript', 'style', 'textarea', 'code', 'a'],
      },
      CommonHTML: {
        scale: 120,
        linebreaks: { automatic: true },
      },
      'HTML-CSS': { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } },
      TeX: { noErrors: { disabled: true } },
    });
  } else {
    setTimeout(this.showMathjax, 1000);
  }
};

```

2.x 的版本，我们要使用 `Mathjax.Hub.Config` 来配置，这几个配置看起来也很好懂，`tex2jax` 中设置了在什么字符包裹的时候渲染数学公式。

设置了行内公式用 `$...$` 包裹，多行公式用 `$$...$$` 来包裹，对于什么什么标签内的则不渲染。  
然后就是设置好几种模式下渲染的表现怎么样，上面我们加载的 js 时候后面有一个 query `?config=TeX-AMS_CHTML`，说明我们加载的是 CHTML 的配置，各种配置显示效果不同。参见 <https://docs.mathjax.org/en/v2.7-latest/config-files.html>

`Mathjax` 加载好之后就会渲染页面，但是对于单页面应用来说， `Mathjax` 并不会在页面 DOM 更新的时候重新渲染，我们需要使用 `MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);` 来让  `Mathjax` 手动渲染 DOM。添加在 `componentDidUpdate` 中即可。

## mathjax@3 版本

同样给出官方文档链接：

- Configuring MathJax
  <http://docs.mathjax.org/en/v3.0-latest/options/index.html>
- MathJax in Dynamic Content
  <http://docs.mathjax.org/en/v3.0-latest/advanced/typeset.html>

3 的版本 `Mathjax` 的加载，配置方式都有不同。

> Upgrading from v2 to v3: <http://docs.mathjax.org/en/latest/upgrading/v2.html>

加载时可以直接加载不同配置的 js，不需要再使用 `?config=xxx` 了，比如说加载 `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js`。

`Mathjax.Hub` 方法被移除，现在设置配置只需要给 `window.Mathjax` 赋值一个配置对象即可。

> 官方还提供一个一键转换配置的链接： [MathJax Configuration Converter](https://mathjax.github.io/MathJax-demos-web/convert-configuration/convert-configuration.html)

还是给出我的配置：

```ts
(window as any).MathJax = {
  tex: {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'code', 'a'],
  },
  chtml: {
    scale: 1.2,
  },
  startup: {
    ready: () => {
      (window as any).MathJax.startup.defaultReady();
      (window as any).MathJax.startup.promise.then(() => {
        console.log('MathJax initial typesetting complete');
      });
    },
  },
};
```

`Mathjax` 脚本加载好之后会读取 `window.Mathjax` 为配置并且替换为 `Mathjax` 对象，然后你就可以调用相关函数了。

`Mathjax` 初始化时会调用配置中的 `startup.ready` 方法，你可以在里面做一下提示或者其他配置。

还是那个问题，`Mathjax` 在 DOM 更新时不会重新渲染，需要使用 `MathJax.typesetPromise()` 方法。也在 `componentDidUpdate` 中设置即可。

```ts
componentDidUpdate() {
  const MathJax = (window as any).MathJax;
  if (MathJax) {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}
```

这个方法是异步方法，还有一个相同功能的同步方法： `MathJax.typeset()`。
