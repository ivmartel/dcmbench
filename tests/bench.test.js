/**
 * Tests for the 'bench.js' file.
 */
/** @module tests/bench */
// Do not warn if these variables were not defined before.
/* global QUnit */
QUnit.module("bench");

/**
 * Tests for {@link dcmb.bench}.
 * @function module:tests/bench
 */
QUnit.test("Test bench.", function (assert) {
  var bench = new dcmb.DicomBench();
  bench.setFunctions([
    { name: "String#indexOf", func: function () {
      'Hello World!'.indexOf('o') > -1;
    }},
    { name: "String#match", func: function () {
      !!'Hello World!'.match(/o/);
    }}
  ]);
  //var res = bench.run();
  //console.log(res);

  assert.ok(true);
});
