/* global hexo */

"use strict"

hexo.extend.filter.register(
  "theme_inject",
  function(injects) {
    injects.postBodyEnd.file(
      "creative-commons",
      "source/_data/copyright/post-copyright.njk",
      hexo.locals
    )
    injects.style.push("source/_data/copyright/post-copyright.styl")
  },
  100
)
