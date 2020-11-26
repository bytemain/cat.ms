var iconv = require("iconv-lite");
const chardet = require("chardet");
const { exec } = require("child_process");
var binaryEncoding = "binary";

const getEncoding = (data) => {
  let encoding = chardet.detect(data);
  if (encoding != "UTF-8") {
    return "GB18030";
  }
  return encoding;
};

const printInfo = (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: \n${error}`);
    return;
  }
  if (stdout) {
    let buf = Buffer.from(stdout, binaryEncoding);
    let encoding = getEncoding(buf);
    console.log(`stdout: \n${iconv.decode(buf, encoding)}`);
  }
  if (stderr) {
    let buf = Buffer.from(stderr, binaryEncoding);
    let encoding = getEncoding(buf);
    console.error(`stderr: \n${iconv.decode(buf, encoding)}`);
  }
};

const run = (command, shell = "cmd.exe") => {
  exec(command, { shell, encoding: binaryEncoding }, printInfo);
};

module.exports = {
  printInfo,
  run,
};
