// third-party
const envOptions = require('@habemus/env-options');

// own
const HBuilderHTML5Server = require('../server');

// env variables
var options = envOptions({
  rabbitMQURI: 'fs:RABBIT_MQ_URI_PATH',
});

var hBuilderHTML5 = new HBuilderHTML5Server();

hBuilderHTML5.connect(options.rabbitMQURI).then(() => {
  console.log('hBuilderHTML5 successfully connected');

  /**
   * Exit process upon channel close.
   * Let environment deal with reconnection.
   */
  hBuilderHTML5.on('channel-close', (e) => {
    console.warn('hBuilderHTML5 channel-close', e);
    process.exit(1);
  });
})
.catch((err) => {
  console.warn('hBuilderHTML5 error connecting to ' + options.rabbitMQURI, err);
  process.exit(1);
});
