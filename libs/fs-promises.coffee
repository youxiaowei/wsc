Q = require 'q'
fs = require 'fs-extra'
traverse = require 'fs-tree-traverse'
# 挂到fs
fs.traverse = traverse.list

api =
  exists: (path) -> # exists 需要特殊处理，让其永远resolve, TODO 官方文档不建议使用exists方法
    new Promise (resolve, reject) ->
      fs.exists path, (exists) -> resolve(exists)

# 需要promise化的方法
denodeify_methods = [
  'readdir', 'readFile', 'traverse', 'stat', 'remove', 'copy', 'mkdirs', 'writeFile', 'outputFile', 'unlink'
  ]

# promise化
api = denodeify_methods.reduce (api, method) ->
  api[method] = Q.denodeify fs[method] # api挂载denodeify_methods方法，同时使它们变成primise规范
  return api
, api

# 安全方法，永远resolve
api = denodeify_methods.reduce (api, method) ->
  # safe规则：先查询地址是否存在，存在就执行方法，不存在就是api.method = undefined
  api["#{method}_safe"] = ->
    args = arguments
    _path = arguments[0]
    api.exists(_path).then (exists) ->
      if (exists) then api[method].apply(api, args) else undefined

  return api
, api

module.exports = api
