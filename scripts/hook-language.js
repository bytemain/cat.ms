/* global hexo */

"use strict"

hexo.extend.filter.register(
  "before_generate",
  function() {
    var lang = hexo.theme.i18n.data
    var zh = lang["zh-CN"]

    zh["footer.powered"] = "Powered by %s"
    zh["footer.theme"] = "Theme"
    zh["state.posts"] = "博客"
  },
  100
)
