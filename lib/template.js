/*!
 * Nitrus.Template
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var fs = require('fs')
  , io = require('../lib/utils/io');


/**
 * Initialize a new Template with the `options`.
 *
 * @param {Package} owner
 * @param {Object} options
 */
var Template = module.exports = function Template(owner, options) {
	if(false === (this instanceof Template)) {
        return new Template();
    }

	var self = this;
	self.owner = owner;

	self.outputs = [];

	var ops = options || {};
	ops.tmpl =  options.tmpl;
	ops.outTmpl =  options.outTmpl;
	
	// expose options
	self.ops = ops;

	self.content = '';
	self.precompiled = '';

	return self;
};

/**
 * Read the file template
 *
 * @param {Function} fn
 */
Template.prototype.load = function(fn) {
	var self = this;

	io.readUtf8(self.ops.tmpl, function(err, result){
		if (err) { fn && fn(err); }
		self.content = result;
		fn && fn(null);
	});

}