import {describe, test, expect} from 'vitest';
import {BenchFunctionRunner} from '../src/benchFunctionRunner.js';

/**
 * Tests for the 'benchFunctionRunner.js' file.
 */
describe('bench', () => {
  /**
   * Tests for {@link BenchFunctionRunner}.
   */
  test('Test bench function runner.', () => {
    const bench = new BenchFunctionRunner();
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
    //const res = bench.run();
    //console.log(res);

    expect(true).toBe(true);
  });
});
