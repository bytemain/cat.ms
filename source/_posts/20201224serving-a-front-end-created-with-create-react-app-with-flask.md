---
title: 使用 Flask 加载打包后的 React 前端页面
comments: true
toc: true
permalink: posts/serving-a-front-end-created-with-create-react-app-with-flask/
date: 2020-12-24 10:56:58
categories: Flask
tags:
  - Flask
  - React
---

最近在忙一个外包，因为大屏展示页面是用 React 写的（使用 create-react-app），甲方想访问后端控制页面的网址就能直接访问这个大屏展示，而不是前后端分离部署。

自己尝试了一下，还是遇到了点问题。

create-react-app 会将打包的结果放在项目根目录中的 build 文件夹，打包后的路径结构：

```plaintext build directory structure https://stackoverflow.com/questions/44209978/serving-a-front-end-created-with-create-react-app-with-flask Source
- build
  - static
    - css
        - style.[hash].css
        - style.[hash].css.map
    - js
        - main.[hash].js
        - main.[hash].js.map
  - index.html
  - [more meta files]
```

create-react-app 打包的静态资源都放在了 `static` 路径下。比如打包后 `index.html` 中的一个链接：

```html index.html
<link href="/static/css/2.0a6fdfd6.chunk.css" rel="stylesheet" />
```

浏览器解析后，会发出一个请求 `GET /static/css/2.0a6fdfd6.chunk.css`。

如果简单的添加一个路由返回 `index.html` 文件的话，就有以下的问题出现：

因为 Flask 本身就有 `static_folder` 的概念，所有请求 `/static` 路径的请求都会从配置的 `static_folder` 中读取文件并返回。

{% mermaid graph LR %}
A(Browser) -->|GET /index.html| app(Flask app)
A(Browser) -->|GET /static/css/style.css| app(Flask app)
app --> C{endpoints}
C -->|/index.html| view[Handled by `View` Function]
C -->|/static/\*| static[Load files from `static_folder`]
{% endmermaid %}

index.html 中请求的资源都会从 `static_folder` 中拉取，那你说把打包后的文件直接放在 `static_folder` 不就好了？

因为本身 `static_folder` 中就有一些后台页面需要的静态资源，也是按类型建立了文件夹：css/js 等，如果直接把 React 打包后的资源直接复制到 `static_folder` 中，那么不同的 js 文件都混杂在一起了。React 每次重新打包生成的 js 文件都不一样的话，每次更新起来还要把原来的删除再复制过去。

<!-- more -->

## 解决方案

搜了一下解决方案，发现了 Stackoverflow 的 [讨论](https://stackoverflow.com/questions/44209978/serving-a-front-end-created-with-create-react-app-with-flask)，顺利应用，记录一下过程。

顺便一提，一般前后端分离的部署是使用 Nginx 等 Server 来返回静态资源，也方便做缓存之类的。

高票答案的解法是捕获所有路由，根据请求的路径来返回对应的文件。

他（以及群策众力）的栗子：

```python
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='react_app/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
```

就是根据请求的 `path` 来从不同的文件夹返回内容。
测试路径是否要请求一个文件 => 发送相应的文件 => 否则发送 index.html。

## 实战

根据思路，我们也要捕获所有的路径:

业务的关系，我这里使用一个 `front` 蓝图来 serve 静态网站，路径在 `app/front_api/__init__.py`。

把静态资源放在 `app/react_app` 下：

![文件夹结构](https://i.lengthm.in/posts/serving-a-front-end-created-with-create-react-app-with-flask/app_struct.png)

然后设置 `react_folder` 这个变量为静态资源的路径就好。

```py
from pathlib import Path
from flask import Blueprint, send_from_directory

front = Blueprint("front", __name__, url_prefix="/front")

react_folder = (
    Path(__file__).parent.parent / "react_app"
).absolute()

# Serve React App
@front.route("/", defaults={"path": ""})
@front.route("/<path:path>")
def serve(path):
    if path != "" and (react_folder / path).exists():
        return send_from_directory(str(react_folder), path)
    else:
        return send_from_directory(str(react_folder), "index.html")
```

### 设置前端 homepage

由于使用了蓝图的前缀功能，所以我们前端拉取静态资源的时候也得有个前缀才能访问到具体文件。

举个例子，当你访问 `http://localhost:5000/front` 的时候是获取到 `index.html`，然后 `index.html` 里面的资源地址还是 `/static/xxxx`，我们得让浏览器往 `/front/static/xxxx` 访问才能被我们的视图函数捕捉到。

我们可以在 `package.json` 中设置 `homepage` 参数来指定基本路径。
在 `package.json` 中设置即可：

```json
 "homepage": "."
```

这样 `index.html` 里面的资源地址就会被设置为 `./static/xxxx`，浏览器访问时也就会访问 `/front` + `./static/xxx` 了。

这样就会被我们的视图函数捕捉到，然后从设置的文件夹中拉取文件了。

### 设置后端 API 地址

还有一个小点要注意。
前端进行开发测试的时候也要请求后端，所以发请求的时候要注意根据不同开发环境来设置不同的 BASE_URL：

```js
let BASE_URL;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://127.0.0.1:5000';
} else {
  BASE_URL = '';
}
// 发请求时拼接链接： BASE_URL + "/front/alarm"
```

这样整个功能就实现好了。

## 优化

> 参考自：链接：<https://www.jianshu.com/p/b348926fa628>
> 作者：AricWu
> 来源：简书

我们打包后的文件需要手动移动到后端的相应文件夹里。手动移动比较麻烦的话，可以写 [npm scripts 的钩子](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html) 来自动化这件事情。

npm 脚本有 pre 和 post 两个钩子，可以在这两个钩子完成一些准备工作和清理工作。

我们为 build 加入 prebuild 和 postbuild 两个钩子。

```json
    "prebuild": "rimraf ../backend/app/react_app/*",
    "build": "cross-env GENERATE_SOURCEMAP=false craco build",
    "postbuild": "cpx -C build/** ../backend/app/react_app/",
```

打包前删除后端已有的文件，打包后把新文件复制过去。

使用了 [rimraf](https://github.com/isaacs/rimraf) 和 [cpx](https://github.com/mysticatea/cpx) 两个跨平台的 cli 工具包。

这里还有一些其他的跨平台的 cli 工具包：[
awesome-nodejs-cross-platform-cli](https://github.com/pandawing/awesome-nodejs-cross-platform-cli)

## 参考链接

- [React 创建项目并打包到 Flask 后端](https://www.jianshu.com/p/b348926fa628)
- [Serving a front end created with create-react-app with Flask](https://stackoverflow.com/questions/44209978/serving-a-front-end-created-with-create-react-app-with-flask)
- [How To Create a React + Flask Project](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project)
