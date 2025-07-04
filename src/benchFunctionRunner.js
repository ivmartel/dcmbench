//import Benchmark from 'benchmark';
import {Bench} from 'tinybench';

/**
 * Function runner for benchmarks.
 * Launch functions within benchmark.js to evaluate their speed.
 */
export class BenchFunctionRunner {

  /**
   * functions to run
   *
   * @type {Array}
   */
  #functions;

  /**
   * Set the runner functions.
   * @param {Array} funcs An array of functions in the form:
   * {name: string, func: Object}
   */
  setFunctions(funcs) {
    this.#functions = funcs;
  };

  /**
   * Run the functions and store benchmark results.
   * @param {Object} buffer The data buffer.
   * @return {Array} An array of memory measures in the form:
   * {count: number, added: boolean, removed: boolean, value: string}
   */
  async run(buffer) {
    const results = [];

    // benchmark suite
    //const suite = new Benchmark.Suite('bench');
    const suite = new Bench({});
    // handle end of cycle
    //suite.on('cycle', function (event) {
    suite.addEventListener('cycle', function (event) {
      // store results
      const task = event.task;
      const opsPerSec = task.result.latency.df;
      const rme = task.result.latency.rme;
      const rmeTxt = rme.toFixed(rme < 100 ? 2 : 0);
      const text = opsPerSec + ' \u00B1' + rmeTxt + '%';
      results.push(text);
      // console output
      console.log(task.name + ':', text);
    });

    // avoid creating functions in loops
    const getFunc = function (f, a) {
      return () => {
        f(a);
      };
    };
    // add parsers to suite
    for (let func of this.#functions) {
      suite.add(func.name, getFunc(func.func, buffer));
    }
    // run async
    //suite.run({async: false});
    await suite.run();

    return results;
  };

  /**
   * Get a header row to result data.
   * @return {string[]} An array representing a header row to the result data.
   */
  getFunctionHeader() {
    const header = [];
    for (let func of this.#functions) {
      header.push(func.name);
    }
    return header;
  };

};
