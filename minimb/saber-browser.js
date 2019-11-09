import './styles/minima.scss';
import 'prismjs/themes/prism.css';
import 'saber-highlight-css/default.css';

export default ({ router }) => {
  // Progress bar is not needed on server-side
  if (process.browser) {
    // These dependencies are only bundled in client build
    const nprogress = require('nprogress');
    require('nprogress/nprogress.css');

    const loaded = Object.create(null);

    router.beforeEach((to, from, next) => {
      if (!loaded[to.path]) {
        // Start progress bar before entering page
        nprogress.start();
      }
      next();
    });

    router.afterEach(to => {
      loaded[to.path] = true;
      // Stop progress bar after entering page
      nprogress.done();
    });
  }
};
