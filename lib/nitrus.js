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
module.exports.version = '0.0.1';

/**
 * Expose the config.
 */
module.exports.config = { engine: 'scriptme' };

/**
 * Expose constructors.
 */

 module.exports.Projector = require('./projector');
 module.exports.Packager = require('./packager');
