'use strict'

{EventEmitter} = require 'events'
path = require 'path'
fs = require 'fs'
mkdirp = require 'mkdirp'
async = require 'async'
log = require './nitrus/nitrus-log.js'
NitrusFiles = require './nitrus/nitrus-fs.js'
NitrusBuilder = require './nitrus/nitrus-builder.js'

# allow require() coffee files
require 'coffee-script/register'

class Nitrus extends EventEmitter
  constructor: (dir) ->
    @PATH           = dir
    @CONF_PATH      = path.join @PATH, ".nitrus"
    @NITRUS_MODULES = path.join @PATH, "nitrus_modules"
    @fs             = new NitrusFiles @CONF_PATH
    @log            = log
    @builder        = new NitrusBuilder @
  init: (ops) ->
    ops ?= {}
    cofe = ops.coffee is yes or false
    nsf = 'nsfile.js'
    nsf = 'nsfile.coffee' if ops.coffee is yes
    async.waterfall [
        (cb) =>
          async.each [@CONF_PATH, @NITRUS_MODULES], mkdirp, (er) =>
            return cb er if er
            cb null
        (cb) =>
          try
            @fs.init true
            cb null
          catch er
            cb er
        (cb) =>
          hasConfig @PATH, (er, has) =>
            return cb er if er
            return cb null if has
            tmpl = getTempl nsf
            fs.writeFile path.join(@PATH, tmpl.filename), tmpl.content, (er) =>
              return cb er if er
              cb null
      ],
      (err) =>
        return @emit 'error', err if err
        @emit 'init', { path: @CONF_PATH, created: fs.existsSync @CONF_PATH }
    @
  initConfig: (ops) ->
    return no if !ops
    
    return no if !ops.model

    @model = ops.model

    yes
  load: ->
    getConfigFilename @PATH, (err, filename) =>
      return @emit 'error', err if err
      return @emit 'error', new Error 'Not configuration file' if !filename
      @emit 'ready' if require("#{@PATH}/#{filename}")(@)
    @
  install: ->
    throw new Error 'install Not implemented yet!'
  add: ->
    throw new Error 'add Not implemented yet!'
  build: (ops)->
    @builder.build ops
    @
  watch: ->
    throw new Error 'watch Not implemented yet!'

  nsfilejs = () ->
    content: "module.exports = function(nitrus) {\n" +
             "  nitrus.initConfig(\n" +
             "    model: {}\n" +
             "  );\n" +
             "}\n"
    filename: 'Nitrusfile.js'
  nsfilecoffee = () ->
    content: "module.exports = (nitrus) ->\n" +
             "  nitrus.initConfig\n" +
             "    model: {}\n" +
             "  \n"
    filename: 'Nitrusfile.coffee'
  getTempl = (name) ->
    switch name
      when "nsfile.js" then return nsfilejs()
      when "nsfile.coffee" then return nsfilecoffee()
  hasConfig = (dir, fn) ->
    fs.readdir dir, (er, files) ->
      return fn er if er
      for file in files
        return fn null, yes if (/(nitrusfile.js|nitrusfile.coffee)/i).test(file)
      fn null, no
  getConfigFilename = (dir, fn) ->
    fs.readdir dir, (er, files) ->
      return fn er if er
      for file in files
        return fn null, file if (/(nitrusfile.js|nitrusfile.coffee)/i).test(file)
      fn null

module.exports = Nitrus