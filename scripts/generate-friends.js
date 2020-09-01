const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

hexo.extend.tag.register("friends", function (args) {
  const friends = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, "../data/friends.yml"), "utf8")
  );
  let array = [];
  Object.keys(friends).forEach((v) => {
    array.push({
      name: v,
      href: friends[v].href,
      intro: friends[v].intro,
    });
  });
  let template = `<ul>
  {% for item in items -%}
    <li>
      <a class="name" href="{{ item.href }}" target="_blank">{{ item.name }}</a>
      <br>
      <span class="intro">{{ item.intro }}</span>
    </li>
  {%- endfor %}
  </ul>`;
  let result = nunjucks.renderString(template, { items: array });
  return result;
});
