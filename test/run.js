process.env.NODE_ENV = 'test';

var fs = require('fs')
  , mkdirp = require('mkdirp')
  , assert = require('assert')
  , nitrus = require('../lib/nitrus');

describe('Making the test case `movies`', function() {

	before(function(done){

		var ops = {
			name: 'all',
			input: './cases/movies/',
			output: './cases/movies/',
			force: true
		};

		nitrus.apply(ops, function(err){
			if (err) { throw err; }

			done();
		});
	   
	});

	it('the movies was created', function(){
        assert.ok(fs.existsSync('./cases/movies/LICENSE'));
    });

});