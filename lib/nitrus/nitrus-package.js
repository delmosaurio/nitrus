(function() {
  'use strict';
  var EventEmitter, NitrusPackage, async, fs, mkdirp, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  path = require('path');

  fs = require('fs.extra');

  mkdirp = require('mkdirp');

  async = require('async');

  NitrusPackage = (function(_super) {
    __extends(NitrusPackage, _super);

    function NitrusPackage(owner, dir) {
      this.owner = owner;
      this.dir = dir;
    }

    return NitrusPackage;

  })(EventEmitter);

  module.exports = NitrusPackage;

}).call(this);
