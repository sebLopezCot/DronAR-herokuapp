'use strict'; // puts us in strict mode (js in hard mode)
let mongo = require('mongodb').MongoClient;
let uri = "mongodb://dronar:dronar123@ds046549.mlab.com:46549/dronar";

/* This sets up a pure socket-io server.
 * Later in the guide we upgrade to a full
 * express server
// sets up the server
let Server = require('socket.io');
let io = Server(3000); //construct a server on port 3000
console.log('SocketIO listening on port 3000');
*/

// sets up express
let path = require('path');
let express = require('express');

let app = express();
app.use(express.static(path.join(__dirname, 'client')));

let routes = require('./routes');
app.use('/', routes);

// 404
app.use( (req, res, next) => {
  let err = new Error('Not found');
  err.status = 404;
  next(err);
} );););

var port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});

let io = require('socket.io')(server);

let currentViews = [
  { type: 'skeleton',
    x: 0, y: 0}
];

io.on('connection', (socket) => {
  for(var i = 0; i < currentViews.length; i++) {
    socket.emit('ADD_VIEW', currentViews[i]);
  }

  socket.on('SEL', (data) => {
    var times[];
    var lat[];
    var long[];
    var drone[];
    var altitude[];
    var eta[];
    io.emit('REMOVE_VIEW', currentViews[0]);
    mongo.connect(uri, function (err, db) {

      var collection = db.collection('location')
      collection.find().sort({ timestamp : -1 }).limit(10).toArray((err, array) => {
      if(err) return console.error(err);
        for(let i = array.length - 1; i >= 0; i--);
        times += array[i].timestamp;
        lat += array[i].lat;
        long += array[i].long;
        drone += array[i].drone;
        altitude += array[i].altitude;
        eta += array[i].eta; 
        //io.emit something
      }
    });
  });
    currentViews.shift();
    currentViews.push({type: data.view, x: 0, y: 0});
    io.emit('ADD_VIEW', currentViews[currentViews.length - 1]); // broadcast the message everywhere
  });
});
