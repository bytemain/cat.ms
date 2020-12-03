const nunjucks = require("nunjucks");

hexo.extend.tag.register(
  "pinyin",
  function (args, content) {
    const pinyin_array = [];

    const regex = /.*?([\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}])(\[(\w+?)\])/guy;

    content.split("\n").forEach((line) => {
      let lineCopy = line;
      while ((array = regex.exec(line)) !== null) {
        const chinese = array[1];
        const pinyinWithBrackets = array[2];
        const pinyin = array[3];

        let template = `&nbsp;<ruby>{{ chinese }}<rt>{{ pinyin }}</rt></ruby>&nbsp;`;
        let result = nunjucks.renderString(template, { chinese, pinyin });
        lineCopy = lineCopy.replace(`${chinese}${pinyinWithBrackets}`, result);
      }
      pinyin_array.push(lineCopy);
    });

    return pinyin_array.join("\n");
  },
  { ends: true }
);
