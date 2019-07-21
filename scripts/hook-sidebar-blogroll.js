/* global hexo */

"use strict"

hexo.extend.filter.register("theme_inject", function(injects) {
  injects.sidebar.file("blog-roll", "source/_data/blog-roll.swig", {})
})
