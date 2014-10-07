'use strict'

chai = require 'chai'
expect = chai.expect
assert = chai.assert
chai.use require 'chai-fs'
Nitrus = require '../lib/nitrus.js'
fs = require 'fs.extra'
mkdirp = require 'mkdirp'

casesdir = "#{__dirname}/cases"

instance = (dir) ->
  ns = new Nitrus dir
  ns.on 'error', (error) ->
    throw error
  return ns

describe 'Nitrus', () ->
  before (done) ->
    if !fs.existsSync casesdir
      mkdirp.sync casesdir
    done()

  describe '#init({coffee: false})', () ->
    before (done) ->
      if fs.existsSync "#{casesdir}/init"
        fs.rmrfSync "#{casesdir}/init"
      mkdirp.sync "#{casesdir}/init"
      done()

    it 'should init without error', (done) ->
      ns = instance "#{casesdir}/init"

      ns.on 'init', (info) ->
        assert.pathExists "#{casesdir}/init/nitrus_modules"
        assert.pathExists "#{casesdir}/init/Nitrusfile.js"
        done()
      ns.init {coffee: false}
  describe '#init({coffee: true})', () ->
    before (done) ->
      if fs.existsSync "#{casesdir}/init"
        fs.rmrfSync "#{casesdir}/init"
      mkdirp.sync "#{casesdir}/init"
      done()

    it 'should init without error', (done) ->
      ns = instance "#{casesdir}/init"
      
      ns.on 'init', (info) ->
        assert.pathExists "#{casesdir}/init/nitrus_modules"
        assert.pathExists "#{casesdir}/init/Nitrusfile.coffee"
        done()
      ns.init {coffee: true}

  describe '#load()', () ->
    describe '- js configfile', () ->
      before (done) ->
        if fs.existsSync "#{casesdir}/model"
          fs.rmrfSync "#{casesdir}/model"
        mkdirp.sync "#{casesdir}/model"
        fs.writeFileSync "#{casesdir}/model/Nitrusfile.js", fs.readFileSync "#{casesdir}/../assets/Nitrusfile.js"
        done()
      it 'should have a model after load', (done) ->
        ns = instance "#{casesdir}/model"
        ns.on 'ready', () ->
          expect(ns).to.have.property('model')
          done()
        ns.load()

    describe '- coffee configfile', () ->
      before (done) ->
        if fs.existsSync "#{casesdir}/model"
          fs.rmrfSync "#{casesdir}/model"
        mkdirp.sync "#{casesdir}/model"
        fs.writeFileSync "#{casesdir}/model/Nitrusfile.coffee", fs.readFileSync "#{casesdir}/../assets/Nitrusfile.coffee"
        done()
      it 'should have a model after load', (done) ->
        ns = instance "#{casesdir}/model"
        ns.on 'ready', () ->
          expect(ns).to.have.property('model')
          done()
        ns.load()
  describe '#build()', () ->
    before (done) ->
        if fs.existsSync "#{casesdir}/build"
          fs.rmrfSync "#{casesdir}/build"
        mkdirp.sync "#{casesdir}/build"
        mkdirp.sync "#{casesdir}/build/nitrus_modules"
        fs.writeFileSync "#{casesdir}/build/Nitrusfile.coffee", fs.readFileSync "#{casesdir}/../assets/Nitrusfile.coffee"
        fs.copyRecursive "#{casesdir}/../assets/license", "#{casesdir}/build//nitrus_modules/license", () ->
          done()
    it 'should build without error', (done) ->
      ns = instance "#{casesdir}/build"
      ns.on 'ready', () ->
        ns.build()
      ns.on 'discover', () ->
        expect ns.builder
          .have.property 'packages'
          .with.length 1
      ns.on 'complete', () ->
        assert.pathExists "#{casesdir}/build/LICENSE"
        done()
      ns.load()