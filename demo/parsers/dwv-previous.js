// dwv-previous is a vendored UMD build that cannot be bundled alongside
// the current dwv: the page must load it as a classic script, before this
// module, which defines window.dwv:
// - ext/dwv-previous/dwv.min.js

/**
 * Parse a DICOM buffer.
 *
 * @param {ArrayBuffer} buffer The DICOM buffer.
 */
export function parse(buffer) {
  // setup the dicom parser
  const dwvParser = new window.dwv.DicomParser();
  // parse the buffer
  dwvParser.parse(buffer);
};

/**
 * Parse a DICOM buffer and return the memory.
 *
 * @param {ArrayBuffer} buffer The DICOM buffer.
 * @returns {object} The memory state (performance.memory).
 */
export function parse2(buffer) {
  // setup the dicom parser
  const dwvParser = new window.dwv.DicomParser();
  // parse the buffer
  dwvParser.parse(buffer);
  // return the memory state
  return performance.memory;
};
