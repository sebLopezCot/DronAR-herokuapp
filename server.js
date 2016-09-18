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
} );

var port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});

let io = require('socket.io')(server);

let currentViews = [
  {
    drone: "drone_one",
    lat: "[40.7127837]",
    long_: "[-74.00594130000002]",
    temp: "60.5",
    status: "good",
    altitude: "100",
    eta: "130",
    timestamp: "1474174199014"
}
];

io.on('connection', (socket) => {
  for(var i = 0; i < currentViews.length; i++) {
    socket.emit('ADD_VIEW', currentViews[i]);
    console.log("connected");
  }

  socket.on('SEL', (data) => {
    var times = [];
    var lat = [];
    var long_ = [];
    var drone = [];
    var altitude=[];
    var eta=[];
    var temp = [];
    var statusStr = [];
    io.emit('REMOVE_VIEW', currentViews[0]);
          console.log(data.choice);
    mongo.connect(uri, function (err, db) {

      var collection = db.collection('location')
      collection.find({"drone": data.choice}).sort({ timestamp : -1 }).limit(10).toArray((err, array) => {
      if(err) return console.error(err);
        for(let i = array.length - 1; i >= 0; i--){
        times += array[i].timestamp;
        lat += array[i].lat;
        long_ += array[i].long_;
        drone += array[i].drone;
        altitude += array[i].altitude;
        eta += array[i].eta;
        temp += array[i].temp;
        status += array[i].status;
        //io.emit something
      }
    });
  });
    currentViews.shift();
    currentViews.push({time: times[0],drone: data.choice, lat: lat, long_: long_,
      altitude:altitude[0], temp:temp[0], eta: eta[0]});
    io.emit('ADD_VIEW', currentViews[currentViews.length - 1]); // broadcast the message everywhere
  });
});
