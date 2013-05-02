/*!
 * Nitrus.utils.namelexer
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/*
 * Regular expression to read the filename or folder names
 */
var regexLib = {
	  dynamicFile: '\\$(?<modifier>[\\-\\+~]?){(?<target>[a-zA-Z0-9\.]+)}'
	, dynamicAccesor: '[\s]*(?<target>[a-zA-Z0-9]+)\.(?<property>[a-zA-Z0-9\.]+)'
	, layerFolder: '@{(?<target>[a-zA-Z0-9\.]+)}'
	, layerAccesor: '[\s]*(?<target>[a-zA-Z0-9]+)\.(?<property>[a-zA-Z0-9\.]+)'
}

 /**
 * Expose functions
 */

