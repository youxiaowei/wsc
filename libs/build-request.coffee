fs = require 'fs'
request = require 'request'

module.exports = (projectPath, options)->

  new Promise (resolve, reject) =>
    r = request.post {url: "http://puzzle.appbricks.io:4080/puzzle/api/tasks", timeout: 1000*60*10}, (err, httpResponse, body) ->
      if err then reject(err) else resolve(body)
    # predefined builder list
    builders = {
      "ios-fastbuild" : "cordova-ios-fastBuild",
      "android-fastbuild" : "cordova-android-fastbuild"
    }
    form = r.form()
    form.append "access_token", "your atom access_token!!!"
    form.append "builder", builders[options.platform]
    form.append "platform", options.platform

    form.append "bundleIdentifier", options.bundleIdentifier || "com.foreveross.chameleon"
    form.append "version", "1.0.0"
    form.append "build", "1"
    form.append "title", options.title

    form.append "scheme", "chameleon-bundled"

    form.append "content_src", "index.html"

    form.append "asset", fs.createReadStream(projectPath)
