#!/usr/bin/env coffee
#the first step is to scan the components directory and read the file line by line
# a temp markdown doc is genereated for each components
# call md2html.js to generate html document
traverse = require 'fs-tree-traverse'
fs = require 'fs'
path = require 'path'

targetdir = __dirname + "/static/runtime/js/components"
docsdir = __dirname + "/docs/components"
console.log "process components doc at #{targetdir}"
if !fs.existsSync docsdir
  fs.mkdir(docsdir)

String::startsWith ?= (s) -> @[...s.length] is s
String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s

traverse.list targetdir, (err, files) ->
  for f in files
    gendoc(f)

gendoc = (component) ->
  console.log "processing #{component}"
  # read file line by line
  content = fs.readFileSync(component, "utf-8")
  # split file in lines
  lines = content.split('\n')
  if lines.length > 0
    #create a markdown file for each component
    docfilename = path.basename(component)[...-3] + '.md'
    docfile = path.join(docsdir, docfilename)
    fsock = fs.openSync docfile, 'w'
    for line in lines
      if line.startsWith '//'
        startPos = if line.length < 3 then 2 else 3 # a blank line
        fs.writeSync fsock, "#{line[startPos...]}\n", (err, written, str)->
          console.log err
    fs.close fsock, (err) ->
      console.log err
