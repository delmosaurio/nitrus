/*!
 * Nitrus.Packager
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var sys = require('sys')
  , os = require('os')
  , events = require('events')
  , fs = require('fs')
  , targz = require('tar.gz')
  , io = require('../lib/utils/io');

/**
 * End-of-line code.
 */

var eol = os.platform
  ? ('win32' == os.platform() ? '\r\n' : '\n')
  : '\n';


// .nsignore file
var nsignore = [
    '*.exe'
  , '*.jpg'
  , '*.png'
].join(eol);


/**
 * Initialize a new Packager with the 'options'.
 *
 * @param {Object} options
 */
var Packager = module.exports = function Packager(options) {
	if(false === (this instanceof Packager)) {
        return new Packager();
    }

	var self = this;

	var ops = options || {};
	
	events.EventEmitter.call(self);

	return self;
};

sys.inherits(Packager, events.EventEmitter);

/**
 * Init a new package
 *
 * @param {Object} options
 * @param {Function} fn
 */
Packager.prototype.init = function(options, fn) {
	var self = this;
	
	var name = options.name
      , path = options.output || '.';

	var po = { 
    	name: name
    };

    io.write(path + '/nspackage.json', JSON.stringify(po));
    io.write(path + '/.nsignore', nsignore);

	self.emit('log', 'the package `' + name + '` was created successfully');

};

/**
 * Install a new package for the project
 *
 * @param {Object} options
 * @param {Function} fn
 */
Packager.prototype.install = function(options, fn) {
	var self = this;

	self.emit('log', 'installing `' + options.name + '`');

	var tgz = options.name
	  , output = options.output + '/nitrus/packages/';

	var compress = new targz().extract(tgz, output, function(err){
	    if(err)
	        console.log(err);

	    self.emit('log', 'installed');
	});
	
};

/**
 * Add a new package into the project for editing
 *
 * @param {Object} options
 * @param {Function} fn
 */
Packager.prototype.add = function(options, fn) {
	var self = this;

	self.emit('log', 'add');
};

/**
 * Compress the package from `options.input` folder
 *
 * @param {Object} options
 * @param {Function} fn
 */
Packager.prototype.make = function(options, fn) {
	var self = this;

	var path = options.input || '.';

	var nsp =  JSON.parse(fs.readFileSync(path + '/nspackage.json'));
	var otgz = path + '/' + nsp.name + '.tgz';

	var compress = new targz().compress(path + '/', otgz, function(err){
	    if(err)
	        console.log(err);

	    self.emit('log', 'the package `' + nsp.name + '` was compressed successfully at `' + otgz + '`');
	});

};