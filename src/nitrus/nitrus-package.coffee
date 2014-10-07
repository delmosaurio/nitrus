'use strict'

{EventEmitter} = require 'events'
path = require 'path'
fs = require 'fs.extra'
mkdirp = require 'mkdirp'
async = require 'async'

class NitrusPackage extends EventEmitter
  constructor: (@owner, @dir) ->

module.exports = NitrusPackage