var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req, res) {
	console.log('aaa')
	res.sendfile('index.html');

})

io.on('connection', function(socket){
	console.log('A user connected');

	//Send a message after a timeout of 4seconds
	setTimeout(function() {
	socket.send('Sent a message 4seconds after connection!');
	}, 4000);

	socket.on('disconnect', function () {
	console.log('A user disconnected');
	});
})


module.exports = app;
