const { exec } = require('child_process');
var iconv = require('iconv-lite');
const chardet = require('chardet');
const { Transform } = require('stream');

var binaryEncoding = 'binary';

function pad(num, n = 2) {
  var len = num.toString().length;
  while (len < n) {
    num = '0' + num;
    len++;
  }
  return num;
}

const getEncoding = (data) => {
  let encoding = chardet.detect(data);
  if (encoding != 'UTF-8') {
    return 'GB18030';
  }
  return encoding;
};

const printInfo = (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: \n${error}`);
    process.exit(1);
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

const run = (command) => {
  exec(command, { encoding: binaryEncoding }, printInfo);
};

const transformFactory = () => {
  return Transform({
    transform: function (chunk, encoding, next) {
      let buf = Buffer.from(chunk, encoding);
      let bufEncoding = getEncoding(buf);
      next(null, iconv.decode(buf, bufEncoding));
    },
  });
};

module.exports = {
  printInfo,
  run,
  getEncoding,
  transformFactory,
  pad,
};
