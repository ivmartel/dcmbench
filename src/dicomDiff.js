// Class to handle dump diff.
// @param f1 The first function to test.
// @param f2 The second function to test.
DicomDiff = function (f1, f2) {

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
  // mean percentage
  var meanDiffPercentage = 0;

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
    var pStatus = document.getElementById("diff-status");
    pStatus.innerHTML = status;
    var button = document.getElementById("diff-button");
    button.disabled = false;
    if ( self.getStatus() === "ready" ||
      self.getStatus() === "done" ||
      self.getStatus() === "cancelled" ) {
      // update button
      button.innerHTML = "Launch";
      meanDiffPercentage = 0;
    }
    else if ( self.getStatus() === "running" ) {
      // update button
      button.innerHTML = "Cancel";
    }
    else if ( self.getStatus() === "cancelling" ) {
      // disable button
      button.disabled = true;
    }
  };

  // cancel the diffs
  this.cancel = function () {
    setStatus("cancelling");
  };

  // run the diffs
  this.run = function () {
    var data = dataList[dataIndex];
    // console output
    console.log("Diff for: '" + data.name + "'");
    // status
    setStatus("running");

    // html display
    var preId = "diff-results-" + data.name;
    // launch button
    var button = document.createElement("button");
    button.onclick = function() {
      onShowButton(preId);
    };
    button.id = preId + "-show";
    button.appendChild(document.createTextNode(data.name));
    // text display
    var pre = document.createElement("pre");
    pre.id = preId;
    pre.style.display = "none";
    var div = document.getElementById("diff-results");
    // append
    div.appendChild(button);
    div.appendChild(pre);

    // handle loaded data
    var onloadBuffer = function (buffer) {
      // run dumps
      dump1 = f1.func(buffer);
      dump2 = f2.func(buffer);
      // get diff
      var diff = JsDiff.diffChars(dump1, dump2);
      // count
      var nSame = 0;
      var nDiff = 0;

      diff.forEach( function (part) {
        if ( part.added || part.removed ) {
          nDiff += part.value.length;
        }
        else {
          nSame += part.value.length;
        }
        // limegreen for additions, crimson for deletions
        // grey for common parts
        var color = part.added ? 'white' :
          part.removed ? 'white' : 'grey';
        var bgcolor = part.added ? 'limegreen' :
          part.removed ? 'crimson' : 'white';
        var span = document.createElement('span');
        span.style.color = color;
        span.style.background = bgcolor;
        span.appendChild( document.createTextNode(part.value) );
        pre.appendChild(span);
      });

      // similarity percentage
      var total = nSame + nDiff;
      var percent = nSame * 100 / total;
      var diffText = document.createElement("p");
      diffText.appendChild(document.createTextNode(percent.toPrecision(4) + "% similar."));
      div.appendChild(diffText);
      meanDiffPercentage += percent / dataList.length;

      // check status
      if ( self.getStatus() !== "cancelled" ) {
        // launch next
        ++dataIndex;
        if ( dataIndex < dataList.length ) {
          self.run();
        }
        else {
          var meanDiffText = document.createElement("p");
          meanDiffText.className = "diff-mean";
          meanDiffText.appendChild(document.createTextNode("Mean: " +
            meanDiffPercentage.toPrecision(4) + "% similar."));
          div.appendChild(meanDiffText);
          ++runIndex;
          dataIndex = 0;
          setStatus("done");
        }
      }
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
