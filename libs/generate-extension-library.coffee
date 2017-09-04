fsp = require './fs-promises'
path = require 'path'
_ = require 'underscore'

Q = require 'q'

# string extension
String::startsWith ?= (s) -> @[...s.length] is s
String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s


#root
# ┣components
# ┣models
# ┗templates
#
module.exports = (root, callback) ->

  fsp.traverse_safe path.resolve(root), relative: true
  .then (all) ->

    # 将所有文件转化为require语句
    requires = _.map all, (each) ->
      each = each.replace /\\/g, "/"
      if each.endsWith('.html') or each.endsWith('.json')
        return "require('text!./#{each}');"
      else if each.endsWith('.mustache')
        return "require('hgn!./#{each.replace('.mustache', '')}');"
      else if each.endsWith('.js')
        return "require('./#{each.replace('.js', '')}')"
      else if each.endsWith('css')
        return "require('css!./#{each.replace('.css', '')}')"
      else
        return "//unknown resource: #{each}"

    # 所有的组件
    components = _.chain all
    .filter (each) ->
      each.startsWith('components/')
    .map (each) ->
      {id: each.replace('components/', '').replace('.js', '')}
    .value()

    js = """
    define(function(require) {
      #{requires.join(';\n\r')}
      return #{JSON.stringify(components)};
    });
    """

    callback(null, js)

  .catch (err) ->
    console.trace err
    callback(err)
