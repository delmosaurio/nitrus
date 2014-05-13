/*!
 * Nitrus
 *
 * Copyright (c) 2013-2014 Delmo Carrozzo <dcardev@gmail.com>
 * MIT License
 */
 'use strict';

var sys = require('sys')
  , events = require('events')
  , path = require('path')
  ;

/**
 * 
 * Initialize a new instance of Nitrus for `dir` with `ops`.
 *
 * @param {String} dir working directory
 * @param {Object} ops
 */
var Nitrus = module.exports = function(dir, ops) {
  var self = this;

  if(false === (self instanceof Nitrus)) {
      return new Nitrus();
  }

  self.version = require('../package.json').version;

  self.PATH = dir;
  self.NITRUS_PATH = path.join(self.PATH, ".nitrus");
  
  return self;
};