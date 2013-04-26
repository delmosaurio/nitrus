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
  , path =require('path')
  , io = require('../lib/utils/io')
  , Package = require('../lib/package')
  , async = require('async');

/**
 * End-of-line code.
 */

var eol = os.platform
  ? ('win32' == os.platform() ? '\r\n' : '\n')
  : '\n';


/**
 * Initialize a new Projector with the `options`.
 *
 * @param {Object} options
 */
var Projector = module.exports = function Projector(options) {
	if(false === (this instanceof Projector)) {
        return new Projector();
    }

	var self = this;

	self.pacakges = [];

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
      , output = options.output || '.';

    var po = { 
    	name: name,
    	model: './nitrus/model.json'
    };

    var model = {};

	io.mkdir( path.join(output, 'nitrus') , function(){
		
		io.write( path.join(output, 'nitrus/model.json') , JSON.stringify(model));
		io.write( path.join(output, 'nitrus/project.json') , JSON.stringify(po));

		io.mkdir( path.join(output, 'nitrus/packages') );
		io.mkdir( path.join(output, 'nitrus/cache') );	

		self.emit('log', 'the project `' + name + '` was created successfully');
	});
};

/**
 * Apply the project 
 *
 * @param {Object} options
 * @param {Function} fn
 */
Projector.prototype.apply = function(options, fn) {
	var self = this;

	var name = options.name.toLowerCase()
      , input =  options.input  || '.'
      , output =  options.output  || '.'
      , pdir = path.join(input, 'nitrus/packages')
      , force = options.force || false
      , buffer = options.buffer || 5; // size of templates per package to process asynchronously

    // read the project info
	var info = JSON.parse( fs.readFileSync(path.join(input, 'nitrus/project.json')) );
		// read the model
	var model = JSON.parse( fs.readFileSync(path.join(input, info.model)) );

	// intenced the packages
    self.pacakges = io.getDirectories(
	    				path.resolve(pdir)
					  ).map(function(dir){ 
					  	return new Package({ 
					  		root: input, 
					  		output: output,
					  		base: path.join(pdir, dir), 
					  		buffer: buffer,
					  		force: force,
					  		model: model
					  	}); 
					});
	
	var tomake = self.pacakges;

     // map the function to read the pkg info in parallel
    torinfo = self.pacakges.map(function(item) {
    	return function(callback) { 
    		item.readInfo.apply( item, [callback] )
		};
    });

    // read the info and then apply the pacckage to de project
    async.series(
    	{
	    	// read packages info
	    	info: function(callback) {
	    		async.parallel(
			    	torinfo,
		    		function(err) {
		    			if (err) callback(err);

		    			if (name !== 'all') {
					    	tomake = self.pacakges.filter(function(p){
					    		return p.name.toLowerCase() == name;
					    	});
					    }

					    callback(null);
		    		}
				);
	    	},

	    	// apply packages
	    	applied: function(callback) {
	    		// get function to apply with the names of packages
	    		var toapply = {};

	    		tomake.forEach(function(item) {
			    	return toapply[item.name] = function(ops, fnc) { 
			    		item.apply.apply( item, [ops, fnc] )
					};
			    });
	    			    		
    			// apply the apply function
	    		async.parallel(
			    	toapply,
		    		function(err, resuls) {
						callback(err, resuls);
			    	}
				);

	    	}
    	},
    	function(err, resuls) {
    		if (err) return fn(err);
			
			self.emit('log', 'all packages applied successfully');
			fn(null);
    	}
	);

};
