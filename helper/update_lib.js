const { exec } = require("child_process");

const printInfo = (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: \n${error}`);
    return;
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(`stderr: \n${stderr}`);
  }
};

exec(
  "git -C themes/next pull || git clone https://github.com/next-theme/hexo-theme-next.git themes/next",
  printInfo
);
