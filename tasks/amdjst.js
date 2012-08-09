/**
 * Task: amd-jst
 * Description: Compile a directory of templates into an AMD compatible JST file
 * Dependencies:
 * Contributor: @jsoverson
 */

grunt = require('grunt');

module.exports = function(grunt) {
  "use strict";

  var defaults = {

  };

  grunt.registerMultiTask("amdjst", "Compile a directory of templates into an AMD compatible JST file", function() {
    var options = grunt.helper("options", this, defaults);

    grunt.verbose.writeflags(options, "Options");

    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var srcFiles;
    var taskOutput;
    var sourceCode;
    var sourceCompiled;

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);

      taskOutput = [];
      taskOutput.push("define(['handlebars'],function(Handlebars){");

      srcFiles.forEach(function(srcFile) {
        sourceCode = grunt.file.read(srcFile);

        sourceCompiled = grunt.helper("handlebars", sourceCode, srcFile, helperNamespace);

        taskOutput.push(sourceCompiled);
      });

      taskOutput.push("});")

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  grunt.registerHelper("handlebars", function(source, filepath, namespace) {
    try {
      var output = "Handlebars.compile('" + source.replace(/([\\"'])/g, "\\$1").replace(/\r/g,"").replace(/\n/g,"\\n").replace(/\0/g, "\\0") + "');";
      return namespace + "['" + filepath + "'] = " + output;
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Handlebars failed to compile.");
    }
  });
};
