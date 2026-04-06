const nunjucks = require('nunjucks');

hexo.extend.tag.register(
  'pinyin',
  function (args, content) {
    const pinyinArray = [];

    const regex =
      /.*?([\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}])(\[(\w+?)\])/guy;

    content.split('\n').forEach((line) => {
      let lineCopy = line;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const chinese = match[1];
        const pinyinWithBrackets = match[2];
        const pinyin = match[3];

        const template = `&nbsp;<ruby>{{ chinese }}<rt>{{ pinyin }}</rt></ruby>&nbsp;`;
        const result = nunjucks.renderString(template, { chinese, pinyin });
        lineCopy = lineCopy.replace(`${chinese}${pinyinWithBrackets}`, result);
      }
      pinyinArray.push(lineCopy);
    });

    return pinyinArray.join('\n');
  },
  { ends: true },
);
