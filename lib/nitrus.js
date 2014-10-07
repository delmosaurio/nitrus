(function() {
  'use strict';
  var EventEmitter, Nitrus, NitrusBuilder, NitrusFiles, async, fs, log, mkdirp, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  path = require('path');

  fs = require('fs');

  mkdirp = require('mkdirp');

  async = require('async');

  log = require('./nitrus/nitrus-log.js');

  NitrusFiles = require('./nitrus/nitrus-fs.js');

  NitrusBuilder = require('./nitrus/nitrus-builder.js');

  require('coffee-script/register');

  Nitrus = (function(_super) {
    var getConfigFilename, getTempl, hasConfig, nsfilecoffee, nsfilejs;

    __extends(Nitrus, _super);

    function Nitrus(dir) {
      this.PATH = dir;
      this.CONF_PATH = path.join(this.PATH, ".nitrus");
      this.NITRUS_MODULES = path.join(this.PATH, "nitrus_modules");
      this.fs = new NitrusFiles(this.CONF_PATH);
      this.log = log;
      this.builder = new NitrusBuilder(this);
    }

    Nitrus.prototype.init = function(ops) {
      var cofe, nsf;
      if (ops == null) {
        ops = {};
      }
      cofe = ops.coffee === true || false;
      nsf = 'nsfile.js';
      if (ops.coffee === true) {
        nsf = 'nsfile.coffee';
      }
      async.waterfall([
        (function(_this) {
          return function(cb) {
            return async.each([_this.CONF_PATH, _this.NITRUS_MODULES], mkdirp, function(er) {
              if (er) {
                return cb(er);
              }
              return cb(null);
            });
          };
        })(this), (function(_this) {
          return function(cb) {
            var er;
            try {
              _this.fs.init(true);
              return cb(null);
            } catch (_error) {
              er = _error;
              return cb(er);
            }
          };
        })(this), (function(_this) {
          return function(cb) {
            return hasConfig(_this.PATH, function(er, has) {
              var tmpl;
              if (er) {
                return cb(er);
              }
              if (has) {
                return cb(null);
              }
              tmpl = getTempl(nsf);
              return fs.writeFile(path.join(_this.PATH, tmpl.filename), tmpl.content, function(er) {
                if (er) {
                  return cb(er);
                }
                return cb(null);
              });
            });
          };
        })(this)
      ], (function(_this) {
        return function(err) {
          if (err) {
            return _this.emit('error', err);
          }
          return _this.emit('init', {
            path: _this.CONF_PATH,
            created: fs.existsSync(_this.CONF_PATH)
          });
        };
      })(this));
      return this;
    };

    Nitrus.prototype.initConfig = function(ops) {
      if (!ops) {
        return false;
      }
      if (!ops.model) {
        return false;
      }
      this.model = ops.model;
      return true;
    };

    Nitrus.prototype.load = function() {
      getConfigFilename(this.PATH, (function(_this) {
        return function(err, filename) {
          if (err) {
            return _this.emit('error', err);
          }
          if (!filename) {
            return _this.emit('error', new Error('Not configuration file'));
          }
          if (require("" + _this.PATH + "/" + filename)(_this)) {
            return _this.emit('ready');
          }
        };
      })(this));
      return this;
    };

    Nitrus.prototype.install = function() {
      throw new Error('install Not implemented yet!');
    };

    Nitrus.prototype.add = function() {
      throw new Error('add Not implemented yet!');
    };

    Nitrus.prototype.build = function(ops) {
      this.builder.build(ops);
      return this;
    };

    Nitrus.prototype.watch = function() {
      throw new Error('watch Not implemented yet!');
    };

    nsfilejs = function() {
      return {
        content: "module.exports = function(nitrus) {\n" + "  nitrus.initConfig(\n" + "    model: {}\n" + "  );\n" + "}\n",
        filename: 'Nitrusfile.js'
      };
    };

    nsfilecoffee = function() {
      return {
        content: "module.exports = (nitrus) ->\n" + "  nitrus.initConfig\n" + "    model: {}\n" + "  \n",
        filename: 'Nitrusfile.coffee'
      };
    };

    getTempl = function(name) {
      switch (name) {
        case "nsfile.js":
          return nsfilejs();
        case "nsfile.coffee":
          return nsfilecoffee();
      }
    };

    hasConfig = function(dir, fn) {
      return fs.readdir(dir, function(er, files) {
        var file, _i, _len;
        if (er) {
          return fn(er);
        }
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          if (/(nitrusfile.js|nitrusfile.coffee)/i.test(file)) {
            return fn(null, true);
          }
        }
        return fn(null, false);
      });
    };

    getConfigFilename = function(dir, fn) {
      return fs.readdir(dir, function(er, files) {
        var file, _i, _len;
        if (er) {
          return fn(er);
        }
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          if (/(nitrusfile.js|nitrusfile.coffee)/i.test(file)) {
            return fn(null, file);
          }
        }
        return fn(null);
      });
    };

    return Nitrus;

  })(EventEmitter);

  module.exports = Nitrus;

}).call(this);
