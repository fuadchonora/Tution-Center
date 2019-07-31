var express = require('express')
var app = express()

var io = require('socket.io')

app.get('index.html', function(req, res) {
	res.sendfile('index.html')
});

io.on('connection', function(socket){
	console.log('A user connected');
})

app.get('index.html', function(req, res) {
	res.sendfile('index.html')
});

module.exports = app;
