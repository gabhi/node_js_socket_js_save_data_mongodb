var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');
 
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('chatdb', server, {safe: true});


db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'chatdb' database");
        db.collection('players', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                 
            }
        });
    }
});




var port = "3002";
var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(port, function() {
    console.log('Listening at: http://localhost:'+port);
});
 
socketio.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.emit('message', msg);
        ///
        //update mongodb

        var m =  {
                      
                      "name":msg,
                      "score":36
                    };
        console.log('Adding m: ' + JSON.stringify(m));
        db.collection('players', function(err, collection) {
            collection.insert(m, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                     
                }
            });
        });


        ///

        
        socket.broadcast.emit('message', msg);
    });
});
