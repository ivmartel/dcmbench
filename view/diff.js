import {DataRunner} from '../src/dataRunner.js';
import {DiffFunctionRunner} from '../src/diffFunctionRunner.js';
import {setupDragDrop} from '../src/dragndrop.js';

import {dump as ctkDcmjsDump} from './parsers/ctk-dcmjs.js';
import {dump as dwvDump} from './parsers/dwv.js';

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
const diffRunner = new DiffFunctionRunner();
dataRunner.setFunctionRunner(diffRunner);

diffRunner.setFunctions([
  {name: 'ctk-dcmjs', func: ctkDcmjsDump},
  {name: 'dwv', func: dwvDump}
]);

// listen to status changes
dataRunner.addEventListener('status-change', function (event) {
  const newStatus = event.value;

  // update gui
  const pStatus = document.getElementById('status');
  pStatus.innerHTML = newStatus;
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
    showResults();
  }
});

/**
 * Display the diff results.
 */
function showResults() {
  const div = document.getElementById('results');
  const dataHeader = dataRunner.getDataHeader();
  const results = dataRunner.getResults();
  let meanDiffPercentage = 0;
  for (let i = 0; i < results.length; ++i) {
    const dataName = dataHeader[i];
    const diff = results[i];

    // html display
    const preId = 'results-' + dataName;
    // diff button
    const dataButton = document.createElement('button');
    dataButton.onclick = function () {
      onShowButton(preId);
    };
    dataButton.id = preId + '-show';
    dataButton.appendChild(document.createTextNode(dataName));
    // text display
    const pre = document.createElement('pre');
    pre.id = preId;
    pre.style.display = 'none';
    // append
    div.appendChild(dataButton);
    div.appendChild(pre);

    for (const part of diff) {
      // limegreen for additions, crimson for deletions
      // grey for common parts
      const color = part.added || part.removed ? 'white' : 'grey';
      let bgcolor = 'white';
      if (part.added) {
        bgcolor = 'limegreen';
      } else if (part.removed) {
        bgcolor = 'crimson';
      }

      const span = document.createElement('span');
      span.style.color = color;
      span.style.background = bgcolor;
      span.appendChild(document.createTextNode(part.value));
      pre.appendChild(span);
    }

    // similarity percentage
    const percent = diffRunner.getSimiarityPercent(diff);
    meanDiffPercentage += percent / results.length;

    const diffText = document.createElement('p');
    diffText.appendChild(
      document.createTextNode(percent.toPrecision(4) + '% similar.')
    );
    div.appendChild(diffText);
  }

  const meanDiffText = document.createElement('p');
  meanDiffText.className = 'diff-mean';
  meanDiffText.appendChild(document.createTextNode('Mean: ' +
    meanDiffPercentage.toPrecision(4) + '% similar.'));
  div.appendChild(meanDiffText);
}

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

// show/hide an element
function onShowButton(id) {
  const element = document.getElementById(id);
  if (element) {
    if (element.style.display === 'none') {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
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
