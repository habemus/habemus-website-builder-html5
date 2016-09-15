// native
const util = require('util');

// third-party
const HBuilderServer = require('h-builder/server');

function HBuilderHTML5Server(options) {
  HBuilderServer.call(this, options);
}
util.inherits(HBuilderHTML5Server, HBuilderServer);

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
HBuilderHTML5Server.prototype.taskName = 'build-html5';

module.exports = HBuilderHTML5Server;
