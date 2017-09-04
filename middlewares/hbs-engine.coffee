#
# handlebars模板引擎
#
exphbs = require 'express-handlebars'
beautify = require('js-beautify').js_beautify

hbs = exphbs.create
  defaultLayout: null
  extname: '.hbs'
  helpers:
    stringify: (obj) ->
      JSON.stringify(obj)
    beautify: (obj) ->
      beautify( if typeof(obj) == "string" then obj else JSON.stringify(obj) )
    ifProduction: (options) ->
      if process.env.NODE_ENV is 'production'
        options.fn(this)
      else
        options.inverse(this)

module.exports = hbs.engine
