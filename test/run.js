(function() {
  'use strict';
  var Nitrus, assert, casesdir, chai, expect, fs, instance, mkdirp;

  chai = require('chai');

  expect = chai.expect;

  assert = chai.assert;

  chai.use(require('chai-fs'));

  Nitrus = require('../lib/nitrus.js');

  fs = require('fs.extra');

  mkdirp = require('mkdirp');

  casesdir = "" + __dirname + "/cases";

  instance = function(dir) {
    var ns;
    ns = new Nitrus(dir);
    ns.on('error', function(error) {
      throw error;
    });
    return ns;
  };

  describe('Nitrus', function() {
    before(function(done) {
      if (!fs.existsSync(casesdir)) {
        mkdirp.sync(casesdir);
      }
      return done();
    });
    describe('#init({coffee: false})', function() {
      before(function(done) {
        if (fs.existsSync("" + casesdir + "/init")) {
          fs.rmrfSync("" + casesdir + "/init");
        }
        mkdirp.sync("" + casesdir + "/init");
        return done();
      });
      return it('should init without error', function(done) {
        var ns;
        ns = instance("" + casesdir + "/init");
        ns.on('init', function(info) {
          assert.pathExists("" + casesdir + "/init/nitrus_modules");
          assert.pathExists("" + casesdir + "/init/Nitrusfile.js");
          return done();
        });
        return ns.init({
          coffee: false
        });
      });
    });
    describe('#init({coffee: true})', function() {
      before(function(done) {
        if (fs.existsSync("" + casesdir + "/init")) {
          fs.rmrfSync("" + casesdir + "/init");
        }
        mkdirp.sync("" + casesdir + "/init");
        return done();
      });
      return it('should init without error', function(done) {
        var ns;
        ns = instance("" + casesdir + "/init");
        ns.on('init', function(info) {
          assert.pathExists("" + casesdir + "/init/nitrus_modules");
          assert.pathExists("" + casesdir + "/init/Nitrusfile.coffee");
          return done();
        });
        return ns.init({
          coffee: true
        });
      });
    });
    describe('#load()', function() {
      describe('- js configfile', function() {
        before(function(done) {
          if (fs.existsSync("" + casesdir + "/model")) {
            fs.rmrfSync("" + casesdir + "/model");
          }
          mkdirp.sync("" + casesdir + "/model");
          fs.writeFileSync("" + casesdir + "/model/Nitrusfile.js", fs.readFileSync("" + casesdir + "/../assets/Nitrusfile.js"));
          return done();
        });
        return it('should have a model after load', function(done) {
          var ns;
          ns = instance("" + casesdir + "/model");
          ns.on('ready', function() {
            expect(ns).to.have.property('model');
            return done();
          });
          return ns.load();
        });
      });
      return describe('- coffee configfile', function() {
        before(function(done) {
          if (fs.existsSync("" + casesdir + "/model")) {
            fs.rmrfSync("" + casesdir + "/model");
          }
          mkdirp.sync("" + casesdir + "/model");
          fs.writeFileSync("" + casesdir + "/model/Nitrusfile.coffee", fs.readFileSync("" + casesdir + "/../assets/Nitrusfile.coffee"));
          return done();
        });
        return it('should have a model after load', function(done) {
          var ns;
          ns = instance("" + casesdir + "/model");
          ns.on('ready', function() {
            expect(ns).to.have.property('model');
            return done();
          });
          return ns.load();
        });
      });
    });
    return describe('#build()', function() {
      before(function(done) {
        if (fs.existsSync("" + casesdir + "/build")) {
          fs.rmrfSync("" + casesdir + "/build");
        }
        mkdirp.sync("" + casesdir + "/build");
        mkdirp.sync("" + casesdir + "/build/nitrus_modules");
        fs.writeFileSync("" + casesdir + "/build/Nitrusfile.coffee", fs.readFileSync("" + casesdir + "/../assets/Nitrusfile.coffee"));
        return fs.copyRecursive("" + casesdir + "/../assets/license", "" + casesdir + "/build//nitrus_modules/license", function() {
          return done();
        });
      });
      return it('should build without error', function(done) {
        var ns;
        ns = instance("" + casesdir + "/build");
        ns.on('ready', function() {
          return ns.build();
        });
        ns.on('discover', function() {
          return expect(ns.builder).have.property('packages')["with"].length(1);
        });
        ns.on('complete', function() {
          assert.pathExists("" + casesdir + "/build/LICENSE");
          return done();
        });
        return ns.load();
      });
    });
  });

}).call(this);
