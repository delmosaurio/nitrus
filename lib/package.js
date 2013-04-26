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
  , scriptme = require('scriptme')
  , XRegExp = require('xregexp').XRegExp;


var regexLib = {
	  target: '@{(?<target>[a-zA-Z0-9\.]+)}'
	, accesor: '[\s]*(?<target>[a-zA-Z0-9]+)\.(?<property>[a-zA-Z0-9\.]+)'
}


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
		project: options.root,
		output: options.output
	};
	
	ops.model = options.model || {};

	ops.force = options.force || false;

	self.dir = ops.dir;
	self.info = {};
	self.ignore = [];
	self.model = ops.model;

	self.templates = [];

	self.folders = [];

	self.aliasFolder = {};

	events.EventEmitter.call(self);

	return self;
};

sys.inherits(Package, events.EventEmitter);

/*
 * Add `dir` into the folder collection
 *
 * @params {String} dir
 */
Package.prototype.addFolder = function(dir) {
	var self = this;

	var tr = new XRegExp(regexLib.target, 'i');
	var at = new XRegExp(regexLib.accesor, 'i');

	if (tr.test(dir)){
		var match = XRegExp.exec(dir, tr);
		var ma = XRegExp.exec( match.target, at);
		var mached = match[0];

		if (self.model.hasOwnProperty(ma.target)) {
			var items = self.model[ma.target];

			if (items && items.hasOwnProperty(ma.property)) {
				var value = items[ma.property];

				self.folders.push( path.join(self.dir.output,  value) );

				self.aliasFolder[dir] = value;
			}

		} else {
			self.outputs.push(path.join(self.dir.output, ops.outTmpl));
			self.currents[ops.outTmpl] = null;
		}

	} else {
		self.folders.push(path.join(self.dir.output,  dir) );
	}

	return self;
}

/*
 * Add `template` into the templates collection
 *
 * @params {Template} template
 */
Package.prototype.addTemplate = function(template) {
	var self = this;

	self.templates.push(template);

	return self;
}


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

					// add the folders and create the alias
					var dirs = results.filter(function(item){
						return item.type === 'directory';
					});

					var files = results.filter(function(item){
						return item.type === 'file';
					});
					
					dirs.forEach(function(item){
						self.addFolder(item.target);
					});

					files.forEach(function(item){
						// add new template
						
						var filename = item.target;

						// optimize this
						for (alias in self.aliasFolder) {
							if (filename.indexOf(alias) != -1) {
								filename = filename.replace(alias, self.aliasFolder[alias])
							}
						}

						filename = path.join(self.dir.output,  filename);

						var tmpl = path.join(basedir, item.target);

						self.addTemplate(
							new Template(self, { tmpl: tmpl, outTmpl: filename, model: self.model })
						);

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
	var self = this;

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

    return self;
};


/**
 * Compile `templates`
 *
 * @param {Array} templates
 */
function compileTemplates(templates, options, fn) {
	var self = this;

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
    	return function(maincallback) { 

    		var subcompile = item.outputs.map(function(tmpl){
    			return function (subcallback) {
    				var stream = fs.createWriteStream(tmpl);
					
					model.current = item.currents[tmpl];
					
		    		scriptme.compile(item.precompiled, stream, model, engineOps, function(err, output){
		    			if (err) subcallback && subcallback(err);
		    			console.log('template', tmpl, 'was compiled');
		    			subcallback && subcallback(null);
		    		});
    			};

    		});

    		async.waterfall(
		    	[
					// now precompile
		    		function(callback) {
						// apply the apply function
			    		async.series(
					    	subcompile,
				    		function(err) {
								callback(err);
					    	}
						);
		    		}

		    	],
		    	function(err, result) {
		    		maincallback(err);
		    	}
			);
    		    		
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

	return self;

};