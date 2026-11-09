import daikon from 'daikon';

/**
 * Parse a DICOM buffer.
 *
 * @param {ArrayBuffer} buffer The DICOM buffer.
 */
export function parse(buffer) {
  // get data view
  const data = new DataView(buffer);
  // parse the data
  daikon.Series.parseImage(data);
};
