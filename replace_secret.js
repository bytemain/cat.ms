var path = require("path")
var fs = require("fs")
var base_file = "_config_base.yml"
var target_file = "_config.yml"

var secrets_file = path.join(__dirname, "secrets_.json")
var secrets_json = null
var secrets_data = fs.readFileSync(secrets_file)
secrets_json = JSON.parse(secrets_data.toString())

var data = fs.readFileSync(base_file)
config_data = data.toString()
config_data = config_data.replace(
  /_gitalk_client_id_/g,
  secrets_json["gitalk_client_id"]
)
config_data = config_data.replace(
  /_gitalk_client_secret_/g,
  secrets_json["gitalk_client_secret"]
)
config_data = config_data.replace(
  /_leancloud_app_id_/g,
  secrets_json["leancloud_app_id"]
)
config_data = config_data.replace(
  /_leancloud_app_key_/g,
  secrets_json["leancloud_app_key"]
)
config_data = config_data.replace(
  /_leancloud_counter_security_password_/g,
  secrets_json["leancloud_counter_security_password"]
)
config_data = config_data.replace(
  /_leancloud_counter_security_username_/g,
  secrets_json["leancloud_counter_security_username"]
)

fs.writeFile(target_file, config_data, function(err) {
  if (err) {
    return console.error(err)
  }
  console.log(`生成 ${target_file} 成功`)
})
