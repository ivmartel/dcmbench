/**
* Drag and drop related code.
* Expects:
* - a dropbox div with the id 'dropbox'
* - a function 'updateDataList' to pass the file list
*/

// Setup drag and drop
setupDragDrop = function () {
  var dropbox = document.getElementById("dropbox");
  dropbox.addEventListener("dragover", onDragOver);
  dropbox.addEventListener("dragleave", onDragLeave);
  dropbox.addEventListener("drop", onDrop);
};

// Handle drag over.
// Switches the drop box style to 'dropbox hover'.
onDragOver = function (event) {
  // prevent default handling
  event.stopPropagation();
  event.preventDefault();
  // update box
  var dropbox = document.getElementById("dropbox");
  dropbox.className = 'dropbox hover';
};

// Handle drag leave.
// Switches the drop box style to 'dropbox'.
onDragLeave = function (event) {
  // prevent default handling
  event.stopPropagation();
  event.preventDefault();
  // update box
  var dropbox = document.getElementById("dropbox");
  dropbox.className = 'dropBox';
};

// Handle drop.
// - Updates the data list by calling updateDataList.
// - Sets the text of the drop box.
onDrop = function (event) {
  // prevent default handling
  event.stopPropagation();
  event.preventDefault();
  // update the DicomDiff data
  var dragData = [];
  var files = event.dataTransfer.files;
  var filesString = "";
  for ( var i = 0; i < files.length; ++i ) {
    dragData.push( { "name": files[i].name,
      "file": files[i] } );
    filesString += files[i].name;
    if ( i !== files.length - 1 ) {
      filesString += ", ";
    }
  }
  // call external function
  updateDataList( dragData );
  // update box
  var dropbox = document.getElementById("dropbox");
  dropbox.innerHTML = filesString;
};

// Handle change in the input file element.
// - Updates the data list by calling updateDataList.
onChangeInput = function (files) {
  var inputData = [];
  for ( var i = 0; i < files.length; ++i ) {
    inputData.push( { "name": files[i].name,
      "file": files[i] } );
  }
  // call external function
  updateDataList( inputData );
};
