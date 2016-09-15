// native
const path = require('path');

// third-party
const should = require('should');
const fse = require('fs-extra');
const vinylFs = require('vinyl-fs');
const checksum = require('checksum');
const Bluebird = require('bluebird');

const _checksumFile = Bluebird.promisify(checksum.file);

// aux
const aux = require('../../aux');

const HBuilderHTML5Server = require('../../../server');

describe('HBuilderHTML5#builderFn(options, vfs, logger)', function () {

  beforeEach(function () {
    return aux.setup();
  });

  afterEach(function () {
    return aux.teardown();
  });

  it('should execute the defined build pipeline in place', function () {

    this.timeout(60000);

    var server = new HBuilderHTML5Server({
      rabbitMQURI: aux.rabbitMQURI,
    });

    /**
     * Mock the vfs with a copy of the fixture to the temporary dir
     */
    var sourceWebsitePath = aux.fixturesPath + '/website';
    var tmpWebsitePath = aux.tmpPath + '/website';
    fse.copySync(
      sourceWebsitePath,
      tmpWebsitePath,
      {
        clobber: true
      }
    );

    var vfs = {
      src: function (globs) {
        globs = Array.isArray(globs) ? globs : [globs];
        globs = globs.map((glob) => {
          return path.join(tmpWebsitePath, glob);
        });

        // console.log('vinylFs.src:', globs);

        return vinylFs.src(globs);
      },
      dest: function (destPath) {
        destPath = path.join(tmpWebsitePath, destPath);

        // console.log('vinylFs.dest:', destPath);

        return vinylFs.dest(destPath);
      }
    }

    /**
     * Mock a logger object
     * @type {Object}
     */
    var logger = {
      log: function (d) {
        console.log(d);
      },
      info: function (d) {
        console.log(d);
      },
      warn: function (d) {
        console.log(d);
      },
      error: function (d) {
        console.log(d);
      },
    };

    return server.builderFn({}, vfs, logger)
      .then((buildReport) => {

        (typeof buildReport.elapsed).should.eql('number');
        (typeof buildReport.startedAt).should.eql('number');
        (typeof buildReport.finishedAt).should.eql('number');

        (typeof buildReport.css.elapsed).should.eql('number');
        (typeof buildReport.css.startedAt).should.eql('number');
        (typeof buildReport.css.finishedAt).should.eql('number');

        (typeof buildReport.js.elapsed).should.eql('number');
        (typeof buildReport.js.startedAt).should.eql('number');
        (typeof buildReport.js.finishedAt).should.eql('number');

        (typeof buildReport.images.elapsed).should.eql('number');
        (typeof buildReport.images.startedAt).should.eql('number');
        (typeof buildReport.images.finishedAt).should.eql('number');

        // check that the files were effectively modified
        return Bluebird.all([
          _checksumFile(path.join(sourceWebsitePath, 'assets/js/main.js')),
          _checksumFile(path.join(tmpWebsitePath, 'assets/js/main.js')),

          _checksumFile(path.join(sourceWebsitePath, 'assets/css/main.css')),
          _checksumFile(path.join(tmpWebsitePath, 'assets/css/main.css')),

          _checksumFile(path.join(sourceWebsitePath, 'images/screen.jpg')),
          _checksumFile(path.join(tmpWebsitePath, 'images/screen.jpg')),
        ]);
      })
      .then((results) => {

        results[0].should.not.eql(results[1]);
        results[2].should.not.eql(results[3]);
        results[4].should.not.eql(results[5]);

      });
  });

});
