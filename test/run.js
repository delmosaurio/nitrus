(function() {
  'use strict';
  var Nitrus, chai, expect, fs, mkdirp;

  chai = require('chai');

  expect = chai.expect;

  Nitrus = require('../lib/nitrus.js');

  fs = require('fs');

  mkdirp = require('mkdirp');

  describe('Nitrus', function() {
    if (!fs.existsSync("" + __dirname + "/cases")) {
      return mkdirp.sync("" + __dirname + "/cases");
    }
  });

}).call(this);
