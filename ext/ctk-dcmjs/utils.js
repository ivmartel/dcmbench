var dcmjs = dcmjs || {};
dcmjs.utils = dcmjs.utils || {};

//
///  Emscripten Related
//

/*
  Emscripten namespace
*/
var Module = Module || {};

/*
  Convenience function loading dcmjs.js asynchronously
*/
dcmjs.utils.initialize = function() {

  if (typeof Pace != 'undefined') {
    Pace.on("done", function(){
      $('#main_content').show(0);
    });
  }

  $.getScript("../javascripts/libs/dcmjs.js");
}

//
///  Emscripten FS Related
//

// utility: check path in virtual fs
dcmjs.utils.fileExists = function(filePath) {
    try {
      FS.stat(filePath);
    }
    catch(e) {
      if (e.code !== 'ENOENT') {
        print(e);
      }
      return false;
    }
    return true;
};

// utility: remove files in a file list (if they exist)
dcmjs.utils.deleteFiles = function(filePaths) {
  $.each(filePaths, function(index,filePath) {
    try {
      FS.unlink(filePath);
    }
    catch(e) {
      if (e.code !== 'ENOENT') {
        print(e);
      }
    }
  });
};


//
///  DCMTK Related
//

/*
  Execute DCMTK program
*/
dcmjs.utils.execute = function(prog, arguments) {

  /*
  return Module.callMain([prog].concat(arguments));
  */

  var exit_orig = Module.exit;
  var exitCode;
  Module.exit = function(status) {
    exitCode = status;
    exit_orig(status);
  }
  Module.callMain([prog].concat(arguments));
  Module.exit = exit_orig;
  return exitCode;
}

/*
  Read the file and invoke processor function
*/
dcmjs.utils.readFile = function(file, processor, filePath) {
  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(file, filePath) {
    return function(e) { processor(reader, file, filePath) };
  })(file, filePath);
  //var blob = new Blob([typedArray], {type: 'application/octet-binary'});
  // Read in the image file
  reader.readAsArrayBuffer(file);
}

//
///  Browser File Related
//

dcmjs.utils.displayFileProperties = function(files) {
  // files is a FileList of File objects. List some properties.
  var output = [];
  $.each(files, function(index,file) {
    output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ',
                file.size, ' bytes, last modified: ',
                file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
  })
  $('#fileListProperties').innerHTML = '<ul>' + output.join('') + '</ul>';
}

$(function() {
  /*
    File management
        http://www.html5rocks.com/en/tutorials/file/dndfiles/
  */
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    //console.log('The File APIs ARE fully supported in this browser.');
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
})
