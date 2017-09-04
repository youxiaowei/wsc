#!/usr/bin/env coffee
#the first step is to scan the components directory and read the file line by line
# a temp markdown doc is genereated for each components
# call md2html.js to generate html document
fs = require 'fs'
_ = require 'underscore'
bodyParser = require 'body-parser'

compdir = "./xmall/js/components"
pagedir = "./xmall/js/pages"
tempdir = "./xmall/js/templates"

less = []
comp = []
template = []
# console.log " prepare clean project ..."


applyfile = (obj) ->
  obj.type && comp.push(obj.type + ".js")
  obj.template && template.push(obj.template)
  if obj.components
    for component in obj.components
      applyfile(component)

module.exports = (app, prefix, workdir, app_obj) ->

  app.use bodyParser.json() # for parsing application/json
  app.use bodyParser.urlencoded({ extended: true }) # for parsing application/x-www-form-urlencoded

  app.get prefix, (req, res) ->
    #render the build page
    res.render 'clean'

  app.post prefix, (req,res)->

    fs.readdir pagedir, (err, files) ->
      if err
        res.status(500).send(err)
      else
        # read json file
        pageTemps = []
        diffTemps = []
        diffComp = []
        files.forEach (file) ->
          if file.indexOf(".json") != -1
            f = pagedir + "/" + file
            JsonObj = JSON.parse(fs.readFileSync(f));
            applyfile(JsonObj)
          else if file.indexOf(".html") != -1
            pageTemps.push(file)
        # check pages' template file useless
        for pt in pageTemps
          if(template.indexOf(pt) == -1)
            diffTemps.push(pt)
        fs.readdir compdir, (error,comps) ->
          if error
            res.status(500).send(error)
          else
            # check components' file useless
            comps.forEach (file) ->
              if comp.indexOf(file) == -1
                diffComp.push(file)
        fs.readdir tempdir, (error,temps) ->
          if error
            res.status(500).send(error)
          else
            # check templates' file useless
            temps.forEach (temp) ->
              if template.indexOf(temp) == -1
                diffTemps.push(temp)
          data = {}
          data.components = diffComp
          data.templates = diffTemps
          res.status(200).send(data)
