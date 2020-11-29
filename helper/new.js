const { transformFactory } = require("./utils.js");
const execa = require("execa");

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();

let prefix = `${year}${month}${day}`;
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
let exec;
if (type !== "page") {
  if (title[0] >= "0" && title[0] <= "9") {
    prefix = prefix + "-";
  }
  let slug = `${prefix}${title}`;
  exec = execa(`yarn hexo new ${type} ${title} -s ${slug}`);
} else {
  exec = execa(`yarn hexo new page ${title}`);
}

exec.stdout.pipe(transformFactory()).pipe(process.stdout);
exec.stderr.pipe(transformFactory()).pipe(process.stderr);
