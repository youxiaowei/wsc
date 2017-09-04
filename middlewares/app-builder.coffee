# build the package
os = require 'os'
fs = require 'fs-extra'
fsp = require '../libs/fs-promises'
path = require 'path'
pr = path.resolve
Handlebars = require 'handlebars'
_ = require 'underscore'
build = require '../libs/build-request'
request = require 'request'
zip = require '../libs/zip'
Q = require 'q'
bodyParser = require 'body-parser'

requestp = Q.denodeify(request)
#create a json parser
#jsonParser ＝ bodyParser.json()
# 文件夹合并复制
fs_merge_promise = (src, dest, exclude) ->
  fsp.traverse_safe src, relative: true
  .then (all) ->
    all_promises = _.map all, (each) ->
      if (exclude && (new RegExp("#{exclude}$")).test(each.toLowerCase()))
        return ;
      fsp.copy path.resolve(src, each), path.resolve(dest, each)
    Q.all all_promises

curl_promise = (url, dest) ->
  requestp(url)
  .then (args) -> body = args[1]
  .then (body) ->
    fsp.outputFile dest, body


module.exports = (app, prefix, workdir, app_obj) ->

  app.get prefix, (req, res) ->
    #render the build page
    res.render 'build'

  app.post prefix, (req, res, next) ->

    # check parameter
    if !req.body.title || !req.body.platform
      res.render 'build', { msg: 'not enought parameters' }
      return
    # 应用沙箱
    sandbox_path = path.resolve workdir if workdir

    # 服务器URL
    serverUrl = "#{req.protocol}://#{req.hostname}:#{process.env.PORT || 3000}"
    # 应用URL
    baseUrl = "#{serverUrl}" # for this app, serverUrl is the base URL
    console.log "app #{baseUrl}"


    res.setTimeout 1000*60*6 # express默认2min
    # 1 生成临时目录
    tempProject = path.resolve os.tmpdir(), "app"
    # tempProject 压缩后保存的位置
    tempZipProject = "#{tempProject}.zip"

    # es6特性
    promise = new Promise (resolve, reject) ->
      resolve()
    .then ->
      console.log "清理临时目录：#{tempProject}"
      console.log "清理临时zip：#{tempZipProject}"
      Q.all [
        fsp.remove tempProject
        fsp.remove tempZipProject
      ]
      .then ->
        console.log "重新生成临时目录：#{tempProject}"
        fsp.mkdirs tempProject
      .then ->
        # 3 复制static/runtime和static/vendor目录
        if req.body.mode == 'production'
          console.log "生产模式，仅复制压缩后的文件"
          prod_res = ['css/runtime.min.css', 'js/require.min.js',
           'js/bootstrap.min.js', 'js/extension-library.js']
          prod_vendor = ['require-css/css.min.js', 'requirejs-text/text.js',
          'slick.js/slick/slick-theme.css', 'slick.js/slick/slick.css', 'flexi-layout/flexi.js']

          # 复制runtime
          ps = _.chain(prod_res).map (each) ->
                  fsp.copy path.resolve('.', "static/runtime/#{each}"), "#{tempProject}/runtime/#{each}"
                .value()
          # 复制插件
          tmp = _.chain(prod_vendor).map (each) ->
                  fsp.copy path.resolve('.', "static/vendor/#{each}"), "#{tempProject}/vendor/#{each}"
                .value()
          ps = ps.concat tmp
          # insert a promise for create dirs
          ps.unshift fsp.mkdirs "#{tempProject}/runtime"
          ps.unshift fsp.mkdirs "#{tempProject}/vendor"
          Q.all [
            ps
            fsp.copy path.resolve('.', 'static/runtime/fonts'), "#{tempProject}/runtime/fonts"
          ]
        else
          console.log "复制runtime，vendor目录"
          Q.all [
            fsp.copy path.resolve('.', 'static/runtime'), "#{tempProject}/runtime"
            fsp.copy path.resolve('.', 'static/vendor'), "#{tempProject}/vendor"
          ]
      .then ->
        # 2 复制project下所有文件到临时目录
        console.log "复制project下所有文件到临时目录"
        Q.all [
          fs_merge_promise pr(sandbox_path, 'js'), pr(tempProject, 'runtime', 'js'),"json"
          fs_merge_promise pr(sandbox_path, 'images'), pr(tempProject, 'images')
          fs_merge_promise pr(sandbox_path, 'fonts'), pr(tempProject, 'fonts')
        ]
        # request each json file from server and replace local ones
        fsp.traverse_safe pr(sandbox_path, 'js', 'pages'), relative: true
        .then (pages) ->
          _.chain(pages).filter (file) ->
            !file.startsWith('_') and file.endsWith('.json')
          .value()
        .then (page_names) ->
          console.log page_names
          json_promises = _.map page_names, (each) ->
            curl_promise("#{baseUrl}/runtime/js/pages/#{each}", "#{tempProject}/runtime/js/pages/#{each}")
          Q.all json_promises
      .then ->
        # 编译less
        console.log "编译less"
        if req.body.mode == 'production'
          # 直接获取自定义样式压缩文件
          curl_promise("#{baseUrl}/css/app.min.css", "#{tempProject}/css/app.min.css")
        else
          fsp.traverse_safe pr(sandbox_path, 'less'), relative: true
          .then (styles) ->
            _.chain(styles).filter (file) ->
              !file.startsWith('_') and file.endsWith('.less')
            .map (style) ->
              style.replace('.less', '.css')
            .value()
          .then (css_names) ->
            css_promises = _.map css_names, (each) ->
              curl_promise("#{baseUrl}/css/#{each}", "#{tempProject}/css/#{each}")
            Q.all css_promises
      .then ->
        # 生成index.html
        # 生成app.js
        # 覆盖默认extension-library.js
        console.log "生成index.html, app.js"
        Q.all [
          # 每个页面ID都生成一个html，与index.html一模一样...
          curl_promise("#{baseUrl}/index.html", "#{tempProject}/index.html")
          .then ->
            #pages have to retrieve from js/pages dir!!
            fsp.traverse_safe pr(sandbox_path, 'js', 'pages'), relative: true
            .then (pages) ->
              ps = _.chain(pages).filter (file) ->
                file.endsWith('.json')
              .map (each) ->
                each = each.replace('.json', '')
                fsp.copy "#{tempProject}/index.html", "#{tempProject}/#{each}.html" unless each == 'index'
              .value()
              # do all
              Q.all ps
          curl_promise("#{baseUrl}/app.js", "#{tempProject}/app.js")
          curl_promise("#{baseUrl}/runtime/js/extension-library.js", "#{tempProject}/runtime/js/extension-library.js")
        ]
      .then -> # 8 压缩文件
        console.log "开始压缩轻应用app"
        zip(tempProject, tempZipProject)
      .then -> # 9 快速编译
        if req.body.platform == 'zip'
          console.log "start downloading zip"
          stream = fs.readFileSync tempZipProject
          res.set('Content-Type', 'application/octet-stream')
          .set('Content-Disposition', "attachment; filename=\"#{req.body.title}.zip\"")
          .status(200).send(stream)
        else
          console.log "连接puzzle在线打包..."
          build(tempZipProject, {title: req.body.title, platform: req.body.platform})
      .then (job)->
        new Promise (resolve, reject) ->
          if req.body.platform != 'zip'
            res.status(200).send(job) # TODO 可根据job来轮询或者用socket.io
          resolve()
      # .then ->
      #   console.log "清理临时目录：#{tempProject}"
      #   fsp.remove tempProject
      # .then ->
      #   console.log "清理临时zip：#{tempZipProject}"
      #   fsp.remove tempZipProject]
    .catch (err) ->
      next(err)
