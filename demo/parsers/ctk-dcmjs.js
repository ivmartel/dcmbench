// ctk-dcmjs is an emscripten build of dcmtk that only works as globals:
// the page must load (as classic scripts, before this module):
// - ext/ctk-dcmjs/libs/jquery-1.11.0.min.js
// - ext/ctk-dcmjs/libs/dcmjs-nico.js
// - ext/ctk-dcmjs/utils.js
// which define window.Module, window.FS and window.dcmjs.

/**
 * Run dcmdump on a buffer.
 *
 * @param {ArrayBuffer} buffer The DICOM buffer.
 * @param {string[]} options Extra dcmdump options.
 * @returns {string} The dcmdump output.
 */
function dcmdump(buffer, options) {
  // store lines (avoids console log)
  let dumpText = '';
  window.Module.print = function (s) {
    dumpText += s + '\n';
  };
  // write to the emscripten file system
  const fileName = 'dcmjs-temp.dcm';
  const content = new Int8Array(buffer);
  window.FS.writeFile(fileName, content, {encoding: 'binary'});
  // run dcmtk command
  window.dcmjs.utils.execute('dcmdump', [fileName].concat(options));
  return dumpText;
}

/**
 * Parse a DICOM buffer.
 *
 * @param {ArrayBuffer} buffer The DICOM buffer.
 */
export function parse(buffer) {
  dcmdump(buffer, []);
};

/**
 * Parse a DICOM buffer and dump its content.
 *
 * @param {ArrayBuffer} buffer The DICOM buffer.
 * @returns {string} The dump.
 */
export function dump(buffer) {
  return dcmdump(buffer, ['-Un']);
};
