// third-party
const Bluebird = require('bluebird');
const plumber    = require('gulp-plumber');
const stripDebug = require('gulp-strip-debug');
const uglify     = require('gulp-uglify');
const gulpIf     = require('gulp-if');
const filesizeParser = require('filesize-parser');

// constants
const CONSTANTS = require('../../shared/constants');
const MAX_JS_FILE_SIZE = filesizeParser('500KB');
const REALLY_SMALL_FILE_SIZE = filesizeParser('50KB');
const MIN_JS_RE = /\.min\.js$/;

// own
const BuildReport = require('../lib/build-report');

function _isSmallFile(file) {
  return file.stat.size <= MAX_JS_FILE_SIZE;
}

function _isReallySmallFile(file) {
  return file.stat.size <= REALLY_SMALL_FILE_SIZE;
}

function _isMinifiedFile(file) {
  return MIN_JS_RE.test(file.path);
}

function _shouldCompileFile(file) {
  return _isSmallFile(file) && !_isMinifiedFile(file);
}

function buildJS(options, vfs, logger) {

  var report = new BuildReport(CONSTANTS.TASK_NAME + ':js');
  report.start();

  return new Bluebird((resolve, reject) => {
    var jsGlobs = [
      '**/*.js',
      '!**/.habemus',
      '!**/.habemus/**',
      '!**/.git',
      '!**/.git/**'
    ];
    var jsStream = vfs.src(jsGlobs, { dot: true })
      .pipe(plumber({
        errorHandler: function (err) {
          logger.error(err);
          this.emit('end');
        },
      }))
      // .pipe(stripDebug())
      .pipe(gulpIf(_shouldCompileFile, uglify()))
      .pipe(vfs.dest('.'))
      .on('end', () => {
        resolve(report.finish());
      });
  })
  .catch((err) => {
    console.warn('build-js error', err);
    // ignore errors
    return;
  });

}

module.exports = buildJS;
