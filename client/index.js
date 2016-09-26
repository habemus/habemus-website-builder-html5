// native
const util = require('util');

// third-party
const HBuilderClient = require('h-builder/client');

// constants
const CONSTANTS = require('../shared/constants');

/**
 * Client constructor
 * @param {Object} options
 *        - rabbitMQURI: String
 */
function HBuilderHTML5Client(options) {
  HBuilderClient.call(this, options);
}
util.inherits(HBuilderHTML5Client, HBuilderClient);

/**
 * Task name should be fixed.
 * @type {String}
 */
HBuilderHTML5Client.prototype.name = CONSTANTS.WORKER_NAME;

module.exports = HBuilderHTML5Client;
