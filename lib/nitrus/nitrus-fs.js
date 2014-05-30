/*!
 * This file is part of Nitrus.
 *
 * please see the LICENSE
 */

'use strict';

var sys = require('sys')
  , extend = require('extend')
  , FileGateway = require('file-gateway')
  ;

/**
 * 
 * Initialize a new customized FileGateway instance for `dir` with `conf`.
 *
 * @param {String} dir working directory
 * @param {Object} conf
 */
var NitrusFiles = module.exports = function(dir, conf) {
  var self = this;

  if(false === (self instanceof NitrusFiles)) {
      return new NitrusFiles();
  }

  self.conf = extend(true, {
    process: true,
    cache: {
      expire: ((1000 * 60) * 10 ),
      length: 30
    },
    extend: true,
    encoding: 'utf-8',
    saveOnSet: true
  }, conf)
  
  // inherits
  FileGateway.call(self, dir, self.conf);

  self.configure();

  return self;
}

sys.inherits(NitrusFiles, FileGateway);

/**
 * 
 * Configure nitrus files and directories
 *
 */
NitrusFiles.prototype.configure = function() {
  var self = this;

  // set files
  self.add([
    { 
      key: "config-file",
      mode: "dynamic", type: "file", name: "CONFIG", json: true,
      defaults: { name: self.reponame }
    },
    { key: "cache-folder", mode: "cache", type: "folder", name: "cache" },
    { key: "tmp-folder", mode: "temp", type: "folder", name: "tmp" }
  ]);

  return self;
};