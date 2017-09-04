Q = require 'q'
_ = require 'underscore'
express = require 'express'
path = require 'path'
fs = require 'fs'
traverse = require 'fs-tree-traverse'
fsp = require './libs/fs-promises'
lessc = require './libs/lessc'
HttpProxy = require('./middlewares/http-proxy')
mongodbRest = require('mongodb-rest/server.js')
gen = Q.denodeify require('./libs/generate-extension-library')
bodyParser = require 'body-parser'

# 获取命令行参数
program = require 'commander'
program
  .version('0.0.1')
  .option('-c, --context <context>', 'web app context')
  .option('-p, --project <path>', 'Path for project development.')
  .option('-k, --appkey <key>', 'App Key')
  .option('-o, --override <override>', 'allow project resource override server resource')
  .parse(process.argv)

#program.project = program.project or "./static-starter"
program.project = program.project or "./xmall"
context = program.context || ''

console.log "project path: #{program.project} "
console.log "env: #{process.env.NODE_ENV}"

String::startsWith ?= (s) -> @[...s.length] is s
String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s


# 创建Express应用
app = express()
app.engine 'hbs', require('./middlewares/hbs-engine')
app.set 'view engine', 'hbs'
# unify the process of reading app.js
app_config_file = path.resolve program.project, "app.js" if program.project
if fs.existsSync app_config_file
  app_config = fs.readFileSync app_config_file, encoding: "utf-8"
  app_config = app_config.slice app_config.indexOf '{'
  eval("app_obj = " + app_config) #use eval instead of JSON.parse
  #console.log(project_config)
  app.use bodyParser.json() # for parsing application/json
  app.use bodyParser.urlencoded({ extended: true }) # for parsing application/x-www-form-urlencoded
  console.log "use proxy with setting:#{JSON.stringify(app_obj.proxy)}"
  app.use HttpProxy app_obj.proxy if app_obj.proxy
  #default to development mode
  app_obj.mode = 'development' unless app_obj.mode
  app_obj.is_development = (app_obj.mode == 'development')
  app_obj.is_debug = (app_obj.mode == 'debug')
  app_obj.is_production = (app_obj.mode == 'production')

  # build page
  (require('./middlewares/app-builder'))(app, '/build/', program.project, app_obj)
  (require('./middlewares/app-clean'))(app, '/clean/', program.project, app_obj)


app.get "/", (req, res) ->
  res.redirect '/index.html'

# 应用手机运行时
# eg：/apps/:app_id/index.html
# eg：/index.html （-p {path} 方式启动）
app.get "/:page_id.html", (req, res) ->
  fsp.readdir_safe path.resolve(program.project, "less")
  .then (styles) ->
    # styles是less目录下的文件名列表
    # 先过滤出less文件
    # 再将后缀转为css，让其匹配后台less即时编译路由
    styles = _.chain(styles).filter (file)->
      !file.startsWith('_') and file.endsWith('.less') # _开头的不加载
    .map (style) ->
      style.replace('.less', '.css')
    .value()

    res.render 'runtime/runtime', {
      styles: styles
      app: app_obj
    }
  .catch (err) ->
    console.trace err
    res.status 500


# 对应runtime.hbs的app.js
app.get "/app.js", (req, res) ->
  fsp.readFile path.resolve(program.project, 'app.js'), 'utf-8'
  .then (app_js) ->
    res.set('Content-Type', 'application/javascript').send app_js
  .catch (err) ->
    res.status(404).json({message: "app.js not found."})

# 支持及时编译less接口，浏览器依旧请求css，接口负责即时编译
app.get "/css/:name.css", (req, res) ->
  if app_obj.is_development
    # less编译
    # http://stackoverflow.com/questions/27501958/less-render-is-not-working-in-nodejs-with-multiple-import-files-which-are-in-dif
    less_file = path.resolve(program.project, "less", "#{req.params.name}.less")
    fsp.stat less_file
    .then ->
      console.log "lessc: #{less_file}" # 编译less
      lessc.render less_file
      .then (output) -> res.set('Content-Type', 'text/css').send(output.css)
      .catch (err) -> res.status(500).send err.toString()
    .catch (err) ->
      console.trace err
      # less文件不存在，跳过
      console.log "less file: #{req.params.name} not found, pass"
      res.status(404).end()
  else
    fsp.readFile path.resolve(program.project, 'css', 'app.min.css'), 'utf-8'
    .then (app_css) ->
      res.set('Content-Type', 'text/css').send app_css
    .catch (err) ->
      res.status(404).json({message: "app.min.css not found."})


# 页面配置
app.get '/runtime/js/pages/:name([^\s]*).json', (req, res) ->

  console.log "query page config: #{req.params.name}"
  Q.all [
    fsp.readFile path.resolve(program.project, 'js', 'pages', "#{req.params.name}.json"), encoding: "utf-8"
    fsp.exists path.resolve(program.project, 'js', 'pages', "#{req.params.name}.js")
    fsp.exists path.resolve(program.project, 'js', 'pages', "#{req.params.name}.css")
    fsp.exists path.resolve(program.project, 'js', 'pages', "#{req.params.name}.html")
  ]
  .spread (page_obj, js_exists, css_exists, template_exists) ->
    page_obj = JSON.parse(page_obj)
    # if page_obj
    page_obj.type = req.params.name if !page_obj.type and js_exists
    page_obj.css = "#{req.params.name}.css" if css_exists
    page_obj.template = "#{req.params.name}.html" if template_exists
    res.status(200).json(page_obj)
    # else
      # res.status(404).json({message: 'page not found'})
  .catch (err) ->
    cosole.trace err
    res.status(500).json({message: "err"})

# 拦截extension-library：默认library.js把extension-library通过requirejs#require进来的行为
# 此行为是为了把用户自定义的js通过extension-library.js的内容require进来
app.get "/runtime/js/extension-library.js", (req, res, next) ->
  #如果是开发模式，直接require方式加载
  #否则用gulp后的文件加载
  if app_obj.is_development
    console.log "intercept extension-library.js"
    # return next() unless program.project
    gen = Q.denodeify require('./libs/generate-extension-library')
    # 提供以runtime-server启动的项目地址 || 提供某个app在sandbox绝对路径入口地址
    gen path.resolve(program.project, 'js')
    .then (content) ->
      res.set('Content-Type', 'application/javascript').send content
    .catch (err) -> throw err
  else
    fsp.readFile path.resolve(program.project, "build", "runtime", 'js', 'extension-library.build.js'), 'utf-8'
    .then (app_js) ->
      res.set('Content-Type', 'application/javascript').send app_js
    .catch (err) ->
      res.status(404).json({message: "extension-components.js not found."})


###
# 静态资源
###
app.use "/images", express.static "#{program.project}/images"
app.use "/css", express.static "#{program.project}/css"
app.use "/fonts", express.static "#{program.project}/fonts"
app.use "/runtime/js", express.static "#{program.project}/js"

# 框架自身
app.use "/runtime", express.static path.resolve(".", "static", "runtime")
app.use "/vendor", express.static path.resolve(".", "static", "vendor")

# 启动
  # start mongo rest server
mongo_config_file = path.resolve program.project, "config.json" if program.project
if app_obj.proxy && fs.existsSync mongo_config_file
  mongo_config_file = fs.readFileSync mongo_config_file, encoding: "utf-8"
  mongoConfig = JSON.parse(mongo_config_file)
  mongodbRest.startServer(mongoConfig)
app.listen process.env.PORT || 3000
console.log "ctx: #{context}, Listen on port #{process.env.PORT || 3000}"
