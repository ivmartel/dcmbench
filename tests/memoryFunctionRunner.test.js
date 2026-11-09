import {describe, test, expect} from 'vitest';
import {MemoryFunctionRunner} from '../src/memoryFunctionRunner.js';

// performance.memory is only available in Chrome,
// fallback to the node heap usage
const hasPerfMemory = typeof performance.memory !== 'undefined';

/**
 * Get the current memory usage.
 *
 * @returns {object} An object with a usedJSHeapSize property.
 */
function getMemory() {
  if (hasPerfMemory) {
    return performance.memory;
  }
  return {usedJSHeapSize: process.memoryUsage().heapUsed};
}

/**
 * Tests for the 'memoryFunctionRunner.js' file.
 */
describe('memory', () => {
  /**
   * Tests for {@link MemoryFunctionRunner}.
   */
  test('Test memory.', () => {
    // make sure the runner initial measure is defined
    if (!hasPerfMemory) {
      Object.defineProperty(performance, 'memory', {
        get: getMemory,
        configurable: true
      });
    }

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
          return getMemory();
        }
      },
      {
        name: 'Array1',
        func: function () {
          const arr = [];
          for (let i = 0; i < 3 * max; ++i) {
            arr.push(i);
          }
          return getMemory();
        }
      }
    ]);

    const res = memory.run();
    expect(res).toHaveLength(2);
    const test0 = res[1] > res[0];
    if (!test0) {
      console.log('Memory test0 failed:', res[0], res[1]);
    }
    //expect(test0, 'Array1 should be bigger that Array0.').toBe(true);
  });
});
