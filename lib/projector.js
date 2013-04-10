/*!
 * Nitrus.Projector
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
  , io = require('../lib/utils/io');



/**
 * End-of-line code.
 */

var eol = os.platform
  ? ('win32' == os.platform() ? '\r\n' : '\n')
  : '\n';


/**
 * Initialize a new Projector with the 'options'.
 *
 * @param {Object} options
 */
var Projector = module.exports = function Projector(options) {
	if(false === (this instanceof Projector)) {
        return new Projector();
    }

	var self = this;

	var ops = options || {};
	
	events.EventEmitter.call(self);

	return self;
};

sys.inherits(Projector, events.EventEmitter);

/**
 * Init a new project 
 *
 * @param {Object} options
 * @param {Function} fn
 */
Projector.prototype.init = function(options, fn) {
	var self = this;

	var name = options.name
      , path = options.output || '.';

    var po = { 
    	name: name
    };

	io.mkdir(path + '/nitrus', function(){
		
		io.write(path + '/nitrus/project.json', JSON.stringify(po));

		io.mkdir(path + '/nitrus/packages');
		io.mkdir(path + '/nitrus/cache');	


		self.emit('log', 'the project `' + name + '` was created successfully');
	});
};

/**
 * Make the project 
 *
 * @param {Object} options
 * @param {Function} fn
 */
Projector.prototype.make = function(options, fn) {
	var self = this;

	self.emit('log', 'make');
};
