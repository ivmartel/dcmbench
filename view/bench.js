import {BenchFunctionRunner} from '../src/benchFunctionRunner.js';
import {DataRunner} from '../src/dataRunner.js';
import {createTable, getMeans} from '../src/gui.js';
import {setupDragDrop} from '../src/dragndrop.js';

import {parse as dcmjsParse} from './parsers/dcmjs.js';
import {parse as dpParse} from './parsers/dicomParser.js';
//import {parse as dwvPrevParse} from './parsers/dwv-previous.js';
import {parse as dwvParse} from './parsers/dwv.js';

// default test data
const githubRaw = 'https://raw.githubusercontent.com/ivmartel/dcmbench/main/data/';
const defaultTestData = [
  {
    name: 'osirix-toutatix-100',
    url: githubRaw + 'osirix-toutatix-100.dcm',
    selected: true
  },
  {
    name: 'osirix-goudurix',
    url: githubRaw + 'osirix-goudurix.dcm',
    selected: false
  },
  {
    name: 'dicompyler-ct.0',
    url: githubRaw + 'dicompyler-ct.0.dcm',
    selected: false
  },
  {
    name: 'gdcm-CR-MONO1-10-chest',
    url: githubRaw + 'gdcm-CR-MONO1-10-chest.dcm',
    selected: false
  },
  {
    name: 'gdcm-CT-MONO2-8-abdo',
    url: githubRaw + 'gdcm-CT-MONO2-8-abdo.dcm',
    selected: false
  },
  //{
  //  "name": "gdcm-US-RGB-8-epicard",
  //  "url": githubRaw + "gdcm-US-RGB-8-epicard.dcm",
  //  "selected": false
  //},
  {
    name: 'gdcm-US-RGB-8-esopecho',
    url: githubRaw + 'gdcm-US-RGB-8-esopecho.dcm',
    selected: false
  }
];
const parserFunctions = [
  //{name: 'ctk-dcmjs', selected: false},
  //{name: 'daikon', selected: false, func: daikonParse},
  {name: 'dcmjs', selected: false, func: dcmjsParse},
  {name: 'dicomParser', selected: true, func: dpParse},
  //{name: 'dwv-previous', selected: false, func: dwvPrevParse},
  {name: 'dwv', selected: true, func: dwvParse}
];

// create default runner object
const dataRunner = new DataRunner();
dataRunner.setDataList(defaultTestData.filter(checkSelected));
const benchRunner = new BenchFunctionRunner();
dataRunner.setFunctionRunner(benchRunner);

benchRunner.setFunctions(parserFunctions.filter((checkSelected)));

// listen to status changes
dataRunner.addEventListener('status-change', function (event) {
  const newStatus = event.value;

  // status text
  const pStatus = document.getElementById('status');
  pStatus.innerHTML = newStatus;
  // main button
  const button = document.getElementById('launch-button');
  button.disabled = false;
  if (newStatus === 'ready' ||
    newStatus === 'done' ||
    newStatus === 'cancelled') {
    // update button
    button.innerHTML = 'Launch';
  } else if (newStatus === 'running') {
    // update button
    button.innerHTML = 'Cancel';
  } else if (newStatus === 'cancelling') {
    // disable button
    button.disabled = true;
  }

  if (newStatus === 'done') {
    const div = document.getElementById('results');
    const dataHeader = dataRunner.getDataHeader();
    const results = dataRunner.getResults();
    // use means as table foot
    let means = ['Mean'];
    means = means.concat(getMeans(results));
    // add to result div
    div.appendChild(createTable(
      benchRunner.getFunctionHeader(), dataHeader, results, means
    ));
  }
});

// called by the drag and drop
function updateDataList(datalist) {
  dataRunner.setDataList(datalist);
}

function checkSelected(parser) {
  return parser.selected === true;
}

function setupParsers() {
  const divParsers = document.getElementById('parsers');
  const fieldsetElem = divParsers.getElementsByTagName('fieldset')[0];

  let parserName = '';
  for (let parseFunc of parserFunctions) {
    parserName = parseFunc.name;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'parsers';
    input.id = parserName;
    input.value = parserName;
    input.onclick = function () {
      onChangeParsers(this);
    };
    input.checked = parseFunc.selected;
    const label = document.createElement('label');
    label.htmlFor = parserName;
    label.appendChild(document.createTextNode(parserName));

    fieldsetElem.appendChild(input);
    fieldsetElem.appendChild(label);
  }
}

function onChangeParsers(input) {
  for (let i = 0; i < parserFunctions.length; ++i) {
    if (parserFunctions[i].name === input.value) {
      parserFunctions[i].selected = input.checked;
      break;
    }
  }
  benchRunner.setFunctions(parserFunctions.filter(checkSelected));
}

// Handle change in the input file element.
// - Updates the data list by calling updateDataList.
function onChangeInput(event) {
  const newfiles = event.target.files;
  const inputData = [];
  for (let file of newfiles) {
    inputData.push({
      name: file.name,
      file: file
    });
  }
  // call external function
  updateDataList(inputData);
};

function onChangeDefaultDataNumber(event) {
  const newNumber = event.target.value;
  for (let i = 0; i < defaultTestData.length; ++i) {
    if (i < newNumber) {
      defaultTestData[i].selected = true;
    } else {
      defaultTestData[i].selected = false;
    }
  }
  dataRunner.setDataList(defaultTestData.filter(checkSelected));
};

// handle launch
function onLaunchButton(/*event*/) {
  // action according to status
  let status = dataRunner.getStatus();
  if (status === 'ready' ||
    status === 'done' ||
    status === 'cancelled') {
    // run
    dataRunner.run();
  } else if (status === 'running') {
    // cancel
    dataRunner.cancel();
  }
};

function setupHtml() {
  const lauchButton = document.getElementById('launch-button');
  lauchButton.onclick = onLaunchButton;

  const dataNumberInput = document.getElementById('data-quantity');
  dataNumberInput.onchange = onChangeDefaultDataNumber;

  const fileInput = document.getElementById('file-input');
  fileInput.onchange = onChangeInput;
}

// last minute
document.addEventListener('DOMContentLoaded', function (/*event*/) {
  // setup html
  setupHtml();

  // drag and drop
  setupDragDrop(updateDataList);

  // parsers
  setupParsers();

  // output user agent
  const preAgent = document.createElement('pre');
  preAgent.appendChild(document.createTextNode('User agent: '));
  preAgent.appendChild(document.createTextNode(navigator.userAgent));
  const broDiv = document.getElementById('browser');
  broDiv.appendChild(preAgent);

  // data number input
  const inputDataQuantity = document.getElementById('data-quantity');
  inputDataQuantity.value = 1;
  inputDataQuantity.max = defaultTestData.length;
});

// iframe content is only available at window.onload time
// window.onload = function () {
//   let ifname = '';
//   let func;
//   for (let i = 0; i < parserFunctions.length; ++i) {
//     ifname = 'iframe-' + parserFunctions[i].name;
//     func = document.getElementById(ifname).contentWindow.parse;
//     if (func) {
//       parserFunctions[i].func = func;
//     }
//   }
//   benchRunner.setFunctions(parserFunctions.filter(checkSelected));
// };
