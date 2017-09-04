spawn = require('child_process').spawn
fs = require 'fs'
{exec} = require 'child_process'

 # zip
 # @param  {[type]}   pathDir      所需要压缩文件夹或文件的地址
 # @param  {[type]}   zipFile      压缩后的文件地址。注意，一定要以 .zip 结尾，否则在文件
 #                                 名称中包含有“.”的情况下会出错
 # @param  {Function} cb           返回压缩文件后的文件名称
 # @return {[type]}            [description]
module.exports = (pathDir, zipFile, cb)->
  new Promise (resolve, reject) ->
    if process.platform is "win32"
      commands = "#{process.cwd()}/libs/zip.exe -r #{zipFile} ./"
    else
      commands = "zip -r #{zipFile} ./"

    options =
      cwd: "#{pathDir}"
      maxBuffer: 1024*1024*10
    foreverossZip = exec commands, options, (error,stdout,stderr)=>
      if error isnt null
        reject(error)
      resolve(zipFile)
