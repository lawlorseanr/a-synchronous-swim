const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  //console.log('Serving request type ' + req.method + ' for url ' + req.url);

  var array = ['up', 'down', 'right', 'left'];
  var randomDirection = array[Math.floor(Math.random() * 4)];
  if(req.method === 'GET') {
    res.write(randomDirection);
  }
  res.writeHead(200, headers);
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};

// this.write = (data) => {
//   if (data) {
//     this._data = Buffer.concat([this._data, Buffer.from(data)]);
//   }
// };