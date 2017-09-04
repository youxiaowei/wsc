#
# less文件编译
#
# Hardcoding vendor prefixes via CSS pre-processor mixins (Less, SCSS or whatever) is a pure anti-pattern these days and considered harmful.
# http://stackoverflow.com/questions/18558368/is-there-a-generic-way-to-add-vendor-prefixes-in-less
#
fsp = require '../libs/fs-promises'
less = require 'less'
LessPluginAutoPrefix = require('less-plugin-autoprefix')
autoprefixPlugin = new LessPluginAutoPrefix({browsers: [
  "ie >= 8"
  "ie_mob >= 10"
  "ff >= 26"
  "chrome >= 30"
  "safari >= 6"
  "opera >= 23"
  "ios >= 5"
  "android >= 2.3"
  "bb >= 10"
]})

module.exports =

  autoprefixPlugin: autoprefixPlugin

  render: (path) ->

    fsp.readFile path, encoding: 'utf-8'
    .then (content) ->
      less.render(content, {
        filename: path
        plugins: [autoprefixPlugin]
      })
