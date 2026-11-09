import {parseDicom} from 'dicom-parser';

// Parse a DICOM buffer.
export function parse(buffer) {
  // convert to uint
  var content = new Uint8Array(buffer);
  // parse
  parseDicom(content);
};
