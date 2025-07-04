import {DicomParser} from 'dwv';

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

// Parse a DICOM buffer and dump its content.
export function dump(buffer) {
  // setup the dicom parser
  var dwvParser = new DicomParser();
  // parse the buffer
  dwvParser.parse(buffer);
  // return dump
  return dwvParser.getDicomElements();
};
