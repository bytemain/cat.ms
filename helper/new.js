const { run } = require("./utils.js");

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();

const prefix = `${year}${month}${day}`;
const args = process.argv.slice(2);

let type = "post";
let title = args[0];
if (args.length !== 1) {
  type = args[0];
  title = args[1];
}

if (type === "d") {
  type = "draft";
}
if (type === "p") {
  type = "page";
}

const typeArray = ["post", "page", "draft"];

if (!typeArray.includes(type)) {
  console.error(`${type} is not valid type.`);
  process.exit(1);
}

console.log(`type:`, type);
console.log(`title:`, title);

if (type !== "page") {
  let slug = `${prefix}${title}`;
  run(`yarn hexo new ${type} ${title} -s ${slug}`);
} else {
  run(`yarn hexo new page ${title}`);
}
