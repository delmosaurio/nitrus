/*!
 * Nitrus.Template
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var fs = require('fs')
  , io = require('../lib/utils/io')
  , XRegExp = require('xregexp').XRegExp;


var regexLib = {
	  target: '\\$(?<modifier>[\\-\\+~]?){(?<target>[a-zA-Z0-9\.]+)}' //(?<target>\$\{[a-zA-Z0-9]\})
	, accesor: '[\s]*(?<target>[a-zA-Z0-9]+)\.(?<property>[a-zA-Z0-9\.]+)'
}

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
	self.currents = [];

	self.dynamic = false;

	self.current = null;

	var ops = options || {};
	ops.tmpl =  options.tmpl;
	ops.outTmpl =  options.outTmpl;
	ops.model = options.model;

	var tr = new XRegExp(regexLib.target, 'i');
	var at = new XRegExp(regexLib.accesor, 'i');

	if (tr.test(ops.outTmpl)){
		//console.log('matched:', ops.tmpl);
		self.dynamic = true;
		var match = XRegExp.exec(ops.outTmpl, tr);
		var ma = XRegExp.exec( match.target, at);
		var mached = match[0];

		//console.log(match);
		if (ops.model.hasOwnProperty(ma.target)) {
			var items = ops.model[ma.target];

			items.forEach(function(item){
				
				if ( item.hasOwnProperty(ma.property) ) {
					var o = ops.outTmpl.substring(0, match.index);
					o += change(item[ma.property], match.modifier);
					o += ops.outTmpl.substring(match.index + mached .length)

					self.outputs.push(o);

					self.currents[o] = item;

				}
				
			});
		}

	} else {
		self.outputs.push(ops.outTmpl);
		self.currents[ops.outTmpl] = null;
	}

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


/*
 * Render `target` with `modifier`
 *
 * @{param} {String} target
 * @{param} {String} modifier '+-~'
 */
function change(target, modifier) {
	if (!target || target === '') {
		return '';
	}

	if (!modifier || modifier === '' ) {
		return target;
	}

	switch(modifier) {
		case '+':
			return target.toUpperCase();
		case '-':
			return target.toLowerCase();
		case '~':
			return target.toLowerCase().replace(/(?:^|\s|_)\w/g, function(match) {
		        return match.toUpperCase();
		    });
		default:
			return target;
	}

}
