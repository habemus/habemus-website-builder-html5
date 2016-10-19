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
});
