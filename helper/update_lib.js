const { transformFactory } = require("./utils.js");
const execa = require("execa");
const exec = execa(
  "git -C themes/next pull --rebase || git clone https://github.com/next-theme/hexo-theme-next.git themes/next",
  { shell: true }
);

exec.stdout.pipe(transformFactory()).pipe(process.stdout);
exec.stderr.pipe(transformFactory()).pipe(process.stderr);
