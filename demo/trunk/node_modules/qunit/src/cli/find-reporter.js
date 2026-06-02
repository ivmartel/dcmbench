'use strict';

const requireFromCWD = require('./require-from-cwd');
const utils = require('./utils');
const pkg = require('../../package.json');

const hasOwn = Object.prototype.hasOwnProperty;

function findReporter (reporterName, builtin) {
  if (!reporterName) {
    return builtin.tap;
  }

  // Reporter is one of the built-in ones
  if (hasOwn.call(builtin, reporterName)) {
    return builtin[reporterName];
  }

  // Reporter is a module in node_modules, or (usually, relative) path to a local script
  try {
    return requireFromCWD(reporterName);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
  }

  // If we didn't find a reporter, display the available reporters and exit
  displayAvailableReporters(reporterName);
}

function displayAvailableReporters (inputReporterName) {
  const message = [];

  if (inputReporterName) {
    message.push(`No reporter found matching "${inputReporterName}".`);
  }

  // We don't advertise 'html', because it doesn't make sense in CLI context
  // We don't advertise 'perf', because it's unlikely to be useful as the only reporter
  // TODO: Add 'perf' after implementing https://github.com/qunitjs/qunit/issues/1784.
  const jsReporters = [
    'tap',
    'console'
  ];
  message.push(`Built-in reporters: ${jsReporters.join(', ')}`);

  const npmReporters = getReportersFromDependencies();
  if (npmReporters.length) {
    message.push(
      `Extra reporters found among package dependencies: ${npmReporters.join(', ')}`
    );
  }

  utils.error(message.join('\n'));
}

function getReportersFromDependencies () {
  const dependencies = [].concat(
    Object.keys(pkg.dependencies),
    Object.keys(pkg.devDependencies)
  );
  return dependencies.filter(dep => {
    try {
      const pkg = require(dep + '/package.json');

      return !!pkg.keywords && pkg.keywords.indexOf('js-reporter') !== -1;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
        throw e;
      }
    }

    return false;
  });
}

module.exports = {
  findReporter,
  displayAvailableReporters
};
