import {DataRunner} from '../src/dataRunner.js';
import {MemoryFunctionRunner} from '../src/memoryFunctionRunner.js';
import {createTable, getMeans} from '../src/gui.js';
import {setupDragDrop} from '../src/dragndrop.js';

//import {parse2 as dcmjsParse2} from './parsers/dcmjs.js';
import {parse2 as dwvPrevParse2} from './parsers/dwv-previous.js';
import {parse2 as dwvParse2} from './parsers/dwv.js';

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
    selected: true
  },
  {
    name: 'dicompyler-ct.0',
    url: githubRaw + 'dicompyler-ct.0.dcm',
    selected: true
  },
  {
    name: 'gdcm-CR-MONO1-10-chest',
    url: githubRaw + 'gdcm-CR-MONO1-10-chest.dcm',
    selected: true
  },
  {
    name: 'gdcm-CT-MONO2-8-abdo',
    url: githubRaw + 'gdcm-CT-MONO2-8-abdo.dcm',
    selected: true
  },
  //{
  //  "name": "gdcm-US-RGB-8-epicard",
  //  "url": githubRaw + "gdcm-US-RGB-8-epicard.dcm",
  //  "selected": true
  //},
  {
    name: 'gdcm-US-RGB-8-esopecho',
    url: githubRaw + 'gdcm-US-RGB-8-esopecho.dcm',
    selected: true
  }
];

// create runner objects
const dataRunner = new DataRunner();
dataRunner.setDataList(defaultTestData.filter(checkSelected));
const memoryRunner = new MemoryFunctionRunner();
dataRunner.setFunctionRunner(memoryRunner);

memoryRunner.setFunctions([
  //{name: 'dcmjs', func: dcmjsParse2},
  {name: 'dwv-previous', func: dwvPrevParse2},
  {name: 'dwv', func: dwvParse2}
]);

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
    const means = ['Mean'].concat(getMeans(results));
    // add to result div
    div.appendChild(createTable(
      memoryRunner.getFunctionHeader(), dataHeader, results, means
    ));
  }
});

// called by the drag and drop
function updateDataList(datalist) {
  dataRunner.setDataList(datalist);
}

function checkSelected(data) {
  return data.selected === true;
}

// Handle change in the input file element.
// - Updates the data list by calling updateDataList.
function onChangeInput(event) {
  const inputData = [];
  for (const file of event.target.files) {
    inputData.push({
      name: file.name,
      file: file
    });
  }
  updateDataList(inputData);
}

function onChangeDefaultDataNumber(event) {
  const newNumber = event.target.value;
  for (let i = 0; i < defaultTestData.length; ++i) {
    defaultTestData[i].selected = i < newNumber;
  }
  dataRunner.setDataList(defaultTestData.filter(checkSelected));
}

// handle launch
function onLaunchButton(/*event*/) {
  // action according to status
  const status = dataRunner.getStatus();
  if (status === 'ready' ||
    status === 'done' ||
    status === 'cancelled') {
    // run
    dataRunner.run();
  } else if (status === 'running') {
    // cancel
    dataRunner.cancel();
  }
}

function setupHtml() {
  const launchButton = document.getElementById('launch-button');
  launchButton.onclick = onLaunchButton;

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

  // output user agent
  const preAgent = document.createElement('pre');
  preAgent.appendChild(document.createTextNode('User agent: '));
  preAgent.appendChild(document.createTextNode(navigator.userAgent));
  const broDiv = document.getElementById('browser');
  broDiv.appendChild(preAgent);

  // data number input
  const inputDataQuantity = document.getElementById('data-quantity');
  inputDataQuantity.value = defaultTestData.length;
  inputDataQuantity.max = defaultTestData.length;
});
