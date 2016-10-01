// own
const HBuilderHTML5Server = require('../server');

// env variables
var rabbitMQURI = process.env.RABBIT_MQ_URI;

if (!rabbitMQURI) {
  throw new Error('RABBIT_MQ_URI is required');
}

var hBuilderHTML5 = new HBuilderHTML5Server();

hBuilderHTML5.connect(rabbitMQURI).then(() => {
  console.log('hBuilderHTML5 successfully connected');
});
