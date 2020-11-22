//@ts-ignore
var fs = require("fs");
const dotenv = require("dotenv");

let fileList = [
  {
    base_file: "_config_base.yml",
    target_file: "_config.yml",
  },
];

console.log(new Date().toLocaleString("zh", { hour12: false }));

fileList.map((value) => {
  const { base_file, target_file } = value;
  if (!process.env.CI) {
    dotenv.config();
  }

  var data = fs.readFileSync(base_file);
  config_data = data.toString();
  secrets_keys = [
    "_GH_TOKEN_",
    "_google_analytics_tracking_id_",
    "_disqusjs_shortname_",
    "_disqusjs_apikey_",
  ];
  for (key of secrets_keys) {
    exp = new RegExp(key, "g");
    if (process.env[key]) {
      console.log(exp);
    }
    config_data = config_data.replace(exp, process.env[key]);
  }

  fs.writeFile(target_file, config_data, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(`生成 ./${target_file} 成功`);
  });
});
