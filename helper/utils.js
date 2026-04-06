const iconv = require('iconv-lite');
const chardet = require('chardet');
const { Transform } = require('stream');

function pad(num, n = 2) {
  return String(num).padStart(n, '0');
}

const getEncoding = (data) => {
  const encoding = chardet.detect(data);
  if (encoding !== 'UTF-8') {
    return 'GB18030';
  }
  return encoding;
};

const transformFactory = () => {
  return Transform({
    transform: function (chunk, encoding, next) {
      const buf = Buffer.from(chunk, encoding);
      const bufEncoding = getEncoding(buf);
      next(null, iconv.decode(buf, bufEncoding));
    },
  });
};

module.exports = {
  getEncoding,
  transformFactory,
  pad,
};
