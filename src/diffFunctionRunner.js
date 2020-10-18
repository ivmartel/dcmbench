// namespace
var dcmb = dcmb || {};
// diff lib
var Diff = Diff || {};

/**
 * Diff function runner
 * Get the difference between the text outputs of two functions.
 */
dcmb.DiffFunctionRunner = function () {

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
   * Run functions and diff their output.
   * @param {Object} buffer The data buffer.
   * @return {Array} An array of dump differences in the form:
   * {count: number, added: boolean, removed: boolean, value: string}
   */
  this.run = function (buffer) {
    // run dumps
    var dump0 = functions[0].func(buffer);
    var dump1 = functions[1].func(buffer);
    // get diff
    return Diff.diffChars(dump0, dump1);
  };

  /**
   * Calculate a similarity percentage.
   * @param {Array} An array of differences as returned by JsDiff.
   * @return {Number} The similarity percentage.
   */
  this.getSimiarityPercent = function (diff) {
    // count similar and total
    var nSame = 0;
    var total = 0;
    diff.forEach(function (part) {
      if (!part.added && !part.removed) {
        nSame += part.value.length;
      }
      total += part.value.length;
    });
    // return percentage
    return nSame * 100 / total;
  };

};
