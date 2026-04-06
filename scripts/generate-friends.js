const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

hexo.extend.tag.register(
  'friends',
  function (args) {
    const friends = yaml.load(
      fs.readFileSync(path.join(__dirname, '../data/friends.yml'), 'utf8'),
    );
    const items = Object.entries(friends).map(([name, friend]) => ({
      name,
      href: friend.href,
      intro: friend.intro,
    }));
    const template = `<ul>
  {% for item in items -%}
    <li>
      <a class="name" href="{{item.href}}" target="_blank" rel="noopener noreferrer">{{item.name}}</a>
      <br>
      <span class="intro">{{item.intro}}</span>
    </li>
  {%- endfor %}
  </ul>`;
    return nunjucks.renderString(template, { items });
  },
  {},
);
