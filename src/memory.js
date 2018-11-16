// namespace
var dcmb = dcmb || {};

// Class to handle running functions.
dcmb.Memory = function () {

  if( !performance.memory ){
      console.warn('performance.memory is only available in Chrome.');
  }

  // the functions to run
  var functions = null;

  /**
   * Set the runner functions.
   * @param {Array} funcs An array of functions in the form:
   * {name: string, func: Object}
   */
  this.setFunctions = function (funcs) {
    functions = funcs;
  };

  /**
   * Run the memory measures
   * @param {Object} buffer The data buffer.
   * @return {Array} An array of memory measures in the form:
   * {count: number, added: boolean, removed: boolean, value: string}
   */
  this.run = function (buffer) {
    // initial measure
    var previousMemory = performance.memory;

    var measures = [];
    for (var i = 0; i < functions.length; ++i) {
      // run the function
      var mem = functions[i].func(buffer);
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
  this.getFunctionHeader = function () {
    var header = [];
    for (var i = 0; i < functions.length; ++i) {
      header.push(functions[i].name);
    }
    return header;
  };

};
