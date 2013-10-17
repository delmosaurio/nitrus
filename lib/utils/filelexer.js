/*!
 * Nitrus.utils.filelexer
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var XRegExp = require('xregexp').XRegExp;

/*
 * Regular expression to read the template
 */
var regexLib = {
	  dynamicTemplate: '\\$(?<modifier>[\\-\\+~]?){(?<target>[a-zA-Z0-9\.]+)}'
	, accesor: '[\s]*(?<owner>[a-zA-Z0-9]+)\.(?<accesor>[a-zA-Z0-9\.]+)'
}


/**
 * Expose functions
 */
exports.isDynamic = isDynamic;
exports.parse = parse;

/*
 * Sync function
 * Define if the `target` filename is a dynamic template
 *
 *@params {String} target
 */
function isDynamic(target) {
	return XRegExp.test(regexLib.dynamicTemplate, target);
}

/*
 * Parse `target` filename return de owner, accesor and modifier
 */
function parse(target) {
	var tr = new XRegExp(regexLib.dynamicTemplate, 'i')
	  , at = new XRegExp(regexLib.accesor, 'i')
	  , match
	  , ma
	  , mached
      , res = {
			  dynamic: false
			, index: undefined
			, owner: undefined
			, accesor: undefined
			, modifier: undefined
			, epression: undefined
		};

	// not dynamic
	if ( !tr.test(target) ) {
		return res; // undefined
	}

	// dynamic
	match = XRegExp.exec(ops.outTmpl, tr);
	ma = XRegExp.exec( match.target, at);
	mached = match.length ? match[0] : '';

	res.dynamic = true;
	res.index = match.index;
	res.owner = ma.owner;
	res.accesor = ma.accesor;
	res.modifier = match.modifier;
	res.epression = mached;

	return res;
}