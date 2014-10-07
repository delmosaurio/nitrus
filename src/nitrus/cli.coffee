# This module was inspired by grunt/cli
# please see https://github.com/gruntjs/grunt

'use strict';

Nitrus = require '../nitrus'
path = require 'path'
nopt = require 'nopt'

cli = module.exports = (options, done) ->
  if options
    Object.keys options
      .forEach (key) ->
        if !(key in cli.options)
          cli.options[key] = options[key]
        else if cli.options[key].type == Array
          [].push.apply cli.options[key], options[key]