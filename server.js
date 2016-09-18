'use strict'; // puts us in strict mode (js in hard mode)
// let mongo = require('mongodb').MongoClient;
// let uri = "mongodb://dronar:dronar123@ds046549.mlab.com:46549/dronar";

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
} );

var port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});

let io = require('socket.io')(server);

let drones = {
  "drone_one": {
    "lat": "40.4406",
    "long_": "-79.9959",
    "temp": "60.5",
    "status": "good",
    "altitude": "100",
    "eta": "0",
    "timestamp": "1474188834",
    "endLat": "40.4406",
    "endLong": "-77.00594130000002"
  },

  "drone_two" : {
    "lat": "42.365843",
    "long_": " -71.104485",
    "temp": "82.5",
    "status": "good",
    "altitude": "15",
    "eta": "5",
    "timestamp": "1474167534",
    "endLat": "42.374445",
    "endLong": "-71.117250"
  },

  "drone_three" : {
    "lat": "39.8781",
    "long_": "-89.6298",
    "temp": "60.5",
    "status": "good",
    "altitude": "300",
    "eta": "60",
    "timestamp": "1474167234",
    // "startLat": "41.8781",
    // "startLong": "-87.6298",
    "endLat": "39.8781",
    "endLong": "-89.6298"
  }

};

io.on('connection', (socket) => {

  socket.on('SEL', (data) => {
    io.emit('CHANGE_VIEW', drones[data.choice]); // broadcast the message everywhere
    console.log("CHANGING TO " + data.choice);
  });
});
