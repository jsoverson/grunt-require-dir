var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['require-dir'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'require-tree' : function(test) {
    test.expect(1);
    var files = [
      'test/fixtures/texttree/bar.tmpl',
      'test/fixtures/texttree/foo.tmpl',
      'test/fixtures/texttree/A/one.tmpl',
      'test/fixtures/texttree/A/two.tmpl',
    ];
    var baseDir = 'test/fixtures/texttree/';
    var expected = {
      'bar.tmpl' : 'bar.tmpl',
      'foo.tmpl' : 'foo.tmpl',
      A : {
        'one.tmpl' : 'A/one.tmpl',
        'two.tmpl' : 'A/two.tmpl'
      }
    }
    var actual = grunt.helper('directory-tree', files, baseDir);
    test.deepEqual(actual, expected, 'Creates tree output');
    test.done();
  },
  'helper': function(test) {
    test.expect(1);
    var options = {
      plugin    : 'tpl',
      baseDir   : 'test/fixtures/texttree/',
      prefixDir : 'texttree'
    };
    var files = [
      'test/fixtures/texttree/bar.tmpl',
      'test/fixtures/texttree/foo.tmpl',
      'test/fixtures/texttree/A/one.tmpl',
      'test/fixtures/texttree/A/two.tmpl',
    ];
    var oldRequire = require;
    var require = function(string) {return string};
    var define = function(fn) {return fn(require)};
    var expected = define(function(require){
        return {
          'bar' : require('tpl!bar.tmpl'),
          'foo' : require('tpl!foo.tmpl'),
          'A' : {
            'one' : require('tpl!A/one.tmpl'),
            'two' : require('tpl!A/two.tmpl')
          }
        }
      });
    var actualSource = grunt.helper('require-tree', files, options);
    var actual = eval(actualSource);
    test.deepEqual(actual, expected, 'Creates correct response');
    test.done();
    require = oldRequire;
  }
};
