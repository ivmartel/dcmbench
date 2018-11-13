// namespace
var dcmb = dcmb || {};

// Class to handle running functions.
dcmb.Memory = function () {

  var functions = null;

  this.setFunctions = function (funcs) {
    functions = funcs;
  };

  // handle loaded data
  this.run = function (buffer) {
    console.log(buffer);

    var mem0 = performance.memory;
    console.log("0", mem0);

    functions[0].func(buffer);

    var mem1 = performance.memory;
    console.log("1", mem1);
    var diff1 = mem1.usedJSHeapSize - mem0.usedJSHeapSize;
    console.log(diff1);

    functions[1].func(buffer);

    var mem2 = performance.memory;
    console.log("2", mem2);
    var diff2 = mem2.usedJSHeapSize - mem1.usedJSHeapSize;
    console.log(diff2);

    return [["mem1", "mem2"], [diff1, diff2]];
  };

};
