// namespace
var dcmb = dcmb || {};

// default test data
var githubRaw = 'https://raw.githubusercontent.com/ivmartel/dcmbench/main/data/';
var defaultTestData = [
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
var dataRunner = new dcmb.DataRunner();
dataRunner.setDataList(defaultTestData);
var diffRunner = new dcmb.DiffFunctionRunner();
dataRunner.setFunctionRunner(diffRunner);

// listen to status changes
dataRunner.addEventListener('status-change', function (event) {
  var newStatus = event.value;

  // update gui
  var pStatus = document.getElementById('status');
  pStatus.innerHTML = newStatus;
  var button = document.getElementById('button');
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
    var meanDiffPercentage = 0;
    var dataHeader = dataRunner.getDataHeader();
    var results = dataRunner.getResults();
    for (var i = 0; i < results.length; ++i) {

      var dataName = dataHeader[i];
      var diff = results[i];

      // html display
      var preId = 'results-' + dataName;
      // diff button
      var dataButton = document.createElement('button');
      dataButton.onclick = function () {
        dcmb.onShowButton(preId);
      };
      dataButton.id = preId + '-show';
      dataButton.appendChild(document.createTextNode(dataName));
      // text display
      var pre = document.createElement('pre');
      pre.id = preId;
      pre.style.display = 'none';
      // append
      var div = document.getElementById('results');
      div.appendChild(dataButton);
      div.appendChild(pre);

      diff.forEach(function (part) {
        // limegreen for additions, crimson for deletions
        // grey for common parts
        var color = part.added ? 'white'
          : part.removed ? 'white' : 'grey';
        var bgcolor = part.added ? 'limegreen'
          : part.removed ? 'crimson' : 'white';

        var span = document.createElement('span');
        span.style.color = color;
        span.style.background = bgcolor;
        span.appendChild(document.createTextNode(part.value));
        pre.appendChild(span);
      });

      // similarity percentage
      var percent = diffRunner.getSimiarityPercent(diff);
      meanDiffPercentage += percent / results.length;

      var diffText = document.createElement('p');
      diffText.appendChild(
        document.createTextNode(percent.toPrecision(4) + '% similar.')
      );
      div.appendChild(diffText);
    }

    var meanDiffText = document.createElement('p');
    meanDiffText.className = 'diff-mean';
    meanDiffText.appendChild(document.createTextNode('Mean: ' +
      meanDiffPercentage.toPrecision(4) + '% similar.'));
    div.appendChild(meanDiffText);
  }
});

// called by the drag and drop
function updateDataList(datalist) {
  dataRunner.setDataList(datalist);
}

function checkSelected(parser) {
  return parser.selected === true;
}

// Handle change in the input file element.
// - Updates the data list by calling updateDataList.
dcmb.onChangeInput = function (files) {
  var inputData = [];
  for (var i = 0; i < files.length; ++i) {
    inputData.push({
      name: files[i].name,
      file: files[i]
    });
  }
  // call external function
  updateDataList(inputData);
};

dcmb.onChangeDefaultDataNumber = function (input) {
  for (var i = 0; i < defaultTestData.length; ++i) {
    if (i < input.value) {
      defaultTestData[i].selected = true;
    } else {
      defaultTestData[i].selected = false;
    }
  }
  dataRunner.setDataList(defaultTestData.filter(checkSelected));
};

// handle launch
dcmb.onLaunchButton = function () {
  // action according to status
  var status = dataRunner.getStatus();
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

// show/hide an element
dcmb.onShowButton = function (id) {
  var element = document.getElementById(id);
  if (element) {
    if (element.style.display === 'none') {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  }
};

// last minute
document.addEventListener('DOMContentLoaded', function (/*event*/) {
  // drag and drop
  dcmb.setupDragDrop();

  // output user agent
  var preAgent = document.createElement('pre');
  preAgent.appendChild(document.createTextNode('User agent: '));
  preAgent.appendChild(document.createTextNode(navigator.userAgent));
  var broDiv = document.getElementById('browser');
  broDiv.appendChild(preAgent);

  // data number input
  var inputDataQuantity = document.getElementById('data-quantity');
  inputDataQuantity.value = defaultTestData.length;
  inputDataQuantity.max = defaultTestData.length;
});

// iframe content is only available at window.onload time
window.onload = function () {
  diffRunner.setFunctions([
    {
      name: 'ctk-dcmjs',
      func: document.getElementById('iframe-ctk-dcmjs').contentWindow.dump
    },
    {
      name: 'dwv',
      func: document.getElementById('iframe-dwv').contentWindow.dump
    }
  ]);
};
