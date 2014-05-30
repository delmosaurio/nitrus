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
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , NitrusFiles = require('./nitrus/nitrus-fs.js')
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

  ops = ops || {};

  self.version = require('../package.json').version;

  self.PATH = dir;
  self.CONF_PATH = path.join(self.PATH, ".nitrus");
  self.NITRUS_MODULES = path.join(self.PATH, "nitrus_modules");

  self.default_engine = ops.default_engine || 'ejs';

  // instance actors
  self.fs = new NitrusFiles(self.CONF_PATH);
  
  return self;
};

sys.inherits(Nitrus, events.EventEmitter);

/**
 * 
 * Initialize a new project
 *
 * events: [ 'init' ]
 *
 * @param {Object} ops
 */
Nitrus.prototype.init = function(ops) {
  var self = this

  ops = ops || {};

  var has = fs.existsSync(self.CONF_PATH);

  try {

    if (!has){
      mkdirp.sync(self.CONF_PATH);
    }

    self.fs.init(true);

    self.emit('init', { path: self.CONF_PATH, created: !has });
  }
  catch (err){
    self.emit('error', err);
  }

  return self;
};