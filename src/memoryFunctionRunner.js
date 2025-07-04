/**
 * Memory function runner.
 * Compare the memory allocation of two functions run.
 */
export class MemoryFunctionRunner {

  // if (!performance.memory) {
  //   console.warn('performance.memory is only available in Chrome.');
  // }

  /**
   * Functions to run.
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
   * Run the functions and store their memory usage.
   * @param {Object} buffer The data buffer.
   * @return {Array} An array of memory measures in the form:
   * {count: number, added: boolean, removed: boolean, value: string}
   */
  run(buffer) {
    // initial measure
    var previousMemory = performance.memory;

    var measures = [];
    for (let func of this.#functions) {
      // run the function
      var mem = func.func(buffer);
      // add to measure
      measures.push(mem.usedJSHeapSize - previousMemory.usedJSHeapSize);
      previousMemory = mem;
    }
    return measures;
  };

  /**
   * Get a header row to result data.
   * @return {Array} An array representing a header row to the result data.
   */
  getFunctionHeader() {
    var header = [];
    for (let func of this.#functions) {
      header.push(func.name);
    }
    return header;
  };

};
