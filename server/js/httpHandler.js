const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpeg');
////////////////////////////////////////////////////////

module.exports.router = (req, res, next = ()=>{}) => {

  //////////////////////////////////////////////
  ////////// OPTIONS ///////////////////////////
  //////////////////////////////////////////////
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();

  //////////////////////////////////////////////
  //////////// POST ////////////////////////////
  //////////////////////////////////////////////
  } else if (req.method === 'POST') {
    lowerUrl = req.url.toLowerCase();
    if (lowerUrl === '/up' || lowerUrl === '/arrowup') {
      messageQueue.enqueue('up');

      res.writeHead(200, headers);
      res.end();
    } else if (lowerUrl === '/down' || lowerUrl === '/arrowdown') {
      messageQueue.enqueue('down');

      res.writeHead(200, headers);
      res.end();
    } else if (lowerUrl === '/right' || lowerUrl === '/arrowright') {
      messageQueue.enqueue('right');

      res.writeHead(200, headers);
      res.end();
    } else if (lowerUrl === '/left' || lowerUrl === '/arrowleft') {
      messageQueue.enqueue('left');

      res.writeHead(200, headers);
      res.end();
    } else if (lowerUrl === '/background') {
      var data = Buffer.alloc(0);
      req.on('data', chunk => {
        data = Buffer.concat([data, Buffer.from(chunk)]);
      });
      req.on('end', () => {

        try {
          fs.writeFileSync(this.backgroundImageFile, data);
          res.writeHead(201, headers);
          res.end();
        } catch (err) {
          res.writeHead(404, headers);
          res.end();
        }
      });
    }

  //////////////////////////////////////////////
  //////////// GET /////////////////////////////
  //////////////////////////////////////////////
  } else if (req.method === 'GET') {

    if (req.url === '/random') {
      var array = ['up', 'down', 'right', 'left'];
      var randomDirection = array[Math.floor(Math.random() * 4)];

      res.writeHead(200, headers);
      res.write(randomDirection);
      res.end();

    } else if (req.url === '/item') {
      var messageToSend = messageQueue.dequeue();

      res.writeHead(200, headers);
      if (messageToSend) {
        res.write(messageToSend);
      }
      res.end();

    } else if (req.url === '/background') {
      if (fs.existsSync(this.backgroundImageFile)) {
        headers['content-type'] = 'image/jpeg';
        res.writeHead(200, headers);

        var readStream = fs.createReadStream(this.backgroundImageFile);
        readStream.pipe(res);

        // res.end();
      } else {
        res.writeHead(404, headers);
        res.end();
      };
    }
  }

  next(); // invoke next() at the end of a request to help with testing!
};