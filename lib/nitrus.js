/*!
 * Nitrus
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
  * Module dependencies.
  */
var 
      // ext modules  
      fs = require('fs')
      // nitrus modules 
    , Projector = require('./projector')
    , Packager = require('./packager');


/**
 * Expose current version.
 */
 
module.exports.version = '0.0.7';

/**
 * Expose the config.
 */

module.exports.config = { engine: 'scriptme' };

/**
 * Expose constructors.
 */

 module.exports.Projector = Projector;
 module.exports.Packager = Packager;

/*
 * Expose functionality
 */
module.exports.initProject = initProject;
module.exports.initPackage = initPackage;
module.exports.apply = apply;
module.exports.install = install;
module.exports.pack = pack;
module.exports.add = add;

/*
 * Init a project with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 */
function initProject(options, fn) {
	var projector = new Projector();

	projector.init(options, fn);
}


/*
 * Init a package with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 */
function initPackage(options, fn) {
	var packager = new Packager();

	packager.init(options, fn);
}


/*
 * Apply package(s) with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 */
function apply(options, fn) {
	var projector = new Projector();
	projector.apply(options, fn);
}


/*
 * Install a new package with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 */
function install(options, fn) {
	var projector = new Projector();
	projector.install(options, fn);
}

/*
 * Pack a package with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 */
function pack(options, fn) {
	var packager = new Packager();
	packager.pack(options, fn);
}

/*
 * Add a package with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 */
function add(options, fn) {
	var projector = new Projector();
	projector.add(options, fn);
}