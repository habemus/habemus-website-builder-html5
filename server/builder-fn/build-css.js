// third-party
const Bluebird = require('bluebird');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss     = require('gulp-clean-css');

// constants
const CONSTANTS = require('../../shared/constants');

// own
const BuildReport = require('../lib/build-report');

// constants
const AUTOPREFIXER_OPTIONS = {
  browsers: [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ],
  cascade: false
};


function buildCSS(options, vfs, logger) {

  var report = new BuildReport(CONSTANTS.TASK_NAME + ':css');
  report.start();

  return new Bluebird((resolve, reject) => {
    var cssGlobs = [
      '**/*.css',
      '**/.habemus',
      '**/.habemus/**',
      '**/.git',
      '**/.git/**'
    ];
    var cssStream = vfs.src(cssGlobs, { dot: true })
      .pipe(plumber({
        errorHandler: function (err) {
          logger.error(err);
          this.emit('end');
        },
      }))
      .pipe(autoprefixer(AUTOPREFIXER_OPTIONS))
      .pipe(cleanCss())
      .pipe(vfs.dest('.'))
      .on('end', () => {
        resolve(report.finish());
      });
  })
  .catch((err) => {
    console.warn('ERROR', err);
    // ignore errors
    return;
  });

}

module.exports = buildCSS;
