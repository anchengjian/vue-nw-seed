/*
 * node-innosetup-compiler
 * https://github.com/felicienfrancois/node-innosetup-compiler
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run.
    innosetup_compiler: {
      default_options: {
        options: {
        	gui: false,
        	verbose: false
        },
        scriptPath: null
      }
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

};
