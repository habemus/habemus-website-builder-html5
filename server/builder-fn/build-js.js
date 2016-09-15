// third-party
const Bluebird = require('bluebird');
const plumber    = require('gulp-plumber');
const stripDebug = require('gulp-strip-debug');
const uglify     = require('gulp-uglify');

// constants
const CONSTANTS = require('../../shared/constants');

// own
const BuildReport = require('../lib/build-report');

function buildJS(options, vfs, logger) {

  var report = new BuildReport(CONSTANTS.TASK_NAME + ':js');
  report.start();

  return new Bluebird((resolve, reject) => {
    var jsGlobs = ['**/*.js'];
    var jsStream = vfs.src(jsGlobs)
      .pipe(plumber({
        errorHandler: function (err) {
          logger.error(err);
        },
      }))
      .pipe(stripDebug())
      .pipe(uglify())
      .pipe(vfs.dest('.'))
      .on('end', () => {
        resolve(report.finish());
      });
  });

}

module.exports = buildJS;
