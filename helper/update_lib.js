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
  "git -C themes/next pull || git clone https://github.com/theme-next/hexo-theme-next.git themes/next",
  printInfo
);
exec(
  "git -C themes/next/source/lib/pace pull || git clone https://github.com/theme-next/theme-next-pace.git themes/next/source/lib/pace",
  printInfo
);
exec(
  "git -C themes/next/source/lib/pjax pull || git clone https://github.com/theme-next/theme-next-pjax themes/next/source/lib/pjax",
  printInfo
);
