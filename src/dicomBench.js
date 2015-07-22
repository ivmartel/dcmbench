// benchmark.js
var Benchmark = Benchmark || {};

// Class to handle benchmarks.
// @param funcs The array of {name, func} to test.
// @param dataList The list of url to test the functions on.
DicomBench = function (funcs) {

  // closure to self
  var self = this;
  // data list
  var dataList = null;
  // file or url
  var isFile = null;
  // current data index
  var dataIndex = 0;
  // run index
  var runIndex = 0;
  // status
  var status = "ready";

  // get the status
  this.getStatus = function () {
    return status;
  };

  // set the data list
  this.setDataList = function (list) {
    if ( list.length !== 0 ) {
      dataList = list;
      isFile = ( typeof list[0].file === "undefined" ) ? false : true;
    }
  };

  // set the statue
  // @private
  setStatus = function (newStatus) {
    status = newStatus;
    // update gui
    var pStatus = document.getElementById("bench-status");
    pStatus.innerHTML = status;
    var button = document.getElementById("bench-button");
    button.disabled = false;
    if ( self.getStatus() === "ready" ||
      self.getStatus() === "done" ||
      self.getStatus() === "cancelled" ) {
      // run bench
      button.innerHTML = "Launch";
    }
    else if ( self.getStatus() === "running" ) {
      // cancel bench
      button.innerHTML = "Cancel";
    }
    else if ( self.getStatus() === "cancelling" ) {
      // disable button
      button.disabled = true;
    }
  };

  // cancel the benchmark(s)
  this.cancel = function () {
    setStatus("cancelling");
  };

  // run the benchmark(s)
  this.run = function () {
    var data = dataList[dataIndex];
    // console output
    console.log("Bench for: '" + data.name + "'");
    // status
    setStatus("running");

    // html display
    tableId = "bench-table-" + runIndex;
    var table = null;
    if ( dataIndex === 0 ) {
      // table
      table = document.createElement("table");
      table.id = tableId;
      // thead
      var hrow = table.insertRow();
      hrow.className = "header-row";
      var td0 = hrow.insertCell();
      var td = null;
      td0.appendChild(document.createTextNode(""));
      for ( var i = 0; i < funcs.length; ++i ) {
        td = hrow.insertCell();
        td.appendChild(document.createTextNode(funcs[i].name));
      }
      // append table to div
      var resDiv = document.getElementById("bench-results");
      resDiv.appendChild(table);
    }
    else {
      table = document.getElementById(tableId);
    }
    var row = null;

    // benchmark suite
    var suite = new Benchmark.Suite();
    // handle start of benchmark
    suite.on('start', function() {
      // header row
      var row = table.insertRow();
      var cell0 = row.insertCell();
      cell0.appendChild(document.createTextNode(data.name));
      for ( var i = 0; i < funcs.length; ++i ) {
        row.insertCell();
      }
    });
    // handle end of cycle
    suite.on('cycle', function(event) {
      // console output
      console.log(String(event.target));
      // html output
      var hz = event.target.hz;
      var opsPerSec = hz.toFixed(hz < 100 ? 2 : 0);
      var text = String(opsPerSec);
      // html
      var tName = event.target.name;
      var index = -1;
      for (var i = 0; i < funcs.length; ++i) {
        if ( funcs[i].name === tName ) {
          index = i;
          break;
        }
      }
      if ( index === -1 ) {
        // exception
        throw new Error("No function found.");
      }
      var cellId = index + 1;
      var cell = table.rows[dataIndex+1].cells[cellId];
      cell.appendChild(document.createTextNode(text));

      // check if cancelling
      if ( self.getStatus() === "cancelling" ) {
        this.abort();
      }
    });
    // handle end of benchmark
    suite.on('complete', function() {
      // check status
      if ( self.getStatus() !== "cancelled" ) {
        // launch next
        ++dataIndex;
        if ( dataIndex < dataList.length ) {
          self.run();
        }
        else {
          ++runIndex;
          dataIndex = 0;
          setStatus("done");
        }
      }
    });
    // handle abort
    suite.on('abort', function(event) {
      ++runIndex;
      dataIndex = 0;
      setStatus("cancelled");
    });

    // handle loaded data
    var onloadBuffer = function (buffer) {
      // avoid creating functions in loops
      var getFunc = function (f, a) {
        return function () {
          f(a);
        };
      };
      // add parsers to suite
      for ( var i = 0; i < funcs.length; ++i ) {
        suite.add(funcs[i].name, getFunc(funcs[i].func, buffer) );
      }
      // run async
      suite.run({ 'async': true });
    };

    // read according to type
    if ( isFile ) {
      // FileReader
      var reader = new FileReader();
      reader.onload = function (event) {
        onloadBuffer(event.target.result);
      };
      reader.readAsArrayBuffer(data.file);
    }
    else {
      // XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', data.url, true);
      request.responseType = "arraybuffer";
      request.onload = function (/*event*/) {
        onloadBuffer(this.response);
      };
      request.send(null);
    }
  };
};
