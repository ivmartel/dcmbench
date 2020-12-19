// namespace
var dcmb = dcmb || {};

/**
* Drag and drop related code.
* Expects:
* - a dropbox div with the id 'dropbox'
* - a function 'updateDataList' to pass the file list
*/

// Setup drag and drop.
dcmb.setupDragDrop = function (callback) {
  var dropbox = document.getElementById('dropbox');
  dropbox.addEventListener('dragover', dcmb.onDragOver);
  dropbox.addEventListener('dragleave', dcmb.onDragLeave);
  dropbox.addEventListener('drop', dcmb.getOnDrop(callback));
};

// Handle drag over.
// Switches the drop box style to 'dropbox hover'.
dcmb.onDragOver = function (event) {
  // prevent default handling
  event.stopPropagation();
  event.preventDefault();
  // update box
  var dropbox = document.getElementById('dropbox');
  dropbox.className = 'dropbox hover';
};

// Handle drag leave.
// Switches the drop box style to 'dropbox'.
dcmb.onDragLeave = function (event) {
  // prevent default handling
  event.stopPropagation();
  event.preventDefault();
  // update box
  var dropbox = document.getElementById('dropbox');
  dropbox.className = 'dropBox';
};

// Handle drop.
// - Updates the data list by calling updateDataList.
// - Sets the text of the drop box.
dcmb.getOnDrop = function (callback) {
  return function (event) {
    // prevent default handling
    event.stopPropagation();
    event.preventDefault();
    // update the DicomDiff data
    var dragData = [];
    var files = event.dataTransfer.files;
    var filesString = '';
    for (var i = 0; i < files.length; ++i) {
      dragData.push({name: files[i].name,
        file: files[i]});
      filesString += files[i].name;
      if (i !== files.length - 1) {
        filesString += ', ';
      }
    }
    // call external function
    callback(dragData);
    // update box
    var dropbox = document.getElementById('dropbox');
    dropbox.innerHTML = filesString;
  };
};
