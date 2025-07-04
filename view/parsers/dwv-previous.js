// needs webpack-dev modif to allow dynamic import
// output: {module: true}, experiments: {outputModule: true},
// but still not working...
import {DicomParser} from 'https://esm.sh/dwv@0.34.2';

// Parse a DICOM buffer.
export function parse(buffer) {
  // setup the dicom parser
  var dwvParser = new DicomParser();
  // parse the buffer
  dwvParser.parse(buffer);
};

// Parse a DICOM buffer and return the memory.
export function parse2(buffer) {
  // setup the dicom parser
  var dwvParser = new DicomParser();
  // parse the buffer
  dwvParser.parse(buffer);
  // return the memory state
  return performance.memory;
};
