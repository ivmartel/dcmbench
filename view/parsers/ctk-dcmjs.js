
// // Parse a DICOM buffer.
// export function parse(buffer) {
//   // avoid console log
//   var dumpLines = [];
//   Module.print = function (s) {
//     dumpLines.push(s);
//   };
//   // temp file name
//   var fileName = 'dcmjs-temp.dcm';
//   // write to FileSystem
//   var content = new Int8Array(buffer);
//   FS.writeFile(fileName, content, {encoding: "binary"});
//   // run dcmtk command
//   dcmjs.utils.execute('dcmdump', [fileName]);
// };

// // Parse a DICOM buffer and dump its content
// export function dump(buffer) {
//   // store lines
//   var dumpLines = [];
//   Module.print = function (s) {
//     dumpLines += s + "\n";
//   };
//   // temp file name
//   var fileName = 'temp';
//   // write to FileSystem
//   var content = new Int8Array(buffer);
//   FS.writeFile(fileName, content, {encoding: "binary"});
//   // run dcmtk command
//   dcmjs.utils.execute('dcmdump', [fileName, "-Un"]);
//   // return lines
//   return dumpLines;
// };
