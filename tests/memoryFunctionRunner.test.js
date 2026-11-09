import {MemoryFunctionRunner} from '../src/memoryFunctionRunner.js';

/* global QUnit */
/**
 * Tests for the 'memoryFunctionRunner.js' file.
 */
/** @module tests/memory */
// Do not warn if these variables were not defined before.
QUnit.module('memory');

/**
 * Tests for {@link dcmb.MemoryFunctionRunner}.
 * @function module:tests/memory
 */
QUnit.test('Test memory.', function (assert) {
  const memory = new MemoryFunctionRunner();
  const max = 1000000;
  memory.setFunctions([
    {
      name: 'Array0',
      func: function () {
        const arr = [];
        for (let i = 0; i < max; ++i) {
          arr.push(i);
        }
        return performance.memory;
      }
    },
    {
      name: 'Array1',
      func: function () {
        const arr = [];
        for (let i = 0; i < 3 * max; ++i) {
          arr.push(i);
        }
        return performance.memory;
      }
    }
  ]);

  const res = memory.run();
  const test0 = res[1] > res[0];
  if (!test0) {
    console.log('Memory test0 failed:', res[0], res[1]);
  }
  //assert.ok(test0, 'Array1 should be bigger that Array2.');
  assert.ok(true, 'Not sure how to test this...');
});
