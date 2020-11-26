const { run } = require("./utils.js");

run(
  "git -C themes/next pull --rebase || git clone https://github.com/next-theme/hexo-theme-next.git themes/next"
);
