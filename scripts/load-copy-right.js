/* global hexo */

"use strict"

hexo.extend.filter.register(
  "theme_inject",
  function(injects) {
    injects.postBodyEnd.file(
      "creative-commons",
      "source/_data/post-copyright.swig"
    )
  },
  100
)
