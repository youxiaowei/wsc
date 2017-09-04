fs = require 'fs-extra'
gulp = require("gulp")
path = require 'path'
minify = require("gulp-minify-css")
concat = require("gulp-concat")
uglify = require("gulp-uglify")
rename = require("gulp-rename")
rjs = require('gulp-requirejs')
requirejs = require('requirejs')
del = require("del")
less = require("gulp-less")
autoprefix = require("./libs/lessc").autoprefixPlugin

bower = require('gulp-bower')
mainBowerFiles = require('main-bower-files')

Q = require 'q'
fsremove = Q.denodeify fs.remove
fscopy = Q.denodeify fs.copy
fsmkdirs = Q.denodeify fs.mkdirs

#指定项目目录
program = require 'commander'
program
  .option('-p, --project <path>', 'Path for project development.')
  .parse(process.argv)

program.project = program.project or "./xmall"
project = program.project


#清除项目css目录
gulp.task 'clean:css', (cb) ->
  del [
    "#{project}/css/"
  ], cb

#清除项目css目录
gulp.task 'clean:build', (cb) ->
  del [
    "#{project}/build/"
  ], cb

#合并项目less任务
gulp.task "build:project:less", ['clean:css'], ->
  #生成压缩文件
  gulp.src("#{project}/less/*.less")
  .pipe(less(plugins: [ autoprefix ]))
  .pipe(concat("app.css"))
  .pipe(gulp.dest("#{project}/css")) #输文件到项目目录

#css压缩模式
gulp.task "build:project:less:min", ['build:project:less'], ->
  gulp.src("#{project}/css/app.css")
  .pipe(minify())
  .pipe(rename(extname: '.min.css'))
  .pipe(gulp.dest("#{project}/css")) #输出目录

#清除项目runtime.min.css
gulp.task 'clean:runtime:css', (cb) ->
  del [
    "./static/runtime/css/runtime.min.css"
  ], cb

#压缩runtime.css任务
gulp.task "build:runtime:css", ['clean:runtime:css'], ->
  #生成压缩文件
  gulp.src("./static/runtime/css/runtime.css")
  .pipe(less(plugins: [ autoprefix ]))
  .pipe(minify())
  .pipe(rename(extname: '.min.css'))
  .pipe(gulp.dest("./static/runtime/css/")) #输出文件到runtime下的css


# 运行时requirejs构建
gulp.task 'rjs:runtime:build', ->
  config = eval fs.readFileSync("./build-runtime.js", encoding: 'utf-8')
  config.out = 'bootstrap.build.js'
  rjs config
  .pipe gulp.dest "static/runtime/js"
  return this

# 压缩js
gulp.task 'rjs:runtime:min', ['rjs:runtime:build'], ->
  config = eval fs.readFileSync("./build-runtime.js", encoding: 'utf-8')
  config.out = 'bootstrap.min.js'
  rjs config
  .pipe uglify()
  .pipe gulp.dest "static/runtime/js"


# 打包项目的extension-library.js
gulp.task 'build:project:extension', ['clean:build'],->
  gen = Q.denodeify require('./libs/generate-extension-library')
  fs_writeFile = Q.denodeify fs.writeFile
  pr = path.resolve
  project = path.resolve(program.project)
  fsremove pr(project, 'build/')
  .then ->
    # 1. 复制static/runtime/, static/vendor/到build目录
    Q.all [
      fscopy pr(process.cwd(), 'static/runtime/'), pr(project, 'build/runtime/')
      fscopy pr(process.cwd(), 'static/vendor/'), pr(project, 'build/vendor/')
    ]
  .then ->
    # 2. 复制项目的js到build目录（与上面重合）
    fscopy pr(project, 'js'), pr(project, 'build/runtime/js/')
  .then ->
    # 3. 生成build/runtime/js/extension-library.js
    console.log "生成 extension-library.js..."

    gen pr(project, 'js')
    .then (content) -> fs_writeFile pr(project, 'build/runtime/js/extension-library.js'), content
  .then ->
    # 4. 运行r.js
    console.log "运行r.js..."
    minpath = pr(project, "build/runtime/js/extension-library.build.min.js")
    buildpath = pr(project, "build/runtime/js/extension-library.build.js")
    config = eval fs.readFileSync("./build-extension.js", encoding: 'utf-8')
    config.baseUrl = pr(project, "build/runtime/js/")
    config.out = buildpath

    requirejs.optimize config, (buildResponse) ->
      exec "uglifyjs #{buildpath} -m -o #{minpath}", (err, stdout, stderr) ->
        console.log stderr
        console.log stdout
      console.log "合并完成"
    , (err) ->
      console.trace err


#Runtime模式
gulp.task 'runtime', ['rjs:runtime:min']
#应用模式
gulp.task 'application', ['build:project:less:min', 'build:project:extension','build:runtime:css']
#运行模式
gulp.task 'default', ['application']
