---
title: VSCode 亮色主题配置 Bracket-Pair-Colorizer-2
comments: true
toc: true
permalink: posts/vscode-bracket-colorizer-light-theme/
date: 2020-12-07 13:11:28
categories: VSCode
tags:
  - VSCode
---

目前使用的亮色主题（Github Light Theme - Gray）下使用 Bracket-Pair-Colorizer-2 会发现默认的金色括号太不明显。
搜索了一下 issue 发现已经有 [解决方案](https://github.com/CoenraadS/Bracket-Pair-Colorizer-2/issues/62)。

![比较](https://i.lengthm.in/posts/vscode-bracket-colorizer-light-theme/comparison.png)

<!-- more -->

Bracket-Pair-Colorizer-2 插件支持自己配置颜色，默认的颜色为：

```json
  // Scope colors
  "bracket-pair-colorizer-2.colors": [
    "Gold", // #ffd700 金色
    "Orchid", // #da70d6 粉色
    "LightSkyBlue" // #87cefa 天蓝色
  ],
```

我们可以自己更改这个列表，比如直接改成 [更鲜艳的颜色](https://github.com/CoenraadS/Bracket-Pair-Colorizer-2/issues/62#issuecomment-563248779)：

作者在这个网站上 [hexcolortool.com](https://www.hexcolortool.com/) 调了 20 分钟的色，最后终于找到了一个在白色背景下表现接近原版配色的颜色。

```json
"bracket-pair-colorizer-2.colors": [
  "#ff9900", // Orange-Brown
  "#f500f5", // Medium-Pink
  "#54b9f8" // Medium-Blue
],
```

但这么做有一个坏处，我们切换会暗色主题的时候，又得改一遍这个值。

我们可以通过修改 VSCode 的不同主题的配色值来达成这个目标。

比如我们就可以使用已有的配色值的字段：

```json
  "bracket-pair-colorizer-2.colors": [
    "terminal.ansiBrightMagenta",
    "terminal.ansiYellow",
    "terminal.ansiBrightCyan"
  ]
```

了解了原理之后，按照 issue 里给出的 [解决方案](https://github.com/CoenraadS/Bracket-Pair-Colorizer-2/issues/62#issuecomment-563248779)：

我们可以使用 `workbench.colorCustomizations` 来自定义覆盖当前使用主题配色的颜色。

```json
  "workbench.colorCustomizations": {
    "[Github Light Theme - Gray]": {
      // 针对相应主题配置不同的颜色
      "colorizer.color-1": "#ff9900", // Orange-Brown...
      "colorizer.color-2": "#f500f5", // Medium-Pink...
      "colorizer.color-3": "#54b9f8" // Medium-Blue...
    },
    // 默认配色
    "colorizer.color-1": "#ffd700", // "Gold". (Yellow with slight Orange)
    "colorizer.color-2": "#da70d6", // "Orchid". (Pink)
    "colorizer.color-3": "#87cefa" // "LightSkyBlue". (Light Blue)
  },
```

然后给 Bracket-Pair-Colorizer-2 把颜色设置上：

```json
  "bracket-pair-colorizer-2.colors": [
    "colorizer.color-1",
    "colorizer.color-2",
    "colorizer.color-3"
  ],
```

最后就是总结以及我的 Bracket-Pair-Colorizer-2 其他配置：

```json
  "workbench.colorCustomizations": {
    "[Github Light Theme - Gray]": {
      "colorizer.color-1": "#ff9900", // Orange-Brown...
      "colorizer.color-2": "#f500f5", // Medium-Pink...
      "colorizer.color-3": "#54b9f8" // Medium-Blue...
    },
    "colorizer.color-1": "#ffd700", // "Gold". (Yellow with slight Orange)
    "colorizer.color-2": "#da70d6", // "Orchid". (Pink)
    "colorizer.color-3": "#87cefa" // "LightSkyBlue". (Light Blue)
  },
  "bracket-pair-colorizer-2.colors": [
    "colorizer.color-1",
    "colorizer.color-2",
    "colorizer.color-3"
  ],
  "bracket-pair-colorizer-2.forceUniqueOpeningColor": true,
  "bracket-pair-colorizer-2.highlightActiveScope": true
```
