'use strict'

{EventEmitter} = require 'events'
path = require 'path'
fs = require 'fs.extra'
mkdirp = require 'mkdirp'
async = require 'async'
NitrusPackage = require './nitrus-package.js'

class NitrusBuilder extends EventEmitter
  constructor: (@owner) ->
    @packages = []
  build: (ops) ->
    @discover @owner.NITRUS_MODULES, (err) =>
      return @emit 'error', err if err
      @emit 'discover', @packages
  discover: (dir, fn)->
    walker = fs.walk dir
    walker.on "directories", (root, stats, next) =>
      for stat in stats
        @packages.push new NitrusPackage @, path.join dir, stat.name
      fn null

module.exports = NitrusBuilder