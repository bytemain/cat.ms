var path = require("path")
var fs = require("fs")
let fileList = [
  {
    base_file: "_config_base.yml",
    target_file: "_config.yml"
  }
]

fileList.map(value => {
  const { base_file, target_file } = value
  var secrets_file = path.join(__dirname, "secrets_.json")
  var secrets_json = null
  var secrets_data = fs.readFileSync(secrets_file)
  secrets_json = JSON.parse(secrets_data.toString())

  var data = fs.readFileSync(base_file)
  config_data = data.toString()
  secrets_keys = Object.keys(secrets_json)

  for (key of secrets_keys) {
    exp = new RegExp(`_${key}_`, "g")
    config_data = config_data.replace(exp, secrets_json[key])
  }

  fs.writeFile(target_file, config_data, function(err) {
    if (err) {
      return console.error(err)
    }
    console.log(`生成 ${target_file} 成功`)
  })
})
