import dcmjs from 'dcmjs';

// Parse a DICOM buffer.
export function parse(buffer) {
  // parse data
  var dicomData = dcmjs.data.DicomMessage.readFile(buffer);
  // interpret data
  dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
};

// Parse a DICOM buffer and return the memory.
export function parse2(buffer) {
  // parse data
  var dicomData = dcmjs.data.DicomMessage.readFile(buffer);
  // interpret data
  dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  // return the memory state
  return performance.memory;
};
