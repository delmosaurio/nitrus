/*!
 * Nitrus.Package
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var fs = require('fs')
  , path =require('path')
  , sys = require('sys')
  , events = require('events')
  , async = require('async')
  , wrench = require('wrench')
  , io = require('../lib/utils/io')
  , Template = require('../lib/template')
  , scriptme = require('scriptme');


/**
 * Initialize a new Package with the `options`.
 *
 * @param {Object} options
 */
var Package = module.exports = function Package(options) {
	if(false === (this instanceof Package)) {
        return new Package();
    }

	var self = this;

	var ops = options || {};
	ops.dir = options.dir || {
		base: options.base,
		project: options.root
	};
	
	ops.model = options.model || {};

	ops.force = options.force || false;

	self.dir = ops.dir;
	self.info = {};
	self.ignore = [];
	self.model = ops.model;

	self.templates = [];

	self.folders = [];

	events.EventEmitter.call(self);

	return self;
};

sys.inherits(Package, events.EventEmitter);


/**
 * Read  the `./nspackage.json` and `.nsignore`
 *
 * @param {Function} fn
 */
Package.prototype.readInfo  = function(fn)  {
	var self = this;

	var basedir = self.dir.base;

	async.map(
		[
			path.join(basedir, 'nspackage.json'), 
			path.join(basedir, '.nsignore')
		], 
		io.readUtf8, 
		function(err, results){
     		self.info = JSON.parse(results[0])
            self.ignore = results[1].split(/\n\r|\n/);

            self.name = self.info.name;

            fn && fn(err);
		}
	);

	return self;
}

/**
 * Get the array of regex to match ignored files/folders
 *
 * @param {Object} options
 */
Package.prototype.ignoreds = function() {
	var self = this
	  , list = [];

	  // TODO: fixme: work this to ignore a folder?

	  list.push( /^.*nspackage\.json$/i );
	  list.push( /^.*\.nsignore$/i );

	  self.ignore.forEach(function(ig){
	  	list.push( ig );
	  });

	  return list;
}

/**
 * Apply the package to the project with `options`
 *
 * @param {Object} options
 */
Package.prototype.apply = function(options, fn)  {
	var self = this;
	
	if (options && typeof options === 'function' ) {
		fn = options;
		options = {};
	}
	var basedir = self.dir.base;

	var ops = {};

	ops.model = self.model;

	// process the templates
	async.waterfall(
		[
			// load templates
			function(callback) {
				
				io.readdir(basedir, self.ignoreds(), function(err, results){
					if (err) err(null, 'error');

					results.forEach(function(item){
						if (item.type === 'file') {
							// add new template
							var tmpl = path.join(basedir, item.target);

							self.templates.push(
								new Template(self, { tmpl: tmpl, outTmpl: item.target })
							);
						} else if (item.type === 'directory') {
							self.folders.push(item.target);
						}
					});
					
					callback(null);

				});
			},
			// pre compile the templates
			function(callback) {
				preCompileTemplates.apply(self, [self.templates, ops, callback]);
			},
			// prepare directories
			function(callback) {
				async.eachSeries(self.folders, io.mkdir, callback)
			},
			// compile the templates
			function(callback) {
				compileTemplates.apply(self, [self.templates, ops, callback]);
			}
		],
		function (err) {
			fn && fn(err);
		}
	);

	return self;
}

/**
 * Precompile `templates`
 *
 * @param {Array} templates
 */
function preCompileTemplates(templates, options, fn) {
	
	if (options && typeof options === 'function') {
		fn = options;
		options = {};
	}

	var ops = {}
	  , toload = [];
    
    ops.buffer = options.buffer || 5;

    var engineOps = {};

	// map function to load
    var toload = templates.map(function(item) {
    	return function(callback) { 
    		item.load.apply( item, [callback] )
		};
    });

    // map function to precompile with scriptme
    var toprecompile = templates.map(function(item) {
    	return function(callback) { 
    		scriptme.precompile(item.content, engineOps, function(err, output){
    			if (err) callback && callback(err);
    			item.precompiled = output;
    			callback(null);
    		})
		};
    });

    async.waterfall(
    	[
    		// load the templates with limit `ops.buffer`
    		function(callback) {
				// apply the apply function
	    		async.parallelLimit(
			    	toload,
			    	ops.buffer,
		    		function(err) {
						callback(err);
			    	}
				);
    		},
			// now precompile
    		function(callback) {
				// apply the apply function
	    		async.parallelLimit(
			    	toprecompile,
			    	ops.buffer,
		    		function(err) {
						callback(err);
			    	}
				);
    		}

    	],
    	function(err, result) {
    		fn(err);
    	}
	);

};


/**
 * Compile `templates`
 *
 * @param {Array} templates
 */
function compileTemplates(templates, options, fn) {
	
	if (options && typeof options === 'function') {
		fn = options;
		options = {};
	}

	var ops = {}
	  , toload = []
	  , model;
    
    ops.buffer = options.buffer || 5;
    
    model = options.model || {};

    var engineOps = {};
    
    // map function to compile with scriptme
    var tocompile = templates.map(function(item) {
    	return function(callback) { 
    		var stream = fs.createWriteStream(item.ops.outTmpl);
			
    		scriptme.compile(item.precompiled, stream, model, engineOps, function(err, output){
    			if (err) callback && callback(err);
    			console.log('template', item.ops.tmpl, 'was compiled');
    			callback(null);
    		})
		};
    });

    async.waterfall(
    	[
			// now precompile
    		function(callback) {
				// apply the apply function
	    		async.parallelLimit(
			    	tocompile,
			    	ops.buffer,
		    		function(err) {
						callback(err);
			    	}
				);
    		}

    	],
    	function(err, result) {
    		fn(err);
    	}
	);

};