// namespace
var dcmb = dcmb || {};
// benchmark.js
var Benchmark = Benchmark || {};

// Class to handle benchmarks.
dcmb.DicomBench = function () {

  // closure to self
  var self = this;
  // data list
  var dataList = null;
  // function list
  var funcs = null;
  // file or url
  var isFile = null;
  // current data index
  var dataIndex = 0;
  // run index
  var runIndex = 0;
  // status
  var status = "ready";

  var results = [];

  // Get the status.
  this.getStatus = function () {
    return status;
  };

  // Set the data list.
  this.setDataList = function (list) {
    if ( list.length !== 0 ) {
      dataList = list;
      isFile = ( typeof list[0].file === "undefined" ) ? false : true;
    }
  };

  // Set the function list.
  this.setFunctionList = function (list) {
    if ( list.length !== 0 ) {
      funcs = list;
    }
  };

  // Set the status.
  // @private
  var setStatus = function (newStatus) {
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

  // Cancel the process.
  this.cancel = function () {
    setStatus("cancelling");
  };

  // Run the process.
  this.run = function () {
    var data = dataList[dataIndex];
    // console output
    console.log("Bench for: '" + data.name + "'");
    // status
    setStatus("running");

    // html display
    var tableId = "bench-table-" + runIndex;
    var table = null;
    if ( dataIndex === 0 ) {
      // table
      table = document.createElement("table");
      table.id = tableId;
      // thead
      dcmb.insertHeadRow(table, funcs);
      // append table to div
      var resDiv = document.getElementById("bench-results");
      resDiv.appendChild(table);
      // reset results
      results = [];
    } else {
      table = document.getElementById(tableId);
    }

    // insert a new results row
    results.push([]);

    // benchmark suite
    var suite = new Benchmark.Suite("bench");
    // handle start of benchmark
    suite.on('start', function() {
      // result row
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
      var opsPerSec = event.target.hz;
      var opsPerSecText = opsPerSec.toFixed(opsPerSec < 100 ? 2 : 0);
      var rme = event.target.stats.rme;
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
      // is it the first column
      var isFirst = results[dataIndex].length === 0;
      // store results
      results[dataIndex].push(opsPerSec);

      // add data to the table cell
      var cellId = index + 1;
      var cell = table.rows[dataIndex+1].cells[cellId];
      cell.appendChild(document.createTextNode(opsPerSecText + " "));
      cell.appendChild(dcmb.getRmeSpan(rme));
      if (!isFirst) {
        cell.appendChild(document.createTextNode(" "));
        cell.appendChild(dcmb.getDiffSpan(results[dataIndex][0], opsPerSec));
      }

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
          // insert a mean row if more than one data
          if ( dataList.length > 1 ) {
            var means = dcmb.getMeans(results);
            dcmb.insertMeanRow(table, means);
          }

          ++runIndex;
          dataIndex = 0;
          setStatus("done");
        }
      }
    });
    // handle abort
    suite.on('abort', function(/*event*/) {
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
