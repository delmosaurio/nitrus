'use strict'

chai = require 'chai'
expect = chai.expect
Nitrus = require '../lib/nitrus.js'
fs = require 'fs'
mkdirp = require 'mkdirp'

describe 'Nitrus', () ->
  if !fs.existsSync "#{__dirname}/cases"
    mkdirp.sync "#{__dirname}/cases"