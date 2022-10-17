/* global hexo */

'use strict';
const yaml = require('js-yaml');

const deps = yaml.load(`
anime:
  name: animejs
  version: 3.2.1
  file: lib/anime.min.js
  integrity: sha256-XL2inqUJaslATFnHdJOi9GfQ60on8Wx1C2H8DYiN1xY=
  cdnUrl: https://cdn.staticfile.org/animejs/3.2.1/anime.min.js
fontawesome:
  name: '@fortawesome/fontawesome-free'
  version: 6.2.0
  file: css/all.min.css
  alias: font-awesome
  integrity: sha256-AbA177XfpSnFEvgpYu1jMygiLabzPCJCRIBtR5jGc0k=
  cdnUrl: https://cdn.staticfile.org/font-awesome/6.2.0/css/all.min.css
prism:
  name: prismjs
  version: 1.29.0
  file: components/prism-core.min.js
  alias: prism
  integrity: sha256-4mJNT2bMXxcc1GCJaxBmMPdmah5ji0Ldnd79DKd1hoM=
  cdnUrl: https://cdn.staticfile.org/prism/1.29.0/components/prism-core.min.js
mathjax:
  name: mathjax
  version: 3.2.2
  file: es5/tex-mml-chtml.js
  integrity: sha256-MASABpB4tYktI2Oitl4t+78w/lyA+D7b/s9GEP0JOGI=
  cdnUrl: https://cdn.staticfile.org/mathjax/3.2.2/es5/tex-mml-chtml.min.js
mediumzoom:
  name: medium-zoom
  version: 1.0.6
  file: dist/medium-zoom.min.js
  integrity: sha256-EdPgYcPk/IIrw7FYeuJQexva49pVRZNmt3LculEr7zM=
  cdnUrl: https://cdn.staticfile.org/medium-zoom/1.0.6/medium-zoom.min.js
lazyload:
  name: lozad
  version: 1.16.0
  file: dist/lozad.min.js
  alias: lozad.js
  integrity: sha256-mOFREFhqmHeQbXpK2lp4nA3qooVgACfh88fpJftLBbc=
  cdnUrl: https://cdn.staticfile.org/lozad.js/1.16.0/lozad.min.js
quicklink:
  name: quicklink
  version: 2.3.0
  file: dist/quicklink.umd.js
  integrity: sha256-yvJQOINiH9fWemHn0vCA5lsHWJaHs6/ZmO+1Ft04SvM=
  cdnUrl: https://cdn.staticfile.org/quicklink/2.3.0/quicklink.umd.min.js
disqusjs_js:
  name: disqusjs
  version: 3.0.2
  file: dist/browser/disqusjs.es2015.umd.min.js
  integrity: sha256-okP99ZQKVpIy7+NogAMpGlIQzJa9XKXhIJcFgdju5bU=
  cdnUrl: https://cdn.staticfile.org/disqusjs/3.0.2/disqusjs.es2015.umd.min.js
disqusjs_css:
  name: disqusjs
  version: 3.0.2
  file: dist/browser/styles/disqusjs.css
  integrity: sha256-71XarXwNr1Td27HmZI9zjY+rMzRdush6/glo6VFXp7o=
  cdnUrl: https://cdn.staticfile.org/disqusjs/3.0.2/styles/disqusjs.min.css
mermaid:
  name: mermaid
  version: 9.1.7
  file: dist/mermaid.min.js
  integrity: sha256-G58AID1YoX5YaEtWfXSI0VLrZ6N4kvNvwg0BI8zUFxE=
  cdnUrl: https://cdn.staticfile.org/mermaid/9.1.7/mermaid.min.js
`);

// hexo.extend.filter.register('template_locals', function (locals) {
//   const themeConfig = locals.theme;
//   const vendors = themeConfig['vendors'];
//   Object.entries(deps).forEach(([k, v]) => {
//     vendors[k] = {
//       url: v.cdnUrl,
//     };
//   });
//   return locals;
// });
