// namespace
var dcmb = dcmb || {};

/**
 * Get an html span with input text.
 * @param {string} txt The span text.
 * @returns {Object} A DOM span.
 */
dcmb.getDomSpan = function (text) {
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(text));
  return span;
};

/**
 * Get an html span with the difference of the two input values as a percentage.
 * @param {number} base The base number.
 * @param {number} current The number to compare to the base.
 * @returns {Object} A DOM span inculding the percentage text.
 */
dcmb.getDiffSpan = function (base, current) {
  var diff = current - base;
  var sign = diff >= 0 ? "+" : "";
  var percent = diff * 100 / base;
  var percentTxt = percent.toFixed(percent < 100 ? 2 : 0);

  var span = dcmb.getDomSpan("(" + sign + percentTxt + "%)");
  span.className = "stats";
  span.className += diff >= 0 ? " green" : " red";
  return span;
};

/**
 * Get an html span with input Root Mean Error (RME).
 * @param {number} rme The RME.
 * @returns {Object} A DOM span inculding the rme text.
 */
dcmb.getRmeSpan = function (rme) {
  var rmeTxt = rme.toFixed(rme < 100 ? 2 : 0);
  var span = dcmb.getDomSpan("\u00B1" + rmeTxt + "%");
  span.className = "stats";
  span.className += Math.abs(rme) >= 10 ? " red" : " green";
  return span;
};

/**
 * Insert a header row in a table with the function names as cell value.
 * @param {Object} table The DOM table.
 * @param {Array} funcs The list of functions.
 */
dcmb.insertHeadRow = function (table, funcs) {
  var hrow = table.insertRow();
  hrow.className = "header-row";
  var td0 = hrow.insertCell();
  td0.appendChild(document.createTextNode(""));
  var td = null;
  for ( var i = 0; i < funcs.length; ++i ) {
    td = hrow.insertCell();
    td.appendChild(document.createTextNode(funcs[i].name));
  }
};

/**
 * Get the mean values of each columns of the input array.
 * @param {Array} results The value array of arrays.
 * @returns {Array} A vector with each columns mean.
 */
dcmb.getMeans = function (results) {
  var nrows = results.length;
  var ncols = results[0].length;
  // check number of cols
  for (var i = 0; i < nrows; ++i) {
    if (results[i].length !== ncols) {
      throw new Error("Different number of columns...");
    }
  }
  // sum along columns
  var means = [];
  for (var j = 0; j < ncols; ++j) {
    var sum = 0;
    for (var k = 0; k < nrows; ++k) {
      sum += results[k][j];
    }
    means.push(Math.round(sum/nrows));
  }
  return means;
};

/**
 * Insert a row in a table with the mean values as cell value.
 * @param {Object} table The DOM table.
 * @param {Array} means The list of means.
 */
dcmb.insertMeanRow = function (table, means) {
  var hrow = table.insertRow();
  hrow.className = "header-row";
  var td0 = hrow.insertCell();
  td0.appendChild(document.createTextNode("Mean"));
  var td = null;
  for ( var i = 0; i < means.length; ++i ) {
    td = hrow.insertCell();
    td.appendChild(document.createTextNode(means[i]));
    if ( i !== 0 ) {
      td.appendChild(document.createTextNode(" "));
      td.appendChild(dcmb.getDiffSpan(means[0], means[i]));
    }
  }
};

dcmb.createTable = function (arrayData) {
  var table = document.createElement('table');

  var tableHead = document.createElement('thead');
  var tableBody = document.createElement('tbody');

  for (var i = 0; i < arrayData.length; ++i) {
    var rowData = arrayData[i];
    var row = document.createElement('tr');

    for (var j = 0; j < rowData.length; ++j) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(rowData[j]));
      row.appendChild(cell);
    }

    if (i === 0) {
      tableHead.appendChild(row);
    } else {
      tableBody.appendChild(row);
    }
  }

  table.appendChild(tableHead);
  table.appendChild(tableBody);
  return table;
};
