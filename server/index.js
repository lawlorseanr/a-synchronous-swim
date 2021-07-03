const keypressHandler = require('./js/keypressHandler');
const httpHandler = require('./js/httpHandler');
const http = require('http');
const server = http.createServer(httpHandler.router);
const messageQueue = require('./js/messageQueue');

keypressHandler.initialize(message => {
  console.log('Messages: ', messageQueue.queue())
  messageQueue.enqueue(message);
});

const port = 3001;
const ip = '127.0.0.1';
server.listen(port, ip);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${ip}:${port}`);
