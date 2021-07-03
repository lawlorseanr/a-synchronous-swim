const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

module.exports.router = (req, res, next = ()=>{}) => {
  var array = ['up', 'down', 'right', 'left'];

  /*
  Write head
   */
  res.writeHead(200, headers);

  /*
  Write data if appropriate
   */
  if (req.method === 'POST') {
    lowerUrl = req.url.toLowerCase();
    if (lowerUrl === '/up' || lowerUrl === '/arrowup') {
      messageQueue.enqueue('up');
    } else if (lowerUrl === '/down' || lowerUrl === '/arrowdown') {
      messageQueue.enqueue('down');
    } else if (lowerUrl === '/right' || lowerUrl === '/arrowright') {
      messageQueue.enqueue('right');
    } else if (lowerUrl === '/left' || lowerUrl === '/arrowleft') {
      messageQueue.enqueue('left');
    }
  } else if (req.method === 'GET') {
    if (req.url === '/random') {
      var randomDirection = array[Math.floor(Math.random() * 4)];
      res.write(randomDirection);
    } else if (req.url === '/item') {
      var messageToSend = messageQueue.dequeue();
      if (messageToSend) {
        res.write(messageToSend)
      }
    }

  }

  /*
  End response
   */
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};