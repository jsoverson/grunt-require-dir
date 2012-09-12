# grunt-require-dir

Task to build a requirejs AMD module out of a directory of files.

[![Build Status](https://secure.travis-ci.org/jsoverson/grunt-require-dir.png)](http://travis-ci.org/jsoverson/grunt-require-dir)

## Getting Started
Install this grunt plugin next to your project's grunt.js gruntfile with: `npm install grunt-require-dir`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-require-dir');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Config

- require-dir
  - src : Your source files to include. Should all be under one common directory
  - baseDir : The local base directory prefix, removed from the source file paths (optional)
  - prefixDir : The new directory path to place in front of the source file paths (optional)
  - dest : The destination AMD file
  - plugin : The requirejs plugin to prefix the files with (optional). Useful for templates.

```javascript
'require-dir' : {
  all : {
    plugin    : 'tpl',
    src       : 'test/fixtures/texttree/**/*.tmpl',
    baseDir   : 'test/fixtures/texttree/',
    prefixDir : 'customDir/',
    dest      : 'test/fixtures/texttree.js'
  }
},
```

## Example output

Given the config above, and the file tree below

```
|_ /fixtures
| |_ /texttree
| | |_ /A
| | | |_ one.tmpl
| | | |_ two.tmpl
| | |_ bar.tmpl
| | |_ foo.tmpl
| | |_ unwanted.ext
```

Running `grunt require-dir` (or `grunt require-dir:all`), you will
get a file in `test/fixtures/texttree.js` with the contents

```javascript
define(function(require){
  return {
  'A' : {
    'one' : require("tpl!customDir/A/one.tmpl"),
    'two' : require("tpl!customDir/A/two.tmpl")
  },
  'bar' : require("tpl!customDir/bar.tmpl"),
  'foo' : require("tpl!customDir/foo.tmpl")
  };
});
```
Which, when required, will allow you to access modules in the same structure as your directory, e.g.

```javascript
define(['texttree.js'],function(texttree){
  texttree.A.one; // A/one.tmpl
  texttree.bar; // bar.tmpl
})
```

## Release History

0.3.0 First public release

## License
Copyright (c) 2012 Jarrod Overson  
Licensed under the [MIT license](https://github.com/jsoverson/grunt-require-dir/blob/master/LICENSE-MIT).
