/* global QUnit, dcmb */
/**
 * Tests for the 'benchFunctionRunner.js' file.
 */
/** @module tests/bench */
// Do not warn if these variables were not defined before.
QUnit.module('bench');

/**
 * Tests for {@link dcmb.BenchFunctionRunner}.
 * @function module:tests/bench
 */
QUnit.test('Test bench fucntion runner.', function (assert) {
  var bench = new dcmb.BenchFunctionRunner();
  bench.setFunctions([
    {name: 'String#indexOf',
      func: function () {
        'Hello World!'.indexOf('o') > -1;
      }},
    {name: 'String#match',
      func: function () {
        !!'Hello World!'.match(/o/);
      }}
  ]);
  //var res = bench.run();
  //console.log(res);

  assert.ok(true);
});
