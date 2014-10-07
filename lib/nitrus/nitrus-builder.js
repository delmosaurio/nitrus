(function() {
  'use strict';
  var EventEmitter, NitrusBuilder, NitrusPackage, async, fs, mkdirp, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  path = require('path');

  fs = require('fs.extra');

  mkdirp = require('mkdirp');

  async = require('async');

  NitrusPackage = require('./nitrus-package.js');

  NitrusBuilder = (function(_super) {
    __extends(NitrusBuilder, _super);

    function NitrusBuilder(owner) {
      this.owner = owner;
      this.packages = [];
    }

    NitrusBuilder.prototype.build = function(ops) {
      return this.discover(this.owner.NITRUS_MODULES, (function(_this) {
        return function(err) {
          if (err) {
            return _this.emit('error', err);
          }
          return _this.emit('discover', _this.packages);
        };
      })(this));
    };

    NitrusBuilder.prototype.discover = function(dir, fn) {
      var walker;
      walker = fs.walk(dir);
      return walker.on("directories", (function(_this) {
        return function(root, stats, next) {
          var stat, _i, _len;
          for (_i = 0, _len = stats.length; _i < _len; _i++) {
            stat = stats[_i];
            _this.packages.push(new NitrusPackage(_this, path.join(dir, stat.name)));
          }
          return fn(null);
        };
      })(this));
    };

    return NitrusBuilder;

  })(EventEmitter);

  module.exports = NitrusBuilder;

}).call(this);
