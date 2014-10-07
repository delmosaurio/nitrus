(function() {
  'use strict';
  var log;

  log = require('log');

  log.verbose = log.info;

  module.exports = log;

}).call(this);
