(function() {
  'use strict';
  var FileGateway, NitrusFiles, extend,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  extend = require('extend');

  FileGateway = require('file-gateway');

  NitrusFiles = (function(_super) {
    __extends(NitrusFiles, _super);

    function NitrusFiles(dir, conf) {
      this.conf = extend(true, {
        process: true,
        cache: {
          expire: (1000 * 60) * 10,
          length: 30
        },
        extend: true,
        encoding: 'utf-8',
        saveOnSet: true
      }, conf);
      NitrusFiles.__super__.constructor.call(this, dir, this.conf);
      this.configure();
    }

    NitrusFiles.prototype.configure = function() {
      var initConfig;
      initConfig = [
        {
          key: "config-file",
          mode: "dynamic",
          type: "file",
          name: "CONFIG",
          json: true,
          defaults: {}
        }, {
          key: "cache-folder",
          mode: "cache",
          type: "folder",
          name: "cache"
        }, {
          key: "tmp-folder",
          mode: "temp",
          type: "folder",
          name: "tmp"
        }
      ];
      this.add(initConfig);
      return this;
    };

    return NitrusFiles;

  })(FileGateway);

  module.exports = NitrusFiles;

}).call(this);
