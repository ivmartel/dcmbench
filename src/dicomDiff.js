// Class to handle dump diff.
// @param f1 The first function to test.
// @param f2 The second function to test.
// @param dataList The list of url to test the functions on.
DicomDiff = function (f1, f2, dataList) {

  // closure to self
  var self = this;
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
      // run diff
      button.innerHTML = "Launch";
    }
    else if ( self.getStatus() === "running" ) {
      // cancel diff
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
    var preId = "diff-results" + dataIndex;

    var button = document.createElement("button");
    button.onclick = function() {
      onShowButton(preId);
    };
    button.id = preId + "-show";
    button.appendChild(document.createTextNode(data.name));

    var pre = document.createElement("pre");
    pre.id = preId
    pre.style.display = "none";

    var div = document.getElementById("diff-results");
    div.appendChild(button);
    div.appendChild(pre);

    // real work
    var request = new XMLHttpRequest();
    request.open('GET', data.url, true);
    request.responseType = "arraybuffer";
    request.onload = function (/*event*/) {
      // closure to response
      var response = this.response;
      // run dumps
      dump1 = f1.func(response);
      dump2 = f2.func(response);
      // get diff
      var diff = JsDiff.diffChars(dump1, dump2);

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

    };
    request.send(null);
  };
};
