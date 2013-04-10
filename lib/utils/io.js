/*!
 * Nitrus.utils.io
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
  * Module dependencies.
  */
var fs = require('fs')
  , mkdirp = require('mkdirp');

/**
 * Expose functions
 */
exports.write = write;
exports.emptyDirectory = emptyDirectory;
exports.mkdir = mkdir;


/**
 * echo `str` > `path`.
 *
 * @param {String} path
 * @param {String} str
 * @param {Boolean} log
 */

function write(path, str, log) {
  fs.writeFile(path, str);
  if (log)
  	console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}


/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, log, fn) {
  if (log && typeof log === 'function') {
	 fn = log;
	 log = false;
  }

  mkdirp(path, 0755, function(err){
    if (err) throw err;
    if (log)
      console.log('   \033[36mcreate\033[0m : ' + path);
    fn && fn();
  });
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 * @param {Boolean} log
 */

function emptyDirectory(path, fn) {

  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}