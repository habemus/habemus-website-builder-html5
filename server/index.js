// native
const util = require('util');

// third-party
const WebsiteBuilderServer = require('habemus-website-builder-base/server');

// constants
const CONSTANTS = require('../shared/constants');

/**
 * Server constructor
 * @param {Object} options
 *        - rabbitMQURI
 */
function HBuilderHTML5Server(options) {
  WebsiteBuilderServer.call(this, options);
}
util.inherits(HBuilderHTML5Server, WebsiteBuilderServer);

/**
 * Define the build function in the prototype.
 * 
 * @param  {Object} options
 * @param  {Vinyl} vfs
 * @param  {Object} logger
 * @return {Bluebird}        
 */
HBuilderHTML5Server.prototype.builderFn = require('./builder-fn');

/**
 * Task name is fixed at 'build-html5'
 * 
 * @type {String}
 */
HBuilderHTML5Server.prototype.name = CONSTANTS.WORKER_NAME;

module.exports = HBuilderHTML5Server;
