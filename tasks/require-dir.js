/**
 * Task: require-dir
 * Description: Compile a directory of templates into an AMD compatible JST file
 * Dependencies:
 * Contributor: @jsoverson
 */

require

module.exports = function(grunt) {
  "use strict";

  grunt.registerTask("require-dir", "Compile a directory of templates into an AMD compatible JST file", function() {
    var config = grunt.config.get('requiredir'),
        options = config.options;

    grunt.verbose.writeflags(options, "Options");

    var files = grunt.file.expandFiles(config.files);

    var output = grunt.helper('require-tree', files, options);

    grunt.file.write(config.dest, output);

  });

  grunt.registerHelper("require-tree", function(files, options) {
    files = files.sort();

    var fileTree = grunt.helper('directory-tree', files, options.baseDir);

    var output = [
      'define(function(require){',
      '  return {'
    ];

    var prefix = options.plugin ? options.plugin + '!' : '';
    var lastDepth = 0;

    function indent(num) { return grunt.utils.repeat(num,'  ')};

    deepEach(fileTree, function(val,key,parentKey,depth){
      key = key.replace(/\.[^\.]*$/,'');
      if (depth > lastDepth)      output.push(indent(depth) + "'" + parentKey + '\' : { ' )
      else if (depth < lastDepth) output.push(indent(depth + 1) + '}, ' )
      output.push(indent(depth + 1) + "'" + key + '\' : require("' + prefix + val + '"),');
      lastDepth = depth;
    })

    output.push(indent(1) + '};')

    output.push('});')
    return output.join("\n");
  });

  grunt.registerHelper('directory-tree', function(files, baseDir){
    var tree = {};
    var baseDirRE = new RegExp('^' + (baseDir || ''));

    files.forEach(function(val,i) {
      var requireUrl = val.replace(baseDirRE, '');
      var parts = requireUrl.split('/');
      var key = tree;
      for (var i = 0; i < parts.length - 1; i++) {
        var dir = parts[i];
        if (!key.hasOwnProperty(dir)) key[dir] = {};
        key = key[dir];
      }
      var filename = parts[parts.length - 1];
      if (key.hasOwnProperty(filename)) throw new Error('Directory contains both dir and file named ' + filename);
      key[filename] = requireUrl;
    });

    return tree;
  })

  function deepEach(obj,fn,parentKey,depth){
    depth = depth || 0;
    grunt.utils._.each(obj,function(val,key){
      if (typeof val === 'object')
        deepEach(val, fn, key, depth+1);
      else fn(val,key,parentKey,depth)
    });
  }

};


