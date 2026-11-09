// data folder url, according to the build mode
// (process.env.NODE_ENV is replaced by webpack with the 'mode'):
// - production: the 'data' folder on github main (not deployed),
// - development: the local 'data' folder served by the dev server
//   (relative to the demo pages, see webpack.dev.js).
const dataUrl = process.env.NODE_ENV === 'production'
  ? 'https://raw.githubusercontent.com/ivmartel/dcmbench/main/data/'
  : 'data/';

// default test data names (files are '<name>.dcm' in the data folder)
const dataNames = [
  'osirix-toutatix-100',
  'osirix-goudurix',
  'dicompyler-ct.0',
  'gdcm-CR-MONO1-10-chest',
  'gdcm-CT-MONO2-8-abdo',
  //'gdcm-US-RGB-8-epicard',
  'gdcm-US-RGB-8-esopecho'
];

/**
 * Get the default test data list.
 *
 * @param {number} [numberSelected] The number of selected data, starting
 *   from the first one, defaults to all.
 * @returns {object[]} A new list of {name, url, selected} objects.
 */
export function getDefaultTestData(numberSelected) {
  if (typeof numberSelected === 'undefined') {
    numberSelected = dataNames.length;
  }
  return dataNames.map((name, index) => ({
    name: name,
    url: dataUrl + name + '.dcm',
    selected: index < numberSelected
  }));
}
