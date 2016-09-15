/**
 * Constructor for a build report.
 * The build report is the object that wraps
 * logic on generating reports on builds.
 *
 * In case it is really useful, will be moved
 * to a separate module
 */
function BuildReport(title) {
  this.title = title;
}

/**
 * Define the status property. It will be computed
 * given the properties set onto the report object.
 * 
 * @type {String}
 */
Object.defineProperty(BuildReport.prototype, 'status', {
  get: function () {

    if (this.finishedAt) {
      return 'finished';
    } else {
      if (this.startedAt) {
        return 'started';
      } else {
        return 'not-started';
      }
    }
  },
  set: function () {
    throw new Error('illegal');
  }
});

/**
 * Starts to count time
 * @return {Date}
 */
BuildReport.prototype.start = function () {
  var status = this.status;

  if (status !== 'not-started') {
    throw new Error('illegal: at status ' + status);
  }

  this.startedAt = Date.now();

  return this.compile();
};

/**
 * Mark the build as finished.
 * @return {Object}
 */
BuildReport.prototype.finish = function () {
  var status = this.status;

  if (status !== 'started') {
    throw new Error('illegal: at status ' + status);
  }

  this.finishedAt = Date.now();

  return this.compile();
};

/**
 * Generates a report object.
 * 
 * @return {Object}
 */
BuildReport.prototype.compile = function () {

  var status = this.status;

  var report = {
    title: this.title,
    status: status,
  };

  if (status === 'finished') {

    report.elapsed = this.finishedAt - this.startedAt;
    report.startedAt = this.startedAt;
    report.finishedAt = this.finishedAt;

  } else if (status === 'started') {

    report.elapsed = Date.now() - this.startedAt;
    report.startedAt = this.startedAt;

  }

  return report
};

/**
 * Make life easier :)
 * @return {Object}
 */
BuildReport.prototype.toJSON = function () {
  return this.compile();
};

module.exports = BuildReport;
