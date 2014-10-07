(function() {
  'use strict';
  var Nitrus, cli, nopt, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Nitrus = require('../nitrus');

  path = require('path');

  nopt = require('nopt');

  cli = module.exports = function(options, done) {
    if (options) {
      return Object.keys(options).forEach(function(key) {
        if (!(__indexOf.call(cli.options, key) >= 0)) {
          return cli.options[key] = options[key];
        } else if (cli.options[key].type === Array) {
          return [].push.apply(cli.options[key], options[key]);
        }
      });
    }
  };

}).call(this);
