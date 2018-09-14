// native
const util = require('util');

// third-party
const HabemusWebsiteBuilderClient = require('habemus-website-builder-base/client');

// constants
const CONSTANTS = require('../shared/constants');

/**
 * Client constructor
 * @param {Object} options
 *        - rabbitMQURI: String
 */
function HBuilderHTML5Client(options) {
  HabemusWebsiteBuilderClient.call(this, options);
}
util.inherits(HBuilderHTML5Client, HabemusWebsiteBuilderClient);

/**
 * Task name should be fixed.
 * @type {String}
 */
HBuilderHTML5Client.prototype.name = CONSTANTS.WORKER_NAME;

module.exports = HBuilderHTML5Client;
