http = require 'http'
url = require 'url'
_ = require 'underscore'
queryString = require 'querystring'

module.exports = (options) ->

  return (req, res, next) ->
    # 查找符合规则的代理配置
    k = _.chain(options).keys().find (k) ->
      req.url.match new RegExp(k)
    .value()
    unless k
      next()
    else
      server_config = options[k]
      #get the right url from routing
      if k != req.url
        # find in the route's definition
        if k.indexOf('*') > 0
          regex = new RegExp(k.replace('*', '(.+)'));
          path = regex.exec(req.url);
          server_config = server_config.replace('*', path.splice(1)) if path
      console.log "proxy #{req.url} to remote service #{server_config}"
      req_opt = url.parse server_config
      # TODO handle error event to avoid exit with error because of wrong proxy
      # console.log "#{JSON.stringify(req_opt)}"
      req_headers = req.headers
      req_headers.host = req_opt.hostname
      req_options = {
        hostname: req_opt.hostname
        port: req_opt.port
        path: req_opt.path
        method: req.method
        headers: req_headers
      }
      request = http.request req_options
      , (response) ->
        res.writeHead response.statusCode, response.headers
        response.pipe(res)
        response.on 'data', (data) ->
          console.log "代理转发[服务器]响应: #{response.statusCode}, #{data.toString()}"

        response.on 'error', (e) ->
          console.log 'problem with response: ' + e.message
      #catch exception
      request.on 'error', (e) ->
        console.log "error happend when write to the background server, #{e}"
        res.status(500).send(e)
      body_param = JSON.stringify(req.body)
      # body_param = queryString.stringify(body_param)
      request.write(body_param + "\n")
      request.end()
      req.on 'error', (e) ->
        console.log 'problem with request: ' + e.message
      req.on 'end', ->
        request.end()
