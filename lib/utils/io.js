/*!
 * Nitrus.utils.io
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
  * Module dependencies.
  */
var fs = require('fs')
  , mkdirp = require('mkdirp')
  , path =require('path')
  , wrench = require('wrench')
  , XRegExp = require('xregexp').XRegExp;

/**
 * Expose functions
 */
exports.write = write;
exports.emptyDirectory = emptyDirectory;
exports.mkdir = mkdir;
exports.getDirectories = getDirectories;
exports.readUtf8 = readUtf8;
exports.readdir = readdir;
exports.readdirSync = readdirSync;
exports.getType = getType;


/**
 * echo `str` > `file`.
 *
 * @param {String} filename
 * @param {String} str
 * @param {Boolean} log
 */

function write(file, str, log) {
  fs.writeFile(file, str);
  if (log)
  	console.log('   \x1b[36mcreate\x1b[0m : ' + file);
};


/**
 * Mkdir -p.
 *
 * @param {String} dir
 * @param {Function} fn
 */

function mkdir(dir, log, fn) {
  if (log && typeof log === 'function') {
	 fn = log;
	 log = false;
  }

  mkdirp(dir, 0755, function(err){
    if (err) throw err;
    if (log)
      console.log('   \033[36mcreate\033[0m : ' + dir);
    fn && fn();
  });
};

/**
 * Check if the given directory `dir` is empty.
 *
 * @param {String} dir
 * @param {Function} fn
 * @param {Boolean} log
 */

function emptyDirectory(dir, fn) {

  fs.readdir(dir, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
};

/**
 * Get list of directories `dir` from synchronously
 *
 * @param {String} dir
 */
function getDirectories(dir) {
  return fs.readdirSync(dir)
      .filter(function(item){
        return fs.statSync(path.join(dir, item)).isDirectory();
      });
};

/**
 * Read the `file` with utf8 enconding
 *
 * @param {String} file
 */
 function readUtf8(file, fn){

    fs.readFile(file, 'utf8', fn);

 };


/**
 * Read the `dir` and returns an array like filtered by `ignore`
 * [{ target: 'filename', type: 'file' }
 * { target: 'foldername', type: 'directory' }]
 *
 * @param {String} dir
 * @param {Array} ignore
 */
function readdirSync(dir, ignore) {

  return readdir(dir, ignore);

};

/**
 * Read the `dir` and returns an array like filtered by `ignore`
 * [{ target: 'filename', type: 'file' }
 * { target: 'foldername', type: 'directory' }]
 *
 * @param {String} dir
 * @param {Array} ignore
 */
function readdir(dir, ignore, fn) {

  var files = wrench.readdirSyncRecursive(dir);

  var toignore = XRegExp.union( ignore );

  var res = files
            .filter(function(item){
                return !toignore.test( item );
            })
            .map(function(item){
              return { target: item, type: getType( path.join(dir, item) ) }
            });
  
  fn && fn(null, res);

  return res;
};

/**
 * Return the type of `target`
 * - file
 * - directory
 *
 * @param {String} target
 */
function getType(target) {
  var stat = fs.statSync(target);

  if (stat.isDirectory()) return 'directory';

  if (stat.isFile()) return 'file';

  return 'undefined'
};