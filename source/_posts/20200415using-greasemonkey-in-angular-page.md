---
title: 在 Angular 网页中使用 UserScript
date: 2020-04-15 09:49:01
categories:
    - userscript
tags:
    - Web
    - tricks
comments: true
toc: true
permalink: posts/using-userscript-in-angular-page/
---

作为一个前端开发者（，偶尔会写点用户脚本[^1]增强自己的浏览体验。

对于传统服务端渲染的页面可以直接在页面上执行脚本达到自己的目的，但是对于现在的数据流驱动的前端开发框架来说，原来的那种做法行不通了，需要找到一个方式参与到页面的渲染中。

[^1]: <https://en.wikipedia.org/wiki/Userscript>

so how to hack(actually: modify) an angular page?

<!-- more -->

先说好啊，我是写 React 的，有什么出错的地方请多指正。

## 获取 Angular 实例

Google 许久，发现了下面这个 [gist](https://gist.github.com/mgol/7893061), 可以直接拿到 Angular 的实例。

<script src="https://gist.github.com/mgol/7893061.js"></script>

解释一下代码：  
因为 angular 会把自己注入到 `window.angular`，所以可以调用 `angular.element` 方法生成 Angular 对象。

按照 gist 里的提示执行代码片段。

能拿到 Angular 的实例就好办了，来调试分析网页的数据流。在 `rootScope` 上 `watch` 后，拿到对应的 `scope` 进行修改。

## 分析网页数据流

![btn-list.png](https://i.lengthm.in/posts/using-userscript-in-angular-page/btn-list.png)

平常我们是无法点击这个用户行为按钮的，因为属性里的 `disable` 被设置为了 `true`，选中这个按钮的 DOM，在控制台输入 `$scope`（你需要按 gist 中的注释现在网页中执行代码片段）查看信息。

![btn-scope-info.png](https://i.lengthm.in/posts/using-userscript-in-angular-page/btn-scope-info.png)

尝试修改 `$scope.disabled = false`，再点击该按钮，可以点击了。

![btn-can-click.png](https://i.lengthm.in/posts/using-userscript-in-angular-page/btn-can-click.png)

但是我们切换到另一页再切换回来之后，又无法点击了，究其根本就是我们没影响到最内层的数据流。

## 监听页面变化，一直修改数据

> 下面的脚本是当时参考了 StackOverflow 上的一个 Angular watch 有关的问题，但是找不到链接了，所以未能注明来源，非常抱歉。

那如何在用户脚本里拿到 Angular 对象呢？

```js
var retryCount = -1,
    maxRetry = 5,
    timeout = 1000,
    timer;
(function initScript () {
    window.clearTimeout(timer)
    if (!window.angular) {
        retryCount++;
        if (retryCount < maxRetry) {
            timer = setTimeout(initScript, timeout)
        }
        return;
    }
    setTimeout(injectScript, 1000);
})();
```

阻塞等待 angular 加载成功即可。然后执行 `injectScript` 执行我们自己的脚本。

```js
function injectScript(){
    var ngAppElem = angular.element(document.querySelector('[ng-app]') || document);
    $rootScope = ngAppElem.scope();
    $rootScope.$watch(function() {
      // do something.
    });
}
```

我们在 `rootScope` 上执行 `watch`，这样也不会因为切换页面而丢失 `watch`。

```js
function injectScript(){
    var ngAppElem = angular.element(document.querySelector('[ng-app]') || document);
    $rootScope = ngAppElem.scope();
    $rootScope.$watch(function() {
        var elem = angular.element(document.querySelector("#dashboardmainpart > div > div.EventBottomChartsContainer > div.EventDetailContainer > div > ul > li:nth-child(3)"));
        var s1 = elem.isolateScope() || elem.scope();
        if (s1) {
          s1.disabled = false;
          return s1.disabled;
        }
        return s1;
    });
}
```

然后获取我们需要的地方的 scope，直接修改即可。
每次页面修改后 `watch` 函数都会被执行。
