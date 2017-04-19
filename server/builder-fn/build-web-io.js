// native
const fs = require('fs');

// third-party
const Bluebird = require('bluebird');
const plumber  = require('gulp-plumber');
const webIO    = require('../lib/gulp-web-io');

// promisify
const readFileAsync = Bluebird.promisify(fs.readFile);

// constants
const CONSTANTS = require('../../shared/constants');

// own
const BuildReport = require('../lib/build-report');

function _isWebIOEnabled(options, vfs, logger) {
  // TODO: document vfs.root
  var packageJSONPath = vfs.root.prependTo('package.json');

  return readFileAsync(packageJSONPath, 'utf8')
    .then(contents => {

      var pkg = JSON.parse(contents);

      // ensure package.json has 'web-io' listed as a devDependency
      return pkg.devDependencies && pkg.devDependencies['web-io'];
    })
    .catch(err => {
      if (err.code === 'ENOENT') {
        // no package.json file, consider web-io disabled
        return false;
      } else {
        throw err;
      }
    });

}

function buildWebIO(options, vfs, logger) {

  var report = new BuildReport(CONSTANTS.TASK_NAME + ':web-io');
  report.start();

  // check if web-io is enabled for the project
  return _isWebIOEnabled(options, vfs, logger)
    .then(isEnabled => {
      if (isEnabled) {

        console.log('build-web-io enabled');

        return new Bluebird((resolve, reject) => {
          var HTML_AND_MARKDOWN_GLOBS = [
            '**/*.md',
            '**/*.html',
            '!**/.habemus',
            '!**/.habemus/**',
            '!**/.git',
            '!**/.git/**'
          ];
          var webIOStream = vfs.src(HTML_AND_MARKDOWN_GLOBS, { dot: false })
            .pipe(plumber({
              errorHandler: function (err) {
                logger.error(err);
                this.emit('end');
              },
            }))
            .pipe(webIO({
              // TODO: document this API at h-builder/server/lib/h-vinyl-fs.js
              fsRoot: vfs.root.value(),
            }))
            .pipe(vfs.dest('.'))
            .on('end', () => {
              resolve(report.finish());
            });
        });

      } else {
        return report.finish();
      }
    })
    .catch((err) => {
      console.warn('build-web-io error', err);
      // ignore errors
      return;
    });

}

module.exports = buildWebIO;
