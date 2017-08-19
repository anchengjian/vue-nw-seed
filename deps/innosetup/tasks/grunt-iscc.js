'use strict';
module.exports = function(grunt) {

	var task = function(grunt) {
		var iscc = require("../lib/iscc.js");
		var done = this.async();
		iscc(this.data.script, this.options({
			gui: false,
			verbose: false
		}), function(error) {
			done(!error);
		});
	};
	grunt.registerMultiTask('innosetup', 'Node wrapper to compile inno setup scripts (.iss)', task);
	grunt.registerMultiTask('innosetup_compiler', 'Node wrapper to compile inno setup scripts (.iss)', task);
	grunt.registerMultiTask('innosetup-compiler', 'Node wrapper to compile inno setup scripts (.iss)', task);

};
