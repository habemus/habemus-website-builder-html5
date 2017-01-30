// third-party
const Bluebird = require('bluebird');
const plumber  = require('gulp-plumber');
const imagemin = require('gulp-imagemin');

// constants
const CONSTANTS = require('../../shared/constants');

// own
const BuildReport = require('../lib/build-report');

function buildImages(options, vfs, logger) {

  var report = new BuildReport(CONSTANTS.TASK_NAME + ':images');
  report.start();

  return new Bluebird((resolve, reject) => {
    resolve(report.finish());
    var imageGlobs = [
      '**/*.{png,PNG}',
      '**/*.{jpg,jpeg,JPG,JPEG}',
      '**/*.{gif,GIF}',
      '**/*.{svg,SVG}',
    ];
    var imageStream = vfs.src(imageGlobs)
      .pipe(plumber({
        errorHandler: function (err) {
          logger.error(err);
          // upon error, stop compiling
          this.emit('end');
        },
      }))
      .pipe(imagemin())
      .pipe(vfs.dest('.'))
      .on('end', () => {
        resolve(report.finish());
      });
  })
  .catch((err) => {
    console.warn('ERROR', err);
    // ignore errors
    return err;
  });

}

module.exports = buildImages;
