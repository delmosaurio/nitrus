module.exports = (grunt) ->
  'use strict'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        expand: true
        flatten: false
        cwd: 'src'
        src: [ '**/*.coffee' ]
        dest: 'lib/'
        ext: '.js'
      test:
        files: 
          'test/run.js': 'test/run.coffee'
    watch: 
      coffee:
        files: [ 'test/run.coffee', 'src/**/*.coffee' ]
        tasks: [ 'coffee' ]  

  grunt.registerTask 'default', ['coffee', 'watch']