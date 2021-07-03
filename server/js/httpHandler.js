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
    next();

  //////////////////////////////////////////////
  //////////// POST ////////////////////////////
  //////////////////////////////////////////////
  } else if (req.method === 'POST') {

    lowerUrl = req.url.toLowerCase();
    var validDirection = lowerUrl.substring(1).match(/(up|down|left|right)/);
    if (validDirection) {
      messageQueue.enqueue(lowerUrl.substring(1));
      res.writeHead(200, headers);
      res.end();
      next();
    } else if (lowerUrl === '/background') {

      var rawdata = Buffer.alloc(0);
      req.on('data', chunk => {
        rawdata = Buffer.concat([rawdata, chunk]);
      });
      req.on('end', () => {

        if (rawdata) {
          var parsedData = multipart.getFile(rawdata);
          if (parsedData === null) {
            var data = rawdata;
          } else {
            var data = parsedData.data;
          }

          let writer = fs.createWriteStream(this.backgroundImageFile, {flags: 'w'});
          writer.on('finish', () => {
            console.log(`Sucessfully wrote to ${this.backgroundImageFile}`);
            res.writeHead(201, headers);
            res.end();
            next();
          });
          writer.on('error', error => {
            console.log(`Unsuccessful in writing ${this.backgroundImageFile}`)
            console.log(err);
            res.writeHead(404, headers);
            res.end();
            next();
          });
          writer.write(data);
          writer.end();

        } else {
          console.log(`No raw data to write ${this.backgroundImageFile}`);
          res.writeHead(404, headers);
          res.end();
          next();
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
      next();
    } else if (req.url === '/item') {
      var messageToSend = messageQueue.dequeue();
      res.writeHead(200, headers);
      if (messageToSend) {
        res.write(messageToSend);
      }
      res.end();
      next();
    } else if (req.url === '/background.jpeg') {
      fs.access(this.backgroundImageFile, fs.F_OK, err => {
        if (err) {
          console.log(`${this.backgroundImageFile} not found.`)
          res.writeHead(404, headers);
          res.end();
          next();
        } else {
          console.log(`${this.backgroundImageFile} found.`)
          headers['content-type'] = 'image/jpeg';
          res.writeHead(200, headers);

          var readStream = fs.createReadStream(this.backgroundImageFile);
          readStream.pipe(res);
          readStream.on('end', () => {
            res.end();
            next();
          });

        }
      });
    }
  }

};