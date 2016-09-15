// third-party
const Bluebird = require('bluebird');

// builder functions
const buildJS     = require('./build-js');
const buildCSS    = require('./build-css');
const buildImages = require('./build-images');

// constants
const CONSTANTS = require('../../shared/constants');

// own
const BuildReport = require('../lib/build-report');

function buildHTML5(options, vfs, logger) {

  var overallReport = new BuildReport(CONSTANTS.TASK_NAME);
  overallReport.start();

  return Bluebird.all([
    buildCSS(options, vfs, logger),
    buildJS(options, vfs, logger),
    buildImages(options, vfs, logger)
  ])
  .then((reports) => {

    overallReport = overallReport.finish();

    overallReport.css    = reports[0];
    overallReport.js     = reports[1];
    overallReport.images = reports[2];

    return overallReport;
  });

}

module.exports = buildHTML5;
