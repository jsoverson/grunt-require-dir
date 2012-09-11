/**
 * Task: require-dir
 * Description: Compile a directory of templates into an AMD compatible JST file
 * Dependencies:
 * Contributor: @jsoverson
 */

var helpers = require('./helpers');

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask("require-dir", "Process a directory of AMD modules and generate an AMD compatible container", function() {
    var config = this.data;

    grunt.verbose.writeflags(config, "Options");

    var files = grunt.file.expandFiles(config.src);

    var output = helpers.requireTree(files, config);

    grunt.file.write(config.dest, output);

  });

};


