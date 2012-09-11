
var grunt = require('grunt');

exports.requireTree = function(files, options) {
  files = files.sort();

  var fileTree = exports.directoryTree(files, options.baseDir);

  var output = [
    'define(function(require){',
    '  return {'
  ];

  var pluginPrefix = options.plugin ? options.plugin + '!' : '';
  var directoryPrefix = options.prefixDir || '';
  var lastDepth = 0;

  function indent(num) { return grunt.utils.repeat(num,'  ')};

  deepEach(fileTree, function(val,key,parentKey,depth){
    key = key.replace(/\.[^\.]*$/,'');
    if (depth > lastDepth)      output.push(indent(depth) + "'" + parentKey + '\' : { ' )
    else if (depth < lastDepth) output.push(indent(depth + 1) + '}, ' )
    output.push(indent(depth + 1) + "'" + key + '\' : require("' + pluginPrefix + directoryPrefix + val + '"),');
    lastDepth = depth;
  })

  output.push(indent(1) + '};')

  output.push('});')
  var stringOutput = output.join("\n").replace(/,(\s+\})/g,'$1');

  return stringOutput;
};

exports.directoryTree = function(files, baseDir){
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
}

function deepEach(obj,fn,parentKey,depth){
  depth = depth || 0;
  grunt.utils._.each(obj,function(val,key){
    if (typeof val === 'object')
      deepEach(val, fn, key, depth+1);
    else fn(val,key,parentKey,depth)
  });
}
