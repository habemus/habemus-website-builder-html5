// third-party
const Bluebird = require('bluebird');
const plumber  = require('gulp-plumber');
const imagemin = require('gulp-imagemin');

// own
const BuildReport = require('../lib/build-report');

function buildImages(options, vfs, logger) {

  var report = new BuildReport('build-html5:images');
  report.start();

  return new Bluebird((resolve, reject) => {

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
        },
      }))
      .pipe(imagemin())
      .pipe(vfs.dest('.'))
      .on('end', () => {
        resolve(report.finish());
      });
  });

}

module.exports = buildImages;
